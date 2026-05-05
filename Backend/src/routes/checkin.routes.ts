import { Router } from 'express'
import * as ctrl from '../controllers/checkin.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { checkinSchema } from '../validators/checkin.validator'

const router = Router()

router.post('/', requireAuth, validate(checkinSchema), ctrl.checkin)

export default router