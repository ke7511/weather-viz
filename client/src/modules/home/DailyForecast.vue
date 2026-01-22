<script setup lang="ts">
import { getDailyForecastApi, type DailyForecastInfo } from '@/api/weather'
import { useLocationStore } from '@/stores/location'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { onMounted, ref } from 'vue'
dayjs.locale('zh-cn')

const locationStore = useLocationStore()

const dailyForecast = ref<DailyForecastInfo[]>([])
async function getDailyForecast() {
  const res = await getDailyForecastApi(locationStore.location.id)
  dailyForecast.value = res.daily
}
onMounted(() => {
  getDailyForecast()
})

function formatDay(dateStr: string, index: number) {
  if (index === 0) return '今天'
  if (index === 1) return '明天'
  return dayjs(dateStr).format('ddd').replace('周', '周')
}

function formatDate(dateStr: string) {
  return dayjs(dateStr).format('M/D')
}
</script>

<template>
  <section class="card card-forecast">
    <h3>📅 未来7天</h3>

    <div class="daily-forecast">
      <div
        v-for="(day, index) in dailyForecast"
        :key="day.fxDate"
        class="day-card"
        @click="
          $router.push({
            name: 'DailyDetail',
            params: { day: index }
          })
        "
      >
        <div class="day-name">{{ formatDay(day.fxDate, index) }}</div>
        <div class="day-date">{{ formatDate(day.fxDate) }}</div>
        <div class="weather-icon">
          <i :class="'qi-' + day.iconDay"></i>
        </div>
        <div class="weather-text">{{ day.textDay }}</div>
        <div class="temp-range">
          <span class="temp-max">{{ day.tempMax }}°</span>
          <span class="temp-divider">/</span>
          <span class="temp-min">{{ day.tempMin }}°</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.card-forecast {
  grid-column: span 2;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: none;
  box-shadow: none;
  padding: var(--spacing-md) 0;

  h3 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1rem;
    color: var(--color-text);
  }

  .daily-forecast {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

    .day-card {
      flex: 1;
      min-width: 90px;
      padding: var(--spacing-lg) var(--spacing-md);

      // 渐变玻璃效果
      background: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.25) 100%
      );
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);

      // 双层边框效果
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);

      border-radius: var(--radius-lg);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-6px) scale(1.02);
        background: linear-gradient(
          145deg,
          rgba(255, 255, 255, 0.7) 0%,
          rgba(255, 255, 255, 0.4) 100%
        );
        box-shadow:
          0 12px 32px rgba(0, 0, 0, 0.12),
          0 4px 8px rgba(16, 185, 129, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border-color: #10b981;
      }

      &:first-child {
        background: linear-gradient(
          145deg,
          rgba(16, 185, 129, 0.15) 0%,
          rgba(255, 255, 255, 0.4) 100%
        );
        border-left: 3px solid #10b981;
      }

      .day-name {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 2px;
      }

      .day-date {
        font-size: 0.75rem;
        color: #64748b;
        margin-bottom: var(--spacing-sm);
      }

      .weather-icon {
        font-size: 2.2rem;
        margin: var(--spacing-sm) 0;
        line-height: 1;
      }

      .weather-text {
        font-size: 0.85rem;
        color: #475569;
        margin-bottom: var(--spacing-sm);
      }
      .temp-range {
        font-size: 1rem;
        font-weight: 600;

        .temp-max {
          color: #f97316; // 橙色高温
        }

        .temp-divider {
          color: #94a3b8;
          margin: 0 1px;
        }

        .temp-min {
          color: #0ea5e9; // 蓝色低温
        }
      }
    }
  }
}
</style>
