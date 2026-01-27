<script setup lang="ts">
import VChart from 'vue-echarts'
import '@/plugins/echarts'
import { computed } from 'vue'
import type { AQIInfo, PollutantInfo } from '@/api/air'

const props = defineProps<{
  aqi: AQIInfo | null
  pollutants: PollutantInfo[]
}>()

// AQI 等级颜色
function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#10b981'
  if (aqi <= 100) return '#84cc16'
  if (aqi <= 150) return '#eab308'
  if (aqi <= 200) return '#f97316'
  if (aqi <= 300) return '#ef4444'
  return '#7c3aed'
}

const color = computed(() =>
  props.aqi ? getAqiColor(props.aqi.aqi) : '#10b981'
)
const value = computed(() => props.aqi?.aqi ?? 0)

// ECharts pie 图模拟环形进度
const chartOption = computed(() => ({
  series: [
    {
      type: 'pie',
      radius: ['65%', '80%'],
      center: ['50%', '50%'],
      startAngle: 90,
      silent: true,
      label: { show: false },
      data: [
        {
          value: value.value,
          itemStyle: {
            color: color.value,
            borderRadius: 10
          }
        },
        {
          value: Math.max(500 - value.value, 0),
          itemStyle: {
            color: '#f1f5f9'
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }
  ]
}))

// 首要污染物
const primaryPollutant = computed(
  () => props.aqi?.primaryPollutant?.name || '-'
)

// 污染物名称映射
const pollutantNameMap: Record<string, string> = {
  pm2p5: 'PM2.5',
  pm10: 'PM10',
  o3: 'O₃',
  no2: 'NO₂',
  so2: 'SO₂',
  co: 'CO'
}
</script>

<template>
  <div class="air-quality">
    <!-- 上部：图表区 -->
    <div class="chart-section">
      <div class="chart-wrapper">
        <v-chart :option="chartOption" autoresize class="chart" />
        <div class="center-label">
          <span class="value" :style="{ color }">{{
            aqi?.aqiDisplay ?? '-'
          }}</span>
          <span class="category">{{ aqi?.category ?? '暂无' }}</span>
        </div>
      </div>
      <div class="side-info">
        <div class="info-row">
          <span class="label">首要污染物</span>
          <span class="data">{{ primaryPollutant }}</span>
        </div>
        <div v-if="aqi?.health?.advice" class="info-row advice">
          <span class="label">健康建议</span>
          <span class="data">{{ aqi.health.advice.generalPopulation }}</span>
        </div>
      </div>
    </div>

    <!-- 下部：污染物网格 -->
    <div class="pollutants">
      <div v-for="p in pollutants.slice(0, 6)" :key="p.code" class="item">
        <span class="name">{{ pollutantNameMap[p.code] || p.name }}</span>
        <span class="val">{{ p.concentration.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.air-quality {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-sm);
}

.chart-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.chart-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;

  .chart {
    width: 100%;
    height: 100%;
  }

  .center-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;

    .value {
      display: block;
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.1;
    }

    .category {
      display: block;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-top: 2px;
    }
  }
}

.side-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  .info-row {
    .label {
      display: block;
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .data {
      display: block;
      font-size: 0.85rem;
      color: var(--color-text);
      font-weight: 500;
    }
  }
}

.pollutants {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xs);

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: var(--radius-sm);

    .name {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .val {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--color-text);
    }
  }
}
</style>
