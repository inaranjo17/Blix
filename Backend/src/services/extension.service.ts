import { prisma } from '../configs/db'
import { getIO } from '../configs/socket'
import { hasTimeConflict } from '../utils/timeUtils'
import { sendExtensionApprovedEmail, sendExtensionRejectedEmail } from './email.service'

// Agrega estas dos funciones al final de email.service.ts (las muestro abajo)
// Por ahora las importamos — las agregaremos al email service en el siguiente paso

export async function requestExtension(reservationId: string, userId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { user: true },
  })

  if (!reservation) throw new Error('Reserva no encontrada')
  if (reservation.userId !== userId) throw new Error('No es tu reserva')
  if (reservation.status !== 'ACTIVE') {
    throw new Error('Solo puedes extender reservas activas')
  }

  const extensionMs = 30 * 60_000
  const newEnd = new Date(reservation.endTime.getTime() + extensionMs)

  // Verificar que el siguiente bloque esté libre
  const conflicts = await prisma.reservation.findMany({
    where: {
      tableId: reservation.tableId,
      id: { not: reservationId },
      status: { in: ['PENDING', 'ACTIVE'] },
    },
  })

  for (const c of conflicts) {
    if (hasTimeConflict(reservation.endTime, newEnd, c.startTime, c.endTime)) {
      // Enviar correo de rechazo
      await sendExtensionRejectedEmail(
        reservation.user.email,
        reservation.user.name,
        reservation.tableId
      )
      throw new Error('NEXT_SLOT_TAKEN')
    }
  }

  // Extender
  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: { endTime: newEnd, status: 'EXTENDED' },
  })

  const remainingSeconds = Math.max(
    0,
    Math.floor((newEnd.getTime() - Date.now()) / 1000)
  )

  // Emitir timer actualizado
  getIO().emit('table:state_changed', {
    tableId: reservation.tableId,
    newState: 'LEGITIMATELY_OCCUPIED',
    timer: remainingSeconds,
  })

  // Enviar correo de confirmación
  await sendExtensionApprovedEmail(
    reservation.user.email,
    reservation.user.name,
    reservation.tableId,
    newEnd
  )

  return { reservation: updated, newEndTime: newEnd, remainingSeconds }
}