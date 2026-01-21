import express from 'express'
import { getUVIndex } from '../services/indices'

const router = express.Router()

// UV 紫外线指数
router.get('/uv', getUVIndex)

export default router
