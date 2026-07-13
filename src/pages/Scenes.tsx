import { Link } from 'react-router-dom'
import {
  Compass, Rocket, TrendingUp, ChevronRight, Plus, Sparkles, ArrowRight,
  Megaphone, Code2, ShoppingCart, BarChart3, Briefcase, Building2, Scale, GraduationCap,
  type LucideIcon,
} from 'lucide-react'
import Ic from '../components/scenes/Ic'
import './scenes/scenes.css'

// 场景总览画廊 —— 1:1 移植原型「场景-总览画廊-原型.html」，去掉左侧导航栏、复用站点顶栏。
// 只有「一人公司」「金融投研」两条链有详情页可点，其余按福仔要求标「即将上线」不可点。

interface Avatar { char: string; tone: string }
interface SceneCard {
  icon: LucideIcon
  tone: string        // 图标底色 class（t-brand / t-teal ...）
  name: string
  tag: string
  desc: string
  chain: string[]     // 阶段名，用箭头连接
  stages: number
  apps: number
  to?: string         // 有则可点，无则「即将上线」
  avatars?: Avatar[]
}
interface SceneGroup {
  icon: LucideIcon
  tone: string
  name: string
  count: string
  cards: SceneCard[]
}

const GROUPS: SceneGroup[] = [
  {
    icon: Rocket, tone: 't-brand', name: '个人创业', count: '4 个场景',
    cards: [
      {
        icon: Rocket, tone: 't-brand', name: '一人公司', tag: '一个人跑通一家公司',
        desc: '从一个想法出发，走完调研、方案、品牌、产品、运营、获客，独自把它做成一门生意。',
        chain: ['想法', '调研', '方案', '品牌', '产品', '运营', '获客'],
        stages: 8, apps: 7, to: '/scenes/solo-company',
        avatars: [
          { char: '研', tone: 't-teal' }, { char: '设', tone: 't-pink' },
          { char: '码', tone: 't-slate' }, { char: '销', tone: 't-orange' },
        ],
      },
      {
        icon: Megaphone, tone: 't-pink', name: '内容工作室', tag: '把一个账号做成内容矩阵',
        desc: '从定位到选题、创作、成片、发布、复盘，用内容运营与短视频把影响力做起来。',
        chain: ['定位', '选题', '创作', '成片', '发布', '复盘'], stages: 6, apps: 5,
      },
      {
        icon: Code2, tone: 't-slate', name: '独立开发者', tag: '一个人把产品做出来上线',
        desc: '从点子到技术选型、构建、发布、增长，研发分身帮你把网站或应用真正跑起来。',
        chain: ['点子', '选型', '构建', '发布', '增长'], stages: 5, apps: 4,
      },
      {
        icon: ShoppingCart, tone: 't-amber', name: '电商品牌', tag: '从选品到成交',
        desc: '选品调研、品牌视觉、详情页、内容种草、私域转化，一条把货卖出去的链路。',
        chain: ['选品', '品牌', '详情', '种草', '转化'], stages: 5, apps: 5,
      },
    ],
  },
  {
    icon: TrendingUp, tone: 't-teal', name: '金融投研', count: '3 个场景',
    cards: [
      {
        icon: TrendingUp, tone: 't-teal', name: '金融投研', tag: '做出可交易的判断',
        desc: '从一个研究命题出发，采行情、做调研、设策略、跑回测、出研报，一路到分发。',
        chain: ['命题', '行情', '调研', '策略', '回测', '研报', '分发'],
        stages: 7, apps: 6, to: '/scenes/finance-research',
        avatars: [{ char: '投', tone: 't-teal' }, { char: '量', tone: 't-indigo' }],
      },
      {
        icon: BarChart3, tone: 't-indigo', name: '量化策略', tag: '从假设到实盘信号',
        desc: '因子假设、数据、建模、回测、稳健性检验、参数优化，把一个想法打磨成可上线的策略。',
        chain: ['假设', '数据', '建模', '回测', '优化'], stages: 5, apps: 3,
      },
      {
        icon: Briefcase, tone: 't-slate', name: '投资尽调', tag: '看一个项目值不值得投',
        desc: '项目梳理、市场与竞品、财务与团队、风险清单、投资备忘录，做出一份尽调结论。',
        chain: ['梳理', '市场', '财务', '风险', '备忘录'], stages: 5, apps: 4,
      },
    ],
  },
  {
    icon: Building2, tone: 't-indigo', name: '企业办公', count: '2 个场景',
    cards: [
      {
        icon: Building2, tone: 't-indigo', name: '企业办公', tag: '团队分身协同把项目落地',
        desc: '立项、调研、方案、排期、交付、复盘，多个分身在企业空间里各司其职、协同推进。',
        chain: ['立项', '调研', '方案', '排期', '交付', '复盘'], stages: 6, apps: 5,
      },
      {
        icon: Briefcase, tone: 't-sky', name: '市场活动', tag: '办一场活动从策划到复盘',
        desc: '目标、创意、物料、预热、执行、复盘，把一场市场活动从想法办成有数据的结果。',
        chain: ['目标', '创意', '物料', '执行', '复盘'], stages: 5, apps: 5,
      },
    ],
  },
  {
    icon: Scale, tone: 't-rose', name: '专业服务', count: '2 个场景',
    cards: [
      {
        icon: Scale, tone: 't-rose', name: '法律法务', tag: '把一个诉求办成合规结论',
        desc: '案情梳理、法律检索、意见分析、文书拟制、归档，法务分身走完一条严谨的办案链路。',
        chain: ['案情', '检索', '意见', '文书', '归档'], stages: 5, apps: 4,
      },
      {
        icon: GraduationCap, tone: 't-violet', name: '教育培训', tag: '从大纲到一门可交付课程',
        desc: '需求、大纲、课件、讲义、测评、迭代，把一个主题做成能上架交付的完整课程。',
        chain: ['需求', '大纲', '课件', '测评', '迭代'], stages: 5, apps: 4,
      },
    ],
  },
]

