<script lang="ts" setup>
import { getHourlyWeather168Api } from '@/api/weather'
import { useLocationStore } from '@/stores/location'
import { computed, onMounted, ref } from 'vue'
import TemperatureTrend from '@/components/TemperatureTrend.vue'
import type { HourlyWeatherInfo } from '@/api/weather'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const props = defineProps<{ day: number }>()

const locationStore = useLocationStore()
const hourlyWeather = ref<HourlyWeatherInfo[]>([])

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

async function getHourlyWeather168() {
  const res = await getHourlyWeather168Api(locationStore.location.id, props.day)
  hourlyWeather.value = res.hourly
  console.log(hourlyWeather.value)
}
onMounted(() => {
  getHourlyWeather168()
})
</script>

<template>
  <div class="home">
    <header class="card header-card">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h3>📅 {{ formattedDate }}</h3>
    </header>
    <TemperatureTrend :hourly-weather="hourlyWeather" />
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
</style>
