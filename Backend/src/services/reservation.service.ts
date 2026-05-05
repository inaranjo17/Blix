import { prisma } from '../configs/db'
import { getIO } from '../configs/socket'
import { generateReservationCode } from '../utils/generateCode'
import { hasTimeConflict } from '../utils/timeUtils'
import {
  sendConfirmationEmail,
} from './email.service'

export async function createReservation(
  userId: string,
  data: { tableId: string; startTime: string; duration: 30 | 45 | 60 }
) {
  const start = new Date(data.startTime)
  const end = new Date(start.getTime() + data.duration * 60_000)
  const now = new Date()

  // No permitir reservas en el pasado
  if (start < now) {
    throw new Error('No puedes reservar en una hora pasada')
  }

  // Verificar que la mesa existe
  const table = await prisma.table.findUnique({ where: { id: data.tableId } })
  if (!table) throw new Error('Mesa no encontrada')
  if (table.state !== 'FREE' && table.state !== 'RESERVED') {
    throw new Error('La mesa no está disponible para reservar')
  }

  // Verificar conflictos de horario
  const existing = await prisma.reservation.findMany({
    where: {
      tableId: data.tableId,
      status: { in: ['PENDING', 'ACTIVE'] },
    },
  })

  for (const r of existing) {
    if (hasTimeConflict(start, end, r.startTime, r.endTime)) {
      // Buscar alternativas del mismo tamaño
      const alternatives = await prisma.table.findMany({
        where: {
          capacity: table.capacity,
          id: { not: data.tableId },
          state: 'FREE',
        },
        include: {
          reservations: {
            where: { status: { in: ['PENDING', 'ACTIVE'] } },
          },
        },
      })

      // Filtrar las que tampoco tienen conflicto
      const available = alternatives.filter((alt) =>
        alt.reservations.every(
          (ar) => !hasTimeConflict(start, end, ar.startTime, ar.endTime)
        )
      )

      throw new Error(
        JSON.stringify({
          message: 'Horario ocupado para esta mesa',
          alternatives: available.map((a) => ({
            id: a.id,
            zone: a.zone,
            capacity: a.capacity,
          })),
        })
      )
    }
  }

  // Crear reserva
  const code = generateReservationCode(data.tableId)
  const reservation = await prisma.reservation.create({
    data: {
      code,
      userId,
      tableId: data.tableId,
      startTime: start,
      endTime: end,
      duration: data.duration,
    },
    include: {
    table: true,
    user: {
      select: {         // ← reemplaza "true" por esto
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      }
    }
  },
})

  // Actualizar estado de mesa
  await prisma.table.update({
    where: { id: data.tableId },
    data: { state: 'RESERVED' },
  })

  // Emitir WebSocket a todos los clientes
  getIO().emit('table:state_changed', {
    tableId: data.tableId,
    newState: 'RESERVED',
  })

  // Enviar correo de confirmación
  await sendConfirmationEmail(
    reservation.user.email,
    reservation.user.name,
    reservation.code,
    reservation.tableId,
    reservation.startTime,
    reservation.endTime
  )

  return reservation
}

export async function getUserReservations(userId: string) {
  return prisma.reservation.findMany({
    where: { userId },
    include: { table: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function cancelReservation(reservationId: string, userId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  })

  if (!reservation) throw new Error('Reserva no encontrada')
  if (reservation.userId !== userId) throw new Error('No es tu reserva')
  if (reservation.status === 'ACTIVE') {
    throw new Error('No puedes cancelar una reserva activa')
  }
  if (reservation.status === 'CANCELLED') {
    throw new Error('Esta reserva ya fue cancelada')
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' },
  })

  // Verificar si hay otras reservas pendientes para esta mesa
  const otherPending = await prisma.reservation.findFirst({
    where: {
      tableId: reservation.tableId,
      status: { in: ['PENDING', 'ACTIVE'] },
    },
  })

  // Si no hay otras reservas, liberar la mesa
  if (!otherPending) {
    await prisma.table.update({
      where: { id: reservation.tableId },
      data: { state: 'FREE' },
    })
    getIO().emit('table:state_changed', {
      tableId: reservation.tableId,
      newState: 'FREE',
    })
  }
}

export async function getAllReservations() {
  return prisma.reservation.findMany({
    include: { user: { select: { id: true, name: true, email: true } }, table: true },
    orderBy: { createdAt: 'desc' },
  })
}