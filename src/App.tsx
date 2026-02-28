import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Subscription from './pages/dashboard/Subscription'
import Credits from './pages/dashboard/Credits'
import SharePage from './pages/doc/SharePage'
import DocsListPage from './pages/doc/DocsListPage'
import ViewPage from './pages/doc/ViewPage'
import EditorPage from './pages/doc/EditorPage'
import ProtectedRoute from './components/ProtectedRoute'
import LoginModal from './components/LoginModal'
import { useAuthStore } from './stores/useAuthStore'

// 初始化主题 store（触发 side effect）
import './stores/useThemeStore'

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-x-hidden bg-space-black">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* 分享页（公开，无需登录） */}
          <Route path="/s/:token" element={<SharePage />} />

          {/* 文档列表（重定向到 dashboard 内） */}
          <Route path="/docs" element={<Navigate to="/dashboard/docs" replace />} />

          {/* 文档预览（需登录） */}
          <Route
            path="/doc/:id/view"
            element={
              <ProtectedRoute>
                <ViewPage />
              </ProtectedRoute>
            }
          />

          {/* 文档编辑（需登录） */}
          <Route
            path="/doc/:id/edit"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="docs" element={<DocsListPage />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="credits" element={<Credits />} />
          </Route>
        </Routes>
        <LoginModal />
      </div>
    </BrowserRouter>
  )
}
