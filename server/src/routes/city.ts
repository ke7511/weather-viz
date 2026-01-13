import express from 'express'
import { getCity } from '../services/city'

const router = express.Router()

router.get('/', getCity)

export default router
