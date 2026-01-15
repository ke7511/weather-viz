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

// UV 紫外线指数 mock 数据
export const mockUVIndexData = {
  code: '200',
  daily: [
    {
      date: new Date().toISOString().split('T')[0],
      type: '5',
      name: '紫外线指数',
      level: '2',
      category: '较弱',
      text: '紫外线强度较弱，建议涂擦SPF在12-15之间的防晒护肤品。'
    }
  ]
}

export function getMockUVIndex() {
  return mockUVIndexData
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
