import { useEffect, useState } from 'react'
import { getLatestRelease, type LatestRelease } from '../api/release'

interface UseLatestReleaseResult {
  release: LatestRelease | null
  loading: boolean
}

// 拉取桌面端最新版本的公共 hook（Hero + 下载页共用）。
// loading=加载中；release=null 表示尚无发布或端点未上线（UI 兜底「敬请期待」）。
export function useLatestRelease(channel = 'stable'): UseLatestReleaseResult {
  const [release, setRelease] = useState<LatestRelease | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // loading 初始即 true，无需在 effect 体内同步 setState（会触发级联渲染 lint）；
    // 拉取结束时在异步回调里落 loading=false。channel 固定为 'stable'，不涉及重取。
    let alive = true
    getLatestRelease(channel)
      .then((data) => {
        if (alive) setRelease(data)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [channel])

  return { release, loading }
}
