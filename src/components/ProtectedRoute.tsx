import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, setShowLoginModal } = useAuthStore()

  if (!isLoggedIn) {
    // 触发登录弹窗并重定向到首页
    setTimeout(() => setShowLoginModal(true), 0)
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
