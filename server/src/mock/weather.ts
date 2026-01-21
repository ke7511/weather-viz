export const mockWeatherData = {
  code: '200',
  location: [
    {
      now: {
        obsTime: '2020-06-30T21:40+08:00',
        temp: '24',
        feelsLike: '26',
        icon: '101',
        text: '多云',
        wind360: '123',
        windDir: '东南风',
        windScale: '1',
        windSpeed: '3',
        humidity: '72',
        precip: '0.0',
        pressure: '1003',
        vis: '16',
        cloud: '10',
        dew: '21'
      }
    }
  ]
}

export function getMockWeather() {
  return mockWeatherData
}

// 日出日落 mock 数据
export const mockSunriseSunsetData = {
  code: '200',
  sunrise: '05:34',
  sunset: '19:23'
}

export function getMockSunriseSunset() {
  return mockSunriseSunsetData
}

// 逐小时天气 mock 数据
export const mockHourlyWeather = {
  code: '200',
  hourly: [
    {
      fxTime: '2020-06-30T21:40+08:00',
      temp: '24',
      icon: '101',
      text: '多云',
      wind360: '123',
      windDir: '东南风',
      windScale: '1',
      windSpeed: '3',
      humidity: '72',
      precip: '0.0',
      pressure: '1003',
      vis: '16',
      cloud: '10',
      dew: '21'
    }
  ]
}

export function getMockHourlyWeather() {
  return mockHourlyWeather
}

// 168小时（7天）逐时预报 mock 数据
function generateMockHourly168() {
  const hourly = []
  const now = new Date()
  // 设置到当前小时的整点
  now.setMinutes(0, 0, 0)

  const weatherTypes = [
    { icon: '100', text: '晴' },
    { icon: '101', text: '多云' },
    { icon: '104', text: '阴' },
    { icon: '305', text: '小雨' }
  ]

  for (let i = 0; i < 168; i++) {
    const time = new Date(now.getTime() + i * 3600000)
    const hour = time.getHours()

    // 模拟温度变化：白天高，夜间低
    const baseTemp = 22
    const tempVariation = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 6
    const temp = Math.round(
      baseTemp + tempVariation + (Math.random() - 0.5) * 2
    )

    // 每天随机一种天气
    const dayIndex = Math.floor(i / 24)
    const weather = weatherTypes[dayIndex % weatherTypes.length]

    hourly.push({
      fxTime: time.toISOString().replace('Z', '+08:00'),
      temp: String(temp),
      icon: weather.icon,
      text: weather.text,
      wind360: String(Math.floor(Math.random() * 360)),
      windDir: '东南风',
      windScale: String(Math.floor(Math.random() * 3) + 1),
      windSpeed: String(Math.floor(Math.random() * 15) + 5),
      humidity: String(Math.floor(Math.random() * 30) + 50),
      pop: String(
        weather.icon === '305' ? Math.floor(Math.random() * 50) + 30 : 0
      ),
      precip: weather.icon === '305' ? '0.5' : '0.0',
      pressure: String(Math.floor(Math.random() * 20) + 1010),
      cloud: String(Math.floor(Math.random() * 50)),
      dew: String(temp - 5)
    })
  }

  return { code: '200', hourly }
}

export function getMockHourlyWeather168() {
  return generateMockHourly168()
}

// 7天预报 mock 数据
export const mockDailyForecastData = {
  code: '200',
  daily: [
    {
      fxDate: new Date().toISOString().split('T')[0],
      tempMax: '28',
      tempMin: '22',
      iconDay: '100',
      textDay: '晴',
      iconNight: '150',
      textNight: '晴',
      humidity: '65',
      cloud: '15',
      windSpeedDay: '12',
      windDirDay: '东南风',
      vis: '25'
    },
    {
      fxDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      tempMax: '27',
      tempMin: '21',
      iconDay: '101',
      textDay: '多云',
      iconNight: '151',
      textNight: '多云',
      humidity: '70',
      cloud: '40',
      windSpeedDay: '10',
      windDirDay: '南风',
      vis: '20'
    },
    {
      fxDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      tempMax: '25',
      tempMin: '19',
      iconDay: '305',
      textDay: '小雨',
      iconNight: '305',
      textNight: '小雨',
      humidity: '85',
      cloud: '80',
      windSpeedDay: '8',
      windDirDay: '东风',
      vis: '10'
    },
    {
      fxDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      tempMax: '26',
      tempMin: '20',
      iconDay: '104',
      textDay: '阴',
      iconNight: '104',
      textNight: '阴',
      humidity: '75',
      cloud: '90',
      windSpeedDay: '6',
      windDirDay: '北风',
      vis: '15'
    },
    {
      fxDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      tempMax: '29',
      tempMin: '23',
      iconDay: '100',
      textDay: '晴',
      iconNight: '150',
      textNight: '晴',
      humidity: '55',
      cloud: '10',
      windSpeedDay: '15',
      windDirDay: '西南风',
      vis: '30'
    },
    {
      fxDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      tempMax: '30',
      tempMin: '24',
      iconDay: '101',
      textDay: '多云',
      iconNight: '151',
      textNight: '多云',
      humidity: '60',
      cloud: '35',
      windSpeedDay: '11',
      windDirDay: '东南风',
      vis: '22'
    },
    {
      fxDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
      tempMax: '28',
      tempMin: '22',
      iconDay: '302',
      textDay: '雷阵雨',
      iconNight: '302',
      textNight: '雷阵雨',
      humidity: '90',
      cloud: '95',
      windSpeedDay: '20',
      windDirDay: '西北风',
      vis: '8'
    }
  ]
}

export function getMockDailyForecast() {
  return mockDailyForecastData
}
