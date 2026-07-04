import Hero from '../components/home/Hero'
import ValueProp from '../components/home/ValueProp'
import PainPoints from '../components/home/PainPoints'
import SuperBrainLayer from '../components/home/SuperBrainLayer'
import SocialFabricLayer from '../components/home/SocialFabricLayer'
import ThreeFaces from '../components/home/ThreeFaces'
import Differentiation from '../components/home/Differentiation'
import PricingBrief from '../components/home/PricingBrief'
import BrandFinale from '../components/home/BrandFinale'

export default function Home() {
  return (
    <>
      {/* 1. 情感冲击 — 发光八角星 + 主标题 */}
      <Hero />

      {/* 2. 价值主张 — 分身干活，你做决定 */}
      <ValueProp />

      {/* 3. 痛点共鸣 — 一个人扛不动 */}
      <PainPoints />

      {/* 4. 层0 · 超级大脑分身 — 全量记忆/主动执行/越用越像你 */}
      <SuperBrainLayer />

      {/* 5. 层1+层2 · 分身进入社交网络 + AI-Native 双面范式 */}
      <SocialFabricLayer />

      {/* 6. 层3 · 三面同底 — IM / 社区 / AI 工具 */}
      <ThreeFaces />

      {/* 7. 差异化 — vs 传统 AI 助手 */}
      <Differentiation />

      {/* 8. 定价精简 */}
      <PricingBrief />

      {/* 9. 品牌收尾 — 仰望星空 + CTA */}
      <BrandFinale />
    </>
  )
}
