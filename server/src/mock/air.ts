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

// 获取 AQI 等级信息
function getAqiLevel(aqi: number) {
  return aqiLevels.find((l) => aqi >= l.min && aqi <= l.max) || aqiLevels[0]
}

// 生成 Mock 空气质量数据
function generateMockAirQuality() {
  const aqi = Math.floor(Math.random() * 150) + 20 // 20-170 之间
  const level = getAqiLevel(aqi)

  const pollutants = ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO']
  const primaryPollutant =
    pollutants[Math.floor(Math.random() * pollutants.length)]

  // 将颜色转换为 RGBA 对象
  const hexToRgba = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { red: r, green: g, blue: b, alpha: 1 }
  }

  return {
    code: '200',
    updateTime: dayjs().format('YYYY-MM-DDTHH:mm+08:00'),
    indexes: [
      {
        aqi: aqi,
        aqiDisplay: String(aqi),
        level: String(aqiLevels.indexOf(level) + 1),
        category: level.category,
        code: 'cn-mee',
        name: 'AQI (CN)',
        color: hexToRgba(level.color),
        primaryPollutant: {
          code: primaryPollutant.toLowerCase().replace('.', ''),
          name: primaryPollutant,
          fullName: getPollutantFullName(primaryPollutant)
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
    pollutants: [
      generatePollutant('pm2p5', 'PM2.5', '细颗粒物', 35, 75),
      generatePollutant('pm10', 'PM10', '可吸入颗粒物', 50, 150),
      generatePollutant('o3', 'O3', '臭氧', 100, 160),
      generatePollutant('no2', 'NO2', '二氧化氮', 40, 80),
      generatePollutant('so2', 'SO2', '二氧化硫', 20, 50),
      generatePollutant('co', 'CO', '一氧化碳', 0.5, 2, 1)
    ],
    sources: ['中国环境监测总站']
  }
}

// 生成单个污染物数据
function generatePollutant(
  code: string,
  name: string,
  fullName: string,
  min: number,
  max: number,
  decimals = 0
) {
  const concentration = Number(
    (Math.random() * (max - min) + min).toFixed(decimals)
  )
  const subIndex = Math.floor(Math.random() * 100) + 20

  return {
    code,
    name,
    fullName,
    concentration: {
      value: concentration,
      unit: code === 'co' ? 'mg/m³' : 'μg/m³'
    },
    subIndex: {
      value: subIndex,
      valueDisplay: String(subIndex)
    }
  }
}

// 获取污染物全称
function getPollutantFullName(name: string): string {
  const map: Record<string, string> = {
    'PM2.5': '细颗粒物',
    PM10: '可吸入颗粒物',
    O3: '臭氧',
    NO2: '二氧化氮',
    SO2: '二氧化硫',
    CO: '一氧化碳'
  }
  return map[name] || name
}

export function getMockAirQuality() {
  return generateMockAirQuality()
}
