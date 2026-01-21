import { Request, Response } from 'express'
import { shouldUseMock } from '../config'
import { getMockUV } from '../mock/indices'
import { getTrueUV } from '../utils/qweather'

/**
 * 获取 UV 紫外线指数（3天）
 */
export async function getUVIndex(req: Request, res: Response) {
  try {
    const { locationId, day } = req.query
    if (!locationId || typeof locationId !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供城市ID'
      })
    }

    let data: { code: string; daily?: Array<Record<string, unknown>> }
    if (shouldUseMock()) {
      data = getMockUV()
    } else {
      data = (await getTrueUV(locationId)) as typeof data
    }

    // 如果传入了 day 参数，返回指定那一天的数据
    if (day !== undefined) {
      const dayIndex = parseInt(day as string, 10)
      if (isNaN(dayIndex) || dayIndex < 0) {
        return res.status(400).json({
          code: '400',
          message: 'day 参数必须是非负整数'
        })
      }

      // UV 指数只有 3 天的数据，超过范围返回 null
      const uvData = data.daily?.[dayIndex] || null

      return res.json({
        code: data.code,
        daily: uvData ? [uvData] : [],
        available: dayIndex < 3 // 标识数据是否可用
      })
    }

    return res.json(data)
  } catch (error) {
    console.error('获取UV指数失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}
