import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import SiteLayout from './layouts/SiteLayout'
import Home from './pages/Home'
import Product from './pages/Product'
import Scenes from './pages/Scenes'
import PricingPage from './pages/PricingPage'
import About from './pages/About'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Subscription from './pages/dashboard/Subscription'
import Credits from './pages/dashboard/Credits'
import PayPage from './pages/pay/PayPage'
import SharePage from './pages/doc/SharePage'
import DocsListPage from './pages/doc/DocsListPage'
import ViewPage from './pages/doc/ViewPage'
import EditorPage from './pages/doc/EditorPage'
import ProtectedRoute from './components/ProtectedRoute'
import LoginModal from './components/LoginModal'
import { useAuthStore } from './stores/useAuthStore'

// 创作中心页面
import CreatorProjects from './pages/dashboard/creator/CreatorProjects'
import CreatorContents from './pages/dashboard/creator/CreatorContents'
import CreatorPublishes from './pages/dashboard/creator/CreatorPublishes'
import CreatorAnalytics from './pages/dashboard/creator/CreatorAnalytics'
import CreatorTopics from './pages/dashboard/creator/CreatorTopics'

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
          {/* ===== 营销页面 — 共享 SiteLayout（Header + StarParticles + Footer）===== */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/scenes" element={<Scenes />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* ===== 原有功能页面（保持不动）===== */}

          {/* 支付页（需登录） */}
          <Route
            path="/pay"
            element={
              <ProtectedRoute>
                <PayPage />
              </ProtectedRoute>
            }
          />

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
            {/* 创作中心 */}
            <Route path="creator" element={<CreatorProjects />} />
            <Route path="creator/contents" element={<CreatorContents />} />
            <Route path="creator/publishes" element={<CreatorPublishes />} />
            <Route path="creator/analytics" element={<CreatorAnalytics />} />
            <Route path="creator/topics" element={<CreatorTopics />} />
          </Route>
        </Routes>
        <LoginModal />
      </div>
    </BrowserRouter>
  )
}
