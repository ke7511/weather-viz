<script setup lang="ts">
withDefaults(defineProps<{ name: string; prefix?: string }>(), {
  prefix: 'icon-'
})
</script>

<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${prefix}${name}`"></use>
  </svg>
</template>

<style scoped lang="scss">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
