import { prisma } from '../configs/db'
import { getIO } from '../configs/socket'
import { sendConflictReassignedEmail } from './email.service'
import { generateReservationCode } from '../utils/generateCode'

export async function processSensorEvent(
  tableId: string,
  detected: boolean
) {
  const now = new Date()

  // Registrar que el sensor sigue vivo
  await prisma.table.update({
    where: { id: tableId },
    data: { lastSeen: now, sensorActive: true },
  })

  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: {
      reservations: {
        where: { status: { in: ['PENDING', 'ACTIVE'] } },
        orderBy: { startTime: 'asc' },
        include: { user: true },
      },
    },
  })

  if (!table) throw new Error('Mesa no encontrada')

  const pendingReservation = table.reservations.find(
    (r) => r.status === 'PENDING'
  )
  const activeReservation = table.reservations.find(
    (r) => r.status === 'ACTIVE'
  )

  // ── R5: Presencia sin ninguna reserva ──────────────────────────────
  if (detected && !pendingReservation && !activeReservation) {
    if (table.state !== 'OCCUPIED_NO_RESERVATION') {
      await prisma.table.update({
        where: { id: tableId },
        data: { state: 'OCCUPIED_NO_RESERVATION' },
      })
      getIO().emit('table:state_changed', {
        tableId,
        newState: 'OCCUPIED_NO_RESERVATION',
      })
    }
    return { tableId, detected, state: 'OCCUPIED_NO_RESERVATION' }
  }

  // ── R4a / R4b: Presencia con reserva PENDING (aún no hizo check-in) ──
  if (detected && pendingReservation) {
    const presenceSince = table.presenceSince ?? now
    const secondsWaiting = (now.getTime() - presenceSince.getTime()) / 1000

    if (secondsWaiting < 180) {
      // R4a: < 3 minutos → PENDING_CONFIRM (mapa muestra amarillo)
      if (table.state !== 'PENDING_CONFIRM') {
        await prisma.table.update({
          where: { id: tableId },
          data: { state: 'PENDING_CONFIRM', presenceSince },
        })
        // No emitimos cambio de estado al público — sigue en RESERVED visualmente
      }
    } else {
      // R4b: ≥ 3 minutos → CONFLICT
      await prisma.table.update({
        where: { id: tableId },
        data: { state: 'CONFLICT', presenceSince: null },
      })

      // Notificar solo al admin (sala privada)
      getIO().to('admin-room').emit('table:conflict', { tableId })

      // Mapa público sigue viendo OCCUPIED (rojo) — no CONFLICT
      getIO().emit('table:state_changed', {
        tableId,
        newState: 'LEGITIMATELY_OCCUPIED', // lo que ve el público
      })

      // Intentar reasignación automática
      await tryReassignment(pendingReservation, tableId, now)
    }
    return { tableId, detected, state: table.state }
  }

  // ── R9: Sin presencia + timer activo expirado → FREE ─────────────
  if (!detected && activeReservation) {
    // El usuario activo se fue antes de tiempo → queda ocupado sin reserva
    // El job de expiración se encargará cuando el timer llegue a 0
    return { tableId, detected, state: table.state }
  }

  // ── Sin presencia + mesa ocupada sin reserva → FREE ──────────────
  if (!detected && table.state === 'OCCUPIED_NO_RESERVATION') {
    await prisma.table.update({
      where: { id: tableId },
      data: { state: 'FREE' },
    })
    getIO().emit('table:state_changed', { tableId, newState: 'FREE' })
    return { tableId, detected, state: 'FREE' }
  }

  return { tableId, detected, state: table.state }
}

// Función interna: busca mesa alternativa y reasigna
async function tryReassignment(
  reservation: {
    id: string
    userId: string
    tableId: string
    code: string
    user: { email: string; name: string }
  },
  conflictTableId: string,
  now: Date
) {
  const originalTable = await prisma.table.findUnique({
    where: { id: conflictTableId },
  })
  if (!originalTable) return

  // Buscar mesa libre del mismo tamaño en zona más cercana
  const alternative = await prisma.table.findFirst({
    where: {
      capacity: originalTable.capacity,
      id: { not: conflictTableId },
      state: 'FREE',
    },
    orderBy: [{ zone: 'asc' }, { id: 'asc' }],
  })

  if (alternative) {
    // Bloquear la mesa alternativa
    await prisma.table.update({
      where: { id: alternative.id },
      data: { state: 'RESERVED' },
    })

    // Crear nueva reserva con nuevo código
    const newCode = generateReservationCode(alternative.id)
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        tableId: alternative.id,
        code: newCode,
        status: 'PENDING',
      },
    })

    getIO().emit('table:state_changed', {
      tableId: alternative.id,
      newState: 'RESERVED',
    })

    await sendConflictReassignedEmail(
      reservation.user.email,
      reservation.user.name,
      conflictTableId,
      alternative.id,
      newCode
    )
  }
  // Si no hay alternativa, el admin lo verá en el panel de conflictos
}