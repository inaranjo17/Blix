import { Router } from 'express'
import * as ctrl from '../controllers/table.controller'

const router = Router()

// Públicas — cualquiera puede ver el mapa
router.get('/', ctrl.getTables)
router.get('/:id', ctrl.getTable)

export default router