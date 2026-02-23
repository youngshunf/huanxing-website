import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

type Message = { role: 'ai' | 'user'; name?: string; text: string }

interface Scenario {
  label: string
  icon: string
  messages: Message[]
}

const scenarios: Scenario[] = [
  {
    label: '办公助手',
    icon: '💼',
    messages: [
      {
        role: 'ai',
        text: '早上好，福仔。\n今天有 3 件事需要你关注：\n1. 下午 2 点有个会议\n2. 昨天那封邮件还没回\n3. 天气转凉，记得加衣服',
      },
      { role: 'user', text: '帮我回那封邮件，就说同意方案' },
      {
        role: 'ai',
        text: '好的，邮件已发送。\n我用了你上次的签名格式，你看看有没有问题。',
      },
      { role: 'user', text: '完美，谢谢小星 ✨' },
      {
        role: 'ai',
        text: '不客气～ 对了，下午的会议要不要我帮你准备一份摘要？',
      },
    ],
  },
  {
    label: '自媒体运营',
    icon: '📱',
    messages: [
      {
        role: 'ai',
        text: '你昨天发的短视频数据出来了：\n播放量 12.8w，点赞 3600+，评论区有几条高互动留言值得回复。',
      },
      { role: 'user', text: '帮我想一条今天的选题，最近 AI 话题很火' },
      {
        role: 'ai',
        text: '推荐选题：「普通人怎么用 AI 月入过万？3 个真实案例」\n这类实操向内容最近完播率很高，要不要我帮你拟个脚本大纲？',
      },
      { role: 'user', text: '可以，再帮我生成一张封面配图的提示词' },
      {
        role: 'ai',
        text: '大纲已生成，封面提示词也准备好了。\n我还顺便分析了你近 7 天的最佳发布时间，建议今天 18:30 发。',
      },
    ],
  },
  {
    label: '金融分析',
    icon: '📊',
    messages: [
      {
        role: 'ai',
        text: '早盘速报：\n沪指高开 0.3%，AI 板块领涨。你关注的 3 只股票中，有 2 只触及了预警价。',
      },
      { role: 'user', text: '哪两只？帮我看看技术面' },
      {
        role: 'ai',
        text: '科大讯飞突破 60 日均线，放量上涨，MACD 金叉；\n中际旭创接近前高压力位，建议关注量能变化。',
      },
      { role: 'user', text: '生成一份分析报告，再看看港股' },
      {
        role: 'ai',
        text: '报告已生成。港股方面，恒生科技指数连涨 3 日，\n腾讯和美团资金流入明显，可以重点关注。',
      },
    ],
  },
  {
    label: '日常陪伴',
    icon: '🌟',
    messages: [
      {
        role: 'ai',
        text: '晚上好～ 今天过得怎么样？\n我看你连续工作了 8 小时，要不要休息一下？',
      },
      { role: 'user', text: '有点累，推荐个电影吧' },
      {
        role: 'ai',
        text: '根据你最近的口味，推荐《星际穿越》重温一下？\n或者轻松点的《怦然心动》也不错。',
      },
      { role: 'user', text: '星际穿越吧，帮我定个明天的闹钟 8 点' },
      {
        role: 'ai',
        text: '闹钟已设好，明早 8 点。\n好好享受电影，晚安 🌙',
      },
    ],
  },
]

const messageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.2 + 0.3 },
  }),
}

function ChatCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-divider bg-space-panel shadow-[0_0_32px_rgba(108,92,231,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-divider px-4 py-3">
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <img src="/logos/icon-compact.svg" alt="小星" className="h-full w-full" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-text-primary">小星</span>
          <span className="ml-2 text-xs text-text-tertiary">{scenario.icon} {scenario.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-text-secondary">在线</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {scenario.messages.map((msg, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={messageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' ? (
              <div className="max-w-[80%] rounded-[2px_12px_12px_12px] border border-divider bg-space-float px-3 py-2.5">
                <span className="text-star-purple">✦</span>
                <span className="whitespace-pre-line text-xs leading-relaxed text-text-primary">
                  {msg.text}
                </span>
              </div>
            ) : (
              <div
                className="max-w-[80%] rounded-[12px_2px_12px_12px] px-3 py-2.5"
                style={{ background: 'linear-gradient(135deg, #6C5CE7, #5A4BD5)' }}
              >
                <span className="whitespace-pre-line text-xs leading-relaxed text-white">
                  {msg.text}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-divider px-4 py-2.5">
        <div className="flex items-center gap-3 rounded-lg bg-space-input px-3 py-2">
          <span className="flex-1 text-xs text-text-tertiary">跟你的星说点什么...</span>
          <span className="text-star-purple">✦</span>
        </div>
      </div>
    </div>
  )
}

export default function ChatPreview() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              与你的星对话
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            不是冷冰冰的工具，而是一个懂你的数字伙伴
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {scenarios.map((s) => (
            <ScrollReveal key={s.label} className="flex">
              <ChatCard scenario={s} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
