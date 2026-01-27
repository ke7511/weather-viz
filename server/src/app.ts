import express from 'express'
import cors from 'cors'
import { config, shouldUseMock } from './config'
import cityRouter from './routes/city'
import weatherRouter from './routes/weather'
import indicesRouter from './routes/indices'
import airRouter from './routes/air'

const app = express()

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api/city', cityRouter)
app.use('/api/weather', weatherRouter)
app.use('/api/indices', indicesRouter)
app.use('/api/air', airRouter)

// 状态端点 - 返回当前是否为模拟数据模式
app.get('/api/status', (_req, res) => {
  res.json({ isMock: shouldUseMock() })
})

app.listen(config.port, () => {
  console.log(`🚀 Server is running on http://localhost:${config.port}`)
  console.log(
    `📦 Mode: ${shouldUseMock() ? '模拟数据 (Mock)' : '真实API (QWeather)'}`
  )
})
