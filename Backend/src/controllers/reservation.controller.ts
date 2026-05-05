import { Request, Response } from 'express'
import * as reservationService from '../services/reservation.service'

interface AuthRequest extends Request {
  user?: { userId: string; role: string }
}

export async function createReservation(req: AuthRequest, res: Response) {
  try {
    const reservation = await reservationService.createReservation(
      req.user!.userId,
      req.body
    )
    res.status(201).json(reservation)
  } catch (err: unknown) {
    if (err instanceof Error) {
      // Intentar parsear si viene con alternativas
      try {
        const parsed = JSON.parse(err.message)
        res.status(409).json(parsed)
        return
      } catch {
        // No era JSON, es un mensaje simple
      }
      res.status(400).json({ error: err.message })
      return
    }
    res.status(500).json({ error: 'Error al crear reserva' })
  }
}

export async function getMyReservations(req: AuthRequest, res: Response) {
  try {
    const reservations = await reservationService.getUserReservations(
      req.user!.userId
    )
    res.json(reservations)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener reservas'
    res.status(500).json({ error: message })
  }
}

export async function cancelReservation(req: AuthRequest, res: Response) {
  try {
    await reservationService.cancelReservation(
      req.params.id as string,
      req.user!.userId
    )
    res.json({ message: 'Reserva cancelada exitosamente' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al cancelar'
    res.status(400).json({ error: message })
  }
}

export async function getAllReservations(_req: Request, res: Response) {
  try {
    const reservations = await reservationService.getAllReservations()
    res.json(reservations)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener reservas'
    res.status(500).json({ error: message })
  }
}