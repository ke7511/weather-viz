<script setup lang="ts">
import { ref } from 'vue'
import { getCityByLocationApi, type CityInfo } from '@/api/city'
import { storeToRefs } from 'pinia'
import { useLocationStore } from '@/stores/location'

const { location } = storeToRefs(useLocationStore())

const emit = defineEmits<{
  locate: [city: CityInfo]
}>()

const isLocating = ref(false)

async function handleLocate() {
  if (!navigator.geolocation) {
    alert('您的浏览器不支持定位功能')
    return
  }

  isLocating.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { longitude, latitude } = position.coords
        const res = await getCityByLocationApi(longitude, latitude)
        if (res.location?.[0]) {
          emit('locate', res.location[0])
        }
      } catch (error) {
        console.error('定位失败:', error)
        alert('获取位置信息失败')
      } finally {
        isLocating.value = false
      }
    },
    (error) => {
      console.error('定位失败:', error)
      isLocating.value = false
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert('您拒绝了定位请求')
          break
        case error.POSITION_UNAVAILABLE:
          alert('无法获取位置信息')
          break
        case error.TIMEOUT:
          alert('获取位置超时')
          break
        default:
          alert('定位失败，请稍后重试')
      }
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}
</script>

<template>
  <div class="location-badge" title="点击获取当前位置" @click="handleLocate">
    <span class="location-icon">{{ isLocating ? '⏳' : '📍' }}</span>
    <span class="location-text">{{
      isLocating ? '定位中...' : location?.name
    }}</span>
  </div>
</template>

<style scoped lang="scss">
.location-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .location-icon {
    font-size: 1rem;
  }

  .location-text {
    font-size: 0.9rem;
    color: var(--color-text);
    font-weight: 500;
  }
}
</style>
