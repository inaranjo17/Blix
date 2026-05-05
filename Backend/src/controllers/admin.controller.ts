import { Request, Response } from 'express'
import { prisma } from '../configs/db'

export async function getConflicts(_req: Request, res: Response) {
  try {
    const conflicts = await prisma.table.findMany({
      where: { state: 'CONFLICT' },
      include: {
        reservations: {
          where: { status: { in: ['PENDING', 'ACTIVE'] } },
          include: { user: { select: { name: true, email: true } } },
        },
      },
    })
    res.json(conflicts)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener conflictos'
    res.status(500).json({ error: message })
  }
}

export async function getMetrics(_req: Request, res: Response) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalReservationsToday,
      noShowsToday,
      activeNow,
      conflictsNow,
      tableStats,
    ] = await Promise.all([
      prisma.reservation.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.reservation.count({
        where: { status: 'CANCELLED', createdAt: { gte: today } },
      }),
      prisma.reservation.count({ where: { status: 'ACTIVE' } }),
      prisma.table.count({ where: { state: 'CONFLICT' } }),
      prisma.table.findMany({
        select: {
          id: true,
          zone: true,
          capacity: true,
          state: true,
          _count: { select: { reservations: true } },
        },
        orderBy: { id: 'asc' },
      }),
    ])

    res.json({
      today: {
        totalReservations: totalReservationsToday,
        noShows: noShowsToday,
        activeNow,
        conflictsNow,
      },
      tables: tableStats,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener métricas'
    res.status(500).json({ error: message })
  }
}