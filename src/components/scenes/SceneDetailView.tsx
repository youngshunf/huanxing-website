import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass, RefreshCw, PenTool, Users, Folder, MoreHorizontal,
  Check, ChevronRight, ArrowRight, Sparkles, Bot, Hand,
  type LucideIcon,
} from 'lucide-react'
import Ic from './Ic'
import '../../pages/scenes/scenes.css'

// 场景详情通用视图 —— 1:1 移植原型「一人公司 / 金融投研」详情页结构：
// 面包屑 → 场景头(自动接力开关) → 进度条 → 链路地图 → 阶段卡(负责分身 + 产物流 + 决策/工作中/操作)。
// 数据驱动，两条链共用；去掉原型左侧导航栏，复用站点顶栏。

export interface Res {
  icon: LucideIcon
  tone: string
  title: string
  meta: string
  pending?: boolean
  go?: boolean
}
export interface Flow {
  single?: boolean
  upstream?: { label: string; items: Res[] }
  output: { label: string; items: Res[] }
}
export interface AppChip { icon: LucideIcon; tone: string; label: string }
export interface AgentBlock {
  role: string
  char: string
  tone: string
  name: string
  prof: string
  verb: string
  apps: AppChip[]
}
export interface StageActions {
  primary?: { label: string; icon: LucideIcon }
  secondaries?: { label: string; icon: LucideIcon }[]
  hint?: { label: string; icon: LucideIcon }
}
export interface Stage {
  numeral: string
  num: number
  name: string
  state: 'done' | 'active' | 'idle'
  pill: { cls: string; label: string; icon: LucideIcon }
  desc: string
  agent?: AgentBlock
  flow?: Flow
  decision?: { title: string; detail: string; choices: { color: string; label: string }[] }
  working?: { title: string; steps: { label: string; icon: LucideIcon; state: 'done' | 'now' | 'later' }[] }
  actions?: StageActions
}
export interface SceneDetailData {
  theme: 'brand' | 'teal'
  crumb: [string, string, string]
  artifactCount: number
  headerIcon: LucideIcon
  badge: string
  title: string
  goal: string
  relay: { defaultOn: boolean; desc: string }
  progress: { done: number; total: number; pct: number; currentBold: string; currentSuffix: string }
  chain: { label: string; status: string; state: 'done' | 'active' | 'next' | 'idle'; num: number }[]
  stages: Stage[]
}

function ResCard({ res }: { res: Res }) {
  return (
    <div className={`rescard${res.pending ? ' pending' : ''}`}>
      <span className={`ri ${res.tone}`}><Ic icon={res.icon} /></span>
      <div className="rc">
        <div className="rt">{res.title}</div>
        <div className="rm">{res.meta}</div>
      </div>
      {res.go && <Ic icon={ChevronRight} className="go" />}
    </div>
  )
}

function FlowView({ flow, teal }: { flow: Flow; teal: boolean }) {
  if (flow.single) {
    return (
      <div className="flow single">
        <div className={`flow-col out${teal ? ' teal' : ''}`}>
          <div className="flow-lb"><Ic icon={Sparkles} />{flow.output.label}</div>
          {flow.output.items.map((r, i) => <ResCard key={i} res={r} />)}
        </div>
      </div>
    )
  }
  return (
    <div className="flow">
      <div className="flow-col">
        <div className="flow-lb"><Ic icon={ArrowRight} />{flow.upstream?.label}</div>
        {flow.upstream?.items.map((r, i) => <ResCard key={i} res={r} />)}
      </div>
      <div className="flow-arrow"><Ic icon={ArrowRight} /></div>
      <div className={`flow-col out${teal ? ' teal' : ''}`}>
        <div className="flow-lb"><Ic icon={Sparkles} />{flow.output.label}</div>
        {flow.output.items.map((r, i) => <ResCard key={i} res={r} />)}
      </div>
    </div>
  )
}

function AgentRow({ agent }: { agent: AgentBlock }) {
  return (
    <div className="srow">
      <span className="rk">{agent.role}</span>
      <span className="agent-id">
        <span className={`av ${agent.tone}`}>{agent.char}</span>
        <div>
          <div className="top">
            <span className="nm">{agent.name}</span>
            <span className="tag-agent"><Ic icon={Bot} />AI分身</span>
          </div>
          <div className="prof">{agent.prof}</div>
        </div>
      </span>
      <span className="rk auto">{agent.verb}</span>
      {agent.apps.map((a, i) => (
        <span className="appchip" key={i}><span className={`ci ${a.tone}`}><Ic icon={a.icon} /></span>{a.label}</span>
      ))}
    </div>
  )
}

