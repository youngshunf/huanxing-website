import PageHero from '../components/shared/PageHero'
import Pricing from '../components/Pricing'
import FAQ from '../components/pricing/FAQ'
import SectionCTA from '../components/shared/SectionCTA'
import ScrollReveal from '../components/shared/ScrollReveal'

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="选择适合你的超级大脑"
        subtitle="每个人都值得一颗星，从免费开始体验"
      />

      {/* 复用已有的 Pricing 组件 */}
      <Pricing />

      {/* 付费亮点 */}
      <section className="relative z-10 px-4 py-16 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="rounded-xl border border-star-purple/30 bg-star-purple/5 p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-text-primary">
                💡 为什么要付费？
              </h3>
              <p className="mb-2 text-lg text-text-secondary">
                免费版的超级大脑只有 <strong className="text-star-purple">7 天记忆</strong>
              </p>
              <p className="text-text-secondary">
                想象一下，你花了一个月让它完全了解你，然后它忘记了你的一切。
              </p>
              <p className="mt-4 text-xl font-semibold text-star-purple">
                "你的超级大脑会忘记你" — 这是最强的付费理由
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FAQ />

      <SectionCTA
        title="从免费开始，让你的超级大脑认识你"
        buttonText="免费注册"
        buttonHref="/pricing"
        isRoute={false}
      />
    </>
  )
}
