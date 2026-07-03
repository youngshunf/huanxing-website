import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import SiteLayout from './layouts/SiteLayout'
import Home from './pages/Home'
import Product from './pages/Product'
import Scenes from './pages/Scenes'
import PricingPage from './pages/PricingPage'
import About from './pages/About'
import Privacy from './pages/Privacy'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Subscription from './pages/dashboard/Subscription'
import Credits from './pages/dashboard/Credits'
import ApiKeys from './pages/dashboard/ApiKeys'
import AgentsPage from './pages/dashboard/agents/AgentsPage'
import AgentDetailPage from './pages/dashboard/agents/AgentDetailPage'
import AgentChatPage from './pages/dashboard/agents/AgentChatPage'
import PayPage from './pages/pay/PayPage'
import PublishSharePage from './pages/share/PublishSharePage'
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
            <Route path="/privacy" element={<Privacy />} />
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

          {/* 网页发布分享查看器（公开入口；private 分享内部引导登录） */}
          <Route path="/s/:slug" element={<PublishSharePage />} />

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
            <Route path="apikeys" element={<ApiKeys />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="agents/:agentId" element={<AgentDetailPage />} />
            <Route path="agents/:agentId/chat" element={<AgentChatPage />} />
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
