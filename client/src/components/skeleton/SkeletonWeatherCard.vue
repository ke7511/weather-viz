<script setup lang="ts">
import Skeleton from '@/components/Skeleton.vue'
</script>

<template>
  <section class="skeleton-weather-card card card-main">
    <div class="weather-section">
      <!-- 城市名 -->
      <Skeleton width="80px" height="1.2rem" />
      <!-- 天气图标 -->
      <Skeleton width="80px" height="80px" radius="50%" class="icon" />
      <!-- 温度 -->
      <Skeleton width="120px" height="3rem" />
      <!-- 描述 -->
      <Skeleton width="160px" height="1rem" />
    </div>
    <div class="air-section">
      <!-- 空气质量环形图骨架 -->
      <div class="chart-skeleton">
        <Skeleton width="100px" height="100px" radius="50%" />
      </div>
      <!-- 信息行 -->
      <div class="info-skeleton">
        <Skeleton width="60px" height="0.8rem" />
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="60px" height="0.8rem" class="mt" />
        <Skeleton width="100%" height="2rem" />
      </div>
      <!-- 污染物网格 -->
      <div class="pollutants-skeleton">
        <Skeleton v-for="i in 6" :key="i" width="100%" height="2.5rem" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.skeleton-weather-card {
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
    gap: var(--spacing-md);

    .icon {
      margin: var(--spacing-md) 0;
    }
  }

  .air-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding-left: var(--spacing-lg);
    border-left: 1px solid rgba(0, 0, 0, 0.08);

    .chart-skeleton {
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing-sm);
    }

    .info-skeleton {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .mt {
        margin-top: var(--spacing-sm);
      }
    }

    .pollutants-skeleton {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-xs);
      margin-top: auto;
    }
  }
}
</style>
