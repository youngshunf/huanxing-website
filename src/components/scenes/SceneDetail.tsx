import ScrollReveal from '../shared/ScrollReveal'

interface SceneProps {
  icon: string
  title: string
  benchmark?: string
  pains: string[]
  solutions: string[]
  chatExample: { role: 'ai' | 'user'; text: string }[]
  reverse?: boolean
}

export default function SceneDetail({ icon, title, benchmark, pains, solutions, chatExample, reverse }: SceneProps) {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 md:px-8 lg:px-12 md:py-24">
      <div className={`mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-start ${reverse ? 'md:flex-row-reverse' : ''}`}>
        {/* Text side */}
        <div className="flex-1">
          <ScrollReveal>
            <div className="mb-2 flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
            </div>
            {benchmark && (
              <p className="mb-6 text-sm font-medium text-text-tertiary">{benchmark}</p>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-text-tertiary uppercase tracking-wider">😩 痛点</h4>
              <ul className="space-y-2">
                {pains.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-star-purple uppercase tracking-wider">✦ 唤星怎么帮</h4>
              <ul className="space-y-2">
                {solutions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                    <span className="mt-1 text-star-purple">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Chat side */}
        <ScrollReveal delay={0.15} className="flex-1">
          <div className="rounded-2xl border border-divider bg-space-panel overflow-hidden">
            <div className="flex items-center gap-3 border-b border-divider px-4 py-3">
              <img src="/logos/icon-dark.svg" alt="小星" className="h-7 w-7 rounded-full" />
              <span className="text-sm font-semibold text-text-primary">小星</span>
              <span className="text-xs text-text-tertiary">{icon} {title}</span>
            </div>
            <div className="flex flex-col gap-3 p-4">
              {chatExample.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' ? (
                    <div className="max-w-[85%] rounded-[2px_12px_12px_12px] border border-divider bg-space-float px-3 py-2.5">
                      <span className="text-star-purple">✦ </span>
                      <span className="whitespace-pre-line text-xs leading-relaxed text-text-primary">{msg.text}</span>
                    </div>
                  ) : (
                    <div className="max-w-[85%] rounded-[12px_2px_12px_12px] bg-gradient-to-br from-star-purple to-[#1D4ED8] px-3 py-2.5">
                      <span className="whitespace-pre-line text-xs leading-relaxed text-white">{msg.text}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
