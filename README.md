# Weather Viz 🌤️

一个现代化的天气可视化平台，基于 [和风天气 API](https://dev.qweather.com/) 提供天气数据，
前端使用 Vue 3 + TypeScript，后端使用 Express 构建 API 服务，支持本地 Mock 与真实 API 两种模式。

## ✨ 功能特性

- 🔍 城市搜索：支持中国城市模糊搜索
- 🌡️ 实时天气：显示当前温度、体感温度、湿度、风速等信息
- 📈 温度趋势：使用 ECharts 展示 24 小时温度变化
- 📅 7 天预报：查看未来一周天气预报
- ☀️ 日出日落与紫外线指数
- 🎨 Glassmorphism UI：现代玻璃态设计风格

## 🛠️ 技术栈

### 前端（client）

- Vue 3
- TypeScript
- Vite
- Pinia + pinia-plugin-persistedstate
- Vue Router
- ECharts + vue-echarts
- Axios
- @vueuse/core
- Day.js
- normalize.css

### 后端（server）

- Express
- TypeScript
- Axios
- Day.js
- dotenv
- jose
- CORS


## 🚀 快速开始

### 环境要求

- Node.js ^20.19.0 或 >= 22.12.0
- pnpm（推荐）

### 安装依赖

在项目根目录执行：

```bash
pnpm install
```

### 开发模式

同时启动前端和后端开发服务器（推荐）：

```bash
pnpm dev
```

单独启动：

```bash
# 仅启动前端
pnpm dev:client

# 仅启动后端
pnpm dev:server
```
### 生产构建

在根目录执行：

```bash
pnpm build
```

会分别构建前端和后端：

- 前端输出到 `client/dist`
- 后端编译到 `server/dist`

## ⚙️ 环境配置

### 1. 和风天气 JWT 配置

后端使用 JWT 鉴权方式访问和风天气 API。配置文件示例见：

- [server/.env.example](file:///d:/OneDrive/Destop/weather-viz/server/.env.example)

首先复制示例文件：

```bash
cp server/.env.example server/.env
```

在 `server/.env` 中配置以下变量（从[和风天气控制台](https://console.qweather.com/home)获取）：

```env
QWEATHER_PROJECT_ID=your_project_id     # 项目 ID
QWEATHER_KID=your_kid                   # 凭据 ID
QWEATHER_PRIVATE_KEY=your_private_key   # 私钥内容，单行，换行用 \n 表示
QWEATHER_API_HOST=your_api_host         # API Host

PORT=3000                               # 后端服务端口，可自行修改
USE_MOCK=false                          # 是否强制使用 Mock 数据
```

说明：
- 注意和风天气 API 的免费额度消耗。
- 当 **未完整配置** 上述和风天气相关变量时，后端会自动降级为 **Mock 模式**。
- 将 `USE_MOCK` 设置为 `true`，可以在本地开发时强制使用内置 Mock 数据，无需真实凭证。

### 2. 前端配置

前端通过环境变量 `VITE_API_BASE_URL` 访问后端 API，在未配置时默认值为：

```ts
http://localhost:3000/api
```

你可以在 `client/.env` 中显式设置：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📝 License

MIT
