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

export function getSunriseSunsetApi(locationId: string, date?: string) {
  return request.get<SunriseSunsetResponse>(`/weather/sun`, {
    params: {
      locationId,
      date
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
  humidity?: string
  cloud?: string
  windSpeedDay?: string
  windDirDay?: string
  windSpeedNight?: string
  windDirNight?: string
  vis?: string
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

export function getHourlyWeather168Api(locationId: string, day: number) {
  return request.get<HourlyWeatherResponse>(`/weather/hourly168`, {
    params: {
      locationId,
      day
    }
  })
}
