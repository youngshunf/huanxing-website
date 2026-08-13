import { Check } from 'lucide-react'

import ScrollReveal from '../shared/ScrollReveal'

interface ProductColumn {
  category: string
  examples: string
  value: string
  agent: string
  data: string
  astra?: boolean
}

type ComparisonField = 'examples' | 'value' | 'agent' | 'data'

const products: ProductColumn[] = [
  {
    category: '通用助手 / 超级入口',
    examples: 'ChatGPT、千问 App',
    value: '问答、内容与统一服务入口',
    agent: '平台助手或服务 Agent',
    data: '以平台云服务为中心',
  },
  {
    category: 'AI 执行工作台',
    examples: 'WorkBuddy、千问办公',
    value: '规划任务并交付办公成果',
    agent: '围绕任务、专家和工作空间组织',
    data: '本地、云端、VPC、私有化并存',
  },
  {
    category: '专业执行 Agent',
    examples: 'Claude Code、Codex、OpenClaw',
    value: '在代码、终端或设备执行专业任务',
    agent: '围绕项目、进程或运行环境工作',
    data: '以本地项目或执行环境为主',
  },
  {
    category: '唤星',
    examples: 'Astra',
    value: '主人拥有的长期数字员工与协作网络',
    agent: '有主人、有身份、可持续、可迁移',
    data: '本地优先；主动同步或分享才上传产物',
    astra: true,
  },
] as const

const comparisonRows: Array<readonly [string, ComparisonField]> = [
  ['代表产品', 'examples'],
  ['核心价值', 'value'],
  ['Agent 形态', 'agent'],
  ['数据与运行', 'data'],
]

export default function CompetitorComparison() {
  return (
    <section id="compare" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
              大家都在让 Agent 更会干活，<br className="hidden md:block" />唤星选择让它真正属于你
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-text-secondary md:text-lg">
              唤星不靠工具数量与成熟平台正面对称竞争，而是建设长期身份、主人责任和跨主体协作这一层。
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="hidden overflow-hidden rounded-2xl border border-divider bg-space-panel lg:block">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="border-b border-divider bg-space-float/70">
                  <th className="w-36 px-5 py-4 text-sm font-semibold text-text-secondary">维度</th>
                  {products.map((product) => (
                    <th key={product.category} className={`px-5 py-4 text-sm font-semibold ${product.astra ? 'text-star-purple' : 'text-text-primary'}`}>
                      {product.category}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-divider text-sm leading-6">
                {comparisonRows.map(([label, key]) => (
                  <tr key={label}>
                    <th className="px-5 py-5 font-semibold text-text-primary">{label}</th>
                    {products.map((product) => (
                      <td key={product.category} className={`px-5 py-5 align-top ${product.astra ? 'bg-star-purple/5 font-medium text-text-primary' : 'text-text-secondary'}`}>
                        {product[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-5 lg:hidden">
            {products.map((product) => (
              <article key={product.category} className={`rounded-2xl border p-6 ${product.astra ? 'border-star-purple bg-star-purple/5' : 'border-divider bg-space-panel'}`}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-text-primary">{product.category}</h3>
                  {product.astra && <span className="rounded-full bg-star-purple px-3 py-1 text-xs font-semibold text-white">唤星</span>}
                </div>
                <dl className="space-y-4 text-sm leading-6">
                  {[
                    ['代表产品', product.examples],
                    ['核心价值', product.value],
                    ['Agent 形态', product.agent],
                    ['数据与运行', product.data],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[88px_1fr] gap-3">
                      <dt className="font-medium text-text-tertiary">{label}</dt>
                      <dd className="text-text-secondary">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto mt-10 flex max-w-4xl gap-3 text-sm leading-6 text-text-secondary">
            <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-star-purple" />
            <p>
              对比基于截至 2026 年 8 月的公开产品定位，不代表竞品缺少表中未展开的能力。WorkBuddy 和千问在执行成熟度、流量与企业交付上领先；唤星选择长期身份与数字员工网络这一不同层次。
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
