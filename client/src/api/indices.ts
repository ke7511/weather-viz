import { request } from '@/utils/request'

// UV 紫外线指数
export interface UVIndexInfo {
  date: string
  type: string
  name: string
  level: string
  category: string
  text: string
}

interface UVIndexResponse {
  code: string
  daily: UVIndexInfo[]
  available?: boolean // 标识数据是否可用（超过 3 天范围时为 false）
}

/**
 * 获取 UV 紫外线指数
 * @param locationId 城市ID
 * @param day 天数索引（0=今天，1=明天...），可选
 * @returns UV 指数数据，注意 day >= 3 时 available 为 false
 */
export function getUVIndexApi(locationId: string, day?: number) {
  return request.get<UVIndexResponse>('/indices/uv', {
    params: {
      locationId,
      day
    }
  })
}
