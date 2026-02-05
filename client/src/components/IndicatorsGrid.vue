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

const indicators = computed(() => [
  {
    icon: 'humidity',
    label: '相对湿度',
    value: props.weather?.humidity || '-'
  },
  {
    icon: 'cloud',
    label: '云量',
    value: props.weather?.cloud || '-'
  },
  {
    icon: 'wind',
    label: '风速',
    value: windSpeed.value
  },
  {
    icon: 'compass',
    label: '风向',
    value: windDir.value
  },
  {
    icon: 'visibility',
    label: '能见度',
    value: props.weather?.vis || '-'
  },
  {
    icon: 'sun',
    label: 'UV指数',
    value: props.uvIndex?.category || '-'
  },
  {
    icon: 'sunrise',
    label: '日出',
    value: computedSunrise.value
  },
  {
    icon: 'sunset',
    label: '日落',
    value: computedSunset.value
  }
])
</script>

<template>
  <div class="indicators-grid">
    <div
      v-for="indicator in indicators"
      :key="indicator.label"
      class="card card-indicator"
    >
      <span class="indicator-label">
        <Icon :name="indicator.icon" class="indicator-icon" />
        {{ indicator.label }}
      </span>
      <span class="indicator-value">{{ indicator.value }}</span>
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
