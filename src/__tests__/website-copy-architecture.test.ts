import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const homeSource = readFileSync(resolve('src/pages/Home.tsx'), 'utf8')
const heroSource = readFileSync(resolve('src/components/home/Hero.tsx'), 'utf8')
const privacySource = readFileSync(resolve('src/components/home/PrivacyFlow.tsx'), 'utf8')
const productSource = readFileSync(resolve('src/pages/Product.tsx'), 'utf8')
const techSource = readFileSync(resolve('src/pages/Tech.tsx'), 'utf8')
const documentSource = readFileSync(resolve('index.html'), 'utf8')
const globalStyleSource = readFileSync(resolve('src/index.css'), 'utf8')

describe('官网三页对外叙事边界', () => {
  it('首页保留品牌 Slogan，并突出本地优先与真实竞品对比', () => {
    expect(homeSource).toContain('export default function Home')
    expect(heroSource).toContain('唤醒星辰的力量')
    expect(heroSource).toContain('AI与你共生')
    expect(heroSource).toContain('真正属于你的 AI 分身')
    expect(heroSource).toContain('本地优先，隐私由你掌控')
    expect(homeSource).toContain('CompetitorComparison')
    expect(homeSource).toContain('PrivacyFlow')
    expect(privacySource).toContain('目标加密流程')
    expect(homeSource).not.toContain('SuperBrainLayer')
    expect(homeSource).not.toContain('ThreeFaces')
  })

  it('产品页按使用路径介绍功能，并诚实标注加密同步仍在建设', () => {
    expect(productSource).toContain('export default function Product')
    expect(productSource).toContain('几分钟，开始第一项任务')
    expect(productSource).toContain('永久记忆是所有用户的基础能力')
    expect(productSource).toContain('产物先留在你的设备')
    expect(productSource).toContain('客户端端到端加密正在建设')
    expect(productSource).toContain('云端常驻设备可以执行任务')
    expect(productSource).not.toContain('四层因果链')
    expect(productSource).not.toContain('7×24 主动替你动手')
  })

  it('技术页区分云端平台与云端节点，不把目标能力冒充为现状', () => {
    expect(techSource).toContain('export default function Tech')
    expect(techSource).toContain('云端平台是同步中枢')
    expect(techSource).toContain('云端节点是主人的第 N 台设备')
    expect(techSource).toContain('当前安全基线')
    expect(techSource).toContain('客户端端到端加密（目标能力）')
    expect(techSource).toContain('目标能力验收边界')
    expect(techSource).toContain('HASN 0.3 Public Draft')
    expect(techSource).not.toContain('云端大脑')
    expect(techSource).not.toContain('技术白皮书（对外发布中）')
  })

  it('官网不加载或使用 Inter 字体', () => {
    expect(documentSource).not.toMatch(/family=Inter|\bInter\b/)
    expect(globalStyleSource).not.toMatch(/font-family:[^;]*\bInter\b/)
    expect(globalStyleSource).toContain(
      "font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif;",
    )
  })
})
