import { Router } from 'express'
import * as ctrl from '../controllers/reservation.controller'
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { createReservationSchema } from '../validators/reservation.validator'

const router = Router()

router.post('/',     requireAuth, validate(createReservationSchema), ctrl.createReservation)
router.get('/my',    requireAuth, ctrl.getMyReservations)
router.delete('/:id', requireAuth, ctrl.cancelReservation)
router.get('/',      requireAuth, requireAdmin, ctrl.getAllReservations)

export default router