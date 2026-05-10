"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCheckin = processCheckin;
const db_1 = require("../configs/db");
const socket_1 = require("../configs/socket");
async function processCheckin(userId, tableId, code) {
    const now = new Date();
    // Ventana válida: desde 0 hasta 10 min después del startTime
    const graceLimit = new Date(now.getTime() - 10 * 60000);
    const reservation = await db_1.prisma.reservation.findFirst({
        where: {
            code,
            tableId,
            userId,
            status: 'PENDING',
            startTime: { gte: graceLimit }, // no expiró la gracia
            endTime: { gt: now }, // no terminó el tiempo
        },
        include: { table: true, user: true },
    });
    if (!reservation) {
        throw new Error('Código inválido, mesa incorrecta, o reserva fuera del horario activo');
    }
    // Activar reserva
    const updated = await db_1.prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'ACTIVE', checkedInAt: now },
    });
    // Actualizar mesa
    await db_1.prisma.table.update({
        where: { id: tableId },
        data: {
            state: 'LEGITIMATELY_OCCUPIED',
            presenceSince: null,
        },
    });
    const remainingSeconds = Math.max(0, Math.floor((reservation.endTime.getTime() - now.getTime()) / 1000));
    // Emitir a todos los clientes con el timer
    (0, socket_1.getIO)().emit('table:state_changed', {
        tableId,
        newState: 'LEGITIMATELY_OCCUPIED',
        timer: remainingSeconds,
    });
    return {
        reservation: updated,
        remainingSeconds,
        endTime: reservation.endTime,
    };
}
