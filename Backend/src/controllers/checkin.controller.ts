import { Request, Response } from 'express'
import * as checkinService from '../services/checkin.service'

interface AuthRequest extends Request {
  user?: { userId: string; role: string }
}

export async function checkin(req: AuthRequest, res: Response) {
  try {
    const { tableId, code } = req.body
    const result = await checkinService.processCheckin(
      req.user!.userId,
      tableId,
      code
    )
    res.json({
      message: '¡Check-in exitoso! Tu tiempo ha comenzado.',
      ...result,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error en check-in'
    res.status(400).json({ error: message })
  }
}