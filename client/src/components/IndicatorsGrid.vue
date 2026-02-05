<script setup lang="ts">
import type { weatherInfo, DailyForecastInfo } from '@/api/weather'
import type { UVIndexInfo } from '@/api/indices'
import dayjs from 'dayjs'
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'

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
      <span class="indicator-label">
        <Icon name="humidity" class="indicator-icon" />相对湿度
      </span>
      <span class="indicator-value">{{ weather?.humidity || '-' }}%</span>
    </div>
    <div class="card card-indicator">
      <span class="indicator-label">
        <Icon name="cloud" class="indicator-icon" />云量
      </span>
      <span class="indicator-value">{{ weather?.cloud || '-' }}%</span>
    </div>
    <div class="card card-indicator">
      <span class="indicator-label">
        <Icon name="wind" class="indicator-icon" />风速
      </span>
      <span class="indicator-value">{{ windSpeed }}km/h</span>
    </div>
    <div class="card card-indicator">
      <span class="indicator-label">
        <Icon name="compass" class="indicator-icon" />风向
      </span>
      <span class="indicator-value">{{ windDir }}</span>
    </div>
    <div class="card card-indicator">
      <span class="indicator-label">
        <Icon name="visibility" class="indicator-icon" />能见度
      </span>
      <span class="indicator-value">{{ weather?.vis || '-' }}km</span>
    </div>
    <div class="card card-indicator">
      <span class="indicator-label">
        <Icon name="sun" class="indicator-icon" />UV指数
      </span>
      <span class="indicator-value">{{ uvIndex?.category || '-' }}</span>
    </div>
    <div class="card card-indicator">
      <span class="indicator-label">
        <Icon name="sunrise" class="indicator-icon" />日出
      </span>
      <span class="indicator-value">{{ computedSunrise }}</span>
    </div>
    <div class="card card-indicator">
      <span class="indicator-label">
        <Icon name="sunset" class="indicator-icon" />日落
      </span>
      <span class="indicator-value">{{ computedSunset }}</span>
    </div>
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
    color: var(--color-text-secondary);
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .indicator-label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
    }

    .indicator-icon {
      font-size: 1rem;
      color: #10b981;
    }

    .indicator-value {
      color: var(--color-text);
    }

    &:hover {
      box-shadow:
        0 0 0 2px rgba(16, 185, 129, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
