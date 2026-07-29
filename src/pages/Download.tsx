import { Apple, CalendarDays, Download as DownloadIcon, History, Monitor, RefreshCw, Terminal } from 'lucide-react'
import PageHero from '../components/shared/PageHero'
import ScrollReveal from '../components/shared/ScrollReveal'
import SectionCTA from '../components/shared/SectionCTA'
import { useLatestRelease } from '../hooks/useLatestRelease'
import { useReleaseHistory } from '../hooks/useReleaseHistory'
import {
  assetDownloadUrl,
  detectPreferredTarget,
  formatFileSize,
  installersOf,
  PLATFORM_META,
  type PlatformMeta,
} from '../api/release'

// 各 OS 对应的图标（品牌无关的通用平台标识）
function platformIcon(os: PlatformMeta['os']) {
  if (os === 'macos') return Apple
  if (os === 'windows') return Monitor
  return Terminal
}

export default function Download() {
  const { release, loading } = useLatestRelease()
  const { releases, loading: historyLoading } = useReleaseHistory()
  const preferredTarget = detectPreferredTarget()
  const history = releases.filter((item) => item.version !== release?.version)

  return (
    <>
      <PageHero
        titleHighlight="把你的星，装进每一台设备"
        title="下载唤星桌面端"
        subtitle={
          release?.version
            ? `当前最新版本 v${release.version} · 内置自动更新，安装后无需手动升级`
            : '内置自动更新，安装后无需手动升级'
        }
      />

      {/* 平台下载卡片 */}
      <section className="relative z-10 px-4 pb-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {!loading && !release && (
            <ScrollReveal>
              <div className="mb-10 rounded-xl border border-star-blue/20 bg-space-panel/60 px-6 py-5 text-center text-text-secondary backdrop-blur-sm">
                安装包正在准备中，敬请期待。你可以先
                <a href="/#pricing" className="mx-1 text-star-blue hover:text-star-purple">
                  在网页端开始体验
                </a>
                ，桌面端上线后这里会第一时间提供下载。
              </div>
            </ScrollReveal>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {PLATFORM_META.map((meta, i) => {
              const Icon = platformIcon(meta.os)
              const installer = release?.installers?.[meta.target] ?? null
              const installerVersion = release?.platform_versions?.[meta.target] ?? null
              const isPreferred = meta.target === preferredTarget
              return (
                <ScrollReveal key={meta.target} delay={i * 0.08}>
                  <div
                    className={`flex h-full flex-col rounded-xl border bg-space-panel p-6 transition-all duration-300 ${
                      isPreferred
                        ? 'border-star-blue/40 shadow-[0_0_24px_rgba(37,99,235,0.12)]'
                        : 'border-divider hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                    }`}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-space-float">
                        <Icon className="h-6 w-6 text-star-blue" />
                      </div>
                      <div>
                        <h3 className="flex items-center gap-2 font-semibold text-text-primary">
                          {meta.label}
                          {installer && installerVersion && (
                            <span className="rounded bg-star-blue/10 px-1.5 py-0.5 text-xs font-medium text-star-blue">
                              v{installerVersion}
                            </span>
                          )}
                          {isPreferred && (
                            <span className="rounded bg-star-blue/15 px-1.5 py-0.5 text-xs font-medium text-star-blue">
                              推荐
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-text-tertiary">{meta.hint}</p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      {loading ? (
                        <div className="h-11 animate-pulse rounded-lg bg-space-float" />
                      ) : installer ? (
                        <a
                          href={assetDownloadUrl(installer)}
                          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        >
                          <DownloadIcon className="h-4 w-4" />
                          下载安装包
                          {installer.file_size > 0 && (
                            <span className="text-sm font-normal opacity-80">
                              （{formatFileSize(installer.file_size)}）
                            </span>
                          )}
                        </a>
                      ) : (
                        <div className="flex items-center justify-center rounded-lg bg-space-float px-5 py-2.5 font-medium text-text-tertiary">
                          敬请期待
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>

          {/* 自动更新说明 */}
          <ScrollReveal delay={0.2}>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-divider bg-space-panel/60 px-6 py-5 text-sm text-text-secondary">
              <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-star-blue" />
              <p>
                桌面端<strong className="text-text-primary">内置自动更新</strong>：启动时会自动检查新版本，
                有更新时后台静默下载并在你确认后一键升级，也可以在应用内「关于」页手动检查。
                自动更新包均经过<strong className="text-text-primary">数字签名校验</strong>，确保下载内容完整。
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 更新日志 */}
      {release?.release_notes_md && (
        <section className="relative z-10 px-4 py-12 sm:px-6 md:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <h2 className="mb-6 text-center text-2xl font-bold text-text-primary">
                v{release.version} 更新内容
              </h2>
              <div className="rounded-xl border border-divider bg-space-panel p-6">
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-text-secondary">
                  {release.release_notes_md}
                </pre>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 历史版本只展示已经完整发布的批次，下载仍走计数重定向。 */}
      {(historyLoading || history.length > 0) && (
        <section className="relative z-10 px-4 py-12 sm:px-6 md:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <div className="mb-7 flex items-center justify-center gap-2">
                <History className="h-6 w-6 text-star-blue" />
                <h2 className="text-2xl font-bold text-text-primary">历史版本</h2>
              </div>
            </ScrollReveal>

            {historyLoading ? (
              <div className="space-y-4">
                {[0, 1].map((item) => (
                  <div key={item} className="h-40 animate-pulse rounded-xl bg-space-panel" />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {history.map((item, index) => {
                  const installers = installersOf(item)
                  return (
                    <ScrollReveal key={item.id} delay={Math.min(index * 0.05, 0.2)}>
                      <article className="rounded-xl border border-divider bg-space-panel p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-text-primary">
                              唤星AI v{item.version}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-text-tertiary">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {item.published_time
                                ? new Date(item.published_time).toLocaleDateString('zh-CN')
                                : '发布时间未知'}
                              {item.release_tag && <span>· {item.release_tag}</span>}
                            </div>
                          </div>
                        </div>

                        {item.release_notes_md && (
                          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                            {item.release_notes_md}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {PLATFORM_META.map((meta) => {
                            const installer = installers[meta.target]
                            if (!installer) return null
                            const Icon = platformIcon(meta.os)
                            return (
                              <a
                                key={meta.target}
                                href={assetDownloadUrl(installer)}
                                className="inline-flex items-center gap-2 rounded-lg bg-star-blue px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-star-purple"
                              >
                                <Icon className="h-4 w-4" />
                                {meta.label}
                                {installer.file_size > 0 && (
                                  <span className="opacity-75">
                                    {formatFileSize(installer.file_size)}
                                  </span>
                                )}
                              </a>
                            )
                          })}
                        </div>
                      </article>
                    </ScrollReveal>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <SectionCTA
        title="下载后，唤醒属于你的那颗星"
        subtitle="登录你的唤星账号，你的分身、记忆与星座会自动同步到这台设备。"
        buttonText="免费开始"
        buttonHref="/pricing"
      />
    </>
  )
}
