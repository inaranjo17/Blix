import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAuth } from '../middlewares/auth.middleware'
import { registerSchema, loginSchema } from '../validators/auth.validator'

const router = Router()

router.post('/register', validate(registerSchema), ctrl.register)
router.post('/login', validate(loginSchema), ctrl.login)
router.get('/verify/:token', ctrl.verify)
router.get('/me', requireAuth, ctrl.me)

export default router