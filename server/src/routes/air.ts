import { Router } from 'express'
import { getAirQuality } from '../services/air'

const router = Router()

// GET /api/air/now - 获取实时空气质量
router.get('/now', getAirQuality)

export default router
