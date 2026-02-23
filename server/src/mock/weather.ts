import { faker } from '@faker-js/faker/locale/zh_CN'
import dayjs from 'dayjs'

// 天气类型定义
const weatherTypes = [
  { icon: '100', text: '晴' },
  { icon: '101', text: '多云' },
  { icon: '104', text: '阴' },
  { icon: '305', text: '小雨' },
  { icon: '302', text: '雷阵雨' }
]

const nightWeatherTypes = [
  { icon: '150', text: '晴' },
  { icon: '151', text: '多云' },
  { icon: '104', text: '阴' },
  { icon: '305', text: '小雨' },
  { icon: '302', text: '雷阵雨' }
]

const windDirs = [
  '东风',
  '南风',
  '西风',
  '北风',
  '东南风',
  '西南风',
  '东北风',
  '西北风'
]

export function getMockWeather() {
  return {
    code: '200',
    now: {
      obsTime: dayjs().format('YYYY-MM-DDTHH:mm+08:00'),
      temp: String(faker.number.int({ min: -5, max: 40 })),
      feelsLike: String(faker.number.int({ min: -8, max: 42 })),
      icon: faker.helpers.arrayElement(weatherTypes).icon,
      text: faker.helpers.arrayElement(weatherTypes).text,
      wind360: String(faker.number.int({ min: 0, max: 359 })),
      windDir: faker.helpers.arrayElement(windDirs),
      windScale: String(faker.number.int({ min: 1, max: 5 })),
      windSpeed: String(faker.number.int({ min: 1, max: 30 })),
      humidity: String(faker.number.int({ min: 20, max: 95 })),
      precip: faker.helpers.arrayElement(['0.0', '0.0', '0.0', '0.5', '1.2']),
      pressure: String(faker.number.int({ min: 990, max: 1030 })),
      vis: String(faker.number.int({ min: 5, max: 30 })),
      cloud: String(faker.number.int({ min: 0, max: 100 })),
      dew: String(faker.number.int({ min: -10, max: 28 }))
    }
  }
}

export function getMockSunriseSunset() {
  return {
    code: '200',
    sunrise: `${faker.number.int({ min: 5, max: 6 }).toString().padStart(2, '0')}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`,
    sunset: `${faker.number.int({ min: 18, max: 19 }).toString().padStart(2, '0')}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`
  }
}

// 逐小时天气 mock 数据 - 动态生成 24 小时
export function getMockHourlyWeather() {
  const now = new Date()
  now.setMinutes(0, 0, 0)

  const hourly = Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now.getTime() + i * 3600000)
    const hour = time.getHours()

    // 模拟温度变化：白天高，夜间低
    const baseTemp = faker.number.int({ min: 18, max: 28 })
    const tempVariation = Math.round(
      Math.sin(((hour - 6) / 24) * Math.PI * 2) * 6
    )
    const temp = baseTemp + tempVariation

    const weather = faker.helpers.arrayElement(weatherTypes)

    return {
      fxTime: time.toISOString().replace('Z', '+08:00'),
      temp: String(temp),
      icon: weather.icon,
      text: weather.text,
      wind360: String(faker.number.int({ min: 0, max: 359 })),
      windDir: faker.helpers.arrayElement(windDirs),
      windScale: String(faker.number.int({ min: 1, max: 3 })),
      windSpeed: String(faker.number.int({ min: 5, max: 20 })),
      humidity: String(faker.number.int({ min: 40, max: 85 })),
      precip: '0.0',
      pressure: String(faker.number.int({ min: 1000, max: 1025 })),
      vis: '16',
      cloud: String(faker.number.int({ min: 0, max: 50 })),
      dew: String(temp - faker.number.int({ min: 3, max: 8 }))
    }
  })

  return { code: '200', hourly }
}

// 168小时（7天）逐时预报 mock 数据
export function getMockHourlyWeather168() {
  const now = new Date()
  now.setMinutes(0, 0, 0)

  // 每天分配一种主天气
  const dailyWeather = Array.from({ length: 7 }, () =>
    faker.helpers.arrayElement(weatherTypes)
  )

  const hourly = Array.from({ length: 168 }, (_, i) => {
    const time = new Date(now.getTime() + i * 3600000)
    const hour = time.getHours()
    const dayIndex = Math.floor(i / 24)

    const baseTemp = faker.number.int({ min: 18, max: 28 })
    const tempVariation = Math.round(
      Math.sin(((hour - 6) / 24) * Math.PI * 2) * 6
    )
    const temp = baseTemp + tempVariation

    const weather = dailyWeather[dayIndex]
    const isRainy = weather.icon === '305' || weather.icon === '302'

    return {
      fxTime: time.toISOString().replace('Z', '+08:00'),
      temp: String(temp),
      icon: weather.icon,
      text: weather.text,
      wind360: String(faker.number.int({ min: 0, max: 359 })),
      windDir: faker.helpers.arrayElement(windDirs),
      windScale: String(faker.number.int({ min: 1, max: 4 })),
      windSpeed: String(faker.number.int({ min: 5, max: 20 })),
      humidity: String(faker.number.int({ min: 40, max: 85 })),
      pop: String(isRainy ? faker.number.int({ min: 30, max: 80 }) : 0),
      precip: isRainy
        ? faker.number.float({ min: 0.1, max: 3, fractionDigits: 1 }).toString()
        : '0.0',
      pressure: String(faker.number.int({ min: 1000, max: 1025 })),
      cloud: String(faker.number.int({ min: 0, max: 100 })),
      dew: String(temp - faker.number.int({ min: 3, max: 8 }))
    }
  })

  return { code: '200', hourly }
}

// 7天预报 mock 数据
export function getMockDailyForecast() {
  const daily = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD')
    const dayWeather = faker.helpers.arrayElement(weatherTypes)
    const nightWeather = faker.helpers.arrayElement(nightWeatherTypes)
    const tempMin = faker.number.int({ min: 15, max: 24 })
    const tempMax = tempMin + faker.number.int({ min: 3, max: 10 })

    return {
      fxDate: date,
      tempMax: String(tempMax),
      tempMin: String(tempMin),
      iconDay: dayWeather.icon,
      textDay: dayWeather.text,
      iconNight: nightWeather.icon,
      textNight: nightWeather.text,
      humidity: String(faker.number.int({ min: 40, max: 95 })),
      cloud: String(faker.number.int({ min: 5, max: 95 })),
      windSpeedDay: String(faker.number.int({ min: 5, max: 25 })),
      windDirDay: faker.helpers.arrayElement(windDirs),
      vis: String(faker.number.int({ min: 5, max: 30 }))
    }
  })

  return { code: '200', daily }
}
