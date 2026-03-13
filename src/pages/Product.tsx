import PageHero from '../components/shared/PageHero'
import SuperBrain from '../components/product/SuperBrain'
import MemorySystem from '../components/product/MemorySystem'
import SocialGraph from '../components/product/SocialGraph'
import ProactiveService from '../components/product/ProactiveService'
import Templates from '../components/product/Templates'
import SectionCTA from '../components/shared/SectionCTA'

export default function Product() {
  return (
    <>
      <PageHero
        titleHighlight="不是聊天工具"
        title="是你的超级大脑"
        subtitle="比你记忆力更强、比你更会分析、比你更能执行。7×24 小时替你思考、替你做事、替你赚钱。"
      />
      <SuperBrain />
      <MemorySystem />
      <SocialGraph />
      <ProactiveService />
      <Templates />
      <SectionCTA
        title="准备好拥有你的超级大脑了吗？"
        subtitle="从免费开始，让你的超级大脑认识你"
        buttonText="免费体验"
        buttonHref="/pricing"
      />
    </>
  )
}