function Chain({ steps }: { steps: string[] }) {
  return (
    <div className="sc-chain">
      {steps.map((s, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span className="st">{s}</span>
          {i < steps.length - 1 && <Ic icon={ChevronRight} className="ar" />}
        </span>
      ))}
    </div>
  )
}

function CardInner({ card }: { card: SceneCard }) {
  return (
    <>
      <div className="sc-top">
        <div className={`sc-ic ${card.tone}`}><Ic icon={card.icon} /></div>
        <div>
          <div className="sc-nm">{card.name}</div>
          <div className="sc-tag">{card.tag}</div>
        </div>
      </div>
      <div className="sc-desc">{card.desc}</div>
      <Chain steps={card.chain} />
      <div className="sc-foot">
        <div className="sc-meta"><span>{card.stages} 阶段</span><span className="d" /><span>{card.apps} 应用</span></div>
        {card.avatars && (
          <div className="avstack">
            {card.avatars.map((a, i) => <span key={i} className={`av ${a.tone}`}>{a.char}</span>)}
          </div>
        )}
      </div>
    </>
  )
}

export default function Scenes() {
  return (
    <div className="scenes-root">
      <div className="wrap">

        {/* Hero */}
        <section className="hero">
          <span className="hero-ey"><Ic icon={Compass} />场景 · Scenario</span>
          <h1>从一个想法，到落地成事</h1>
          <p>场景是一条领域链路——把「分身 × AI-Native 应用」按行业打包成从想法到落地的完整路径。你只管在每一步派分身，产物顺着链路自己往下走。</p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/scenes/solo-company"><Ic icon={Rocket} />从「一人公司」开始</Link>
            <Link className="btn btn-glass" to="/scenes/finance-research"><Ic icon={TrendingUp} />看金融投研场景</Link>
          </div>
        </section>

        {/* 机制解释 */}
        <section>
          <div style={{ marginBottom: 14 }}>
            <div className="sec-title">场景是怎么工作的</div>
            <div className="sec-sub">四步闭环——选场景、逐环节派分身、分身串应用出产物、产物顺链往下走。</div>
          </div>
          <div className="mech">
            {[
              { t: '选一个场景', d: '挑一条贴合你目标的领域链路，比如一人公司、金融投研。场景自带阶段、分身和应用编排。' },
              { t: '逐环节派分身', d: '每一环都有一个专家分身负责。到了这一步，你点「派发」，它替你上手；也可开自动接力。' },
              { t: '分身串应用出产物', d: '分身调用知识库、设计系统、建站等 AI-Native 应用，干完活产出真实产物（报告、设计、网站）。' },
              { t: '产物顺链下游', d: '上一环的产出自动成为下一环的输入——知识库喂设计，设计喂产品，一路到获客闭环。' },
            ].map((m, i, arr) => (
              <div className="mech-step" key={i}>
                <div className="mech-n">{i + 1}</div>
                <div className="mech-t">{m.t}</div>
                <div className="mech-d">{m.d}</div>
                {i < arr.length - 1 && <div className="mech-arrow"><Ic icon={ArrowRight} /></div>}
              </div>
            ))}
          </div>
        </section>

        {/* 场景分组 */}
        {GROUPS.map((g) => (
          <section className="group" key={g.name}>
            <div className="group-hd">
              <span className={`group-ic ${g.tone}`}><Ic icon={g.icon} /></span>
              <span className="group-nm">{g.name}</span>
              <span className="group-ct">{g.count}</span>
            </div>
            <div className="scene-cards">
              {g.cards.map((card) => (
                card.to ? (
                  <Link className="card sc" to={card.to} key={card.name}><CardInner card={card} /></Link>
                ) : (
                  <div className="card sc sc-soon" key={card.name} aria-disabled="true"><CardInner card={card} /></div>
                )
              ))}
            </div>
          </section>
        ))}

        {/* 底部说明 */}
        <section>
          <div className="addscene">
            <div className="ai"><Ic icon={Plus} /></div>
            <div className="tx">
              <div className="t">在这个框架下，添加你自己的场景</div>
              <div className="s">场景是一套开放框架：定义阶段、给每一环挑分身和应用、连好产物流向，就是一条新链路。你可以把自己反复在做的工作流沉淀成场景，也能把它分享给团队复用。</div>
            </div>
            <Link className="btn btn-primary" to="/pricing"><Ic icon={Sparkles} />免费开始</Link>
          </div>
        </section>

      </div>
    </div>
  )
}
