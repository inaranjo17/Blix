import { z } from 'zod'

export const createReservationSchema = z.object({
  tableId: z.string().min(2, 'Mesa requerida'),
  startTime: z.string().datetime({ message: 'Fecha/hora inválida' }),
  duration: z.union(
    [z.literal(30), z.literal(45), z.literal(60)],
    { error: 'Duración debe ser 30, 45 o 60 minutos' }
  ),
})