import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

const faqs = [
  { q: '免费版能用多久？', a: '免费版无商业到期时间，每 30 天提供 100 积分，也可随时升级到更高档位。' },
  { q: '不同套餐会限制可用模型或记忆保留时间吗？', a: '当前档位不按模型或记忆保留时间做区分。各档位的可执行差异以积分、云存储、分身数量和客服支持为准。' },
  { q: '支持哪些平台？', a: '目前支持飞书机器人和 QQ 机器人。桌面端应用和移动端 APP 正在开发中，敬请期待。' },
  { q: '可以退款吗？', a: '支持 7 天无理由退款。如果对产品不满意，联系客服即可全额退款。' },
  { q: '数据安全吗？', a: '你的记忆和数据完全属于你自己。我们使用企业级加密存储，绝不会将你的数据用于训练模型或出售给第三方。' },
  { q: '可以同时有多个分身吗？', a: '可以。免费版、轻享版、专业版、高级版分别支持 1、2、5、10 个分身，旗舰版不限分身数量。' },
  { q: '模型会升级吗？', a: '会。随着 AI 技术发展，我们会持续升级底层模型。升级后你的分身会变得更聪明，而价格不变。' },
  { q: '如何联系客服？', a: '免费版提供社区支持，轻享版提供邮件支持，专业版和高级版提供优先支持，旗舰版提供专属客服。' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="text-star-blue">
              常见问题
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            还有疑问？看看这里有没有答案
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="rounded-xl border border-divider bg-space-panel overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-text-primary pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-text-tertiary transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? 'max-h-40 pb-4' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
