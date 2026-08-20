import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import {
  readSharePasswordFromHash,
  SHARE_PASSWORD_HASH_PARAM,
  type ShareMeta,
} from '../api/publishShare'
import PublishSharePage from '../pages/share/PublishSharePage'

// 只 mock 网络面三个函数；纯函数（readSharePasswordFromHash / shareContentUrl）走真实实现。
const getShareMetaMock = vi.fn()
const unlockShareMock = vi.fn()
const issueViewTicketBySlugMock = vi.fn()

vi.mock('../api/publishShare', async (importActual) => {
  const actual = await importActual<typeof import('../api/publishShare')>()
  return {
    ...actual,
    getShareMeta: (...args: unknown[]) => getShareMetaMock(...args),
    unlockShare: (...args: unknown[]) => unlockShareMock(...args),
    issueViewTicketBySlug: (...args: unknown[]) => issueViewTicketBySlugMock(...args),
  }
})

const PASSWORD_META: ShareMeta = {
  slug: 'abc123',
  title: '测试站点',
  kind: 'page',
  visibility: 'password',
  has_password: true,
  requires_login: false,
  allow_present: false,
  allow_download: false,
  expired: false,
  available: true,
}

function renderSharePage(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/s/:slug" element={<PublishSharePage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('readSharePasswordFromHash', () => {
  it('参数名与复制侧约定一致（pw）', () => {
    expect(SHARE_PASSWORD_HASH_PARAM).toBe('pw')
  })

  it('空 hash / 无 pw 参数 → 空串', () => {
    expect(readSharePasswordFromHash('')).toBe('')
    expect(readSharePasswordFromHash('#')).toBe('')
    expect(readSharePasswordFromHash('#from=qr')).toBe('')
  })

  it('#pw= 直读', () => {
    expect(readSharePasswordFromHash('#pw=pass1234')).toBe('pass1234')
  })

  it('与其它 fragment 参数用 & 共存', () => {
    expect(readSharePasswordFromHash('#from=qr&pw=pw9')).toBe('pw9')
  })

  it('percent-encode 的口令被还原', () => {
    expect(readSharePasswordFromHash('#pw=a%26b%3Dc%23d')).toBe('a&b=c#d')
  })

  it('纯空白口令视为未携带', () => {
    expect(readSharePasswordFromHash('#pw=%20%20')).toBe('')
  })
})

describe('PublishSharePage · #pw= 自动解锁', () => {
  beforeEach(() => {
    getShareMetaMock.mockReset()
    unlockShareMock.mockReset()
    issueViewTicketBySlugMock.mockReset()
    getShareMetaMock.mockResolvedValue({ status: 'ok', meta: PASSWORD_META })
  })

  it('链接带 #pw=：自动用该口令解锁一次并直接嵌内容', async () => {
    unlockShareMock.mockResolvedValue({ ticket: 'vt-1', ttl_seconds: 600 })
    renderSharePage('/s/abc123#pw=secret')

    await waitFor(() => expect(unlockShareMock).toHaveBeenCalledTimes(1))
    expect(unlockShareMock).toHaveBeenCalledWith('abc123', 'secret')

    const iframe = await screen.findByTitle('测试站点')
    expect(iframe).toHaveAttribute('src', expect.stringContaining('/s/abc123/content?vt=vt-1'))
  })

  it('链接口令错误：展示带来源的失败原因、输入框保留该口令、不自动重试', async () => {
    unlockShareMock.mockRejectedValue(new Error('口令错误'))
    renderSharePage('/s/abc123#pw=wrong')

    await screen.findByText('链接自带口令解锁失败：口令错误')
    const input = screen.getByPlaceholderText('请输入访问口令') as HTMLInputElement
    expect(input.value).toBe('wrong')

    // 等一拍确认守卫生效：绝不因重渲染变相重试刷解锁接口
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(unlockShareMock).toHaveBeenCalledTimes(1)
  })

  it('链接不带 #pw=：停在口令页，不发起解锁', async () => {
    renderSharePage('/s/abc123')

    await screen.findByText('该分享受口令保护')
    expect(unlockShareMock).not.toHaveBeenCalled()
  })
})
