import { Router } from 'express'
import * as ctrl from '../controllers/extension.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

// POST /api/reservations/:id/extend
router.post('/:id/extend', requireAuth, ctrl.extendReservation)

export default router