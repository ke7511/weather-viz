<script setup lang="ts">
import CitySearch from '@/components/CitySearch.vue'
import LocationBadge from '@/components/LocationBadge.vue'
import TemperatureTrend from '@/components/TemperatureTrend.vue'
import DailyForecast from '@/components/DailyForecast.vue'
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
    <!-- 动态背景层 -->
    <div class="background-layer">
      <div class="gradient-bg"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 顶部导航 -->
      <header class="header glass">
        <div class="logo">
          <span class="logo-icon">🌤️</span>
          <span class="logo-text">Weather Viz</span>
        </div>
        <CitySearch @select="handleCitySelect" />
        <LocationBadge :location="location" @locate="handleLocate" />
      </header>

      <!-- 主体 Bento Grid -->
      <main class="bento-grid">
        <!-- 左侧大卡片：当前天气 -->
        <section class="card card-main glass-strong">
          <div class="city">
            <span class="city-icon">📍</span>
            {{ location?.name }}
          </div>
          <div class="weather-icon">
            <i :class="'qi-' + weather?.icon"></i>
          </div>
          <div class="temp">
            {{ weather?.temp }}<span class="temp-unit">°C</span>
          </div>
          <div class="desc">
            {{ weather?.text }} · 体感 {{ weather?.feelsLike }}°C
          </div>
        </section>

        <!-- 右侧小卡片：指标 (2x4 网格) -->
        <div class="indicators-grid">
          <div class="card card-indicator glass" :style="{ '--delay': '0.1s' }">
            <span class="indicator-icon">💧</span>
            <span class="indicator-label">相对湿度</span>
            <span class="indicator-value">{{ weather?.humidity }}%</span>
          </div>
          <div
            class="card card-indicator glass"
            :style="{ '--delay': '0.15s' }"
          >
            <span class="indicator-icon">☁️</span>
            <span class="indicator-label">云量</span>
            <span class="indicator-value">{{ weather?.cloud }}%</span>
          </div>
          <div class="card card-indicator glass" :style="{ '--delay': '0.2s' }">
            <span class="indicator-icon">🌬️</span>
            <span class="indicator-label">风速</span>
            <span class="indicator-value">{{ weather?.windSpeed }}km/h</span>
          </div>
          <div
            class="card card-indicator glass"
            :style="{ '--delay': '0.25s' }"
          >
            <span class="indicator-icon">🧭</span>
            <span class="indicator-label">风向</span>
            <span class="indicator-value">{{ weather?.windDir }}</span>
          </div>
          <div class="card card-indicator glass" :style="{ '--delay': '0.3s' }">
            <span class="indicator-icon">👁️</span>
            <span class="indicator-label">能见度</span>
            <span class="indicator-value">{{ weather?.vis }}km</span>
          </div>
          <div
            class="card card-indicator glass"
            :style="{ '--delay': '0.35s' }"
          >
            <span class="indicator-icon">☀️</span>
            <span class="indicator-label">UV指数</span>
            <span class="indicator-value">{{ uvIndex?.category || '-' }}</span>
          </div>
          <div class="card card-indicator glass" :style="{ '--delay': '0.4s' }">
            <span class="indicator-icon">🌅</span>
            <span class="indicator-label">日出</span>
            <span class="indicator-value">{{
              dayjs(sunrise).format('HH:mm') || '-'
            }}</span>
          </div>
          <div
            class="card card-indicator glass"
            :style="{ '--delay': '0.45s' }"
          >
            <span class="indicator-icon">🌇</span>
            <span class="indicator-label">日落</span>
            <span class="indicator-value">{{
              dayjs(sunset).format('HH:mm') || '-'
            }}</span>
          </div>
        </div>

        <!-- 温度趋势图 -->
        <section class="card card-chart glass">
          <h3>
            <span class="section-icon">📈</span>
            温度趋势
          </h3>
          <TemperatureTrend :weather="weather" />
        </section>

        <!-- 7天预报 -->
        <section class="card card-forecast">
          <h3>
            <span class="section-icon">📅</span>
            未来7天
          </h3>
          <div class="forecast-list">
            <DailyForecast />
          </div>
        </section>
      </main>

      <!-- 数据来源声明 -->
      <footer class="attribution">
        天气服务由
        <a
          href="https://www.qweather.com"
          target="_blank"
          rel="noopener noreferrer"
          >和风天气</a
        >
        驱动
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ========== 动态背景层 ========== */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;

  .gradient-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      -45deg,
      #0f0c29,
      #302b63,
      #24243e,
      #1a1a2e,
      #16213e,
      #0f3460
    );
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
  }

  .floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.5;
    }

    .shape-1 {
      width: 500px;
      height: 500px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      top: -100px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }

    .shape-2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      bottom: -50px;
      left: -100px;
      animation: float 10s ease-in-out infinite reverse;
    }

    .shape-3 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: float 12s ease-in-out infinite;
    }

    .shape-4 {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      bottom: 20%;
      right: 10%;
      animation: float 9s ease-in-out infinite reverse;
    }
  }
}

