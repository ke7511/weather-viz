import express from 'express'
import { getCity, getCityByCoords } from '../services/city'

const router = express.Router()

router.get('/', getCity)
router.get('/locate', getCityByCoords)

export default router
