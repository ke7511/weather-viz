<script setup lang="ts">
import Skeleton from '@/components/Skeleton.vue'
</script>

<template>
  <section class="card skeleton-chart">
    <Skeleton width="120px" height="1rem" class="title" />
    <div class="chart-area">
      <!-- 模拟折线图的波浪效果 -->
      <div class="wave-container">
        <div class="wave"></div>
      </div>
      <!-- 底部时间轴 -->
      <div class="time-axis">
        <Skeleton v-for="i in 8" :key="i" width="40px" height="0.8rem" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.skeleton-chart {
  grid-column: span 2;

  .title {
    margin-bottom: var(--spacing-md);
  }

  .chart-area {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .wave-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.03);
      border-radius: var(--radius-sm);

      .wave {
        position: absolute;
        bottom: 30%;
        left: 0;
        right: 0;
        height: 40%;
        background: linear-gradient(
          90deg,
          rgba(16, 185, 129, 0.1) 0%,
          rgba(16, 185, 129, 0.2) 50%,
          rgba(16, 185, 129, 0.1) 100%
        );
        border-radius: 50% 50% 0 0;
        animation: pulse 2s infinite ease-in-out;
      }
    }

    .time-axis {
      display: flex;
      justify-content: space-between;
      padding-top: var(--spacing-sm);
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scaleY(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
