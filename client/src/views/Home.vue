<script setup lang="ts">
import CitySearch from '@/modules/home/CitySearch.vue'
import LocationBadge from '@/modules/home/LocationBadge.vue'
import Icon from '@/components/Icon.vue'
// 骨架屏组件
import SkeletonWeatherCard from '@/components/skeleton/SkeletonWeatherCard.vue'
import SkeletonIndicators from '@/components/skeleton/SkeletonIndicators.vue'
import SkeletonChart from '@/components/skeleton/SkeletonChart.vue'
import SkeletonForecast from '@/components/skeleton/SkeletonForecast.vue'
import {
  AirQuality,
  TemperatureTrend,
  DailyForecast,
  IndicatorsGrid
} from '@/utils/lazyComponents'
import { useWeatherData } from '@/composables/useWeatherData'

const {
  location,
  loading,
  weather,
  uvIndex,
  sunrise,
  sunset,
  hourlyWeather,
  aqi,
  pollutants,
  airSources,
  handleCitySelect
} = useWeatherData()
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
      <!-- 骨架屏状态 -->
      <template v-if="loading">
        <SkeletonWeatherCard />
        <SkeletonIndicators />
        <SkeletonChart />
        <SkeletonForecast />
      </template>

      <!-- 真实内容 -->
      <template v-else>
        <!-- 左侧大卡片：当前天气 + 空气质量 -->
        <section class="card card-main">
          <div class="weather-section">
            <div class="city">
              <Icon name="location" style="color: #ff6b6b" />
              {{ location?.name }}
            </div>
            <div class="weather-icon">
              <i :class="'qi-' + weather?.icon"></i>
            </div>
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
      </template>
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
