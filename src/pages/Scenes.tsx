import PageHero from '../components/shared/PageHero'
import SceneDetail from '../components/scenes/SceneDetail'
import TargetUsers from '../components/scenes/TargetUsers'
import SectionCTA from '../components/shared/SectionCTA'

const scenes = [
  {
    icon: '📱', title: '自媒体赚钱',
    pains: ['选题枯竭，不知道写什么', '产出太慢，一篇内容要写半天', '不懂数据，不知道什么内容受欢迎'],
    solutions: ['实时追踪全网热点，自动推荐选题', '根据你的风格批量生成内容', '适配多平台一键发布', '自动分析数据，优化涨粉策略'],
    chatExample: [
      { role: 'ai' as const, text: '今天有个热点适合你的账号：「AI 时代普通人的赚钱机会」\n我已经写好了 3 条不同风格的内容，要看看吗？' },
      { role: 'user' as const, text: '看看第一条' },
      { role: 'ai' as const, text: '标题：《AI时代，普通人的3个翻身机会》\n\n开头用了你惯用的"讲故事"风格，预计完播率比上周平均高 15%。建议今天 18:30 发布，这是你粉丝最活跃的时段。' },
    ],
  },
  {
    icon: '💰', title: '投资理财',
    pains: ['信息过载，每天几百条财经新闻看不完', '分析耗时，一个标的要研究好几天', '容易错过时机，涨了才发现'],
    solutions: ['7×24 监控你关注的标的和市场动态', '自动分析财报、技术面、资金流向', '异常波动实时预警', '生成专业分析报告'],
    chatExample: [
      { role: 'ai' as const, text: '早盘速报：沪指高开 0.3%，AI 板块领涨。\n你关注的 3 只股票中，有 2 只触及了预警价。' },
      { role: 'user' as const, text: '哪两只？帮我看看' },
      { role: 'ai' as const, text: '科大讯飞突破 60 日均线，放量上涨，MACD 金叉；\n中际旭创接近前高压力位，建议关注量能变化。\n要我生成详细分析报告吗？' },
    ],
  },
  {
    icon: '🤝', title: '人脉管理',
    pains: ['认识的人多，记不住谁是谁', '重要日期总忘记，错过送礼时机', '不知道该联系谁、什么时候联系'],
    solutions: ['记住你所有的社会关系', '自动提醒生日、纪念日等重要日期', '分析关系亲密度，建议联络时机', '记录每个人的喜好和交往历史'],
    chatExample: [
      { role: 'ai' as const, text: '提醒你：明天是张总的生日🎂\n他上次帮你介绍了客户王总，是个重要人脉。\n他喜欢喝普洱茶，要不要送一盒？' },
      { role: 'user' as const, text: '好主意，帮我编一条祝福' },
      { role: 'ai' as const, text: '参考你平时的说话风格，我写了一条：\n\n"张哥，生日快乐！🎉 上次多亏您引荐了王总，一直感激在心。改天约您喝茶，有批好普洱想跟您分享。祝事事顺心！"' },
    ],
  },
  {
    icon: '📊', title: '职场效率',
    pains: ['重复写邮件、报告，浪费时间', '会议太多，纪要来不及整理', '项目进度乱，容易遗漏任务'],
    solutions: ['根据你的风格自动撰写邮件和报告', '实时整理会议纪要和待办事项', '跟踪项目进度，提醒 deadline', '自动准备会议材料'],
    chatExample: [
      { role: 'ai' as const, text: '早上好！今天有 3 件事需要你关注：\n1. 下午 2 点产品评审会（材料我已整理好）\n2. 昨天那封客户邮件还没回\n3. Q1 周报今天截止' },
      { role: 'user' as const, text: '帮我回那封邮件，就说同意方案' },
      { role: 'ai' as const, text: '邮件已发送 ✅\n用了你上次的签名格式，语气保持了你一贯的专业友好风格。要看一眼确认吗？' },
    ],
  },
  {
    icon: '🚀', title: '创业决策',
    pains: ['精力有限，什么都要自己干', '决策靠直觉，缺少数据支撑', '市场变化快，跟不上节奏'],
    solutions: ['自动进行竞品分析和市场调研', '数据驱动的商业决策建议', '实时监控行业动态和政策变化', '生成商业计划书和融资材料'],
    chatExample: [
      { role: 'ai' as const, text: '关于你昨天提到的新项目方向，我做了初步调研：\n\n市场规模：约 50 亿\n主要竞品：3 家，最强的是 XX\n进入壁垒：中等\n\n建议先做 MVP 验证，要看详细报告吗？' },
      { role: 'user' as const, text: '详细报告发我，再分析一下竞品的弱点' },
      { role: 'ai' as const, text: '报告已生成（共 12 页）。\n\n竞品主要弱点：\n1. 用户留存率低（30天仅 15%）\n2. 客单价高，中小企业用不起\n3. 没有移动端\n\n这恰好是我们可以切入的差异化方向。' },
    ],
  },
  {
    icon: '🤖', title: '日常生活',
    pains: ['琐事太多，总忘记重要的事', '选择困难，不知道吃什么看什么', '记性差，朋友的喜好记不住'],
    solutions: ['管理你的所有日程和待办', '根据你的偏好智能推荐', '记住你和每个人的交往细节', '健康提醒和生活建议'],
    chatExample: [
      { role: 'ai' as const, text: '晚上好～今天连续工作了 8 小时，该休息了。\n根据你最近的口味，推荐《星际穿越》重温一下？\n或者轻松点的《怦然心动》也不错。' },
      { role: 'user' as const, text: '星际穿越吧，帮我定个明天闹钟 8 点' },
      { role: 'ai' as const, text: '闹钟已设好，明早 8 点 ⏰\n明天气温骤降 10°，记得穿厚外套。\n好好享受电影，晚安 🌙' },
    ],
  },
]

export default function Scenes() {
  return (
    <>
      <PageHero
        title="如果你有一个比自己更强的大脑"
        subtitle="你会让它做什么？"
      />

      {scenes.map((scene, i) => (
        <SceneDetail key={scene.title} {...scene} reverse={i % 2 === 1} />
      ))}

      <TargetUsers />

      <SectionCTA
        title="找到你的场景了吗？"
        subtitle="免费开始，让超级大脑为你工作"
        buttonText="免费体验"
        buttonHref="/pricing"
      />
    </>
  )
}
