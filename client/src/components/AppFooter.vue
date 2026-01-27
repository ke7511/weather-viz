<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

const isMock = ref(false)

onMounted(async () => {
  try {
    const res = await request.get<{ isMock: boolean }>('/status')
    isMock.value = res.isMock
  } catch {
    // 获取状态失败时忽略
  }
})
</script>

<template>
  <!-- 数据来源声明 -->
  <footer class="attribution">
    <div v-if="isMock" class="mock-badge">
      ⚠️ 当前显示的是模拟数据，仅供演示
    </div>
    <div v-else class="source">
      天气服务由
      <a
        href="https://www.qweather.com"
        target="_blank"
        rel="noopener noreferrer"
        >和风天气</a
      >
      驱动
    </div>
  </footer>
</template>

<style scoped lang="scss">
/* 数据来源声明 */
.attribution {
  text-align: center;
  padding: var(--spacing-lg) 0;
  color: var(--color-text-secondary);
  font-size: 0.85rem;

  .mock-badge {
    display: inline-block;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: var(--spacing-sm);
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
  }

  .source {
    a {
      color: var(--color-primary, #10b981);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;

      &:hover {
        color: var(--color-primary-dark, #059669);
        text-decoration: underline;
      }
    }
  }
}
</style>
