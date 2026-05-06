import cron from 'node-cron'
import { prisma } from '../configs/db'
import {
  sendReminderEmail,
  sendTimerWarningEmail,
} from '../services/email.service'

export function startEmailReminders(): void {
  // Corre cada minuto
  cron.schedule('* * * * *', async () => {
    const now = new Date()

    // ── Recordatorio 30 min ANTES del inicio ──────────────────────────
    const thirtyMin = await prisma.reservation.findMany({
      where: {
        status: 'PENDING',
        startTime: {
          gte: new Date(now.getTime() + 29 * 60_000),
          lte: new Date(now.getTime() + 31 * 60_000),
        },
      },
      include: { user: true },
    })

    for (const r of thirtyMin) {
      await sendReminderEmail(
        r.user.email,
        r.user.name,
        r.code,
        r.tableId,
        30
      )
      console.log(`[EMAIL] Recordatorio 30min → ${r.user.email} (${r.code})`)
    }

    // ── Recordatorio 10 min ANTES del inicio ──────────────────────────
    const tenMinStart = await prisma.reservation.findMany({
      where: {
        status: 'PENDING',
        startTime: {
          gte: new Date(now.getTime() + 9 * 60_000),
          lte: new Date(now.getTime() + 11 * 60_000),
        },
      },
      include: { user: true },
    })

    for (const r of tenMinStart) {
      await sendReminderEmail(
        r.user.email,
        r.user.name,
        r.code,
        r.tableId,
        10
      )
      console.log(`[EMAIL] Recordatorio 10min inicio → ${r.user.email} (${r.code})`)
    }

    // ── Aviso 10 min ANTES del fin ────────────────────────────────────
    const tenMinEnd = await prisma.reservation.findMany({
      where: {
        status: { in: ['ACTIVE', 'EXTENDED'] },
        endTime: {
          gte: new Date(now.getTime() + 9 * 60_000),
          lte: new Date(now.getTime() + 11 * 60_000),
        },
      },
      include: { user: true },
    })

    for (const r of tenMinEnd) {
      await sendTimerWarningEmail(r.user.email, r.user.name, r.tableId, 10)
      console.log(`[EMAIL] Aviso 10min fin → ${r.user.email} (${r.code})`)
    }

    // ── Aviso 5 min ANTES del fin ─────────────────────────────────────
    const fiveMinEnd = await prisma.reservation.findMany({
      where: {
        status: { in: ['ACTIVE', 'EXTENDED'] },
        endTime: {
          gte: new Date(now.getTime() + 4 * 60_000),
          lte: new Date(now.getTime() + 6 * 60_000),
        },
      },
      include: { user: true },
    })

    for (const r of fiveMinEnd) {
      await sendTimerWarningEmail(r.user.email, r.user.name, r.tableId, 5)
      console.log(`[EMAIL] Aviso 5min fin → ${r.user.email} (${r.code})`)
    }
  })

  console.log('✅ Recordatorios de email iniciados (cada 1min)')
}