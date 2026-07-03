import ScrollReveal from '../shared/ScrollReveal'

const services = [
  { emoji: '💰', title: '主动赚钱', example: '"今天有个热点适合你的账号，我已经写好了 3 条内容，要发吗？"' },
  { emoji: '🎂', title: '主动提醒', example: '"明天是你妈妈生日，要不要订个蛋糕？她喜欢芒果味的。"' },
  { emoji: '📊', title: '主动分析', example: '"你关注的那只股票今天跌了 5%，我分析了原因，建议..."' },
  { emoji: '🤝', title: '主动社交', example: '"你已经 2 个月没联系张总了，他上次帮你介绍了客户。"' },
  { emoji: '📈', title: '主动优化', example: '"你上周的小红书数据出来了，第 3 条笔记效果最好。"' },
  { emoji: '⚠️', title: '主动预警', example: '"明天有重要会议，但你还没准备材料，要不要我帮你整理？"' },
]

export default function ProactiveService() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              不等你开口，主动为你服务
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            不是被动等指令的工具，而是主动思考的超级大脑
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-xl border border-divider bg-space-panel p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.1)]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <h3 className="font-semibold text-text-primary">{item.title}</h3>
                </div>
                <p className="flex-1 text-sm text-text-secondary leading-relaxed italic">
                  {item.example}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
