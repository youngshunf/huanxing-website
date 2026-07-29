import { useEffect, useState } from 'react'
import { getReleaseHistory, type ReleaseVersion } from '../api/release'

interface UseReleaseHistoryResult {
  releases: ReleaseVersion[]
  loading: boolean
}

// 历史版本与最新版本分别请求，历史接口只返回已经完整发布的批次。
export function useReleaseHistory(channel = 'stable'): UseReleaseHistoryResult {
  const [releases, setReleases] = useState<ReleaseVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    getReleaseHistory(channel)
      .then((data) => {
        if (alive) setReleases(data)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [channel])

  return { releases, loading }
}
