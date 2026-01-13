import { SignJWT, importPKCS8 } from 'jose'
import { config } from '../config'

let cachedToken: { token: string; expireAt: number } | null = null

/**
 * 生成和风天气 JWT Token
 */
export async function generateQWeatherJwt(): Promise<string> {
  // 如果缓存的 token 还有效（提前 60 秒刷新），直接返回
  if (cachedToken && Date.now() < cachedToken.expireAt - 60000) {
    return cachedToken.token
  }

  const privateKey = await importPKCS8(config.qweatherPrivateKey, 'EdDSA')

  const iat = Math.floor(Date.now() / 1000) - 30 // 提前 30 秒，防止时间误差
  const exp = iat + 900 // 15 分钟有效期

  const token = await new SignJWT({ sub: config.qweatherProjectId })
    .setProtectedHeader({
      alg: 'EdDSA',
      kid: config.qweatherKid
    })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(privateKey)

  // 缓存 token
  cachedToken = {
    token,
    expireAt: exp * 1000
  }

  return token
}
