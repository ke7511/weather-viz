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
    <div v-show="isSearch" class="search-result">
      <!-- 加载中 -->
      <div v-if="isLoading" class="loading-spinner">
        <span class="spinner"></span>
        <span>搜索中...</span>
      </div>
      <!-- 搜索结果 -->
      <ul v-else-if="searchResult.length > 0">
        <li
          v-for="item in searchResult"
          :key="item.id"
          @mousedown.prevent="selectCity(item)"
        >
          {{ item.name }} - {{ item.adm2 }} - {{ item.adm1 }}
        </li>
      </ul>
      <p v-else-if="searchResult.length === 0">暂无匹配城市</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.city-search {
  position: relative;

  .search-input {
    box-sizing: border-box;
    padding: 0 var(--spacing-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    width: 300px;
    height: 35px;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--color-primary);
      border-bottom: none;
      border-radius: var(--radius) var(--radius) 0 0;
    }
  }

  .search-result {
    box-sizing: border-box;
    z-index: 10;
    width: 300px;
    position: absolute;
    background-color: #fff;
    border-radius: 0 0 var(--radius) var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid var(--color-primary);
    border-top: none;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: var(--spacing-sm) var(--spacing-lg);
        cursor: pointer;
        transition: background-color 0.15s;

        &:hover {
          background-color: var(--color-primary);
          color: #fff;
        }
      }
    }

    p {
      padding: var(--spacing-sm) var(--spacing-lg);
      color: var(--color-text-secondary);
      margin: 0;
      font-size: 0.9rem;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: var(--spacing-md);
      color: var(--color-text-secondary);

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
