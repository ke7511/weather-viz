import { faker } from '@faker-js/faker/locale/zh_CN'
import dayjs from 'dayjs'

// UV 紫外线等级定义
const uvLevels = [
  { level: '1', category: '最弱', text: '紫外线最弱，适宜户外活动。' },
  {
    level: '2',
    category: '较弱',
    text: '紫外线较弱，建议涂擦SPF12-15的防晒护肤品。'
  },
  {
    level: '3',
    category: '中等',
    text: '紫外线中等，建议涂擦SPF15及以上的防晒护肤品。'
  },
  {
    level: '4',
    category: '强',
    text: '紫外线强，建议涂擦SPF20及以上的防晒护肤品。'
  },
  {
    level: '5',
    category: '很强',
    text: '紫外线很强，建议涂擦SPF30及以上的防晒护肤品。'
  }
]

export function getMockUV() {
  const daily = Array.from({ length: 3 }, (_, i) => {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD')
    const uv = faker.helpers.arrayElement(uvLevels)

    return {
      date,
      type: '5',
      name: '紫外线指数',
      ...uv
    }
  })

  return { code: '200', daily }
}
