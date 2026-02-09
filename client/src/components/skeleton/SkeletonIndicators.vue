<script setup lang="ts">
import Skeleton from '@/components/Skeleton.vue'
</script>

<template>
  <div class="skeleton-indicators">
    <div v-for="i in 8" :key="i" class="card indicator-item">
      <Skeleton width="60px" height="0.85rem" />
      <Skeleton width="40px" height="1rem" class="value" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-indicators {
  grid-row: span 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: var(--spacing-md);

  .indicator-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: var(--spacing-md);

    .value {
      margin-top: 4px;
    }
  }
}
</style>
