import ScrollReveal from '../shared/ScrollReveal'

const dimensions = ['定位', '获取方式', '配置门槛', '记忆', '做事', '社交', '养成感']

const competitors = [
  {
    name: 'MiClaw',
    sub: '小米',
    values: ['智能家居AI管家', '需安装App+绑定设备', '需配置设备和场景', '设备状态记忆', '控制设备', '❌', '❌'],
  },
  {
    name: 'EasyClaw',
    sub: '猎豹',
    values: ['效率工具助手', '需安装App', '需配置工作流', '有限上下文', '办公自动化', '❌', '❌'],
  },
  {
    name: 'ArkClaw',
    sub: '字节',
    values: ['内容创作AI', '需安装App', '需配置模板和偏好', '创作偏好记录', '内容生成', '❌', '❌'],
  },
  {
    name: 'QClaw',
    sub: '腾讯',
    values: ['社交AI伴侣', '需安装App', '需配置人设', '聊天记录', '社交辅助', '基础', '有限'],
  },
]

const huanxing = [
  '你的超级大脑',
  '✅ 手机号领取，免安装',
  '✅ 零配置，领取即用',
  '✅ 全量永久记忆',
  '✅ 全场景做事+赚钱',
  '✅ 完整关系图谱',
  '✅ 越用越像你',
]

export default function CompareTable() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              和 Claw 系列产品对比
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            同属 OpenClaw 生态，唤星的差异化：免安装、零配置、领取即养成
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="overflow-x-auto rounded-xl border border-divider">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-divider bg-space-float">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">维度</th>
                  {competitors.map((c) => (
                    <th key={c.name} className="px-4 py-3 text-center font-medium text-text-secondary">
                      <div>{c.name}</div>
                      <div className="text-xs text-text-tertiary">{c.sub}</div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-bold">
                    <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
                      唤星 ✦
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((dim, ri) => (
                  <tr key={dim} className={`border-b border-divider last:border-0 ${ri % 2 === 0 ? '' : 'bg-space-float/50'}`}>
                    <td className="px-4 py-3 font-medium text-text-primary">{dim}</td>
                    {competitors.map((c) => (
                      <td key={c.name} className="px-4 py-3 text-center text-text-secondary">
                        {c.values[ri]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center font-semibold text-star-purple">
                      {huanxing[ri]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
