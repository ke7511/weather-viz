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
}

export function getUVIndexApi(locationId: string) {
  return request.get<UVIndexResponse>(`/weather/uv`, {
    params: {
      locationId
    }
  })
}

// 日出日落
export interface SunriseSunsetInfo {
  sunrise: string
  sunset: string
}

interface SunriseSunsetResponse {
  code: string
  sunrise: string
  sunset: string
}

export function getSunriseSunsetApi(locationId: string) {
  return request.get<SunriseSunsetResponse>(`/weather/sun`, {
    params: {
      locationId
    }
  })
}

// 逐小时天气
export interface HourlyWeatherInfo {
  fxTime: string
  temp: string
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

interface HourlyWeatherResponse {
  code: string
  hourly: HourlyWeatherInfo[]
}

export function getHourlyWeatherApi(locationId: string) {
  return request.get<HourlyWeatherResponse>(`/weather/hourly`, {
    params: {
      locationId
    }
  })
}

// 7天天气预报
export interface DailyForecastInfo {
  fxDate: string
  tempMax: string
  tempMin: string
  iconDay: string
  textDay: string
  iconNight: string
  textNight: string
}

interface DailyForecastResponse {
  code: string
  daily: DailyForecastInfo[]
}

export function getDailyForecastApi(locationId: string) {
  return request.get<DailyForecastResponse>(`/weather/daily`, {
    params: {
      locationId
    }
  })
}
