import { Request, Response } from 'express'
import * as sensorService from '../services/sensor.service'

export async function sensorEvent(req: Request, res: Response) {
  try {
    const { tableId, detected } = req.body

    if (typeof tableId !== 'string' || typeof detected !== 'boolean') {
      res.status(400).json({ error: 'tableId (string) y detected (boolean) son requeridos' })
      return
    }

    const result = await sensorService.processSensorEvent(tableId, detected)
    res.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error en evento de sensor'
    res.status(400).json({ error: message })
  }
}