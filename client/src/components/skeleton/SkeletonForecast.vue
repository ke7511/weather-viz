<script setup lang="ts">
import Skeleton from '@/components/Skeleton.vue'
</script>

<template>
  <section class="skeleton-forecast">
    <Skeleton width="100px" height="1rem" class="title" />
    <div class="forecast-container">
      <div v-for="i in 7" :key="i" class="day-card">
        <Skeleton width="40px" height="1rem" />
        <Skeleton width="30px" height="0.75rem" />
        <Skeleton width="50px" height="50px" radius="50%" class="icon" />
        <Skeleton width="40px" height="0.85rem" />
        <Skeleton width="60px" height="1rem" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.skeleton-forecast {
  grid-column: span 2;
  padding: var(--spacing-md) 0;

  .title {
    margin-bottom: var(--spacing-md);
  }

  .forecast-container {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: var(--radius-lg);

    .day-card {
      flex: 1;
      min-width: 90px;
      padding: var(--spacing-lg) var(--spacing-md);
      background: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.25) 100%
      );
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);

      .icon {
        margin: var(--spacing-xs) 0;
      }
    }
  }
}
</style>
