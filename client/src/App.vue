<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="home">
    <router-view />
    <AppFooter />
  </div>
</template>

<style scoped>
body {
  background: var(--color-bg);
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
