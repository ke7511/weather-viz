import { request } from '@/utils/request'

// 污染物信息
export interface PollutantInfo {
  code: string // 污染物代码：pm2p5, pm10, o3, no2, so2, co
  name: string // 污染物名称
  fullName: string // 污染物全称
  concentration: {
    value: number
    unit: string // μg/m³ 或 mg/m³
  }
  subIndex: {
    value: number
    valueDisplay: string
  }
}

// AQI 信息
export interface AQIInfo {
  aqi: number // AQI 数值
  aqiDisplay: string
  level: string // AQI 等级 1-6
  category: string // 空气质量类别：优、良、轻度污染等
  code: string // 如 'cn-mee'
  name: string // 如 'AQI (CN)'
  color: {
    red: number
    green: number
    blue: number
    alpha: number
  }
  primaryPollutant: {
    code: string
    name: string
    fullName: string
  }
  health?: {
    effect: string
    advice: {
      generalPopulation: string
      sensitivePopulation: string
    }
  }
}

// 空气质量响应
export interface AirQualityResponse {
  indexes: AQIInfo[]
  pollutants: PollutantInfo[]
  metadata?: object
  stations?: object[]
  sources?: string[] // 数据来源（署名规范要求完整显示）
}

/**
 * 获取实时空气质量
 * @param lat 纬度
 * @param lon 经度
 */
export function getAirQualityApi(lat: string, lon: string) {
  return request.get<AirQualityResponse>('/air/now', {
    params: { lat, lon }
  })
}
