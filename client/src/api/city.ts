import { request } from '@/utils/request'

// 城市信息接口
export interface CityInfo {
  id: string
  name: string
  adm1: string
  adm2: string
  country: string
  lat: string
  lon: string
}

// 城市搜索响应
interface SearchCityResponse {
  code: string
  location: CityInfo[]
}

export const searchCityApi = (keyword: string) =>
  request.get<SearchCityResponse>('/city', { params: { keyword } })

// 根据经纬度获取城市
export const getCityByLocationApi = (lon: number, lat: number) =>
  request.get<SearchCityResponse>('/city/locate', { params: { lon, lat } })
