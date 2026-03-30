import { motion } from 'framer-motion'
import { QrCode, MessageCircle, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { BETA_CONTACTS } from '../../config/betaContacts'
import ScrollReveal from '../shared/ScrollReveal'

const TYPE_LABEL: Record<string, string> = {
  qq: 'QQ',
  wechat: '微信',
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  qq: <MessageCircle className="h-4 w-4" />,
  wechat: <QrCode className="h-4 w-4" />,
}

export default function BetaContact() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  function copyAccount(account: string) {
    navigator.clipboard.writeText(account).then(() => {
      setCopiedAccount(account)
      setTimeout(() => setCopiedAccount(null), 2000)
    })
  }
  return (
    <section
      id="beta-contact"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 md:px-8"
    >
      <ScrollReveal>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-star-purple/30 bg-star-purple/10 px-4 py-1.5 text-sm text-star-purple">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-star-purple opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-star-purple" />
          </span>
          内测招募中
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
            加入内测，抢先体验
          </span>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="mb-16 max-w-lg text-center text-text-secondary">
          产品正在内测阶段，添加下方联系方式即可申请加入，与我们一起打磨你的 AI 超级大脑
        </p>
      </ScrollReveal>

      <div className={`grid gap-8 ${BETA_CONTACTS.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} w-full max-w-3xl`}>
        {BETA_CONTACTS.map((contact, i) => (
          <ScrollReveal key={contact.account} delay={0.1 * (i + 1)}>
            <motion.div
              className="flex flex-col items-center rounded-2xl border border-divider bg-space-panel p-8 transition-all duration-300 hover:border-star-purple/40 hover:shadow-[0_0_32px_rgba(108,92,231,0.12)]"
              whileHover={{ y: -4 }}
            >
              {/* 二维码 */}
              <div className="mb-6 overflow-hidden rounded-xl border border-divider bg-white p-2">
                <img
                  src={contact.qrcode}
                  alt={`${contact.name} 二维码`}
                  className="h-48 w-48 object-contain"
                />
              </div>

              {/* 类型标签 */}
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
                {TYPE_ICON[contact.type]}
                <span>{TYPE_LABEL[contact.type] ?? contact.type}</span>
              </div>

              {/* 名称 */}
              <p className="mb-1 text-base font-semibold text-text-primary">{contact.name}</p>

              {/* 号码 + 复制 */}
              <div className="mt-1 flex items-center gap-2">
                <p className="font-mono text-2xl font-bold tracking-widest text-star-purple">
                  {contact.account}
                </p>
                <button
                  onClick={() => copyAccount(contact.account)}
                  title="复制"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-tertiary transition-colors hover:bg-space-float hover:text-star-purple"
                >
                  {copiedAccount === contact.account
                    ? <><Check className="h-3.5 w-3.5 text-green-400" /><span className="text-green-400">已复制</span></>
                    : <><Copy className="h-3.5 w-3.5" /><span>复制</span></>
                  }
                </button>
              </div>

              {/* 操作提示 */}
              <p className="mt-4 text-xs text-text-tertiary">
                扫码或搜索{TYPE_LABEL[contact.type] ?? contact.type}号添加
              </p>
              <p className="mt-1.5 text-sm text-text-secondary">
                添加好友后，发送<span className="font-medium text-star-purple">「你好」</span>，开启你的专属超级大脑
              </p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4}>
        <p className="mt-12 text-xs text-text-tertiary">
          内测期间全功能免费体验 · 反馈 Bug 或建议可获得正式版积分奖励
        </p>
      </ScrollReveal>
    </section>
  )
}
