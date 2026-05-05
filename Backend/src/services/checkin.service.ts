import { prisma } from '../configs/db'
import { getIO } from '../configs/socket'

export async function processCheckin(
  userId: string,
  tableId: string,
  code: string
) {
  const now = new Date()
  // Ventana válida: desde 0 hasta 10 min después del startTime
  const graceLimit = new Date(now.getTime() - 10 * 60_000)

  const reservation = await prisma.reservation.findFirst({
    where: {
      code,
      tableId,
      userId,
      status: 'PENDING',
      startTime: { gte: graceLimit }, // no expiró la gracia
      endTime: { gt: now },           // no terminó el tiempo
    },
    include: { table: true, user: true },
  })

  if (!reservation) {
    throw new Error(
      'Código inválido, mesa incorrecta, o reserva fuera del horario activo'
    )
  }

  // Activar reserva
  const updated = await prisma.reservation.update({
    where: { id: reservation.id },
    data: { status: 'ACTIVE', checkedInAt: now },
  })

  // Actualizar mesa
  await prisma.table.update({
    where: { id: tableId },
    data: {
      state: 'LEGITIMATELY_OCCUPIED',
      presenceSince: null,
    },
  })

  const remainingSeconds = Math.max(
    0,
    Math.floor((reservation.endTime.getTime() - now.getTime()) / 1000)
  )

  // Emitir a todos los clientes con el timer
  getIO().emit('table:state_changed', {
    tableId,
    newState: 'LEGITIMATELY_OCCUPIED',
    timer: remainingSeconds,
  })

  return {
    reservation: updated,
    remainingSeconds,
    endTime: reservation.endTime,
  }
}