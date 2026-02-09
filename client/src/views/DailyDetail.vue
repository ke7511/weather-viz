<script lang="ts" setup>
import {
  getHourlyWeather168Api,
  getDailyForecastApi,
  type HourlyWeatherInfo,
  type DailyForecastInfo
} from '@/api/weather'
import { useLocationStore } from '@/stores/location'
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { getUVIndexApi, type UVIndexInfo } from '@/api/indices'
import SkeletonWeatherCard from '@/components/skeleton/SkeletonWeatherCard.vue'
import SkeletonIndicators from '@/components/skeleton/SkeletonIndicators.vue'
import SkeletonForecast from '@/components/skeleton/SkeletonForecast.vue'
import { TemperatureTrend, IndicatorsGrid } from '@/utils/lazyComponents'
dayjs.locale('zh-cn')

const props = defineProps<{ day: number }>()

const locationStore = useLocationStore()
const hourlyWeather = ref<HourlyWeatherInfo[]>([])
const dailyForecast = ref<DailyForecastInfo | null>(null)
const uvIndex = ref<UVIndexInfo | null>(null)
const loading = ref(true)

async function fetchData() {
  try {
    const [hourlyRes, dailyRes, uvRes] = await Promise.all([
      getHourlyWeather168Api(locationStore.location.id, props.day),
      getDailyForecastApi(locationStore.location.id),
      getUVIndexApi(locationStore.location.id, props.day)
    ])
    hourlyWeather.value = hourlyRes.hourly
    dailyForecast.value = dailyRes.daily[props.day] || null
    uvIndex.value = uvRes.daily[0] || null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// 根据 day 参数计算目标日期
const targetDate = computed(() => dayjs().add(props.day, 'day'))
const formattedDate = computed(() => {
  const date = targetDate.value
  const weekday = date.format('ddd')
  const res = `${date.format('M月D日')} ${weekday}`
  if (props.day === 0) return '今天 ' + res
  if (props.day === 1) return '明天 ' + res
  return res
})
</script>

<template>
  <div>
    <header class="card header-card">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h3>📅 {{ formattedDate }}</h3>
    </header>
    <main class="main-content">
      <!-- 骨架屏 -->
      <template v-if="loading">
        <SkeletonWeatherCard />
        <SkeletonIndicators />
        <!-- <SkeletonChart /> -->
        <SkeletonForecast />
      </template>

      <template v-else>
        <!-- 左侧：天气概览 -->
        <section class="card weather-overview">
          <div class="weather-icon">
            <i :class="'qi-' + dailyForecast?.iconDay"></i>
          </div>
          <div class="weather-info">
            <div class="weather-text">{{ dailyForecast?.textDay }}</div>
            <div class="temp-range">
              <span class="temp-max">{{ dailyForecast?.tempMax }}°</span>
              <span class="divider">/</span>
              <span class="temp-min">{{ dailyForecast?.tempMin }}°</span>
            </div>
            <div class="night-info">🌙 夜间 {{ dailyForecast?.textNight }}</div>
          </div>
        </section>

        <!-- 右侧：指标网格 -->
        <IndicatorsGrid :weather="dailyForecast" :uv-index="uvIndex" />

        <TemperatureTrend :hourly-weather="hourlyWeather" />
      </template>
    </main>
  </div>
</template>

<style scoped lang="scss">
.header-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  position: relative;

  .back-btn {
    position: absolute;
    left: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--radius-sm);
    color: var(--color-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(16, 185, 129, 0.2);
      border-color: var(--color-primary);
    }
  }

  h3 {
    margin: 0;
    flex: 1;
    text-align: center;
  }
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);

  .weather-overview {
    grid-row: span 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-xl);
    min-height: 200px;

    .weather-icon {
      font-size: 5rem;
      line-height: 1;
      margin-bottom: var(--spacing-md);
    }

    .weather-info {
      .weather-text {
        font-size: 1.5rem;
        font-weight: 500;
        color: var(--color-text);
        margin-bottom: var(--spacing-sm);
      }

      .temp-range {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: var(--spacing-sm);

        .temp-max {
          color: #f97316;
        }
        .divider {
          color: #94a3b8;
          margin: 0 4px;
        }
        .temp-min {
          color: #0ea5e9;
        }
      }

      .night-info {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
      }
    }
  }
}
</style>
