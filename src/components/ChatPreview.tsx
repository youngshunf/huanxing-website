import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const messages = [
  {
    role: 'ai' as const,
    name: '小星',
    text: '早上好，福仔。\n今天有 3 件事需要你关注：\n1. 下午 2 点有个会议\n2. 昨天那封邮件还没回\n3. 天气转凉，记得加衣服',
  },
  {
    role: 'user' as const,
    text: '帮我回那封邮件，就说同意方案',
  },
  {
    role: 'ai' as const,
    name: '小星',
    text: '好的，邮件已发送。\n我用了你上次的签名格式，你看看有没有问题。',
  },
  {
    role: 'user' as const,
    text: '完美，谢谢小星 ✨',
  },
  {
    role: 'ai' as const,
    name: '小星',
    text: '不客气～ 对了，下午的会议要不要我帮你准备一份摘要？',
  },
]

const messageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.3 + 0.5 },
  }),
}

export default function ChatPreview() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
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

        <ScrollReveal>
          <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-divider bg-space-panel shadow-[0_0_32px_rgba(108,92,231,0.1)]">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-divider px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-star-purple to-star-blue">
                <span className="text-sm text-white">✦</span>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-text-primary">小星</span>
                <span className="ml-2 text-xs text-text-tertiary">你的数字分身</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-text-secondary">在线</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex flex-col gap-4 p-5" style={{ minHeight: 360 }}>
              {messages.map((msg, i) => (
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
                    <div className="max-w-[75%] rounded-[2px_12px_12px_12px] border border-divider bg-space-float px-4 py-3">
                      <span className="mr-1 text-star-purple">✦</span>
                      <span className="whitespace-pre-line text-sm leading-relaxed text-text-primary">
                        {msg.text}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="max-w-[75%] rounded-[12px_2px_12px_12px] px-4 py-3"
                      style={{ background: 'linear-gradient(135deg, #6C5CE7, #5A4BD5)' }}
                    >
                      <span className="whitespace-pre-line text-sm leading-relaxed text-white">
                        {msg.text}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Chat input */}
            <div className="border-t border-divider px-5 py-3">
              <div className="flex items-center gap-3 rounded-lg bg-space-input px-4 py-2.5">
                <span className="flex-1 text-sm text-text-tertiary">跟你的星说点什么...</span>
                <span className="text-star-purple">✦</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
