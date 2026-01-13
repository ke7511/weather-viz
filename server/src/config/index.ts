import dotenv from 'dotenv'

// 加载 .env 文件
dotenv.config()

export const config = {
  /** 和风天气项目 ID */
  qweatherProjectId: process.env.QWEATHER_PROJECT_ID || '',

  /** 和风天气凭据 ID (KID) */
  qweatherKid: process.env.QWEATHER_KID || '',

  /** 和风天气私钥 */
  qweatherPrivateKey:
    process.env.QWEATHER_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',

  /** 服务器端口 */
  port: Number(process.env.PORT) || 3000,

  /** 是否强制使用模拟数据 */
  forceMock: process.env.USE_MOCK === 'true',

  /** 和风天气 API Host */
  qweatherApiHost: process.env.QWEATHER_API_HOST || ''
}

/**
 * 检查 JWT 凭证是否完整配置
 */
export function hasJwtCredentials(): boolean {
  return !!(
    config.qweatherProjectId &&
    config.qweatherKid &&
    config.qweatherPrivateKey &&
    config.qweatherApiHost
  )
}

/**
 * 判断当前是否应该使用模拟数据
 */
export function shouldUseMock(): boolean {
  return config.forceMock || !hasJwtCredentials()
}
