// 网页发布分享查看器数据层（WEBSHARE-C）。
//
// 官网 `/s/{slug}` 接管网页发布分享：
//   - 元数据 / owner 换票走 `/api/v1/...`（由 client.ts 的 request 自动带 JWT + 解包信封）；
//   - 制品内容（iframe）+ 口令解锁直连**内容域**（后端 API 域 `/s/{slug}/content|unlock`）：
//     内容域的 `/content` 无 frame-ancestors/XFO、恒带 `sandbox allow-scripts`（opaque origin），
//     可被官网跨域嵌入；shell `/s/{slug}` 带 `frame-ancestors 'self'` 不可嵌，故只嵌 `/content`。
//   - 内容域来自 VITE_SHARE_CONTENT_ORIGIN（dev=http://127.0.0.1:8020，prod=https://api.huanxing.dcfuture.cn）。
import axios from 'axios'

import { request } from './client'

// 制品内容域（后端 API 域）：iframe src + 口令解锁的绝对域名。
// 官网自身 /s/* 会被 SPA 接管，故内容/解锁必须显式指向内容域，不能用相对路径。
const CONTENT_ORIGIN = (import.meta.env.VITE_SHARE_CONTENT_ORIGIN || '').replace(/\/$/, '')

export type ShareVisibility = 'private' | 'password' | 'unlisted' | 'public'

export interface ShareMeta {
  slug: string
  title: string
  kind: string
  visibility: ShareVisibility
  has_password: boolean
  requires_login: boolean
  allow_present: boolean
  allow_download: boolean
  expired: boolean
  available: boolean
}

export interface ViewTicket {
  ticket: string
  ttl_seconds: number
}

export type ShareMetaResult =
  | { status: 'ok'; meta: ShareMeta }
  | { status: 'not_found' }
  | { status: 'error'; message: string }

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as { msg?: string } | undefined)?.msg
    if (msg) return msg
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

// 匿名分享元数据（判定渲染态：public/unlisted/password/private + 过期/撤销/不存在）。
export async function getShareMeta(slug: string): Promise<ShareMetaResult> {
  try {
    const meta = await request<ShareMeta>({
      method: 'GET',
      url: `/publish/open/sites/${encodeURIComponent(slug)}/meta`,
    })
    return { status: 'ok', meta }
  } catch (error) {
    // 不存在 / 已撤销 → 404；已过期整站 → 410：都当「打不开」空态
    if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 410)) {
      return { status: 'not_found' }
    }
    return { status: 'error', message: errorMessage(error, '加载分享失败') }
  }
}

// owner 本人登录后按 slug 换 private 访问票（浏览器只有 slug，无 site_id）。
// 非 owner / 不存在 → 后端返回 404 → 这里抛错（页面据此判「无权查看」）。
export async function issueViewTicketBySlug(slug: string): Promise<ViewTicket> {
  return request<ViewTicket>({
    method: 'POST',
    url: `/publish/app/sites/by-slug/${encodeURIComponent(slug)}/view-ticket`,
  })
}

// 口令解锁：直连内容域 `/s/{slug}/unlock`（跨域，后端 CORS 已放行官网域）。
export async function unlockShare(slug: string, password: string): Promise<ViewTicket> {
  const resp = await fetch(`${CONTENT_ORIGIN}/s/${encodeURIComponent(slug)}/unlock`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const body = (await resp.json().catch(() => null)) as { data?: ViewTicket; msg?: string } | null
  if (!resp.ok || !body?.data?.ticket) {
    throw new Error(body?.msg || '口令错误')
  }
  return body.data
}

// 制品内容 iframe URL（内容域，opaque origin 沙箱内渲染；带 vt 授权 private/password）。
export function shareContentUrl(slug: string, ticket?: string): string {
  const base = `${CONTENT_ORIGIN}/s/${encodeURIComponent(slug)}/content`
  return ticket ? `${base}?vt=${encodeURIComponent(ticket)}` : base
}

/** 分享链接 fragment 里携带口令的参数名（与 hasn-node webui 复制侧的 `shareLinkWithPassword` 约定一致）。 */
export const SHARE_PASSWORD_HASH_PARAM = 'pw'

/**
 * 从 URL fragment 读分享口令（`#pw=…`，可与其它 fragment 参数用 `&` 共存）。
 *
 * 选 fragment 而不是 query：fragment 不进 HTTP 请求——不落 nginx access log、
 * 不随 Referer 外泄——是「链接带口令」唯一安全的信道；读取只发生在浏览器侧。
 * 纯函数（hash 由调用方传入），便于单测。
 */
export function readSharePasswordFromHash(hash: string): string {
  const raw = hash.replace(/^#/, '')
  if (!raw) return ''
  const value = new URLSearchParams(raw).get(SHARE_PASSWORD_HASH_PARAM)
  return value?.trim() ?? ''
}
