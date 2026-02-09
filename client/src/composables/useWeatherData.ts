import { onMounted, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import type { CityInfo } from '@/api/city'
import { getAirQualityApi, type AQIInfo, type PollutantInfo } from '@/api/air'
import {
  getWeatherApi,
  getSunriseSunsetApi,
  type weatherInfo,
  type HourlyWeatherInfo,
  getHourlyWeatherApi
} from '@/api/weather'
import { getUVIndexApi, type UVIndexInfo } from '@/api/indices'
import { useLocationStore } from '@/stores/location'
import { storeToRefs } from 'pinia'

export function useWeatherData() {
  const locationStore = useLocationStore()
  const { location } = storeToRefs(locationStore)
  const { setLocation } = locationStore
  const loading = ref(true)

  const weather = ref<weatherInfo | null>(null)
  const uvIndex = ref<UVIndexInfo | null>(null)
  const sunrise = ref<string>('')
  const sunset = ref<string>('')
  const hourlyWeather = ref<HourlyWeatherInfo[]>([])
  const aqi = ref<AQIInfo | null>(null)
  const pollutants = ref<PollutantInfo[]>([])
  const airSources = ref<string[]>([])

  async function fetchAllData() {
    loading.value = true
    try {
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
    } finally {
      loading.value = false
    }
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

  return {
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
  }
}
