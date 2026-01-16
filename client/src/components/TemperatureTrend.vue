<script setup lang="ts">
import VChart from 'vue-echarts'
import '@/plugins/echarts'
import { computed, onMounted, ref, watch } from 'vue'
import { getHourlyWeatherApi, type HourlyWeatherInfo } from '@/api/weather'
import { useLocationStore } from '@/stores/location'
import dayjs from 'dayjs'
import type { weatherInfo } from '@/api/weather'

const props = defineProps<{ weather: weatherInfo | null }>()

const locationStore = useLocationStore()
const hourlyWeather = ref<HourlyWeatherInfo[]>([])

// 将当前天气转换为逐小时天气格式
function toHourlyFormat(weather: weatherInfo): HourlyWeatherInfo {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { obsTime, feelsLike, ...rest } = weather
  return {
    fxTime: '现在',
    ...rest
  }
}

function formatTime(weather: HourlyWeatherInfo[]) {
  return weather.map((d) =>
    d.fxTime === '现在' ? '现在' : dayjs(d.fxTime).format('HH:mm')
  )
}

// 标记是否已添加当前天气
const hasCurrentWeather = ref(false)

async function getHourlyWeather() {
  const res = await getHourlyWeatherApi(locationStore.location.id)
  hourlyWeather.value = res.hourly

  // 在逐小时数据加载完成后，添加当前天气到开头
  if (props.weather) {
    hourlyWeather.value.unshift(toHourlyFormat(props.weather))
    hasCurrentWeather.value = true
  }
}

// 当 props.weather 变化时添加/更新当前天气
watch(
  () => props.weather,
  (newVal) => {
    if (newVal && hourlyWeather.value.length > 0) {
      const currentWeatherData = toHourlyFormat(newVal)

      if (hasCurrentWeather.value) {
        hourlyWeather.value[0] = currentWeatherData
      } else {
        hourlyWeather.value.unshift(currentWeatherData)
        hasCurrentWeather.value = true
      }
    }
  }
)

onMounted(() => {
  getHourlyWeather()
})

const option = computed(() => ({
  grid: {
    left: '3%',
    right: '3%',
    top: '10%',
    bottom: '10%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: Array<{ dataIndex: number }>) => {
      if (!params[0]) return ''
      const item = params[0].dataIndex
      const data = hourlyWeather.value[item]
      if (!data) return ''
      return `${formatTime(hourlyWeather.value)[item]}<br/>温度: ${data.temp}°C<br/>天气: ${data.text}`
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#10b981',
    borderWidth: 1,
    textStyle: {
      color: '#334155'
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#10b981',
        width: 2,
        type: 'dashed'
      }
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: formatTime(hourlyWeather.value),
    axisLine: {
      lineStyle: { color: '#cbd5e1' }
    },
    axisLabel: {
      formatter: (value: string, index: number) => {
        const icon = hourlyWeather.value[index]?.icon
        return `{time|${value}}\n{icon${icon}|}`
      },
      rich: {
        time: { color: '#64748b', fontSize: 12 },
        // 动态生成每个图标的样式
        ...hourlyWeather.value.reduce(
          (acc, item) => {
            if (item.icon && !acc[`icon${item.icon}`]) {
              acc[`icon${item.icon}`] = {
                backgroundColor: {
                  image: `https://icons.qweather.com/assets/icons/${item.icon}.svg`
                },
                height: 20,
                width: 20
              }
            }
            return acc
          },
          {} as Record<string, object>
        )
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}°C',
      color: '#64748b'
    },
    splitLine: {
      lineStyle: { color: '#e2e8f0', type: 'dashed' }
    }
  },
  // 动画配置
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut' as const,
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: true,
      lineStyle: {
        color: '#10b981',
        width: 3
      },
      itemStyle: {
        color: '#10b981',
        borderColor: '#fff',
        borderWidth: 2
      },
      // 悬停高亮效果
      emphasis: {
        scale: true, // 放大效果
        focus: 'series',
        itemStyle: {
          color: '#059669',
          borderColor: '#10b981',
          borderWidth: 3,
          shadowColor: 'rgba(16, 185, 129, 0.5)',
          shadowBlur: 10
        },
        lineStyle: {
          width: 4
        }
      },
      areaStyle: {
        color: {
          type: 'linear',
          y: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ]
        }
      },
      data: hourlyWeather.value.map((d) => d.temp)
    }
  ],
  dataZoom: [
    { type: 'inside', xAxisIndex: 0 },
    {
      type: 'slider',
      xAxisIndex: 0,
      height: 24,
      bottom: 0,
      borderColor: 'transparent',
      backgroundColor: 'rgba(226, 232, 240, 0.5)',
      fillerColor: 'rgba(16, 185, 129, 0.15)',
      handleIcon:
        'M-9.35,34.56V42m0-40V9.5m-2,0h4a2,2,0,0,1,2,2v21a2,2,0,0,1-2,2h-4a2,2,0,0,1-2-2v-21A2,2,0,0,1-11.35,9.5Z',
      handleSize: '120%',
      handleStyle: {
        color: '#fff',
        borderColor: '#10b981',
        borderWidth: 1,
        shadowBlur: 4,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffsetY: 2
      },
      dataBackground: {
        lineStyle: { color: '#10b981', opacity: 0.3 },
        areaStyle: { color: '#10b981', opacity: 0.1 }
      },
      selectedDataBackground: {
        lineStyle: { color: '#10b981' },
        areaStyle: { color: '#10b981', opacity: 0.2 }
      },
      moveHandleSize: 0,
      emphasis: {
        handleStyle: {
          borderColor: '#059669',
          shadowBlur: 6
        }
      }
    }
  ]
}))
</script>

<template>
  <v-chart :option="option" autoresize class="container" />
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 300px;
}
</style>
