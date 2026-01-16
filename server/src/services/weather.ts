import { Request, Response } from 'express'
import { shouldUseMock } from '../config'
import {
  getTrueWeather,
  getTrueUVIndex,
  getTrueSunriseSunset,
  getTrueHourlyWeather,
  getTrueDailyForecast
} from '../utils/qweather'
import {
  getMockWeather,
  getMockUVIndex,
  getMockSunriseSunset,
  getMockHourlyWeather,
  getMockDailyForecast
} from '../mock/weather'

export async function getWeather(req: Request, res: Response) {
  try {
    const { locationId } = req.query
    if (!locationId || typeof locationId !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供城市ID'
      })
    }

    if (shouldUseMock()) {
      const data = getMockWeather()
      return res.json(data)
    }

    const data = await getTrueWeather(locationId)
    return res.json(data)
  } catch (error) {
    console.error('获取天气失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}

export async function getUVIndex(req: Request, res: Response) {
  try {
    const { locationId } = req.query
    if (!locationId || typeof locationId !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供城市ID'
      })
    }

    if (shouldUseMock()) {
      const data = getMockUVIndex()
      return res.json(data)
    }

    const data = await getTrueUVIndex(locationId)
    return res.json(data)
  } catch (error) {
    console.error('获取UV指数失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}

export async function getSunriseSunset(req: Request, res: Response) {
  try {
    const { locationId } = req.query
    if (!locationId || typeof locationId !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供城市ID'
      })
    }

    if (shouldUseMock()) {
      const data = getMockSunriseSunset()
      return res.json(data)
    }

    const data = await getTrueSunriseSunset(locationId)
    return res.json(data)
  } catch (error) {
    console.error('获取日出日落失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}

export async function getHourlyWeather(req: Request, res: Response) {
  try {
    const { locationId } = req.query
    if (!locationId || typeof locationId !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供城市ID'
      })
    }

    if (shouldUseMock()) {
      const data = getMockHourlyWeather()
      return res.json(data)
    }

    const data = await getTrueHourlyWeather(locationId)
    return res.json(data)
  } catch (error) {
    console.error('获取逐小时天气失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}

export async function getDailyForecast(req: Request, res: Response) {
  try {
    const { locationId } = req.query
    if (!locationId || typeof locationId !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供城市ID'
      })
    }

    if (shouldUseMock()) {
      const data = getMockDailyForecast()
      return res.json(data)
    }

    const data = await getTrueDailyForecast(locationId)
    return res.json(data)
  } catch (error) {
    console.error('获取7天预报失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}
