import express from 'express'
import { getWeather, getUVIndex, getSunriseSunset } from '../services/weather'
const router = express.Router()

router.get('/', getWeather)
router.get('/uv', getUVIndex)
router.get('/sun', getSunriseSunset)

export default router
