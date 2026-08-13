import type { LucideIcon } from 'lucide-react'
import {
  AppWindow,
  ArrowRight,
  Brain,
  Check,
  Cloud,
  FileCheck2,
  KeyRound,
  Laptop,
  MessageCircle,
  MessagesSquare,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import PageHero from '../components/shared/PageHero'
import ScrollReveal from '../components/shared/ScrollReveal'
import SectionCTA from '../components/shared/SectionCTA'

interface SectionIntroProps {
  title: string
  description?: string
  align?: 'left' | 'center'
}

function SectionIntro({ title, description, align = 'left' }: SectionIntroProps) {
  return (
    <div className={align === 'center' ? 'mx-auto mb-14 max-w-3xl text-center' : 'mb-12 max-w-3xl'}>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-7 text-text-secondary md:text-lg">{description}</p>}
    </div>
  )
}

const startSteps = [
  ['下载并登录', '安装唤星桌面端，用一个账号管理消息、分身、任务和应用。'],
  ['创建你的分身', '设置名称、角色和擅长方向，选择由哪台设备承载执行能力。'],
  ['为分身启用能力', '选择需要的应用、技能和工作方式，不必配置 MCP JSON、Token 或工作流代码。'],
  ['交代任务并查看成果', '像发消息一样说明目标。分身拆解和执行，遇到关键决定时向你确认。'],
] as const

const productAreas: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: MessagesSquare,
    title: '消息',
    desc: '和人、分身收发消息。分身在授权范围内接待和回复，不敢自行处理的内容进入“待我处理”。',
  },
  {
    icon: FileCheck2,
    title: '任务',
    desc: '查看目标、执行计划、当前进度和最终交付，让一项任务从交办到验收保持完整上下文。',
  },
  {
    icon: AppWindow,
    title: '应用',
    desc: '分身调用调研、知识、演示文稿、内容、设计和专业分析应用，不必在多个工具之间反复搬运。',
  },
  {
    icon: Sparkles,
    title: '产物',
    desc: '成果先保存在生成设备。你可以主动同步到自己的其他设备，也可以分享给指定联系人。',
  },
]

const memoryTypes = ['你的偏好与表达方式', '重要的人和关系', '正在推进的目标与任务', '做过的决定和积累的方法'] as const

const privacySteps: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  { icon: Laptop, title: '本地生成', desc: '业务逻辑在你选择的设备运行，产物原件默认留在生成设备。' },
  { icon: Cloud, title: '主动同步', desc: '你明确开启同步后，产物才进入跨设备传输流程。' },
  { icon: Users, title: '主动分享', desc: '分享前确认接收者与产物范围，不随产物创建默认上传。' },
  { icon: KeyRound, title: '加密目标', desc: '客户端加密后由云端中转密文，授权设备和指定接收者在本地解密。' },
]

const governance = [
  '普通操作在主人授权范围内执行',
  '涉及金钱、合同、对外发送和关键决定时主动询问',
  '随时查看分身正在做什么',
  '随时接管、纠正、停用或收回权限',
  '所有行为都留下可追溯记录',
] as const

const collaboration = ['主分身理解目标', '调研分身收集资料', '内容分身完成初稿', '设计分身制作成品', '主分身整理交付', '你确认最终结果'] as const

