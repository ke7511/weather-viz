import { Request, Response } from 'express'
import { shouldUseMock } from '../config'
import { getMockAirQuality } from '../mock/air'
import { getTrueAirQuality } from '../utils/qweather'

/**
 * 获取实时空气质量 AQI
 * 新版 API v1 需要使用经纬度参数
 */
export async function getAirQuality(req: Request, res: Response) {
  try {
    const { lat, lon } = req.query
    if (!lat || !lon || typeof lat !== 'string' || typeof lon !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供经纬度参数 (lat, lon)'
      })
    }

    if (shouldUseMock()) {
      const data = getMockAirQuality()
      return res.json(data)
    }

    const data = await getTrueAirQuality(lat, lon)
    return res.json(data)
  } catch (error) {
    console.error('获取空气质量失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}
