import { describe, expect, it } from 'vitest'

import { pricingPlans, tierDisplayColorMap } from '../data/pricingPlans'

describe('官网订阅档位事实源', () => {
  it('只包含定档的五个稳定键和中文名称', () => {
    expect(pricingPlans.map((plan) => plan.name)).toEqual(['free', 'lite', 'pro', 'max', 'ultra'])
    expect(pricingPlans.map((plan) => plan.display_name)).toEqual([
      '免费版',
      '轻享版',
      '专业版',
      '高级版',
      '旗舰版',
    ])
  })

  it('价格和卡片权益与定档文档一致', () => {
    expect(pricingPlans.map((plan) => plan.monthly_price)).toEqual([0, 49, 99, 299, 699])
    expect(pricingPlans.map((plan) => plan.features)).toEqual([
      ['每月积分：100', '云存储：10 GB', '分身数量：1', '客服支持：社区支持'],
      ['每月积分：500', '云存储：50 GB', '分身数量：2', '客服支持：邮件支持'],
      ['每月积分：1200', '云存储：200 GB', '分身数量：5', '客服支持：优先支持'],
      ['每月积分：4000', '云存储：500 GB', '分身数量：10', '客服支持：优先支持'],
      ['每月积分：10000', '云存储：1 TB', '分身数量：不限', '客服支持：专属客服'],
    ])
  })

  it('不再暴露退役的恒星和超新星档位', () => {
    const serialized = JSON.stringify(pricingPlans)
    expect(serialized).not.toContain('advanced')
    expect(serialized).not.toContain('flagship')
    expect(serialized).not.toContain('恒星')
    expect(serialized).not.toContain('超新星')
  })

  it('订阅管理的颜色映射也只使用五个正式中文名', () => {
    expect(Object.keys(tierDisplayColorMap)).toEqual(['免费版', '轻享版', '专业版', '高级版', '旗舰版'])
  })
})
