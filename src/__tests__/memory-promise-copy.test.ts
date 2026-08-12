import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const pricingPageSource = readFileSync(resolve('src/pages/PricingPage.tsx'), 'utf8')
const memorySystemSource = readFileSync(resolve('src/components/product/MemorySystem.tsx'), 'utf8')
const pricingFaqSource = readFileSync(resolve('src/components/pricing/FAQ.tsx'), 'utf8')

describe('官网永久记忆承诺', () => {
  it('定价页不再把遗忘恐惧作为付费理由', () => {
    expect(pricingPageSource).toContain('<Pricing />')
    expect(pricingPageSource).toContain('<FAQ />')
    expect(pricingPageSource).not.toContain('为什么要付费')
    expect(pricingPageSource).not.toContain('7 天记忆')
    expect(pricingPageSource).not.toContain('会忘记你')
  })

  it('产品页明确永久记忆是所有用户的基础能力', () => {
    expect(memorySystemSource).toContain('const memoryTypes')
    expect(memorySystemSource).toContain('永久记忆是每个用户的基础能力')
    expect(memorySystemSource).not.toContain('免费版只保留 7 天记忆')
    expect(memorySystemSource).not.toContain('核心付费逻辑')
    expect(pricingFaqSource).toContain('永久记忆是所有套餐的基础能力')
  })
})