export default function Product() {
  return (
    <>
      <PageHero
        titleHighlight="从一句话"
        title="到一项看得见的交付"
        subtitle="你负责提出目标和作出决定，分身负责理解背景、调用应用、推进任务并带回成果。执行过程始终对你可见。"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/download"
            className="rounded-lg bg-star-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-star-purple-hover"
          >
            免费下载
          </Link>
          <a
            href="#how-it-works"
            className="rounded-lg border border-divider bg-space-panel px-6 py-3 font-semibold text-text-primary transition-colors hover:border-border-hover"
          >
            看看怎么使用
          </a>
        </div>
      </PageHero>

      <section id="how-it-works" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionIntro title="几分钟，开始第一项任务" description="不先学配置，也不先搭工作流。创建分身后，直接交代一件真实的事。" />
          </ScrollReveal>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-divider bg-divider md:grid-cols-4">
            {startSteps.map(([title, desc], index) => (
              <li key={title} className="bg-space-panel p-6 md:p-7">
                <span className="mb-8 block text-sm font-semibold tabular-nums text-star-purple">0{index + 1}</span>
                <h3 className="mb-3 text-lg font-semibold text-text-primary">{title}</h3>
                <p className="text-base leading-7 text-text-secondary">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="product-overview" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionIntro
              title="一个入口，贯穿沟通、执行和成果"
              description="消息让你交代和接管，任务让过程持续可见，应用负责执行，产物承接最终交付。"
            />
          </ScrollReveal>
          <div className="divide-y divide-divider border-y border-divider">
            {productAreas.map((area, index) => {
              const Icon = area.icon
              return (
                <ScrollReveal key={area.title} delay={index * 0.06}>
                  <article className="grid gap-5 py-8 md:grid-cols-[64px_160px_1fr] md:items-center md:gap-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-star-purple/10 text-star-purple">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">{area.title}</h3>
                    <p className="max-w-3xl text-base leading-7 text-text-secondary">{area.desc}</p>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="memory" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <ScrollReveal>
            <p className="mb-3 text-sm font-semibold text-star-purple">永久记忆</p>
            <SectionIntro
              title="永久记忆是所有用户的基础能力"
              description="免费版也能持续理解你的偏好、联系人、工作背景和过去的决定，不会因为套餐或对话结束突然遗忘。"
            />
            <p className="text-base leading-7 text-text-secondary">
              记忆范围由主人管理。你可以查看、纠正或删除，不把“永久”变成“失去控制”。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <div className="rounded-2xl border border-divider bg-space-panel p-7 md:p-9">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-star-purple/10 text-star-purple">
                <Brain aria-hidden="true" className="h-6 w-6" />
              </div>
              <ul className="space-y-5">
                {memoryTypes.map((memory) => (
                  <li key={memory} className="flex items-center gap-3 text-base text-text-primary">
                    <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-star-purple" />
                    {memory}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="artifact-privacy" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionIntro
              title="产物先留在你的设备，分享权始终在你手中"
              description="本地优先不是一个存储选项，而是默认边界：未主动操作前，产物原件不会上传到唤星云端平台。"
            />
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {privacySteps.map((step, index) => {
              const Icon = step.icon
              return (
                <ScrollReveal key={step.title} delay={index * 0.07}>
                  <article className="h-full border-t-2 border-star-purple pt-6">
                    <Icon aria-hidden="true" className="mb-5 h-6 w-6 text-star-purple" />
                    <h3 className="mb-2 font-semibold text-text-primary">{step.title}</h3>
                    <p className="text-base leading-7 text-text-secondary">{step.desc}</p>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
          <ScrollReveal>
            <div className="mt-10 flex gap-4 rounded-2xl border border-star-purple/30 bg-star-purple/5 p-6 md:p-8">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-star-purple" />
              <div>
                <h3 className="font-semibold text-text-primary">客户端端到端加密正在建设</h3>
                <p className="mt-2 text-base leading-7 text-text-secondary">
                  当前版本使用私有存储、服务端加密、访问控制与短期签名链接。完成客户端加密、设备密钥、接收者授权和真实端到端验收后，才会升级为“云端只保存密文”的正式承诺。
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="governance" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <MessageCircle aria-hidden="true" className="mb-6 h-8 w-8 text-star-purple" />
            <SectionIntro
              title="分身可以主动，但不能越权"
              description="主动性解决效率问题，主人治理解决信任问题。两者缺一不可。"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <div className="divide-y divide-divider border-y border-divider">
              {governance.map((item, index) => (
                <div key={item} className="flex items-center gap-4 py-5">
                  <span className="text-sm font-semibold tabular-nums text-star-purple">0{index + 1}</span>
                  <p className="text-base text-text-primary">{item}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="collaboration" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionIntro
              align="center"
              title="一个分身做不完，就让多个分身一起完成"
              description="属于你的多个长期分身可以分别负责研究、内容、设计、运营或工程工作，并把过程和成果汇总回同一个任务。"
            />
          </ScrollReveal>
          <ol className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {collaboration.map((step, index) => (
              <li key={step} className="relative flex min-h-32 flex-col justify-between rounded-xl border border-divider bg-space-panel p-5">
                <span className="text-sm font-semibold tabular-nums text-star-purple">0{index + 1}</span>
                <p className="mt-8 text-sm font-medium leading-6 text-text-primary">{step}</p>
                {index < collaboration.length - 1 && (
                  <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-space-black text-text-tertiary lg:block" />
                )}
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-text-secondary">
            同一主人下的多分身协作已有产品基础；跨主人、跨组织的重复协作网络仍在持续验证和开放。
          </p>
        </div>
      </section>

      <section id="devices" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionIntro
              title="分身不绑死在一台设备，也不绑死在一种大脑上"
              description="更换设备、模型或 Runtime 时，分身的身份、主人关系和工作归属不会重置。"
            />
          </ScrollReveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-divider bg-divider md:grid-cols-3">
            <article className="bg-space-panel p-7">
              <Laptop aria-hidden="true" className="mb-6 h-7 w-7 text-star-purple" />
              <h3 className="mb-3 text-lg font-semibold text-text-primary">本机</h3>
              <p className="text-base leading-7 text-text-secondary">数据和执行留在自己的电脑，适合处理本地文件和隐私任务。</p>
            </article>
            <article className="bg-space-panel p-7">
              <Network aria-hidden="true" className="mb-6 h-7 w-7 text-star-purple" />
              <h3 className="mb-3 text-lg font-semibold text-text-primary">其他设备</h3>
              <p className="text-base leading-7 text-text-secondary">分身可以绑定到主人拥有的其他设备，并通过同一账号继续工作。</p>
            </article>
            <article className="bg-space-panel p-7">
              <Cloud aria-hidden="true" className="mb-6 h-7 w-7 text-star-purple" />
              <h3 className="mb-3 text-lg font-semibold text-text-primary">云端常驻设备</h3>
              <p className="text-base leading-7 text-text-secondary">
                云端常驻设备可以执行任务，因为它是主人授权的一台完整设备；唤星云端平台只负责身份、路由、授权协调和同步。
              </p>
            </article>
          </div>
        </div>
      </section>

      <SectionCTA
        title="创建你的第一个 AI 分身"
        subtitle="支持 macOS、Windows 和 Linux。永久记忆免费，从一项真实任务开始。"
        buttonText="下载桌面端"
        buttonHref="/download"
      />
    </>
  )
}
