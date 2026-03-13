import Hero from '../components/home/Hero'
import PainPoints from '../components/home/PainPoints'
import SuperBrainBrief from '../components/home/SuperBrainBrief'
import Features from '../components/Features'
import GrowthSystem from '../components/GrowthSystem'
import ChatPreview from '../components/ChatPreview'
import UseCasesBrief from '../components/home/UseCasesBrief'
import CompareTable from '../components/home/CompareTable'
import PricingBrief from '../components/home/PricingBrief'
import BrandStory from '../components/BrandStory'

export default function Home() {
  return (
    <>
      {/* 1. 情感冲击 — 10秒定生死 */}
      <Hero />

      {/* 2. 痛点共鸣 — 你有这些问题 */}
      <PainPoints />

      {/* 3. 超级大脑六大能力精简版 */}
      <SuperBrainBrief />

      {/* 4. 核心价值 — 养成感/全时在线/无限可能（原版灵魂） */}
      <Features />

      {/* 5. 养成进化 — 四颗星球（原版灵魂 ✦） */}
      <GrowthSystem />

      {/* 6. 对话预览 — 4个场景对话卡片（原版灵魂） */}
      <ChatPreview />

      {/* 7. 六大场景精简版 */}
      <UseCasesBrief />

      {/* 8. Claw 系列产品对比 */}
      <CompareTable />

      {/* 9. 定价精简版 */}
      <PricingBrief />

      {/* 10. 品牌故事 — "每个人小时候都仰望过星空"（原版灵魂 ✦） */}
      <BrandStory />
    </>
  )
}
