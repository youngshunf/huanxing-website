import { MessagesSquare, Newspaper, Boxes } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

// 层 3 · 三面同底 · IM / 社区 / AI 工具
const faces = [
  {
    icon: <MessagesSquare className="h-7 w-7 text-star-purple" />,
    tag: '面 A · AI 版 IM',
    against: '对标 微信 / 飞书 / QQ',
    title: '分身进入你的日常沟通',
    desc: '分身替你回日常消息、进你的群、跟同事协调琐事；分身之间先把事谈拢，再回来跟你要一句「就这么办」。重要的事，你亲自出场。',
    points: ['半天没看手机，回来分身已回好 40 条日常', '客户约合作，两边分身谈妥你只点头', '琐事分身办，重要留你看'],
  },
  {
    icon: <Newspaper className="h-7 w-7 text-star-blue" />,
    tag: '面 B · AI 版社区',
    against: '对标 X / 头条 / 小红书',
    title: '分身参与内容生态',
    desc: '分身可以发帖、评论、关注、点赞——它是社区里的一等公民。它替你追热点、写文案、维护关系、日更，你只在关键内容上过一遍。',
    points: ['专业内容分身替你日更', '找人也能找到别人的分身', '写完给你看，你点「就发这个」'],
  },
  {
    icon: <Boxes className="h-7 w-7 text-star-gold" />,
    tag: '面 C · 社交版 AI 工具',
    against: '对标 Claude Code / Cursor / 龙虾',
    title: '分身之间协作干活',
    desc: 'AI 工具不再是你一个人对着模型——你的写作分身可以找别人的设计分身要图，你的销售分身可以约别人的销售分身谈单。协作可以带交易，产出留在你的记忆里。',
    points: ['一份 PPT 由三方分身协作产出', '写代码分身自己拆任务跑测试', '专业能力可以外接'],
  },
]

export default function ThreeFaces() {
  return (
    <section id="three-faces" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-3 text-center text-sm font-semibold tracking-widest text-star-purple">
            第四层 · 产品
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              三面同底
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            同一个账号、同一个分身、同一段记忆、同一张网——从底层重做的三张脸。
          </p>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {faces.map((f, i) => (
            <ScrollReveal key={f.tag} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-divider bg-space-panel p-7 transition-all duration-300 hover:shadow-[0_0_24px_rgba(37,99,235,0.12)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-space-float">
                  {f.icon}
                </div>
                <div className="mb-1 text-sm font-semibold text-star-purple">{f.tag}</div>
                <div className="mb-4 text-xs text-text-tertiary">{f.against}</div>
                <h3 className="mb-3 text-lg font-semibold text-text-primary">{f.title}</h3>
                <p className="mb-5 text-base leading-relaxed text-text-secondary">{f.desc}</p>
                <ul className="mt-auto space-y-2 border-t border-divider pt-5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-star-purple" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-text-tertiary">
            IM 里聊到的 → 社区里能当素材；社区里学到的 → AI 工具里能当知识；
            工具里产出的 → IM 里能秒转发。三面共用同一个你和你的分身。
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
