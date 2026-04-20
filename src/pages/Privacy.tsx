import PageHero from '../components/shared/PageHero'

/**
 * 唤星隐私政策页面 /privacy
 * 法律源文件在 huanxing-website/docs/privacy.md，本页面为公开展示入口。
 */
export default function Privacy() {
  return (
    <>
      <PageHero
        titleHighlight="隐私政策 Privacy Policy"
        title="我们如何收集、使用和保护您的信息"
      />

      <section className="relative z-10 px-4 py-16 sm:px-6 md:px-8 lg:px-12">
        <article className="prose prose-invert mx-auto max-w-3xl text-text-secondary">
          <p className="text-sm">
            <span className="text-text-primary">版本 / Version:</span> v1.0（M1 草案 · 2026-04-21）·
            <span className="text-text-primary"> 生效日期 / Effective:</span> 2026-05-01
          </p>
          <p className="text-sm">
            联系方式 / Contact:{' '}
            <a href="mailto:privacy@huanxing.ai" className="text-star-blue">
              privacy@huanxing.ai
            </a>
          </p>

          <hr className="my-8 border-divider" />

          <h2 className="text-2xl font-bold text-text-primary">中文版（以中文版为准）</h2>

          <h3 className="mt-6 text-xl font-bold text-text-primary">1. 我们是谁</h3>
          <p>
            唤星（HuanXing）是一款 AI 数字分身产品。本政策说明我们收集哪些信息、为什么收集、保留多久、与哪些第三方共享，以及您如何行使访问、更正、删除、导出权利。
          </p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">2. 我们收集的信息</h3>
          <ul>
            <li>账户信息：手机号 / 邮箱、密码哈希、昵称</li>
            <li>身份凭据：JWT、owner_api_key（仅存储于您本地设备的 Android Keystore / iOS Keychain）</li>
            <li>设备信息：设备型号、OS 版本、分辨率、语言、时区、匿名设备 ID</li>
            <li>网络信息：IP 地址、网络类型（WiFi / 蜂窝）</li>
            <li>对话 / 记忆内容：您与分身的聊天、文档、偏好、记忆片段</li>
            <li>崩溃日志：脱敏堆栈（凭据、消息正文不上报）</li>
            <li>使用埋点：页面访问、按钮点击、功能使用频率</li>
            <li>推送令牌：手机厂商推送通道 Token（小米 / 华为 / OPPO / vivo / 魅族）</li>
          </ul>
          <p>
            <strong className="text-text-primary">我们不收集</strong>
            ：通讯录、相册（除非您主动导入）、精确位置、麦克风录音、健康数据、人脸生物特征。
          </p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">3. 我们如何使用这些信息</h3>
          <p>
            提供核心功能 · 账户安全 · 崩溃诊断 · 产品改进（聚合分析）· 推送通知（正文不含对话内容）· 法律合规。
          </p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">4. 我们如何共享您的信息</h3>
          <p>我们不出售您的个人信息。仅在以下有限场景共享：</p>
          <ul>
            <li>友盟+（U-Push / U-App）：推送通道路由 + 匿名使用统计</li>
            <li>腾讯 Bugly：崩溃诊断（脱敏堆栈）</li>
            <li>手机厂商推送（小米 / 华为 / OPPO / vivo / 魅族）：厂商级推送通道（推送无正文）</li>
            <li>云服务提供商（阿里云 / 腾讯云）：服务器托管</li>
            <li>监管部门：法律强制要求范围内</li>
          </ul>

          <h3 className="mt-6 text-xl font-bold text-text-primary">5. 我们保留信息多久</h3>
          <ul>
            <li>账户信息：账户存续期间 + 注销后 30 天宽限期</li>
            <li>对话 / 记忆：账户存续期间；账户注销后 30 天内删除</li>
            <li>崩溃日志：90 天</li>
            <li>使用埋点：180 天</li>
            <li>支付记录：5 年（税务合规）</li>
            <li>登录日志：180 天</li>
          </ul>

          <h3 className="mt-6 text-xl font-bold text-text-primary">6. 您的权利</h3>
          <p>依据《个人信息保护法》等法律，您有权访问、更正、删除、导出、撤回同意、投诉。联系 privacy@huanxing.ai。</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">7. 数据安全</h3>
          <p>
            传输层全站 HTTPS（TLS 1.3）；凭据存储于设备 Keystore / Keychain，永不明文落盘、永不通过带外通道传输；审计日志留痕 180 天；崩溃堆栈敏感字段自动脱敏。
          </p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">8. 未成年人</h3>
          <p>本产品不面向 14 周岁以下儿童。如发现收集了儿童信息，我们会立即删除。</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">9. 政策变更</h3>
          <p>本政策更新时，我们会通过 App 内弹窗 + 邮件通知。重大变更生效前 15 天发出。</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">10. 联系我们</h3>
          <ul>
            <li>
              邮件：
              <a href="mailto:privacy@huanxing.ai" className="text-star-blue">
                privacy@huanxing.ai
              </a>
            </li>
            <li>
              数据保护负责人（DPO）：
              <a href="mailto:dpo@huanxing.ai" className="text-star-blue">
                dpo@huanxing.ai
              </a>
            </li>
          </ul>

          <hr className="my-8 border-divider" />

          <h2 className="text-2xl font-bold text-text-primary">English Version</h2>
          <p className="italic">(Chinese version prevails in case of discrepancy.)</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">1. Who We Are</h3>
          <p>
            HuanXing is an AI digital-avatar product. This policy explains what information we collect, why, how long we keep it, with whom we share it, and how you can exercise your rights of access, correction, deletion, and portability.
          </p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">2. Information We Collect</h3>
          <ul>
            <li>Account: phone / email, password hash, nickname</li>
            <li>Credentials: JWT, owner_api_key (device Keystore / Keychain only)</li>
            <li>Device: model, OS version, resolution, language, timezone, anonymous device ID</li>
            <li>Network: IP address, connection type (WiFi / cellular)</li>
            <li>Conversations / memory fragments</li>
            <li>Crash logs (redacted — no credentials, no message bodies)</li>
            <li>Analytics events (can be disabled)</li>
            <li>Push tokens (Xiaomi / Huawei / OPPO / vivo / Meizu)</li>
          </ul>

          <h3 className="mt-6 text-xl font-bold text-text-primary">3. How We Use It</h3>
          <p>Deliver core features, account security, crash diagnostics, product improvement, push notifications (no chat content in push bodies), legal compliance.</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">4. How We Share</h3>
          <p>We do not sell your data. Limited sharing with: Umeng+ (U-Push / U-App), Tencent Bugly, OEM push channels, cloud providers, and regulators under legal mandate.</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">5. Retention</h3>
          <p>Account data: lifetime + 30-day grace. Conversations: deleted within 30 days after closure. Crash logs: 90 days. Analytics: 180 days. Payment records: 5 years (tax). Login logs: 180 days.</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">6. Your Rights</h3>
          <p>Access, correct, delete, export, withdraw consent, complain. Contact privacy@huanxing.ai.</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">7. Security</h3>
          <p>
            TLS 1.3 in transit; Argon2id password hashing; credentials stored in device Keystore / Keychain only; audit logs retained 180 days; sensitive fields auto-redacted in crash reports.
          </p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">8. Minors</h3>
          <p>Not intended for children under 14. Contact privacy@huanxing.ai if such collection is discovered.</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">9. Changes</h3>
          <p>Material updates notified in-app + email 15 days before effect.</p>

          <h3 className="mt-6 text-xl font-bold text-text-primary">10. Contact</h3>
          <ul>
            <li>
              Email:{' '}
              <a href="mailto:privacy@huanxing.ai" className="text-star-blue">
                privacy@huanxing.ai
              </a>
            </li>
            <li>
              DPO:{' '}
              <a href="mailto:dpo@huanxing.ai" className="text-star-blue">
                dpo@huanxing.ai
              </a>
            </li>
          </ul>

          <p className="mt-12 text-sm italic">
            本页面为 M1 草案，发布前需法务过目。完整源文件见{' '}
            <a
              href="https://github.com/youngshunf/huanxing-website/blob/main/docs/privacy.md"
              className="text-star-blue"
              target="_blank"
              rel="noreferrer"
            >
              docs/privacy.md
            </a>
            。Last reviewed: 2026-04-21.
          </p>
        </article>
      </section>
    </>
  )
}
