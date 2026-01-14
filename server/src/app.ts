import express from 'express'
import cors from 'cors'
import { config, shouldUseMock } from './config'
import cityRouter from './routes/city'
import weatherRouter from './routes/weather'

const app = express()

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api/city', cityRouter)
app.use('/api/weather', weatherRouter)

app.listen(config.port, () => {
  console.log(`🚀 Server is running on http://localhost:${config.port}`)
  console.log(
    `📦 Mode: ${shouldUseMock() ? '模拟数据 (Mock)' : '真实API (QWeather)'}`
  )
})
