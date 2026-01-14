/**
 * 城市搜索模拟数据
 * 数据格式参考和风天气城市搜索 API
 */
export const mockCityData = {
  code: '200',
  location: [
    {
      name: '北京',
      id: '101010100',
      lat: '39.90499',
      lon: '116.40529',
      adm2: '北京',
      adm1: '北京市',
      country: '中国',
      tz: 'Asia/Shanghai',
      utcOffset: '+08:00',
      isDst: '0',
      type: 'city',
      rank: '10',
      fxLink: 'https://www.qweather.com/weather/beijing-101010100.html'
    },
    {
      name: '上海',
      id: '101020100',
      lat: '31.23171',
      lon: '121.47264',
      adm2: '上海',
      adm1: '上海市',
      country: '中国',
      tz: 'Asia/Shanghai',
      utcOffset: '+08:00',
      isDst: '0',
      type: 'city',
      rank: '11',
      fxLink: 'https://www.qweather.com/weather/shanghai-101020100.html'
    },
    {
      name: '广州',
      id: '101280101',
      lat: '23.12908',
      lon: '113.26436',
      adm2: '广州',
      adm1: '广东省',
      country: '中国',
      tz: 'Asia/Shanghai',
      utcOffset: '+08:00',
      isDst: '0',
      type: 'city',
      rank: '13',
      fxLink: 'https://www.qweather.com/weather/guangzhou-101280101.html'
    },
    {
      name: '深圳',
      id: '101280601',
      lat: '22.54700',
      lon: '114.08595',
      adm2: '深圳',
      adm1: '广东省',
      country: '中国',
      tz: 'Asia/Shanghai',
      utcOffset: '+08:00',
      isDst: '0',
      type: 'city',
      rank: '15',
      fxLink: 'https://www.qweather.com/weather/shenzhen-101280601.html'
    },
    {
      name: '杭州',
      id: '101210101',
      lat: '30.28745',
      lon: '120.15358',
      adm2: '杭州',
      adm1: '浙江省',
      country: '中国',
      tz: 'Asia/Shanghai',
      utcOffset: '+08:00',
      isDst: '0',
      type: 'city',
      rank: '14',
      fxLink: 'https://www.qweather.com/weather/hangzhou-101210101.html'
    }
  ]
}

/**
 * 根据关键词搜索模拟城市数据
 */
export function searchMockCity(keyword: string) {
  if (!keyword) {
    return { code: '200', location: [] }
  }

  const filtered = mockCityData.location.filter(
    (city) =>
      city.name.includes(keyword) ||
      city.adm1.includes(keyword) ||
      city.adm2.includes(keyword)
  )

  return {
    code: '200',
    location: filtered
  }
}

/**
 * 根据经纬度获取最近的模拟城市
 * 在 mock 模式下默认返回北京
 */
export function getMockCityByLocation() {
  return {
    code: '200',
    location: [mockCityData.location[0]]
  }
}
