import { faker } from '@faker-js/faker/locale/zh_CN'
import dayjs from 'dayjs'

// AQI 等级定义
const aqiLevels = [
  { min: 0, max: 50, category: '优', color: '#00e400' },
  { min: 51, max: 100, category: '良', color: '#ffff00' },
  { min: 101, max: 150, category: '轻度污染', color: '#ff7e00' },
  { min: 151, max: 200, category: '中度污染', color: '#ff0000' },
  { min: 201, max: 300, category: '重度污染', color: '#8f3f97' },
  { min: 301, max: 500, category: '严重污染', color: '#7e0023' }
]

// 污染物定义
const pollutantDefs = [
  {
    code: 'pm2p5',
    name: 'PM2.5',
    fullName: '细颗粒物',
    min: 5,
    max: 150,
    unit: 'μg/m³',
    decimals: 0
  },
  {
    code: 'pm10',
    name: 'PM10',
    fullName: '可吸入颗粒物',
    min: 10,
    max: 250,
    unit: 'μg/m³',
    decimals: 0
  },
  {
    code: 'o3',
    name: 'O3',
    fullName: '臭氧',
    min: 20,
    max: 200,
    unit: 'μg/m³',
    decimals: 0
  },
  {
    code: 'no2',
    name: 'NO2',
    fullName: '二氧化氮',
    min: 10,
    max: 120,
    unit: 'μg/m³',
    decimals: 0
  },
  {
    code: 'so2',
    name: 'SO2',
    fullName: '二氧化硫',
    min: 5,
    max: 80,
    unit: 'μg/m³',
    decimals: 0
  },
  {
    code: 'co',
    name: 'CO',
    fullName: '一氧化碳',
    min: 0.3,
    max: 4,
    unit: 'mg/m³',
    decimals: 1
  }
] as const

// 获取 AQI 等级信息
function getAqiLevel(aqi: number) {
  return aqiLevels.find((l) => aqi >= l.min && aqi <= l.max) || aqiLevels[0]
}

// 将颜色 HEX 转换为 RGBA 对象
function hexToRgba(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { red: r, green: g, blue: b, alpha: 1 }
}

export function getMockAirQuality() {
  const aqi = faker.number.int({ min: 20, max: 170 })
  const level = getAqiLevel(aqi)
  const primaryPollutant = faker.helpers.arrayElement(pollutantDefs)

  return {
    code: '200',
    updateTime: dayjs().format('YYYY-MM-DDTHH:mm+08:00'),
    indexes: [
      {
        aqi,
        aqiDisplay: String(aqi),
        level: String(aqiLevels.indexOf(level) + 1),
        category: level.category,
        code: 'cn-mee',
        name: 'AQI (CN)',
        color: hexToRgba(level.color),
        primaryPollutant: {
          code: primaryPollutant.code,
          name: primaryPollutant.name,
          fullName: primaryPollutant.fullName
        },
        health: {
          effect:
            '空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响',
          advice: {
            generalPopulation: '极少数异常敏感人群应减少户外活动',
            sensitivePopulation: '极少数异常敏感人群应减少户外活动'
          }
        }
      }
    ],
    pollutants: pollutantDefs.map((p) => {
      const concentration = faker.number.float({
        min: p.min,
        max: p.max,
        fractionDigits: p.decimals
      })
      const subIndex = faker.number.int({ min: 20, max: 120 })

      return {
        code: p.code,
        name: p.name,
        fullName: p.fullName,
        concentration: {
          value: concentration,
          unit: p.unit
        },
        subIndex: {
          value: subIndex,
          valueDisplay: String(subIndex)
        }
      }
    })
  }
}
