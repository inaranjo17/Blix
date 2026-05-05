import { Router } from 'express'
import * as ctrl from '../controllers/admin.controller'
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware'

const router = Router()

router.get('/conflicts', requireAuth, requireAdmin, ctrl.getConflicts)
router.get('/metrics',   requireAuth, requireAdmin, ctrl.getMetrics)

export default router