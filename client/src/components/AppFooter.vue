<template>
  <!-- 数据来源声明 -->
  <footer class="attribution">
    天气服务由
    <a href="https://www.qweather.com" target="_blank" rel="noopener noreferrer"
      >和风天气</a
    >
    驱动
  </footer>
</template>

<style scoped lang="scss">
/* 数据来源声明 */
.attribution {
  text-align: center;
  padding: var(--spacing-lg) 0;
  color: var(--color-text-secondary);
  font-size: 0.85rem;

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
</style>
