<script setup lang="ts">
import VChart from 'vue-echarts'
import '@/plugins/echarts' // 引入配置好的 echarts（注册渲染器和组件）
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
    fxTime: dayjs().format('YYYY-MM-DDTHH:mm+08:00'),
    ...rest
  }
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
    formatter: '{b}<br/>温度: {c}°C',
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
    data: hourlyWeather.value.map((d) => dayjs(d.fxTime).format('HH:mm')),
    axisLine: {
      lineStyle: { color: '#cbd5e1' }
    },
    axisLabel: {
      color: '#64748b'
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
