import { Router } from 'express'
import * as ctrl from '../controllers/sensor.controller'

const router = Router()

// Endpoint interno — en producción estaría protegido por API key del gateway IoT
router.post('/event', ctrl.sensorEvent)

export default router