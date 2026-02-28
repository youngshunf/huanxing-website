import { useCallback, useEffect, useRef, useState } from 'react'
import { autosaveDoc } from '../api/doc'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface UseAutosaveOptions {
  docId: number | null
  debounceMs?: number
  intervalMs?: number
}

export default function useAutosave({ docId, debounceMs = 5000, intervalMs = 30000 }: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('saved')
  const contentRef = useRef<string>('')
  const lastSavedRef = useRef<string>('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const save = useCallback(async (force = false) => {
    if (!docId) return
    const content = contentRef.current
    if (!force && content === lastSavedRef.current) return

    setStatus('saving')
    try {
      await autosaveDoc(docId, content)
      lastSavedRef.current = content
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }, [docId])

  // debounce 保存
  const onContentChange = useCallback((content: string) => {
    contentRef.current = content
    setStatus('unsaved')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(), debounceMs)
  }, [save, debounceMs])

  // 定时强制保存
  useEffect(() => {
    intervalRef.current = setInterval(() => save(), intervalMs)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [save, intervalMs])

  // beforeunload 保存
  useEffect(() => {
    const handler = () => {
      if (contentRef.current !== lastSavedRef.current && docId) {
        // 同步请求保存
        const url = `/api/v1/huanxing/app/docs/${docId}/autosave`
        const data = JSON.stringify({ content: contentRef.current })
        navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }))
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [docId])

  // 初始化已保存内容
  const initSavedContent = useCallback((content: string) => {
    contentRef.current = content
    lastSavedRef.current = content
    setStatus('saved')
  }, [])

  return { status, onContentChange, save, initSavedContent }
}
