import express from 'express'
import {
  getWeather,
  getSunriseSunset,
  getHourlyWeather,
  getHourlyWeather168,
  getDailyForecast
} from '../services/weather'
const router = express.Router()

router.get('/', getWeather)
router.get('/sun', getSunriseSunset)
router.get('/hourly', getHourlyWeather)
router.get('/hourly168', getHourlyWeather168)
router.get('/daily', getDailyForecast)

export default router
