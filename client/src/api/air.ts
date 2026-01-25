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
  value: number // AQI 数值
  valueDisplay: string
  level: string // AQI 等级 1-6
  category: string // 空气质量类别：优、良、轻度污染等
  color: string // 等级对应颜色
  primaryPollutant: {
    code: string
    name: string
    fullName: string
  }
}

// 空气质量响应
export interface AirQualityResponse {
  code: string
  updateTime: string
  aqi: AQIInfo
  pollutants: PollutantInfo[]
  source?: string
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
