import { motion } from 'framer-motion'
import ScrollReveal from '../shared/ScrollReveal'

const scenarios = [
  { emoji: '🎂', text: '"明天是张总的生日，他上次帮你介绍了客户，要不要发个祝福？"' },
  { emoji: '📞', text: '"你已经 3 个月没联系李姐了，她上次说孩子要高考，可以关心一下。"' },
  { emoji: '🍵', text: '"王总喜欢喝普洱，下次见面可以带一盒。"' },
]

/* 关系图谱节点 */
const nodes = [
  // 中心：我
  { id: 'me', x: 200, y: 200, r: 28, label: '我', color: '#2563EB', glow: 'rgba(37, 99, 235,0.5)', textColor: '#fff', fontSize: 14 },
  // 第一层：核心关系
  { id: 'zhang', x: 320, y: 110, r: 20, label: '张总', color: '#2563EB', glow: 'rgba(37, 99, 235,0.4)', textColor: '#BFDBFE', fontSize: 11, tag: '客户' },
  { id: 'li', x: 80, y: 120, r: 18, label: '李姐', color: '#1D4ED8', glow: 'rgba(29, 78, 216,0.4)', textColor: '#67E8F9', fontSize: 11, tag: '同事' },
  { id: 'wang', x: 100, y: 300, r: 19, label: '王总', color: '#2563EB', glow: 'rgba(37, 99, 235,0.4)', textColor: '#BFDBFE', fontSize: 11, tag: '合作伙伴' },
  { id: 'mom', x: 310, y: 310, r: 17, label: '妈妈', color: '#EC4899', glow: 'rgba(236,72,153,0.4)', textColor: '#F9A8D4', fontSize: 11, tag: '家人' },
  // 第二层：次要关系
  { id: 'chen', x: 200, y: 60, r: 14, label: '陈老师', color: '#818CF8', glow: 'rgba(129,140,248,0.3)', textColor: '#A5B4FC', fontSize: 10, tag: '导师' },
  { id: 'liu', x: 360, y: 220, r: 13, label: '刘哥', color: '#22D3EE', glow: 'rgba(34,211,238,0.3)', textColor: '#67E8F9', fontSize: 10, tag: '朋友' },
  { id: 'zhao', x: 40, y: 210, r: 13, label: '赵姐', color: '#A78BFA', glow: 'rgba(167,139,250,0.3)', textColor: '#BFDBFE', fontSize: 10, tag: '同事' },
  { id: 'sun', x: 200, y: 360, r: 12, label: '孙总', color: '#818CF8', glow: 'rgba(129,140,248,0.3)', textColor: '#A5B4FC', fontSize: 10, tag: '投资人' },
]

/* 关系连线 */
const edges = [
  // 我到第一层
  { from: 'me', to: 'zhang', strength: 3 },
  { from: 'me', to: 'li', strength: 2 },
  { from: 'me', to: 'wang', strength: 3 },
  { from: 'me', to: 'mom', strength: 4 },
  // 我到第二层
  { from: 'me', to: 'chen', strength: 1 },
  { from: 'me', to: 'liu', strength: 2 },
  { from: 'me', to: 'zhao', strength: 1 },
  { from: 'me', to: 'sun', strength: 1 },
  // 交叉关系
  { from: 'zhang', to: 'wang', strength: 1 },
  { from: 'zhang', to: 'liu', strength: 1 },
  { from: 'li', to: 'zhao', strength: 2 },
  { from: 'chen', to: 'li', strength: 1 },
  { from: 'wang', to: 'sun', strength: 1 },
]

function getNode(id: string) {
  return nodes.find(n => n.id === id)!
}

/* 数据流动光点组件 */
function FlowDot({ from, to, delay }: { from: string; to: string; delay: number }) {
  const n1 = getNode(from)
  const n2 = getNode(to)
  return (
    <motion.circle
      r="2"
      fill="#A5B4FC"
      opacity={0.8}
      animate={{
        cx: [n1.x, n2.x],
        cy: [n1.y, n2.y],
        opacity: [0, 0.9, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function SocialGraph() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              社会关系图谱
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            杀手级功能 — 记住你所有的人际关系，主动帮你维护
          </p>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left: 可视化关系图谱 */}
          <ScrollReveal>
            <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-divider bg-space-panel p-4">
              <svg viewBox="0 0 400 400" className="h-full w-full" style={{ minHeight: 340 }}>
                <defs>
                  {/* 连线渐变 */}
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.4" />
                  </linearGradient>
                  {/* 节点发光 */}
                  <filter id="graphGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                  </filter>
                </defs>

                {/* 连线 */}
                {edges.map((edge, i) => {
                  const n1 = getNode(edge.from)
                  const n2 = getNode(edge.to)
                  return (
                    <motion.line
                      key={i}
                      x1={n1.x}
                      y1={n1.y}
                      x2={n2.x}
                      y2={n2.y}
                      stroke="url(#edgeGrad)"
                      strokeWidth={edge.strength * 0.4 + 0.3}
                      strokeOpacity={0.15 + edge.strength * 0.08}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05 + 0.3 }}
                    />
                  )
                })}

                {/* 数据流动光点 */}
                <FlowDot from="me" to="zhang" delay={0} />
                <FlowDot from="me" to="wang" delay={1.2} />
                <FlowDot from="me" to="mom" delay={2.4} />
                <FlowDot from="zhang" to="wang" delay={1.8} />
                <FlowDot from="li" to="zhao" delay={3} />

                {/* 节点 */}
                {nodes.map((node, i) => (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
                  >
                    {/* 发光层 */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 6}
                      fill={node.glow}
                      filter="url(#graphGlow)"
                    />
                    {/* 节点圆 */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill={node.color}
                      fillOpacity={node.id === 'me' ? 0.9 : 0.25}
                      stroke={node.color}
                      strokeWidth={node.id === 'me' ? 2 : 1.2}
                      strokeOpacity={0.6}
                    />
                    {/* 节点名字 */}
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={node.textColor}
                      fontSize={node.fontSize}
                      fontWeight={node.id === 'me' ? 700 : 500}
                    >
                      {node.label}
                    </text>
                    {/* 关系标签（中心节点除外） */}
                    {'tag' in node && node.tag && (
                      <text
                        x={node.x}
                        y={node.y + node.r + 14}
                        textAnchor="middle"
                        fill="#6E7681"
                        fontSize="9"
                      >
                        {node.tag}
                      </text>
                    )}
                  </motion.g>
                ))}

                {/* 中心节点呼吸光环 */}
                <motion.circle
                  cx={200}
                  cy={200}
                  r={38}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth={1}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '200px 200px' }}
                />
              </svg>
            </div>
          </ScrollReveal>

          {/* Right: scenario cards */}
          <div className="space-y-4">
            {scenarios.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="rounded-xl border border-divider bg-space-panel p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.1)]">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="text-sm text-text-secondary leading-relaxed italic">
                      {item.text}
                    </p>
                  </div>
                  <div className="mt-3 text-right">
                    <span className="text-xs text-star-purple">✦ 小星主动提醒</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
