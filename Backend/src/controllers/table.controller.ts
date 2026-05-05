import { Request, Response } from 'express'
import * as tableService from '../services/table.service'

export async function getTables(_req: Request, res: Response) {
  try {
    const tables = await tableService.getAllTables()
    res.json(tables)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener mesas'
    res.status(500).json({ error: message })
  }
}

export async function getTable(req: Request, res: Response) {
  try {
    const table = await tableService.getTableById(req.params.id as string,)
    if (!table) {
      res.status(404).json({ error: 'Mesa no encontrada' })
      return
    }
    res.json(table)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener mesa'
    res.status(500).json({ error: message })
  }
}