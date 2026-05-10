"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTimerBroadcast = startTimerBroadcast;
const db_1 = require("../configs/db");
const socket_1 = require("../configs/socket");
function startTimerBroadcast() {
    // Cada 60 segundos emite el tiempo restante de todas las mesas activas
    setInterval(async () => {
        const now = Date.now();
        const activeReservations = await db_1.prisma.reservation.findMany({
            where: { status: { in: ['ACTIVE', 'EXTENDED'] } },
            select: { tableId: true, endTime: true },
        });
        for (const r of activeReservations) {
            const remainingSeconds = Math.max(0, Math.floor((r.endTime.getTime() - now) / 1000));
            (0, socket_1.getIO)().emit('table:timer_update', {
                tableId: r.tableId,
                remainingSeconds,
            });
        }
        if (activeReservations.length > 0) {
            console.log(`[SOCKET] Timer broadcast — ${activeReservations.length} mesa(s) activa(s)`);
        }
    }, 60000); // cada 60 segundos
    console.log('✅ Timer broadcast iniciado (cada 60s)');
}
