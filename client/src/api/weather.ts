import { request } from '@/utils/request'

export interface weatherInfo {
  obsTime: string
  temp: string
  feelsLike: string
  icon: string
  text: string
  wind360: string
  windDir: string
  windScale: string
  windSpeed: string
  humidity: string
  precip: string
  pressure: string
  vis: string
  cloud: string
  dew: string
}

interface WeatherResponse {
  code: string
  now: weatherInfo
}

export function getWeatherApi(locationId: string) {
  return request.get<WeatherResponse>(`/weather`, {
    params: {
      locationId
    }
  })
}
