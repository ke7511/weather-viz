<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
/* 全局样式重置 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
}

/* 链接样式 */
a {
  color: inherit;
  text-decoration: none;
}

/* 滚动条全局样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  transition: background 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 选中文本样式 */
::selection {
  background: rgba(16, 185, 129, 0.3);
  color: #fff;
}

/* 按钮重置 */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
}

/* 输入框重置 */
input,
textarea {
  font-family: inherit;
}

/* 图片响应式 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
