import express from 'express'
import {
  getWeather,
  getUVIndex,
  getSunriseSunset,
  getHourlyWeather
} from '../services/weather'
const router = express.Router()

router.get('/', getWeather)
router.get('/uv', getUVIndex)
router.get('/sun', getSunriseSunset)
router.get('/hourly', getHourlyWeather)

export default router
