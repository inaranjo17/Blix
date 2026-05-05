import { TableState } from '@prisma/client'
import { prisma } from '../configs/db'

export async function getAllTables() {
  return prisma.table.findMany({
    orderBy: [{ zone: 'asc' }, { id: 'asc' }],
    include: {
      reservations: {
        where: { status: { in: ['PENDING', 'ACTIVE'] } },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
        },
      },
    },
  })
}

export async function getTableById(id: string) {
  return prisma.table.findUnique({
    where: { id },
    include: {
      reservations: {
        where: { status: { in: ['PENDING', 'ACTIVE'] } },
        select: {
          id: true,
          code: true,
          startTime: true,
          endTime: true,
          status: true,
        },
      },
    },
  })
}

export async function updateTableState(
  id: string,
  state: TableState,
  extra?: Partial<{
    presenceSince: Date | null
    lastSeen: Date
    sensorActive: boolean
  }>
) {
  return prisma.table.update({
    where: { id },
    data: { state, ...extra },
  })
}