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
  <button
    class="location-badge"
    :class="{ 'is-locating': isLocating }"
    title="点击获取当前位置"
    @click="handleLocate"
  >
    <span class="badge-glow"></span>
    <span class="location-icon" :class="{ 'animate-pulse': isLocating }">
      {{ isLocating ? '📡' : '📍' }}
    </span>
    <span class="location-text">
      {{ isLocating ? '定位中...' : location?.name }}
    </span>
    <span v-if="isLocating" class="loading-ring"></span>
  </button>
</template>

<style scoped lang="scss">
.location-badge {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-glass);
  overflow: hidden;
  font-family: inherit;

  // 内发光效果
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow:
      var(--shadow-glass-hover),
      0 0 20px rgba(16, 185, 129, 0.3);

    .badge-glow {
      opacity: 1;
    }

    .location-icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &.is-locating {
    border-color: var(--color-accent);

    .badge-glow {
      opacity: 1;
      background: radial-gradient(
        circle at center,
        rgba(6, 182, 212, 0.2) 0%,
        transparent 70%
      );
    }
  }

  .badge-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(
      circle at center,
      rgba(16, 185, 129, 0.15) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity var(--transition-normal);
    pointer-events: none;
  }

  .location-icon {
    font-size: 1.1rem;
    transition: transform var(--transition-fast);
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));

    &.animate-pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  .location-text {
    font-size: 0.9rem;
    color: var(--color-text);
    font-weight: 500;
    white-space: nowrap;
  }

  .loading-ring {
    position: absolute;
    inset: -2px;
    border: 2px solid transparent;
    border-top-color: var(--color-accent);
    border-radius: 999px;
    animation: spin 1s linear infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
