<script setup lang="ts">
import type { weatherInfo, DailyForecastInfo } from '@/api/weather'
import type { UVIndexInfo } from '@/api/indices'
import dayjs from 'dayjs'
import { computed } from 'vue'

const props = defineProps<{
  weather: weatherInfo | DailyForecastInfo | null
  uvIndex: UVIndexInfo | null
  sunrise?: string
  sunset?: string
}>()

// 兼容的计算属性
const windSpeed = computed(() => {
  if (!props.weather) return '-'
  return (
    ('windSpeed' in props.weather
      ? props.weather.windSpeed
      : props.weather.windSpeedDay) || '-'
  )
})

const windDir = computed(() => {
  if (!props.weather) return '-'
  return (
    ('windDir' in props.weather
      ? props.weather.windDir
      : props.weather.windDirDay) || '-'
  )
})

const computedSunrise = computed(() => {
  // 如果 weather 对象包含 sunrise 字段（如 DailyForecastInfo），直接使用
  if (props.weather && 'sunrise' in props.weather) {
    return props.weather.sunrise || '-'
  }
  // 否则使用传入的 sunrise prop，如果已经是 HH:mm 格式就直接显示
  if (props.sunrise) {
    // 如果是 HH:mm 格式，直接返回
    if (/^\d{2}:\d{2}$/.test(props.sunrise)) {
      return props.sunrise
    }
    // 否则尝试用 dayjs 解析
    const parsed = dayjs(props.sunrise)
    return parsed.isValid() ? parsed.format('HH:mm') : props.sunrise
  }
  return '-'
})

const computedSunset = computed(() => {
  if (props.weather && 'sunset' in props.weather) {
    return props.weather.sunset || '-'
  }
  if (props.sunset) {
    if (/^\d{2}:\d{2}$/.test(props.sunset)) {
      return props.sunset
    }
    const parsed = dayjs(props.sunset)
    return parsed.isValid() ? parsed.format('HH:mm') : props.sunset
  }
  return '-'
})
</script>

<template>
  <div class="indicators-grid">
    <div class="card card-indicator">
      💧 相对湿度<br />{{ weather?.humidity || '-' }}%
    </div>
    <div class="card card-indicator">
      ☁️ 云量<br />{{ weather?.cloud || '-' }}%
    </div>
    <div class="card card-indicator">🌬️ 风速<br />{{ windSpeed }}km/h</div>
    <div class="card card-indicator">🧭 风向<br />{{ windDir }}</div>
    <div class="card card-indicator">
      👁️ 能见度<br />{{ weather?.vis || '-' }}km
    </div>
    <div class="card card-indicator">
      ☀️ UV指数<br />{{ uvIndex?.category || '-' }}
    </div>
    <div class="card card-indicator">🌅 日出<br />{{ computedSunrise }}</div>
    <div class="card card-indicator">🌇 日落<br />{{ computedSunset }}</div>
  </div>
</template>

<style scoped lang="scss">
.indicators-grid {
  grid-row: span 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: var(--spacing-md);

  .card-indicator {
    text-align: center;
    padding: var(--spacing-md);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &:hover {
      box-shadow:
        0 0 0 2px rgba(16, 185, 129, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
