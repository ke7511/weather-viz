import { defineAsyncComponent } from 'vue'

const AirQuality = defineAsyncComponent(
  () => import('@/modules/home/AirQuality.vue')
)
const TemperatureTrend = defineAsyncComponent(
  () => import('@/components/TemperatureTrend.vue')
)
const DailyForecast = defineAsyncComponent(
  () => import('@/modules/home/DailyForecast.vue')
)
const IndicatorsGrid = defineAsyncComponent(
  () => import('@/components/IndicatorsGrid.vue')
)

export { AirQuality, TemperatureTrend, DailyForecast, IndicatorsGrid }
