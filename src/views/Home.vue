<script setup lang="ts">
// 暂时留空
</script>

<template>
  <div class="home">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo">🌤️ Weather Viz</div>
      <input type="text" class="search" placeholder="🔍 搜索城市..." />
      <div class="location-badge">
        <span class="location-icon">📍</span>
        <span class="location-text">当前位置</span>
        <span class="location-arrow">▼</span>
      </div>
    </header>

    <!-- 主体 Bento Grid -->
    <main class="bento-grid">
      <!-- 左侧大卡片：当前天气 -->
      <section class="card card-main">
        <div class="city">📍 北京</div>
        <div class="weather-icon">☀️</div>
        <div class="temp">28°C</div>
        <div class="desc">晴天 · 体感 30°</div>
      </section>

      <!-- 右侧小卡片：指标 -->
      <div class="indicators-grid">
        <div class="card card-indicator">💧 湿度<br />65%</div>
        <div class="card card-indicator">🌬️ 风速<br />12km/h</div>
        <div class="card card-indicator">🌧️ 降水<br />10%</div>
        <div class="card card-indicator">☀️ 紫外线<br />中等</div>
        <div class="card card-indicator">🌡️ 气压<br />1013hPa</div>
        <div class="card card-indicator">👁️ 能见度<br />25km</div>
      </div>

      <!-- 温度趋势图 -->
      <section class="card card-chart">
        <h3>📈 温度趋势</h3>
      </section>
      <!-- 7天预报 -->
      <section class="card card-forecast">
        <h3>📅 未来7天</h3>
        <div class="forecast-list">
          <!-- 7个天气卡片 -->
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #e0f7fa 0%, #f0fdf4 50%, #fef3c7 100%);

  /* 顶部导航 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    margin-bottom: var(--spacing-lg);

    .logo {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text);
    }
    .search {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      width: 300px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: var(--color-primary);
      }
    }
    .location-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid var(--glass-border);
      border-radius: 999px; /* 椭圆/胶囊形 */
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      .location-icon {
        font-size: 1rem;
      }

      .location-text {
        font-size: 0.9rem;
        color: var(--color-text);
        font-weight: 500;
      }

      .location-arrow {
        font-size: 0.6rem;
        color: var(--color-text-secondary);
      }
    }
  }

  /* Bento Grid */
  .bento-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto;
    gap: var(--spacing-lg);

    .card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow);
    }

    /* 主天气卡片 */
    .card-main {
      grid-row: span 2;
      text-align: center;
      padding: var(--spacing-xl);
      background: linear-gradient(180deg, #e0f7fa 0%, #ffffff 100%);

      .city {
        font-size: 1.2rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
      }

      .weather-icon {
        font-size: 5rem;
        margin: var(--spacing-lg) 0;
      }

      .temp {
        font-size: 4rem;
        font-weight: 300;
        color: var(--color-text);
      }

      .desc {
        color: var(--color-text-secondary);
        margin-top: var(--spacing-sm);
      }
    }

    .indicators-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);

      .card-indicator {
        text-align: center;
        padding: var(--spacing-md);
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        transition: all 0.2s;
        &:hover {
          box-shadow:
            0 0 0 2px rgba(16, 185, 129, 0.2),
            0 4px 16px rgba(0, 0, 0, 0.08);
        }
      }
    }
    /* 预报和图表 */
    .card-forecast,
    .card-chart {
      grid-column: span 2;

      h3 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: 1rem;
        color: var(--color-text);
      }
    }
  }
}
</style>
