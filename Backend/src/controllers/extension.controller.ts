import { Request, Response } from 'express'
import * as extensionService from '../services/extension.service'

interface AuthRequest extends Request {
  user?: { userId: string; role: string }
}

export async function extendReservation(req: AuthRequest, res: Response) {
  try {
    const result = await extensionService.requestExtension(
      req.params.id as string,
      req.user!.userId
    )
    res.json({
      message: `¡Reserva extendida! Nuevo fin: ${result.newEndTime.toLocaleTimeString('es-CO')}`,
      ...result,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al extender'

    if (message === 'NEXT_SLOT_TAKEN') {
      res.status(409).json({
        error: 'No es posible extender: hay una reserva en el siguiente bloque',
      })
      return
    }

    res.status(400).json({ error: message })
  }
}