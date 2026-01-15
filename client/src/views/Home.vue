<script setup lang="ts">
import CitySearch from '@/components/CitySearch.vue'
import LocationBadge from '@/components/LocationBadge.vue'
import type { CityInfo } from '@/api/city'
import { onMounted, ref } from 'vue'
import {
  getWeatherApi,
  getUVIndexApi,
  getSunriseSunsetApi,
  type weatherInfo,
  type UVIndexInfo
} from '@/api/weather'
import { useIntervalFn } from '@vueuse/core'
import { useLocationStore } from '@/stores/location'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

const locationStore = useLocationStore()
const { location } = storeToRefs(locationStore)
const { setLocation } = locationStore
const weather = ref<weatherInfo | null>(null)
const uvIndex = ref<UVIndexInfo | null>(null)
const sunrise = ref<string>('')
const sunset = ref<string>('')

async function fetchAllData() {
  const [weatherRes, uvRes, sunRes] = await Promise.all([
    getWeatherApi(location.value.id),
    getUVIndexApi(location.value.id),
    getSunriseSunsetApi(location.value.id)
  ])
  weather.value = weatherRes.now
  uvIndex.value = uvRes.daily?.[0] || null
  sunrise.value = sunRes.sunrise || ''
  sunset.value = sunRes.sunset || ''
}

async function handleCitySelect(city: CityInfo) {
  setLocation(city)
  await fetchAllData()
}

async function handleLocate(city: CityInfo) {
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
  <div class="home">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo">🌤️ Weather Viz</div>
      <CitySearch @select="handleCitySelect" />
      <LocationBadge :location="location" @locate="handleLocate" />
    </header>

    <!-- 主体 Bento Grid -->
    <main class="bento-grid">
      <!-- 左侧大卡片：当前天气 -->
      <section class="card card-main">
        <div class="city">📍 {{ location?.name }}</div>
        <div class="weather-icon"><i :class="'qi-' + weather?.icon"></i></div>
        <div class="temp">{{ weather?.temp }}°C</div>

        <div class="desc">
          {{ weather?.text }} · 体感 {{ weather?.feelsLike }}°C
        </div>
      </section>

      <!-- 右侧小卡片：指标 (2x4 网格) -->
      <div class="indicators-grid">
        <div class="card card-indicator">
          💧 相对湿度<br />{{ weather?.humidity }}%
        </div>
        <div class="card card-indicator">
          🌬️ 风速<br />{{ weather?.windSpeed }}km/h
        </div>
        <div class="card card-indicator">
          🧭 风向<br />{{ weather?.windDir }}
        </div>
        <div class="card card-indicator">
          ☁️ 云量<br />{{ weather?.cloud }}%
        </div>
        <div class="card card-indicator">
          👁️ 能见度<br />{{ weather?.vis }}km
        </div>
        <div class="card card-indicator">
          ☀️ UV指数<br />{{ uvIndex?.category || '-' }}
        </div>
        <div class="card card-indicator">
          🌅 日出<br />{{ dayjs(sunrise).format('HH:mm') || '-' }}
        </div>
        <div class="card card-indicator">
          🌇 日落<br />{{ dayjs(sunset).format('HH:mm') || '-' }}
        </div>
      </div>

      <!-- 温度趋势图 -->
      <section class="card card-chart">
        <h3>📈 温度趋势</h3>
      </section>
      <!-- 7天预报 -->
      <section class="card card-forecast">
        <h3>📅 未来7天</h3>
        <div class="forecast-list">
          <!-- 7个天气卡片 -->
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #e0f7fa 0%, #f0fdf4 50%, #fef3c7 100%);

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

    .card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow);
    }

    /* 主天气卡片 */
    .card-main {
      grid-row: span 2;
      text-align: center;
      padding: var(--spacing-xl);
      background: linear-gradient(180deg, #e0f7fa 0%, #ffffff 100%);

      .city {
        font-size: 1.2rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
      }

      .weather-icon {
        font-size: 5rem;
        margin: var(--spacing-lg) 0;
      }

      .temp {
        font-size: 4rem;
        font-weight: 300;
        color: var(--color-text);
      }

      .desc {
        color: var(--color-text-secondary);
        margin-top: var(--spacing-sm);
      }
    }

    .indicators-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);

      .card-indicator {
        text-align: center;
        padding: var(--spacing-md);
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        transition: all 0.2s;
        &:hover {
          box-shadow:
            0 0 0 2px rgba(16, 185, 129, 0.2),
            0 4px 16px rgba(0, 0, 0, 0.08);
        }
      }
    }
    /* 预报和图表 */
    .card-forecast,
    .card-chart {
      grid-column: span 2;

      h3 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: 1rem;
        color: var(--color-text);
      }
    }
  }
}
</style>
