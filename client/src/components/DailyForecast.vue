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
  return dayjs(dateStr).format('ddd')
}

function formatDate(dateStr: string) {
  return dayjs(dateStr).format('M/D')
}
</script>

<template>
  <div class="daily-forecast">
    <div
      v-for="(day, index) in dailyForecast"
      :key="day.fxDate"
      class="day-card glass"
      :class="{ 'is-today': index === 0 }"
      :style="{ '--delay': `${index * 0.08}s` }"
    >
      <div class="day-header">
        <span class="day-name">{{ formatDay(day.fxDate, index) }}</span>
        <span class="day-date">{{ formatDate(day.fxDate) }}</span>
      </div>

      <div class="weather-icon">
        <i :class="'qi-' + day.iconDay"></i>
      </div>

      <div class="weather-text">{{ day.textDay }}</div>

      <div class="temp-range">
        <div class="temp-bar">
          <div class="temp-fill"></div>
        </div>
        <div class="temp-values">
          <span class="temp-max">{{ day.tempMax }}°</span>
          <span class="temp-min">{{ day.tempMin }}°</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.daily-forecast {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .day-card {
    flex: 0 0 auto;
    min-width: 120px;
    padding: var(--spacing-lg) var(--spacing-md);
    border-radius: var(--radius-lg);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-normal);
    scroll-snap-align: start;
    animation: card-enter 0.5s ease-out backwards;
    animation-delay: var(--delay, 0s);
    position: relative;
    overflow: hidden;

    // 顶部装饰线
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--glass-border-hover),
        transparent
      );
      border-radius: 2px;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover {
      transform: translateY(-8px) scale(1.02);
      background: var(--glass-bg-hover);
      border-color: var(--glass-border-hover);
      box-shadow:
        var(--shadow-glass-hover),
        0 0 30px rgba(16, 185, 129, 0.15);

      &::before {
        opacity: 1;
        background: linear-gradient(
          90deg,
          transparent,
          var(--color-primary-light),
          transparent
        );
      }

      .weather-icon {
        transform: scale(1.15);
        filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
      }

      .extra-info {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &.is-today {
      background: linear-gradient(
        145deg,
        rgba(16, 185, 129, 0.2) 0%,
        var(--glass-bg) 100%
      );
      border-color: var(--color-primary);

      &::after {
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

      .day-name {
        color: var(--color-primary-light);
      }
    }

    .day-header {
      margin-bottom: var(--spacing-sm);

      .day-name {
        display: block;
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: 2px;
      }

      .day-date {
        font-size: 0.75rem;
        color: var(--color-text-light);
      }
    }

    .weather-icon {
      font-size: 2.5rem;
      margin: var(--spacing-md) 0;
      line-height: 1;
      transition: all var(--transition-normal);
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
    }

    .weather-text {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-md);
    }

    .temp-range {
      .temp-bar {
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin-bottom: var(--spacing-sm);
        overflow: hidden;

        .temp-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--color-accent) 0%,
            var(--color-primary) 50%,
            #f97316 100%
          );
          border-radius: 2px;
          width: 100%;
        }
      }

      .temp-values {
        display: flex;
        justify-content: space-between;
        font-size: 1rem;
        font-weight: 600;

        .temp-max {
          color: #fb923c;
          text-shadow: 0 0 10px rgba(251, 146, 60, 0.3);
        }

        .temp-min {
          color: #38bdf8;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
        }
      }
    }
  }
}

/* 玻璃态 */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass), var(--shadow-inset);
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
