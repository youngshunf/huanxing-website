import {
  TrendingUp, RefreshCw, Check, CheckCircle2, Clock, Circle, FlaskConical, FileText,
  BookOpen, BarChart3, Database, Calendar, Presentation, Megaphone, Users, Monitor, MessageSquare,
} from 'lucide-react'
import SceneDetailView, { type SceneDetailData } from '../../components/scenes/SceneDetailView'

// 场景详情 · 金融投研（第二域·7 环）—— 1:1 移植原型「场景-金融投研-原型.html」，teal 主题证明跨领域复用
const DATA: SceneDetailData = {
  theme: 'teal',
  crumb: ['场景', '金融投研', '新能源龙头 · 投研专题'],
  artifactCount: 11,
  headerIcon: TrendingUp,
  badge: '金融投研 · 场景',
  title: '新能源龙头 · 投研专题',
  goal: '从「新能源还能不能上车」这个问题出发，采行情、做调研、设策略、跑回测，最后产出一份可交易的研报并分发。',
  relay: { defaultOn: true, desc: '前四环已连贯自动跑通，当前正在回测。' },
  progress: { done: 4, total: 7, pct: 64, currentBold: '⑤ 量化回测', currentSuffix: ' · 分身工作中' },
  chain: [
    { label: '研究命题', status: '已完成', state: 'done', num: 1 },
    { label: '行情采集', status: '已完成', state: 'done', num: 2 },
    { label: '基本面与舆情调研', status: '已完成', state: 'done', num: 3 },
    { label: '策略设计', status: '已完成', state: 'done', num: 4 },
    { label: '量化回测', status: '分身工作中', state: 'active', num: 5 },
    { label: '研报产出', status: '未开始', state: 'next', num: 6 },
    { label: '观点分发', status: '未开始', state: 'idle', num: 7 },
  ],
  stages: [
    {
      numeral: '①', num: 1, name: '研究命题', state: 'done',
      pill: { cls: 'pill-done', label: '已完成', icon: CheckCircle2 },
      desc: '你抛出一个待研究的判断问题，场景据此启动，作为整条投研链的锚点。',
      flow: {
        single: true,
        output: {
          label: '产出',
          items: [{ icon: FlaskConical, tone: 't-teal', title: '研究命题：新能源龙头当前是否具备配置价值', meta: '起点 · 你于 7 月 9 日录入', go: true }],
        },
      },
    },
    {
      numeral: '②', num: 2, name: '行情采集', state: 'done',
      pill: { cls: 'pill-done', label: '已完成', icon: CheckCircle2 },
      desc: '派投研分析师用「金融行情」应用拉取板块行情、估值分位与资金流向，形成量化底座数据。',
      agent: {
        role: '负责分身', char: '祁', tone: 't-teal', name: '祁云', prof: '投研分析师', verb: '调用',
        apps: [{ icon: BarChart3, tone: 't-teal', label: '金融行情' }],
      },
      flow: {
        upstream: { label: '上游产物', items: [{ icon: FlaskConical, tone: 't-teal', title: '研究命题', meta: '来自 ① 研究命题' }] },
        output: {
          label: '产出',
          items: [
            { icon: Database, tone: 't-teal', title: '板块行情快照 + 估值分位表', meta: '数据产物 · 近 5 年 PE/PB 分位', go: true },
            { icon: Database, tone: 't-teal', title: '资金流向与龙头日线数据', meta: '数据产物 · 供回测环取用', go: true },
          ],
        },
      },
    },
    {
      numeral: '③', num: 3, name: '基本面与舆情调研', state: 'done',
      pill: { cls: 'pill-done', label: '已完成', icon: CheckCircle2 },
      desc: '派投研分析师拆解龙头财报、梳理产业链、汇总舆情，全部沉淀进知识库，为策略与研报提供依据。',
      agent: {
        role: '负责分身', char: '祁', tone: 't-teal', name: '祁云', prof: '投研分析师', verb: '调用',
        apps: [{ icon: BookOpen, tone: 't-brand', label: '知识库' }, { icon: Database, tone: 't-orange', label: '企业线索' }],
      },
      flow: {
        upstream: { label: '上游产物', items: [{ icon: Database, tone: 't-teal', title: '板块行情快照', meta: '来自 ② 行情采集' }] },
        output: {
          label: '产出 → 知识库',
          items: [
            { icon: FileText, tone: 't-brand', title: '龙头财报拆解（3 家）', meta: '知识库文档 · 盈利/现金流', go: true },
            { icon: BookOpen, tone: 't-brand', title: '产业链地图 + 舆情摘要', meta: '知识库合集 · 供研报引用', go: true },
          ],
        },
      },
    },
    {
      numeral: '④', num: 4, name: '策略设计', state: 'done',
      pill: { cls: 'pill-done', label: '已完成', icon: CheckCircle2 },
      desc: '派量化交易员，结合调研结论与行情数据，设计「均线趋势 × 基本面过滤」策略假设与因子清单。',
      agent: {
        role: '负责分身', char: '秦', tone: 't-indigo', name: '秦度', prof: '量化交易员', verb: '调用',
        apps: [{ icon: BookOpen, tone: 't-brand', label: '知识库' }, { icon: Calendar, tone: 't-indigo', label: '规划' }],
      },
      flow: {
        upstream: {
          label: '上游产物',
          items: [
            { icon: FileText, tone: 't-brand', title: '龙头财报拆解', meta: '来自 ③ 调研' },
            { icon: Database, tone: 't-teal', title: '龙头日线数据', meta: '来自 ② 行情采集' },
          ],
        },
        output: {
          label: '产出',
          items: [
            { icon: FlaskConical, tone: 't-indigo', title: '策略假设：均线趋势 × 基本面过滤', meta: '供回测环执行', go: true },
            { icon: FileText, tone: 't-indigo', title: '因子清单 v1', meta: '知识库文档 · 6 个因子', go: true },
          ],
        },
      },
    },
    {
      numeral: '⑤', num: 5, name: '量化回测', state: 'active',
      pill: { cls: 'pill-run teal', label: '分身工作中', icon: RefreshCw },
      desc: '量化交易员用「量化」应用，把策略假设放到历史行情上回测，输出年化、回撤、夏普与分年度表现。',
      agent: {
        role: '负责分身', char: '秦', tone: 't-indigo', name: '秦度', prof: '量化交易员', verb: '调用',
        apps: [{ icon: BarChart3, tone: 't-indigo', label: '量化' }],
      },
      flow: {
        upstream: {
          label: '上游产物',
          items: [
            { icon: FlaskConical, tone: 't-indigo', title: '策略假设', meta: '来自 ④ 策略设计' },
            { icon: Database, tone: 't-teal', title: '龙头日线数据', meta: '来自 ② 行情采集' },
          ],
        },
        output: {
          label: '将产出',
          items: [{ icon: BarChart3, tone: 't-indigo', title: '回测报告（初值：年化 23.4% · 回撤 11%）', meta: '生成中 · hasn://quant/…', pending: true }],
        },
      },
      working: {
        title: '秦度正在回测「均线趋势 × 基本面过滤」策略…',
        steps: [
          { label: '载入 2019–2026 日线', icon: Check, state: 'done' },
          { label: '因子计算', icon: Check, state: 'done' },
          { label: '分年度回测中', icon: RefreshCw, state: 'now' },
          { label: '稳健性检验', icon: Circle, state: 'later' },
        ],
      },
      actions: {
        secondaries: [{ label: '查看实时进度', icon: Monitor }, { label: '接管 · 和秦度说', icon: MessageSquare }],
        hint: { label: '回测完成后自动接力，派祁云写研报', icon: RefreshCw },
      },
    },
    {
      numeral: '⑥', num: 6, name: '研报产出', state: 'idle',
      pill: { cls: 'pill-idle', label: '未开始', icon: Circle },
      desc: '派投研分析师，把调研结论与回测数据整合成投研报告，并用「演示文稿」出一份路演版。',
      agent: {
        role: '默认分身', char: '祁', tone: 't-teal', name: '祁云', prof: '投研分析师', verb: '将调用',
        apps: [{ icon: BookOpen, tone: 't-brand', label: '知识库' }, { icon: Presentation, tone: 't-orange', label: '演示文稿' }],
      },
      actions: { hint: { label: '等第 5 环回测报告就绪后启动，把数据变成结论。', icon: Clock } },
    },
    {
      numeral: '⑦', num: 7, name: '观点分发', state: 'idle',
      pill: { cls: 'pill-idle', label: '未开始', icon: Circle },
      desc: '派内容运营官，把研报要点做成可传播的观点内容，通过创作运营与社区分发出去——投研闭环。',
      agent: {
        role: '默认分身', char: '小', tone: 't-pink', name: '小媒', prof: '内容运营官', verb: '将调用',
        apps: [{ icon: Megaphone, tone: 't-pink', label: '创作运营' }, { icon: Users, tone: 't-brand', label: '社区' }],
      },
      actions: { hint: { label: '链路终点。分发后可回流阅读/互动数据，迭代下一期专题。', icon: Clock } },
    },
  ],
}

export default function FinanceResearchScene() {
  return <SceneDetailView data={DATA} />
}
