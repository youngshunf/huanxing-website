import {
  Rocket, RefreshCw, CheckCircle2, Clock, Circle, Lightbulb, FileText,
  BookOpen, Code2, Target, Palette, Image, Presentation, Globe, Video, Megaphone,
  Database, Calendar, PenTool, MessageSquare, Sparkles,
} from 'lucide-react'
import SceneDetailView, { type SceneDetailData } from '../../components/scenes/SceneDetailView'

// 场景详情 · 一人公司（旗舰·8 环）—— 1:1 移植原型「场景-一人公司-原型.html」
const DATA: SceneDetailData = {
  theme: 'brand',
  crumb: ['场景', '一人公司', 'AI 宠物陪伴'],
  artifactCount: 9,
  headerIcon: Rocket,
  badge: '一人公司 · 场景',
  title: 'AI 宠物陪伴',
  goal: '把「给独居年轻人做一个 AI 宠物陪伴产品」这个想法，一个人跑通成一家公司：调研 → 方案 → 品牌 → 产品 → 运营 → 获客。',
  relay: { defaultOn: true, desc: '每环完成自动派下一环，遇到要你决策的节点会停下等你。' },
  progress: { done: 3, total: 8, pct: 44, currentBold: '④ 品牌与设计系统', currentSuffix: ' · 待你决策' },
  chain: [
    { label: '想法立项', status: '已完成', state: 'done', num: 1 },
    { label: '市场调研', status: '已完成', state: 'done', num: 2 },
    { label: '方案设计', status: '已完成', state: 'done', num: 3 },
    { label: '品牌与设计系统', status: '待你决策', state: 'active', num: 4 },
    { label: '品牌资产 / 官方建设', status: '未开始', state: 'next', num: 5 },
    { label: '产品研发', status: '未开始', state: 'idle', num: 6 },
    { label: '内容运营', status: '未开始', state: 'idle', num: 7 },
    { label: '获客增长', status: '未开始', state: 'idle', num: 8 },
  ],
  stages: [
    {
      numeral: '①', num: 1, name: '想法立项', state: 'done',
      pill: { cls: 'pill-done', label: '已完成', icon: CheckCircle2 },
      desc: '你说出一个想法，场景据此启动，并把它作为整条链路的起点。',
      flow: {
        single: true,
        output: {
          label: '产出',
          items: [{ icon: Lightbulb, tone: 't-amber', title: '想法陈述：给独居年轻人的 AI 宠物陪伴', meta: '起点 · 你于 7 月 6 日录入', go: true }],
        },
      },
    },
    {
      numeral: '②', num: 2, name: '市场调研', state: 'done',
      pill: { cls: 'pill-done', label: '已完成', icon: CheckCircle2 },
      desc: '派调研分身去做市场分析、竞品分析、行业地图，全部沉淀进知识库，作为后续每一环的事实底座。',
      agent: {
        role: '负责分身', char: '顾', tone: 't-teal', name: '顾行', prof: '市场研究专家', verb: '调用',
        apps: [{ icon: BookOpen, tone: 't-brand', label: '知识库' }, { icon: Database, tone: 't-orange', label: '企业线索' }],
      },
      flow: {
        upstream: { label: '上游产物', items: [{ icon: Lightbulb, tone: 't-amber', title: '想法陈述', meta: '来自 ① 想法立项' }] },
        output: {
          label: '产出 → 知识库',
          items: [
            { icon: FileText, tone: 't-brand', title: '市场分析报告', meta: '知识库文档 · 约 6,200 字', go: true },
            { icon: FileText, tone: 't-brand', title: '竞品分析：5 家对手拆解', meta: '知识库文档 · 含定价/功能矩阵', go: true },
            { icon: BookOpen, tone: 't-brand', title: '行业地图 v1', meta: '知识库合集 · 12 篇资料', go: true },
          ],
        },
      },
    },
    {
      numeral: '③', num: 3, name: '方案设计', state: 'done',
      pill: { cls: 'pill-done', label: '已完成', icon: CheckCircle2 },
      desc: '派产品战略分身读知识库，产出落地方案、技术选型与产品 PRD，并把里程碑拆进规划。',
      agent: {
        role: '负责分身', char: '周', tone: 't-brand', name: '周策', prof: '产品战略专家', verb: '调用',
        apps: [{ icon: BookOpen, tone: 't-brand', label: '知识库' }, { icon: Calendar, tone: 't-indigo', label: '规划' }],
      },
      flow: {
        upstream: {
          label: '上游产物',
          items: [
            { icon: FileText, tone: 't-brand', title: '市场分析报告', meta: '来自 ② 市场调研' },
            { icon: FileText, tone: 't-brand', title: '竞品分析', meta: '来自 ② 市场调研' },
          ],
        },
        output: {
          label: '产出',
          items: [
            { icon: FileText, tone: 't-brand', title: '落地方案 v2', meta: '知识库文档 · 商业模式 + 打法', go: true },
            { icon: Code2, tone: 't-brand', title: '技术选型清单 + 产品 PRD', meta: '知识库文档 · 供研发环引用', go: true },
            { icon: Target, tone: 't-indigo', title: '目标：6 个月 MVP 上线', meta: '规划 · 已拆 4 个里程碑', go: true },
          ],
        },
      },
    },
    {
      numeral: '④', num: 4, name: '品牌与设计系统', state: 'active',
      pill: { cls: 'pill-wait', label: '待你决策', icon: Clock },
      desc: '派设计师分身依据知识库里的品牌调性与受众画像，用「设计系统」应用产出一套可复用的品牌设计规范（配色、字体、组件），供后面的官网、产品、内容统一取用。',
      agent: {
        role: '负责分身', char: '林', tone: 't-pink', name: '林墨', prof: '品牌设计专家', verb: '调用',
        apps: [{ icon: Palette, tone: 't-agent', label: '设计系统' }],
      },
      flow: {
        upstream: {
          label: '上游产物',
          items: [
            { icon: FileText, tone: 't-brand', title: '市场分析（品牌调性 / 受众）', meta: '来自 ② 市场调研' },
            { icon: FileText, tone: 't-brand', title: '落地方案 v2（定位）', meta: '来自 ③ 方案设计' },
          ],
        },
        output: {
          label: '将产出',
          items: [{ icon: Palette, tone: 't-agent', title: 'AI宠伴 · 品牌设计系统', meta: '待派发 · hasn://designsystem/…', pending: true }],
        },
      },
      decision: {
        title: '林墨已读完知识库，备好三套品牌基调，等你选一个再开工',
        detail: '这是链路上的「决策节点」，自动接力会在这里停下。选定后分身据此产出完整设计系统。',
        choices: [
          { color: '#2563eb', label: '科技蓝 · 可信克制' },
          { color: '#f97316', label: '暖橙 · 亲和陪伴' },
          { color: '#10b981', label: '薄荷绿 · 治愈轻盈' },
        ],
      },
      actions: {
        primary: { label: '选定基调，派林墨开工', icon: Sparkles },
        secondaries: [{ label: '先和林墨聊聊', icon: MessageSquare }],
        hint: { label: '选定后自动接力，继续推进第 5 环', icon: RefreshCw },
      },
    },
    {
      numeral: '⑤', num: 5, name: '品牌资产 / 官方建设', state: 'idle',
      pill: { cls: 'pill-idle', label: '未开始', icon: Circle },
      desc: '用知识库内容 + 上一环的设计系统，产出 Logo、VI、官网视觉稿与品牌手册——所有资产共用同一套规范，不跑偏。',
      agent: {
        role: '默认分身', char: '林', tone: 't-pink', name: '林墨', prof: '品牌设计专家', verb: '将调用',
        apps: [
          { icon: PenTool, tone: 't-agent', label: '矢量设计' },
          { icon: Image, tone: 't-sky', label: '图坊' },
          { icon: Presentation, tone: 't-orange', label: '演示文稿' },
        ],
      },
      actions: { hint: { label: '等第 4 环产出设计系统后解锁。上游就绪即可派发，或开启自动接力自动进入。', icon: Clock } },
    },
    {
      numeral: '⑥', num: 6, name: '产品研发', state: 'idle',
      pill: { cls: 'pill-idle', label: '未开始', icon: Circle },
      desc: '派研发工程师分身，拿产品 PRD + 设计系统，用「建站发布」把官网 / 落地页真正构建并上线（App、小程序列入路线图）。',
      agent: {
        role: '默认分身', char: '阿', tone: 't-slate', name: '阿码', prof: '全栈研发工程师', verb: '将调用',
        apps: [{ icon: Globe, tone: 't-green', label: '建站发布' }],
      },
      actions: { hint: { label: '依赖 ③ PRD 与 ④ 设计系统，就绪后可派发。', icon: Clock } },
    },
    {
      numeral: '⑦', num: 7, name: '内容运营', state: 'idle',
      pill: { cls: 'pill-idle', label: '未开始', icon: Circle },
      desc: '派内容运营官，围绕产品与品牌，用「创作运营 + 短视频 + 视频工作室」持续产出自媒体内容矩阵并发布。',
      agent: {
        role: '默认分身', char: '小', tone: 't-pink', name: '小媒', prof: '内容运营官', verb: '将调用',
        apps: [{ icon: Megaphone, tone: 't-pink', label: '创作运营' }, { icon: Video, tone: 't-rose', label: '短视频' }],
      },
      actions: { hint: { label: '产品与品牌就绪后启动，把它们变成能传播的内容。', icon: Clock } },
    },
    {
      numeral: '⑧', num: 8, name: '获客增长', state: 'idle',
      pill: { cls: 'pill-idle', label: '未开始', icon: Circle },
      desc: '派销售顾问，用「获客」应用把内容与产品带来的关注变成线索、触达和转化——链路闭环，从想法真正走到有客户。',
      agent: {
        role: '默认分身', char: '雷', tone: 't-orange', name: '雷宇', prof: '销售顾问', verb: '将调用',
        apps: [{ icon: Target, tone: 't-orange', label: '获客' }],
      },
      actions: { hint: { label: '链路终点。产出线索与转化后，可回流复盘、迭代整条链。', icon: Clock } },
    },
  ],
}

export default function SoloCompanyScene() {
  return <SceneDetailView data={DATA} />
}