/* ========== 内容层 ========== */
.content-layer {
  position: relative;
  z-index: 1;
  padding: var(--spacing-lg);
  min-height: 100vh;
}

/* ========== 顶部导航 ========== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  animation: fade-in-up 0.6s ease-out;

  .logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    .logo-icon {
      font-size: 1.8rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text);
      background: linear-gradient(135deg, #fff 0%, #a5f3fc 50%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

/* ========== Bento Grid ========== */
.bento-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--spacing-lg);

  /* ========== 主天气卡片 ========== */
  .card-main {
    grid-row: span 2;
    text-align: center;
    padding: var(--spacing-2xl);
    animation: scale-in 0.6s ease-out;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--color-primary-light),
        var(--color-accent-light),
        transparent
      );
    }

    .city {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      font-size: 1.2rem;
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-md);

      .city-icon {
        font-size: 1.2rem;
      }
    }

    .weather-icon {
      font-size: 6rem;
      margin: var(--spacing-lg) 0;
      filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3));
      animation: float 4s ease-in-out infinite;
    }

    .temp {
      font-size: 5rem;
      font-weight: 200;
      color: var(--color-text);
      text-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
      line-height: 1;

      .temp-unit {
        font-size: 2rem;
        font-weight: 300;
        color: var(--color-text-secondary);
        vertical-align: top;
      }
    }

    .desc {
      color: var(--color-text-secondary);
      margin-top: var(--spacing-md);
      font-size: 1.1rem;
    }
  }

  /* ========== 指标卡片网格 ========== */
  .indicators-grid {
    grid-row: span 2;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: var(--spacing-md);

    .card-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-md);
      gap: var(--spacing-xs);
      cursor: default;
      transition: all var(--transition-normal);
      animation: fade-in-up 0.5s ease-out backwards;
      animation-delay: var(--delay, 0s);

      &:hover {
        transform: translateY(-4px) scale(1.02);
        background: var(--glass-bg-hover);
        border-color: var(--glass-border-hover);
        box-shadow: var(--shadow-glass-hover), var(--neon-glow);
      }

      .indicator-icon {
        font-size: 1.5rem;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
      }

      .indicator-label {
        font-size: 0.75rem;
        color: var(--color-text-light);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .indicator-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text);
      }
    }
  }

  /* ========== 图表和预报区域 ========== */
  .card-forecast,
  .card-chart {
    grid-column: span 2;
    animation: fade-in-up 0.6s ease-out 0.3s backwards;

    h3 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: 1.1rem;
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      .section-icon {
        font-size: 1.2rem;
      }
    }
  }

  .card-forecast {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: none;
    box-shadow: none;
    padding: var(--spacing-md) 0;
  }
}

/* ========== 玻璃态样式 ========== */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass), var(--shadow-inset);
  border-radius: var(--radius-lg);
}

.glass-strong {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur-strong));
  -webkit-backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border-hover);
  box-shadow: var(--shadow-glass-hover), var(--shadow-inset-strong);
  border-radius: var(--radius-lg);
}

/* ========== 数据来源声明 ========== */
.attribution {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-light);
  font-size: 0.85rem;

  a {
    color: var(--color-primary-light);
    text-decoration: none;
    font-weight: 500;
    transition: all var(--transition-fast);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--color-primary-light);
      transform: scaleX(0);
      transition: transform var(--transition-fast);
    }

    &:hover {
      color: var(--color-accent-light);
      text-shadow: 0 0 10px var(--neon-accent);

      &::after {
        transform: scaleX(1);
      }
    }
  }
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .content-layer {
    padding: var(--spacing-md);
  }

  .header {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .bento-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);

    .card-main {
      grid-row: span 1;
      padding: var(--spacing-xl);

      .weather-icon {
        font-size: 4rem;
      }

      .temp {
        font-size: 3.5rem;
      }
    }

    .indicators-grid {
      grid-row: span 1;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }

    .card-forecast,
    .card-chart {
      grid-column: span 1;
    }
  }
}
</style>
