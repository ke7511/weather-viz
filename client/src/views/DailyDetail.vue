<script lang="ts" setup>
import { getHourlyWeather168Api } from '@/api/weather'
import { useLocationStore } from '@/stores/location'
import { onMounted, ref } from 'vue'
import TemperatureTrend from '@/components/TemperatureTrend.vue'
import type { HourlyWeatherInfo } from '@/api/weather'

const props = defineProps<{ day: number }>()
const locationStore = useLocationStore()
const hourlyWeather = ref<HourlyWeatherInfo[]>([])
async function getHourlyWeather168() {
  const res = await getHourlyWeather168Api(locationStore.location.id, props.day)
  hourlyWeather.value = res.hourly
}
onMounted(() => {
  getHourlyWeather168()
})
</script>

<template>
  <div>Detail {{ props.day }}</div>
  <div><TemperatureTrend :hourly-weather="hourlyWeather" /></div>
</template>

<style scoped lang="scss"></style>
