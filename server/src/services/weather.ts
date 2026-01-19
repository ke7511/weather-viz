import { Request, Response } from 'express'
import { shouldUseMock } from '../config'
import {
  getTrueWeather,
  getTrueUVIndex,
  getTrueSunriseSunset,
  getTrueHourlyWeather,
  getTrueHourlyWeather168,
  getTrueDailyForecast
} from '../utils/qweather'
import {
  getMockWeather,
  getMockUVIndex,
  getMockSunriseSunset,
  getMockHourlyWeather,
  getMockHourlyWeather168,
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

export async function getHourlyWeather168(req: Request, res: Response) {
  try {
    const { locationId, day } = req.query
    if (!locationId || typeof locationId !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供城市ID'
      })
    }

    let data: { code: string; hourly?: Array<Record<string, unknown>> }
    if (shouldUseMock()) {
      data = getMockHourlyWeather168()
    } else {
      data = (await getTrueHourlyWeather168(locationId)) as typeof data
    }

    // 如果传入了 day 参数，返回指定那一天的 24 小时数据
    if (day !== undefined) {
      const dayIndex = parseInt(day as string, 10)
      if (isNaN(dayIndex) || dayIndex < 0 || dayIndex > 6) {
        return res.status(400).json({
          code: '400',
          message: 'day 参数必须是 0-6 的整数'
        })
      }

      const startIndex = dayIndex * 24
      const endIndex = startIndex + 24
      const slicedHourly = data.hourly?.slice(startIndex, endIndex) || []

      return res.json({
        code: data.code,
        hourly: slicedHourly
      })
    }

    return res.json(data)
  } catch (error) {
    console.error('获取168小时预报失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}
