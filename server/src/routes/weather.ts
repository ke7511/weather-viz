import express from 'express'
import { getWeather } from '../services/weather'
const router = express.Router()

router.get('/', getWeather)

export default router
