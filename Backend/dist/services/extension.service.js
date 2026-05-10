"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestExtension = requestExtension;
const db_1 = require("../configs/db");
const socket_1 = require("../configs/socket");
const timeUtils_1 = require("../utils/timeUtils");
const email_service_1 = require("./email.service");
async function requestExtension(reservationId, userId) {
    const reservation = await db_1.prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { user: true },
    });
    if (!reservation)
        throw new Error('Reserva no encontrada');
    if (reservation.userId !== userId)
        throw new Error('No es tu reserva');
    //permite extender si está ACTIVE o ya fue EXTENDED antes
    if (reservation.status !== 'ACTIVE' && reservation.status !== 'EXTENDED') {
        throw new Error('Solo puedes extender reservas activas');
    }
    const extensionMs = 30 * 60000;
    const newEnd = new Date(reservation.endTime.getTime() + extensionMs);
    // Verificar que el siguiente bloque esté libre
    const conflicts = await db_1.prisma.reservation.findMany({
        where: {
            tableId: reservation.tableId,
            id: { not: reservationId },
            status: { in: ['PENDING', 'ACTIVE'] },
        },
    });
    for (const c of conflicts) {
        if ((0, timeUtils_1.hasTimeConflict)(reservation.endTime, newEnd, c.startTime, c.endTime)) {
            // Enviar correo de rechazo
            await (0, email_service_1.sendExtensionRejectedEmail)(reservation.user.email, reservation.user.name, reservation.tableId);
            throw new Error('NEXT_SLOT_TAKEN');
        }
    }
    // Extender
    const updated = await db_1.prisma.reservation.update({
        where: { id: reservationId },
        data: { endTime: newEnd, status: 'EXTENDED' },
    });
    const remainingSeconds = Math.max(0, Math.floor((newEnd.getTime() - Date.now()) / 1000));
    // Emitir timer actualizado
    (0, socket_1.getIO)().emit('table:state_changed', {
        tableId: reservation.tableId,
        newState: 'LEGITIMATELY_OCCUPIED',
        timer: remainingSeconds,
    });
    // Enviar correo de confirmación
    await (0, email_service_1.sendExtensionApprovedEmail)(reservation.user.email, reservation.user.name, reservation.tableId, newEnd);
    return { reservation: updated, newEndTime: newEnd, remainingSeconds };
}
