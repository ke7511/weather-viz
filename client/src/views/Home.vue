<script setup lang="ts">
import CitySearch from '@/modules/home/CitySearch.vue'
import LocationBadge from '@/modules/home/LocationBadge.vue'
import AirQuality from '@/modules/home/AirQuality.vue'
import TemperatureTrend from '@/components/TemperatureTrend.vue'
import DailyForecast from '@/modules/home/DailyForecast.vue'
import IndicatorsGrid from '@/components/IndicatorsGrid.vue'
import Icon from '@/components/Icon.vue'
import type { CityInfo } from '@/api/city'
import { getAirQualityApi, type AQIInfo, type PollutantInfo } from '@/api/air'
import { onMounted, ref } from 'vue'
import {
  getWeatherApi,
  getSunriseSunsetApi,
  type weatherInfo,
  type HourlyWeatherInfo,
  getHourlyWeatherApi
} from '@/api/weather'
import { getUVIndexApi, type UVIndexInfo } from '@/api/indices'
import { useIntervalFn } from '@vueuse/core'
import { useLocationStore } from '@/stores/location'
import { storeToRefs } from 'pinia'

const locationStore = useLocationStore()
const { location } = storeToRefs(locationStore)
const { setLocation } = locationStore
const weather = ref<weatherInfo | null>(null)
const uvIndex = ref<UVIndexInfo | null>(null)
const sunrise = ref<string>('')
const sunset = ref<string>('')
const hourlyWeather = ref<HourlyWeatherInfo[]>([])
const aqi = ref<AQIInfo | null>(null)
const pollutants = ref<PollutantInfo[]>([])
const airSources = ref<string[]>([])

async function fetchAllData() {
  const [weatherRes, uvRes, sunRes, hourlyWeatherRes, airRes] =
    await Promise.all([
      getWeatherApi(location.value.id),
      getUVIndexApi(location.value.id),
      getSunriseSunsetApi(location.value.id),
      getHourlyWeatherApi(location.value.id),
      getAirQualityApi(location.value.lat, location.value.lon)
    ])
  weather.value = weatherRes.now
  uvIndex.value = uvRes.daily?.[0] || null
  sunrise.value = sunRes.sunrise || ''
  sunset.value = sunRes.sunset || ''
  hourlyWeather.value = hourlyWeatherRes.hourly
  aqi.value = airRes.indexes?.[0] || null
  pollutants.value = airRes.pollutants || []
  airSources.value = airRes.sources || []
  formatHourlyWeather()
}

// 将当前天气转换为逐小时天气格式
function toHourlyFormat(): HourlyWeatherInfo {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { obsTime, feelsLike, ...rest } = weather.value!
  return {
    fxTime: '现在',
    ...rest
  }
}

function formatHourlyWeather() {
  hourlyWeather.value.unshift(toHourlyFormat())
}

async function handleCitySelect(city: CityInfo) {
  setLocation(city)
  await fetchAllData()
}

// 每 10 分钟自动刷新天气数据
useIntervalFn(fetchAllData, 10 * 60 * 1000)

onMounted(() => {
  fetchAllData()
})
</script>

<template>
  <div>
    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo">🌤️ Weather Viz</div>
      <CitySearch @select="handleCitySelect" />
      <LocationBadge :location="location" @locate="handleCitySelect" />
    </header>

    <!-- 主体 Bento Grid -->
    <main class="bento-grid">
      <!-- 左侧大卡片：当前天气 + 空气质量 -->
      <section class="card card-main">
        <div class="weather-section">
          <div class="city">
            <Icon name="location" style="color: #ff6b6b" />
            {{ location?.name }}
          </div>
          <div class="weather-icon"><i :class="'qi-' + weather?.icon"></i></div>
          <div class="temp">{{ weather?.temp }}°C</div>
          <div class="desc">
            {{ weather?.text }} · 体感 {{ weather?.feelsLike }}°C
          </div>
        </div>
        <div class="air-section">
          <AirQuality
            :aqi="aqi"
            :pollutants="pollutants"
            :sources="airSources"
          />
        </div>
      </section>

      <!-- 右侧小卡片：指标 (2x4 网格) -->
      <IndicatorsGrid
        :weather="weather"
        :uv-index="uvIndex"
        :sunrise="sunrise"
        :sunset="sunset"
      />

      <!-- 温度趋势图 -->
      <TemperatureTrend :hourly-weather="hourlyWeather" />
      <!-- 7天预报 -->
      <DailyForecast />
    </main>
  </div>
</template>

<style scoped lang="scss">
/* 顶部导航 */
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  margin-bottom: var(--spacing-lg);

  .logo {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
  }
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--spacing-lg);

  /* 主天气卡片 */
  .card-main {
    grid-row: span 2;
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: linear-gradient(180deg, #e0f7fa 0%, #ffffff 100%);

    .weather-section {
      flex: 1.2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      .city {
        font-size: 1.2rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
      }

      .weather-icon {
        font-size: 4.5rem;
        margin: var(--spacing-md) 0;
      }

      .temp {
        font-size: 3.5rem;
        font-weight: 300;
        color: var(--color-text);
      }

      .desc {
        color: var(--color-text-secondary);
        margin-top: var(--spacing-sm);
      }
    }

    .air-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-left: var(--spacing-lg);
      border-left: 1px solid rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
