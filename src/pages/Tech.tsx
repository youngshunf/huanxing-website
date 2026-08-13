import type { LucideIcon } from 'lucide-react'
import {
  AppWindow,
  ArrowDown,
  ArrowRight,
  Boxes,
  BrainCircuit,
  Check,
  Cloud,
  Code2,
  Database,
  Fingerprint,
  KeyRound,
  Laptop,
  LockKeyhole,
  Network,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import PageHero from '../components/shared/PageHero'
import ScrollReveal from '../components/shared/ScrollReveal'
import SectionCTA from '../components/shared/SectionCTA'

interface SectionHeadingProps {
  title: string
  description?: string
  label?: string
  center?: boolean
}

function SectionHeading({ title, description, label, center = false }: SectionHeadingProps) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} mb-12 max-w-4xl`}>
      {label && <p className="mb-3 text-sm font-semibold text-star-purple">{label}</p>}
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-7 text-text-secondary md:text-lg">{description}</p>}
    </div>
  )
}

const missingLayerQuestions = [
  'Agent 换平台、设备或模型后，身份是否仍然连续？',
  'Agent 对外通信和行动时，授权与责任如何追溯？',
  '应用提供的是能力，还是又创建了一个孤立机器人？',
  '不同主人拥有的 Agent，能否在双方可见和可接管的前提下协作？',
  '跨设备同步和跨主人分享时，云端能否在看不到产物明文的情况下完成中转？',
] as const

const architectureLayers = [
  ['L0', '节点与数据', 'hasn-node · Rust · SQLite · 本地优先 · 多设备模型'],
  ['L1', 'Agent 与 Runtime', 'Agent 是长期身份；Runtime 是可替换执行环境，模型、引擎和设备可以变化。'],
  ['L2', '身份与主人治理', '稳定 hasn_id、明确主人、独立授权、设备凭据、行为审计和可撤销控制。'],
  ['L3', 'HASN 网络', '身份、关系、消息、工作会话与 A2A / A2H / H2A 通信，保持完整责任链。'],
  ['L4', 'AI-Native 应用', 'App 提供 UI、Tool、Skill、Workflow、Resource 和 Event，分身携带上下文跨应用执行。'],
] as const

const implementations: Array<{ icon: LucideIcon; title: string; body: string; status?: string }> = [
  {
    icon: Fingerprint,
    title: 'HASN 0.3 协议',
    body: '定义人、Agent、主人归属、关系、消息和协作边界。Schema 已冻结并可校验，仍为 Public Draft。',
    status: '当前基础',
  },
  {
    icon: Laptop,
    title: '本地优先 hasn-node',
    body: '对话、记忆与本地产物优先落在用户设备；云端不会默认接管本地原件。',
    status: '当前基础',
  },
  {
    icon: BrainCircuit,
    title: 'Agent / Runtime 解耦',
    body: 'Agent 保存长期身份、记忆、关系和授权；Runtime 负责执行。替换引擎不必重新创建分身。',
    status: '当前基础',
  },
  {
    icon: RefreshCw,
    title: 'LFRT / SWR / WSPUSH',
    body: '读取优先命中本地镜像，云端刷新在后台完成，以 freshness 信封和失效通知保持一致。',
    status: '当前基础',
  },
  {
    icon: Wrench,
    title: '渐进式 MCP 工具发现',
    body: '分身按意图搜索并加载需要的工具，经过 scope 过滤后暴露能力，减少上下文与配置负担。',
    status: '当前基础',
  },
  {
    icon: Radio,
    title: '透明 A2A / A2H / H2A',
    body: '分身与人、分身与分身的通信对主人可见，以提问卡、审批、接管和审计约束自动化边界。',
    status: '持续完善',
  },
  {
    icon: LockKeyhole,
    title: '客户端加密的同步与分享',
    body: '产物在客户端加密，内容密钥分别封装给授权设备和指定接收者，云端平台只中转密文。',
    status: '目标能力',
  },
]

const encryptionFlow: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  { icon: AppWindow, title: '本地生成', desc: '业务和产物在 hasn-node 执行与生成' },
  { icon: KeyRound, title: '客户端加密', desc: '生成随机内容密钥并加密产物' },
  { icon: Users, title: '密钥授权', desc: '为授权设备或指定接收者封装密钥' },
  { icon: Cloud, title: '密文同步', desc: '云端保存密文、密钥信封与最小元数据' },
  { icon: ShieldCheck, title: '本地解密', desc: '接收方在自己的设备解封并查看' },
]

const securityRules = [
  '云端平台不接收产物明文，不为产物建立明文索引，也不调用模型分析产物',
  '用户没有主动开启同步或分享时，产物原件只留在生成设备',
  '设备私钥保存在系统安全存储，不随密文上传',
  '撤销授权阻止后续访问，不能收回接收者已经保存或解密的副本',
] as const

const competitorRows = [
  ['WorkBuddy', '办公交付、专家协作、企业治理和渠道', '直接竞品，也可能成为执行能力伙伴'],
  ['千问', '超级入口、支付、订单、履约与多终端生态', '平台与流量层的重要参照'],
  ['Claude Code / Codex / OpenClaw', '代码、终端、本地设备与专业执行', '可以成为分身的 Runtime、工具或执行能力'],
  ['MCP / A2A / AgentOps', '工具标准、互操作协议与企业治理', 'HASN 兼容并利用这些能力，不重复造轮子'],
  ['唤星', '长期 Agent 身份、主人责任链、跨应用工作归属', '聚焦不同主人数字员工之间的协作网络'],
] as const

const faqs = [
  ['HASN 和 MCP、A2A 是什么关系？', 'MCP 解决工具连接，A2A 解决 Agent 互操作；HASN 关注有主人 Agent 的身份、关系、通信透明和责任归属。'],
  ['HASN 现在是否已经是稳定开放标准？', '不是。当前是 HASN 0.3 Public Draft，Schema 已冻结，但真实第三方互操作门尚未完成。'],
  ['公开 SDK 是否已经可以使用？', '当前存在内部契约和真实 HTTP 接入基础，正式公开 SDK、文档与开发者沙箱仍在建设。'],
  ['分身的数据保存在哪里？', '对话、记忆和产物优先保存在用户设备。当前只有用户明确授权的数据会进入私有云存储；客户端端到端加密仍是目标能力。'],
  ['唤星云端平台能看到被分享的产物吗？', '当前版本依靠私有存储、服务端加密、ACL 与短期签名链接保护访问，尚不是云端不可解密的端到端加密。目标能力完成后，云端平台将不持有产物解密私钥。'],
  ['为什么要把 Agent 和 Runtime 分开？', '模型和执行引擎会快速变化，而身份、记忆、关系和责任需要长期稳定。'],
] as const

export default function Tech() {
  return (
    <>
      <PageHero
        titleHighlight="数字员工真正进入社会"
        title="需要的不只是更强的模型"
        subtitle="唤星从身份、责任、运行、应用和网络五个层面重建 Agent 底座。业务在节点执行，云端平台只协调身份、授权和数据同步。"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#architecture"
            className="rounded-lg bg-star-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-star-purple-hover"
          >
            查看技术架构
          </a>
          <Link
            to="/download"
            className="rounded-lg border border-divider bg-space-panel px-6 py-3 font-semibold text-text-primary transition-colors hover:border-border-hover"
          >
            下载桌面端
          </Link>
        </div>
        <p className="mt-6 text-sm text-text-tertiary">面向技术人员 · 生态伙伴 · 投资人</p>
      </PageHero>

      <section id="industry-gap" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeading
              label="行业缺口"
              title="执行层已经被验证，身份与协作层仍然缺位"
              description="WorkBuddy、千问办公已经证明 Agent 能够规划任务、使用工具并交付成果；MCP、A2A 和 AgentOps 也分别推进了工具接入、互操作和企业治理。下一阶段的问题，是 Agent 进入真实关系以后代表谁、由谁负责，以及能否持续存在。"
            />
          </ScrollReveal>
          <ol className="divide-y divide-divider border-y border-divider">
            {missingLayerQuestions.map((question, index) => (
              <ScrollReveal key={question} delay={index * 0.05}>
                <li className="grid gap-3 py-6 md:grid-cols-[72px_1fr] md:items-center">
                  <span className="text-sm font-semibold tabular-nums text-star-purple">0{index + 1}</span>
                  <p className="text-lg font-medium leading-7 text-text-primary">{question}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="architecture" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeading label="架构骨架" title="五层契约，让身份、执行和协作各归其位" />
          </ScrollReveal>
          <div className="space-y-3">
            {architectureLayers.map(([level, title, desc], index) => (
              <ScrollReveal key={level} delay={index * 0.06}>
                <article className="grid gap-4 rounded-xl border border-divider bg-space-panel p-6 md:grid-cols-[72px_220px_1fr] md:items-center md:gap-8">
                  <span className="text-2xl font-bold text-star-purple">{level}</span>
                  <h3 className="font-semibold text-text-primary">{title}</h3>
                  <p className="text-base leading-7 text-text-secondary">{desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="mt-8 grid gap-4 rounded-2xl border border-divider bg-space-panel p-6 text-sm leading-6 md:grid-cols-3 md:p-8">
              <p><span className="font-semibold text-text-primary">当前：</span><span className="text-text-secondary">桌面端、身份与消息底座、第一方应用闭环。</span></p>
              <p><span className="font-semibold text-text-primary">建设中：</span><span className="text-text-secondary">客户端加密同步、公开 SDK、真实第三方接入。</span></p>
              <p><span className="font-semibold text-text-primary">协议：</span><span className="text-text-secondary">HASN 0.3 Public Draft。</span></p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="implementations" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeading label="关键实现" title="从协议到执行的七项技术选择" description="每一项都对应一个明确问题，并标注当前成熟度，不把目标架构包装成已上线能力。" />
          </ScrollReveal>
          <div className="divide-y divide-divider border-y border-divider">
            {implementations.map((item, index) => {
              const Icon = item.icon
              return (
                <ScrollReveal key={item.title} delay={index * 0.04}>
                  <article className="grid gap-5 py-7 md:grid-cols-[56px_240px_1fr_96px] md:items-center md:gap-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-star-purple/10 text-star-purple">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-base leading-7 text-text-secondary">{item.body}</p>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${item.status === '目标能力' ? 'bg-space-float text-text-secondary' : 'bg-star-purple/10 text-star-purple'}`}>
                      {item.status}
                    </span>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="data-security" className="relative z-10 overflow-hidden bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <SectionHeading
              label="本地优先的数据与密钥流"
              title="云端平台是同步中枢，不是业务执行层"
              description="目标架构让云端完成跨设备和跨主人的可靠同步，同时不读取产物内容。它与当前安全基线严格分开描述。"
            />
          </ScrollReveal>

          <div className="grid gap-3 md:grid-cols-5">
            {encryptionFlow.map((step, index) => {
              const Icon = step.icon
              return (
                <ScrollReveal key={step.title} delay={index * 0.07}>
                  <article className="relative h-full rounded-xl border border-divider bg-space-panel p-5">
                    <Icon aria-hidden="true" className="mb-8 h-6 w-6 text-star-purple" />
                    <h3 className="mb-2 font-semibold text-text-primary">{step.title}</h3>
                    <p className="text-sm leading-6 text-text-secondary">{step.desc}</p>
                    {index < encryptionFlow.length - 1 && (
                      <ArrowRight aria-hidden="true" className="absolute -right-3 top-8 z-10 hidden h-5 w-5 rounded-full bg-space-black text-text-tertiary md:block" />
                    )}
                  </article>
                </ScrollReveal>
              )
            })}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ScrollReveal>
              <article className="h-full rounded-2xl border border-divider bg-space-panel p-7 md:p-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-text-primary">当前安全基线</h3>
                  <span className="rounded-full bg-star-purple/10 px-3 py-1 text-xs font-semibold text-star-purple">已采用</span>
                </div>
                <p className="text-base leading-7 text-text-secondary">
                  本地原件默认不上传；用户明确授权后，对象进入私有存储，并由服务端加密、资源 ACL 和短期签名链接保护访问。当前不能承诺云端无法解密。
                </p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <article className="h-full rounded-2xl border border-star-purple/30 bg-star-purple/5 p-7 md:p-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-text-primary">客户端端到端加密（目标能力）</h3>
                  <span className="rounded-full bg-space-float px-3 py-1 text-xs font-semibold text-text-secondary">建设中</span>
                </div>
                <p className="text-base leading-7 text-text-secondary">
                  产物先在客户端完成认证加密，内容密钥按设备和接收者分别封装；云端平台只保存密文、密钥信封和最小授权元数据，不持有解密私钥。
                </p>
              </article>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <p className="mt-10 text-sm font-semibold text-star-purple">目标能力验收边界</p>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {securityRules.map((rule) => (
                <li key={rule} className="flex gap-3 text-sm leading-6 text-text-secondary">
                  <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-star-purple" />
                  {rule}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <section id="cloud-node" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeading
              label="云端节点架构"
              title="云端节点是主人的第 N 台设备"
              description="云端节点不是阉割 Runtime，而是一台完整、受主人授权的无头 hasn-node。它能执行任务；唤星云端平台仍然只承担同步与协调。"
            />
          </ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <ScrollReveal>
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-divider bg-space-panel p-8">
                <div className="grid w-full max-w-md grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="rounded-xl border border-divider bg-space-float p-5 text-center">
                    <Laptop aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-star-purple" />
                    <p className="font-semibold text-text-primary">本机 hasn-node</p>
                    <p className="mt-1 text-xs text-text-secondary">完整设备</p>
                  </div>
                  <Network aria-hidden="true" className="h-6 w-6 text-text-tertiary" />
                  <div className="rounded-xl border border-star-purple/40 bg-star-purple/5 p-5 text-center">
                    <Server aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-star-purple" />
                    <p className="font-semibold text-text-primary">云端 hasn-node</p>
                    <p className="mt-1 text-xs text-text-secondary">主人的另一台设备</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="divide-y divide-divider border-y border-divider">
                {[
                  '运行完整 daemon、引擎管理和多设备协议，可安装引擎、调用应用并生成内容',
                  'daemon 不直接暴露公网，外部访问只经过统一 edge',
                  '使用独立设备身份，不把主人 Token 注入容器',
                  '每台云端设备可以单独授权、单独吊销',
                  '在线状态以真实 Presence 为准，不以容器运行制造假在线',
                ].map((item) => (
                  <div key={item} className="flex gap-4 py-5">
                    <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-star-purple" />
                    <p className="text-base leading-7 text-text-secondary">{item}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="competition" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeading
              label="竞争位置"
              title="不重复制造执行器，而是上移到身份、责任和网络"
              description="唤星不宣称本地文件、MCP、多 Agent、企业审计或私有化是独占能力。差异在于这些能力如何持续归属于一个有主人的数字员工，并进入跨主体关系。"
            />
          </ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-divider bg-space-panel">
            {competitorRows.map(([name, strength, relation], index) => (
              <div key={name} className={`grid gap-3 p-6 md:grid-cols-[220px_1fr_1fr] md:gap-8 ${index < competitorRows.length - 1 ? 'border-b border-divider' : ''} ${name === '唤星' ? 'bg-star-purple/5' : ''}`}>
                <h3 className={`font-semibold ${name === '唤星' ? 'text-star-purple' : 'text-text-primary'}`}>{name}</h3>
                <p className="text-sm leading-6 text-text-secondary">{strength}</p>
                <p className="text-sm leading-6 text-text-secondary">{relation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="moat" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <SectionHeading label="长期壁垒" title="护城河不是代码量，而是持续沉淀的身份、关系和工作资产" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ol className="space-y-3">
              {['架构差异', '用户持续使用', '跨主人协作密度', '身份、关系与工作资产', '第三方供给', '网络效应'].map((step, index) => (
                <li key={step} className="flex items-center gap-4 rounded-xl border border-divider bg-space-panel px-5 py-4">
                  <span className="text-sm font-semibold tabular-nums text-star-purple">0{index + 1}</span>
                  <span className="font-medium text-text-primary">{step}</span>
                  {index < 5 && <ArrowDown aria-hidden="true" className="ml-auto h-4 w-4 text-text-tertiary" />}
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      <section id="open-status" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeading label="开放状态" title="开放，但不提前宣布成熟" description="协议、应用接入和 Runtime 扩展分别说明已经具备什么、正在建设什么。" />
          </ScrollReveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-divider bg-divider md:grid-cols-3">
            {[
              { icon: Code2, title: '协议', body: 'HASN 0.3 已形成 Public Draft 和可校验 Schema，稳定标准仍需外部互操作验证。' },
              { icon: Boxes, title: '应用接入', body: '第一方应用已验证统一契约与真实 HTTP 接缝；公开 SDK 和第三方生产接入正在建设。' },
              { icon: Database, title: 'Runtime 接入', body: '不同 Agent 引擎通过 RuntimeAdapter 挂载到长期分身身份之下。' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="bg-space-panel p-7">
                  <Icon aria-hidden="true" className="mb-6 h-7 w-7 text-star-purple" />
                  <h3 className="mb-3 text-lg font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-base leading-7 text-text-secondary">{item.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="tech-faq" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <SectionHeading center label="技术 FAQ" title="把边界说清楚，比把口号说满更重要" />
          </ScrollReveal>
          <div className="space-y-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-xl border border-divider bg-space-panel open:border-star-purple/40">
                <summary className="flex list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-text-primary">
                  {question}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-star-purple transition-transform group-open:rotate-90" />
                </summary>
                <p className="border-t border-divider px-6 py-5 text-base leading-7 text-text-secondary">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SectionCTA
        title="一起建设数字员工网络的下一阶段"
        subtitle="从一个真正属于用户的分身开始，让身份、应用、设备和协作关系在同一套稳定契约上持续运转。"
        buttonText="下载桌面端"
        buttonHref="/download"
      />
    </>
  )
}
