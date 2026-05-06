import cron from 'node-cron'
import { prisma } from '../configs/db'
import { getIO } from '../configs/socket'
import {
  sendNoShowEmail,
} from '../services/email.service'

export function startStateEngine(): void {
  // Corre cada 30 segundos
  cron.schedule('*/30 * * * * *', async () => {
    const now = new Date()

    // ── R3: No-show — reserva PENDING sin check-in después de 10 min de gracia ──
    const noShows = await prisma.reservation.findMany({
      where: {
        status: 'PENDING',
        startTime: { lt: new Date(now.getTime() - 10 * 60_000) },
      },
      include: { user: true, table: true },
    })

    for (const r of noShows) {
      await prisma.reservation.update({
        where: { id: r.id },
        data: { status: 'CANCELLED' },
      })

      // Solo liberar la mesa si no hay otra reserva activa para ella
      const otherActive = await prisma.reservation.findFirst({
        where: {
          tableId: r.tableId,
          id: { not: r.id },
          status: { in: ['PENDING', 'ACTIVE'] },
        },
      })

      if (!otherActive) {
        await prisma.table.update({
          where: { id: r.tableId },
          data: { state: 'FREE', presenceSince: null },
        })
        getIO().emit('table:state_changed', {
          tableId: r.tableId,
          newState: 'FREE',
        })
      }

      try {
        console.log(`[EMAIL] Enviando no-show a: ${r.user.email}`)
        await sendNoShowEmail(r.user.email, r.user.name, r.tableId)
        console.log(`[EMAIL] ✅ No-show enviado a: ${r.user.email}`)
    } catch (emailErr) {
        console.error(`[EMAIL] ❌ Error enviando no-show:`, emailErr)
    }
      console.log(`[R3] No-show: ${r.code} — Mesa ${r.tableId} liberada`)
    }

    // ── R8/R9: Reservas ACTIVE cuyo tiempo ya terminó ─────────────────────
    const expired = await prisma.reservation.findMany({
      where: {
        status: { in: ['ACTIVE', 'EXTENDED'] },
        endTime: { lt: now },
      },
      include: { table: true },
    })

    for (const r of expired) {
      await prisma.reservation.update({
        where: { id: r.id },
        data: { status: 'COMPLETED' },
      })

      // R8: si el sensor detecta presencia → OCCUPIED_NO_RESERVATION
      // R9: si no hay presencia → FREE
      // Como no tenemos evento del sensor en este momento,
      // chequeamos el lastSeen reciente (< 2 min) para inferir presencia
      const table = await prisma.table.findUnique({
        where: { id: r.tableId },
      })

      const sensorRecentlyActive =
        table?.lastSeen &&
        now.getTime() - table.lastSeen.getTime() < 2 * 60_000

      const newState = sensorRecentlyActive
        ? 'OCCUPIED_NO_RESERVATION'
        : 'FREE'

      await prisma.table.update({
        where: { id: r.tableId },
        data: { state: newState },
      })

      getIO().emit('table:state_changed', {
        tableId: r.tableId,
        newState,
      })

      console.log(
        `[R8/R9] Expirada: ${r.code} — Mesa ${r.tableId} → ${newState}`
      )
    }
  })

  console.log('✅ Motor de estados iniciado (cada 30s)')
}