function StageCard({ stage, teal }: { stage: Stage; teal: boolean }) {
  const railInner = stage.state === 'done' ? <Ic icon={Check} /> : stage.num
  return (
    <div className={`card stage ${stage.state}${teal ? ' teal' : ''}`}>
      <div className="rail">
        <div className="num">{railInner}</div>
        <div className="thread" />
      </div>
      <div className="sbody">
        <div className="stage-hd">
          <span className="stage-nm">{stage.numeral} {stage.name}</span>
          <span className={`pill ${stage.pill.cls}`}><Ic icon={stage.pill.icon} />{stage.pill.label}</span>
        </div>
        <div className="stage-desc">{stage.desc}</div>
        {stage.agent && <AgentRow agent={stage.agent} />}
        {stage.flow && <FlowView flow={stage.flow} teal={teal} />}

        {stage.decision && (
          <div className="decision">
            <Ic icon={Hand} className="di" />
            <div>
              <div className="dt">{stage.decision.title}</div>
              <div className="dd">{stage.decision.detail}</div>
              <div className="choices">
                {stage.decision.choices.map((c, i) => (
                  <button className="choice" key={i}><span className="sw" style={{ background: c.color }} />{c.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage.working && (
          <div className="working">
            <div className="working-hd"><span className="spin" />{stage.working.title}</div>
            <div className="work-line"><i /></div>
            <div className="work-steps">
              {stage.working.steps.map((s, i) => (
                <span className={`wstep${s.state === 'now' ? ' now' : ''}${s.state === 'later' ? ' later' : ''}`} key={i}>
                  <Ic icon={s.icon} />{s.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {stage.actions && (
          <div className="stage-actions">
            {stage.actions.primary && (
              <button className={`btn ${teal ? 'btn-teal' : 'btn-primary'}`}>
                <Ic icon={stage.actions.primary.icon} />{stage.actions.primary.label}
              </button>
            )}
            {stage.actions.secondaries?.map((s, i) => (
              <button className="btn btn-secondary" key={i}><Ic icon={s.icon} />{s.label}</button>
            ))}
            {stage.actions.hint && (
              <span className="hint"><Ic icon={stage.actions.hint.icon} />{stage.actions.hint.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SceneDetailView({ data }: { data: SceneDetailData }) {
  const teal = data.theme === 'teal'
  const [relayOn, setRelayOn] = useState(data.relay.defaultOn)

  return (
    <div className="scenes-root">
      <div className="wrap detail">

        {/* 面包屑 */}
        <nav className={`crumb${teal ? ' teal' : ''}`}>
          <Link to="/scenes">{data.crumb[0]}</Link><span className="sep">/</span>
          <Link to="/scenes">{data.crumb[1]}</Link><span className="sep">/</span>
          <span className="cur">{data.crumb[2]}</span>
          <span style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm"><Ic icon={Folder} />产物册 · {data.artifactCount}</button>
          <button className="btn btn-ghost btn-sm"><Ic icon={MoreHorizontal} /></button>
        </nav>

        {/* 场景头 */}
        <div className="card">
          <div className="scene-head">
            <div className="sh-left">
              <div className={`sh-ic ${teal ? 't-teal' : 't-brand'}`}><Ic icon={data.headerIcon} /></div>
              <div>
                <span className={`sh-badge${teal ? ' teal' : ''}`}><Ic icon={Compass} />{data.badge}</span>
                <div className="sh-title">{data.title}</div>
                <div className="sh-goal">{data.goal}</div>
              </div>
            </div>
            <div className="sh-right">
              <div className={`relay${teal ? ' teal' : ''}`}>
                <div className="rx">
                  <div className="rt"><Ic icon={RefreshCw} />自动接力</div>
                  <div className="rd">{data.relay.desc}</div>
                </div>
                <button
                  className={`switch${teal ? ' teal' : ''}${relayOn ? '' : ' off'}`}
                  role="switch"
                  aria-checked={relayOn}
                  aria-label={`自动接力：${relayOn ? '开' : '关'}`}
                  onClick={() => setRelayOn((v) => !v)}
                />
              </div>
              <div className="sh-actions">
                <button className="btn btn-secondary btn-sm"><Ic icon={PenTool} />编辑链路</button>
                <button className="btn btn-secondary btn-sm"><Ic icon={Users} />分身团队</button>
              </div>
            </div>
          </div>
          <div className="sh-prog">
            <span className="prog-txt"><b>{data.progress.done}</b>/{data.progress.total} 环已完成</span>
            <div className="prog-track"><div className={`prog-fill${teal ? ' teal' : ''}`} style={{ width: `${data.progress.pct}%` }} /></div>
            <span className="prog-txt">当前 <b>{data.progress.currentBold}</b>{data.progress.currentSuffix}</span>
          </div>
        </div>

        {/* 链路地图 */}
        <div className="card mapwrap">
          <div className="mapscroll">
            <div className="chainmap">
              {data.chain.map((n, i) => (
                <div className={`cm-node ${n.state}${teal ? ' teal' : ''}`} key={i}>
                  <span className="cm-line" />
                  <div className="cm-circle">{n.state === 'done' ? <Ic icon={Check} /> : n.num}</div>
                  <div className="cm-label">{n.label}</div>
                  <div className="cm-status">{n.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 阶段卡列表 */}
        <div className="stages">
          {data.stages.map((s, i) => <StageCard key={i} stage={s} teal={teal} />)}
        </div>

      </div>
    </div>
  )
}
