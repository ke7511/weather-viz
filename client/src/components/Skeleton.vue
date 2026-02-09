<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  radius?: string
}>()
</script>

<template>
  <div
    class="skeleton"
    :style="{
      width: width || '100%',
      height: height || '1rem',
      borderRadius: radius || 'var(--radius-sm)'
    }"
  ></div>
</template>

<style scoped lang="scss">
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  will-change: background-position;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
