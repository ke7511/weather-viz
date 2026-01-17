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
  backgroundColor: 'transparent',
  grid: {
    left: '3%',
    right: '3%',
    top: '12%',
    bottom: '12%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: Array<{ dataIndex: number }>) => {
      if (!params[0]) return ''
      const item = params[0].dataIndex
      const data = hourlyWeather.value[item]
      if (!data) return ''
      return `
        <div style="padding: 8px 12px;">
          <div style="font-weight: 600; margin-bottom: 8px; color: #fff;">
            ${formatTime(hourlyWeather.value)[item]}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 24px;">🌡️</span>
            <span style="font-size: 18px; font-weight: 600; color: #10b981;">${data.temp}°C</span>
          </div>
          <div style="color: rgba(255,255,255,0.8);">${data.text}</div>
        </div>
      `
    },
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 0,
    textStyle: {
      color: '#fff'
    },
    extraCssText:
      'backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'rgba(16, 185, 129, 0.6)',
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
      lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 11,
      formatter: (value: string, index: number) => {
        const icon = hourlyWeather.value[index]?.icon
        return `{time|${value}}\n{icon${icon}|}`
      },
      rich: {
        time: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 11,
          lineHeight: 20
        },
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
      formatter: '{value}°',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 11
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.05)',
        type: 'dashed'
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  // 动画配置
  animation: true,
  animationDuration: 1200,
  animationEasing: 'cubicOut' as const,
  series: [
    {
      type: 'line',
      smooth: 0.4,
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: true,
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#06b6d4' },
            { offset: 0.5, color: '#10b981' },
            { offset: 1, color: '#34d399' }
          ]
        },
        width: 3,
        shadowColor: 'rgba(16, 185, 129, 0.4)',
        shadowBlur: 10,
        shadowOffsetY: 5
      },
      itemStyle: {
        color: '#10b981',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        shadowColor: 'rgba(16, 185, 129, 0.5)',
        shadowBlur: 8
      },
      // 悬停高亮效果
      emphasis: {
        scale: 1.5,
        focus: 'series',
        itemStyle: {
          color: '#fff',
          borderColor: '#10b981',
          borderWidth: 3,
          shadowColor: 'rgba(16, 185, 129, 0.8)',
          shadowBlur: 15
        },
        lineStyle: {
          width: 4
        }
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
            { offset: 0.5, color: 'rgba(16, 185, 129, 0.15)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0)' }
          ]
        }
      },
      data: hourlyWeather.value.map((d) => d.temp)
    }
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      moveOnMouseWheel: false
    },
    {
      type: 'slider',
      xAxisIndex: 0,
      height: 20,
      bottom: 0,
      borderColor: 'transparent',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      fillerColor: 'rgba(16, 185, 129, 0.2)',
      borderRadius: 10,
      handleIcon:
        'M-9.35,34.56V42m0-40V9.5m-2,0h4a2,2,0,0,1,2,2v21a2,2,0,0,1-2,2h-4a2,2,0,0,1-2-2v-21A2,2,0,0,1-11.35,9.5Z',
      handleSize: '120%',
      handleStyle: {
        color: '#1a1a2e',
        borderColor: '#10b981',
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(16, 185, 129, 0.4)',
        shadowOffsetY: 2
      },
      dataBackground: {
        lineStyle: { color: 'rgba(16, 185, 129, 0.3)' },
        areaStyle: { color: 'rgba(16, 185, 129, 0.1)' }
      },
      selectedDataBackground: {
        lineStyle: { color: '#10b981' },
        areaStyle: { color: 'rgba(16, 185, 129, 0.25)' }
      },
      moveHandleSize: 0,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 10
      },
      emphasis: {
        handleStyle: {
          borderColor: '#34d399',
          shadowBlur: 12,
          shadowColor: 'rgba(16, 185, 129, 0.6)'
        }
      }
    }
  ]
}))
</script>

<template>
  <div class="chart-wrapper">
    <v-chart :option="option" autoresize class="chart-container" />
  </div>
</template>

<style scoped lang="scss">
.chart-wrapper {
  position: relative;
  padding: var(--spacing-sm);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    background: radial-gradient(
      ellipse at 50% 0%,
      rgba(16, 185, 129, 0.1) 0%,
      transparent 60%
    );
    pointer-events: none;
  }
}

.chart-container {
  width: 100%;
  height: 320px;
}
</style>
