import PageHero from '../components/shared/PageHero'
import Pricing from '../components/Pricing'
import FAQ from '../components/pricing/FAQ'
import SectionCTA from '../components/shared/SectionCTA'

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="选择适合你的超级大脑"
        subtitle="每个人都值得一颗星，从免费开始体验"
      />

      {/* 复用已有的 Pricing 组件 */}
      <Pricing />

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
