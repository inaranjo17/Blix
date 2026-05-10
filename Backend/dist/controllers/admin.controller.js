"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConflicts = getConflicts;
exports.getMetrics = getMetrics;
const db_1 = require("../configs/db");
async function getConflicts(_req, res) {
    try {
        const conflicts = await db_1.prisma.table.findMany({
            where: { state: 'CONFLICT' },
            include: {
                reservations: {
                    where: { status: { in: ['PENDING', 'ACTIVE'] } },
                    include: { user: { select: { name: true, email: true } } },
                },
            },
        });
        res.json(conflicts);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error al obtener conflictos';
        res.status(500).json({ error: message });
    }
}
async function getMetrics(_req, res) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalReservationsToday, noShowsToday, activeNow, conflictsNow, tableStats,] = await Promise.all([
            db_1.prisma.reservation.count({
                where: { createdAt: { gte: today } },
            }),
            db_1.prisma.reservation.count({
                where: { status: 'CANCELLED', createdAt: { gte: today } },
            }),
            db_1.prisma.reservation.count({ where: { status: 'ACTIVE' } }),
            db_1.prisma.table.count({ where: { state: 'CONFLICT' } }),
            db_1.prisma.table.findMany({
                select: {
                    id: true,
                    zone: true,
                    capacity: true,
                    state: true,
                    _count: { select: { reservations: true } },
                },
                orderBy: { id: 'asc' },
            }),
        ]);
        res.json({
            today: {
                totalReservations: totalReservationsToday,
                noShows: noShowsToday,
                activeNow,
                conflictsNow,
            },
            tables: tableStats,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error al obtener métricas';
        res.status(500).json({ error: message });
    }
}
