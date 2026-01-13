import { Request, Response } from 'express'
import { shouldUseMock } from '../config'
import { searchMockCity } from '../mock/city'
import { searchCity } from '../utils/qweather'

/**
 * 获取城市列表或搜索城市
 */
export async function getCity(req: Request, res: Response) {
  try {
    const { keyword } = req.query

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        code: '400',
        message: '请提供搜索关键词'
      })
    }

    // 根据配置决定使用模拟数据还是真实 API
    if (shouldUseMock()) {
      const data = searchMockCity(keyword)
      return res.json(data)
    }

    // 调用封装好的和风天气 API
    const data = await searchCity(keyword)
    return res.json(data)
  } catch (error) {
    console.error('城市搜索失败:', error)
    return res.status(500).json({
      code: '500',
      message: '服务器内部错误'
    })
  }
}
