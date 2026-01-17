<script setup lang="ts">
import { searchCityApi } from '@/api/city'
import { ref } from 'vue'
import type { CityInfo } from '@/api/city'
import { useDebounceFn } from '@vueuse/core'

const emit = defineEmits<{
  select: [city: CityInfo]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isSearch = ref(false)
const isLoading = ref(false)
const keyword = ref('')
const searchResult = ref<CityInfo[]>([])

const searchCity = useDebounceFn(async () => {
  if (!keyword.value.trim()) {
    searchResult.value = []
    return
  }
  isLoading.value = true
  try {
    const res = await searchCityApi(keyword.value)
    searchResult.value = res.location
  } finally {
    isLoading.value = false
  }
}, 400)

function selectCity(city: CityInfo) {
  keyword.value = ''
  searchResult.value = []
  isSearch.value = false
  inputRef.value?.blur()
  emit('select', city)
}
</script>

<template>
  <div class="city-search">
    <div class="search-wrapper" :class="{ 'is-focused': isSearch }">
      <span class="search-icon">🔍</span>
      <input
        ref="inputRef"
        v-model="keyword"
        type="search"
        class="search-input"
        placeholder="搜索城市..."
        @input="searchCity"
        @focus="isSearch = true"
        @blur="isSearch = false"
      />
      <div class="search-glow"></div>
    </div>

    <Transition name="dropdown">
      <div v-show="isSearch" class="search-result glass">
        <!-- 加载中 -->
        <div v-if="isLoading" class="loading-spinner">
          <span class="spinner"></span>
          <span>搜索中...</span>
        </div>
        <!-- 搜索结果 -->
        <ul v-else-if="searchResult.length > 0">
          <li
            v-for="(item, index) in searchResult"
            :key="item.id"
            :style="{ '--delay': `${index * 0.05}s` }"
            @mousedown.prevent="selectCity(item)"
          >
            <span class="city-icon">🏙️</span>
            <span class="city-info">
              <span class="city-name">{{ item.name }}</span>
              <span class="city-region">{{ item.adm2 }} · {{ item.adm1 }}</span>
            </span>
          </li>
        </ul>
        <p v-else-if="keyword && searchResult.length === 0">
          <span class="empty-icon">🔎</span>
          暂无匹配城市
        </p>
        <p v-else class="hint">
          <span class="hint-icon">✨</span>
          输入城市名称开始搜索
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.city-search {
  position: relative;
  z-index: 100;

  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-md);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: 999px;
    transition: all var(--transition-normal);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 999px;
      padding: 1px;
      background: linear-gradient(
        135deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    &.is-focused {
      border-color: var(--color-primary);
      background: var(--glass-bg-hover);
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);

      .search-glow {
        opacity: 1;
      }
    }

    .search-icon {
      font-size: 0.9rem;
      opacity: 0.7;
      transition: opacity var(--transition-fast);
    }

    .search-input {
      box-sizing: border-box;
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      background: transparent;
      width: 260px;
      height: 40px;
      font-size: 0.9rem;
      color: var(--color-text);
      outline: none;

      &::placeholder {
        color: var(--color-text-light);
      }

      &::-webkit-search-cancel-button {
        -webkit-appearance: none;
      }
    }

    .search-glow {
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
  }

  .search-result {
    position: absolute;
    top: calc(100% + var(--spacing-sm));
    left: 0;
    right: 0;
    max-height: 350px;
    overflow-y: auto;
    border-radius: var(--radius);
    padding: var(--spacing-sm);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--glass-border);
      border-radius: 3px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        animation: fade-in-up 0.3s ease-out backwards;
        animation-delay: var(--delay, 0s);

        &:hover {
          background: var(--glass-bg-hover);
          transform: translateX(4px);

          .city-name {
            color: var(--color-primary-light);
          }
        }

        .city-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
        }

        .city-info {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .city-name {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--color-text);
            transition: color var(--transition-fast);
          }

          .city-region {
            font-size: 0.75rem;
            color: var(--color-text-light);
          }
        }
      }
    }

    p {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      color: var(--color-text-secondary);
      margin: 0;
      font-size: 0.9rem;

      .empty-icon,
      .hint-icon {
        font-size: 1.1rem;
      }
    }

    .hint {
      color: var(--color-text-light);
      font-size: 0.85rem;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      color: var(--color-text-secondary);

      .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid var(--glass-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }
  }
}

/* 玻璃态 */
.glass {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur-strong));
  -webkit-backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-normal);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
