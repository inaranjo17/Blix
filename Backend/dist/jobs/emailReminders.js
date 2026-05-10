"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEmailReminders = startEmailReminders;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../configs/db");
const email_service_1 = require("../services/email.service");
function startEmailReminders() {
    // Corre cada minuto
    node_cron_1.default.schedule('* * * * *', async () => {
        const now = new Date();
        // ── Recordatorio 30 min ANTES del inicio ──────────────────────────
        const thirtyMin = await db_1.prisma.reservation.findMany({
            where: {
                status: 'PENDING',
                startTime: {
                    gte: new Date(now.getTime() + 29 * 60000),
                    lte: new Date(now.getTime() + 31 * 60000),
                },
            },
            include: { user: true },
        });
        for (const r of thirtyMin) {
            await (0, email_service_1.sendReminderEmail)(r.user.email, r.user.name, r.code, r.tableId, 30);
            console.log(`[EMAIL] Recordatorio 30min → ${r.user.email} (${r.code})`);
        }
        // ── Recordatorio 10 min ANTES del inicio ──────────────────────────
        const tenMinStart = await db_1.prisma.reservation.findMany({
            where: {
                status: 'PENDING',
                startTime: {
                    gte: new Date(now.getTime() + 9 * 60000),
                    lte: new Date(now.getTime() + 11 * 60000),
                },
            },
            include: { user: true },
        });
        for (const r of tenMinStart) {
            await (0, email_service_1.sendReminderEmail)(r.user.email, r.user.name, r.code, r.tableId, 10);
            console.log(`[EMAIL] Recordatorio 10min inicio → ${r.user.email} (${r.code})`);
        }
        // ── Aviso 10 min ANTES del fin ────────────────────────────────────
        const tenMinEnd = await db_1.prisma.reservation.findMany({
            where: {
                status: { in: ['ACTIVE', 'EXTENDED'] },
                endTime: {
                    gte: new Date(now.getTime() + 9 * 60000),
                    lte: new Date(now.getTime() + 11 * 60000),
                },
            },
            include: { user: true },
        });
        for (const r of tenMinEnd) {
            await (0, email_service_1.sendTimerWarningEmail)(r.user.email, r.user.name, r.tableId, 10);
            console.log(`[EMAIL] Aviso 10min fin → ${r.user.email} (${r.code})`);
        }
        // ── Aviso 5 min ANTES del fin ─────────────────────────────────────
        const fiveMinEnd = await db_1.prisma.reservation.findMany({
            where: {
                status: { in: ['ACTIVE', 'EXTENDED'] },
                endTime: {
                    gte: new Date(now.getTime() + 4 * 60000),
                    lte: new Date(now.getTime() + 6 * 60000),
                },
            },
            include: { user: true },
        });
        for (const r of fiveMinEnd) {
            await (0, email_service_1.sendTimerWarningEmail)(r.user.email, r.user.name, r.tableId, 5);
            console.log(`[EMAIL] Aviso 5min fin → ${r.user.email} (${r.code})`);
        }
    });
    console.log('✅ Recordatorios de email iniciados (cada 1min)');
}
