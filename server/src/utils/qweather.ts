import axios from 'axios'
import { config } from '../config'
import { generateQWeatherJwt } from './jwt'

/**
 * 自动处理 JWT 认证
 */
export const qweatherApi = {
  /**
   * 发送 GET 请求
   */
  async get<T = unknown>(
    path: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const token = await generateQWeatherJwt()
    const { data } = await axios.get<T>(
      `https://${config.qweatherApiHost}${path}`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return data
  }
}

/**
 * GEO API - 城市搜索
 */
export async function getTrueCity(location: string) {
  return qweatherApi.get('/geo/v2/city/lookup', { location, range: 'cn' })
}

/**
 * GEO API - 热门城市
 */
export async function getTrueTopCities(
  range?: 'cn' | 'world',
  number?: number
) {
  return qweatherApi.get('/geo/v2/city/top', { range, number })
}

/**
 * GEO API - 根据经纬度查询城市
 */
export async function getCityByLocation(lon: number, lat: number) {
  return qweatherApi.get('/geo/v2/city/lookup', {
    location: `${lon},${lat}`,
    range: 'cn'
  })
}

// 天气数据
export async function getTrueWeather(locationId: string) {
  return qweatherApi.get('/v7/weather/now', { location: locationId })
}
