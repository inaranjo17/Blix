import { z } from 'zod'

export const checkinSchema = z.object({
  tableId: z.string().min(2, 'Mesa requerida'),
  code: z.string().min(8, 'Código inválido'),
})