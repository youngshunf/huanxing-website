import Hero from '../components/home/Hero'
import PainPoints from '../components/home/PainPoints'
import Offerings from '../components/home/Offerings'
import PrivacyFlow from '../components/home/PrivacyFlow'
import CompetitorComparison from '../components/home/CompetitorComparison'
import PricingBrief from '../components/home/PricingBrief'
import BrandFinale from '../components/home/BrandFinale'

export default function Home() {
  return (
    <>
      {/* 1. 品牌首屏：保留发光八角星、Slogan、下载识别与按钮结构。 */}
      <Hero />

      {/* 2. 用户问题。 */}
      <PainPoints />

      {/* 3. 产品与服务。 */}
      <Offerings />

      {/* 4. 产品归属、本地优先与隐私边界。 */}
      <PrivacyFlow />

      {/* 5. 竞品位置与事实边界。 */}
      <CompetitorComparison />

      {/* 6. 免费基础与付费权益。 */}
      <PricingBrief />

      {/* 7. 单一行动收口。 */}
      <BrandFinale />
    </>
  )
}
