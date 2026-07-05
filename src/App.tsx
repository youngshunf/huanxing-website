import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import SiteLayout from './layouts/SiteLayout'
import Home from './pages/Home'
import Product from './pages/Product'
import Scenes from './pages/Scenes'
import PricingPage from './pages/PricingPage'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Download from './pages/Download'
import Tech from './pages/Tech'
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
import ProtectedRoute from './components/ProtectedRoute'
import LoginModal from './components/LoginModal'
import ScrollToTop from './components/shared/ScrollToTop'
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
      <ScrollToTop />
      <div className="relative min-h-screen overflow-x-hidden bg-space-black">
        <Routes>
          {/* ===== 营销页面 — 共享 SiteLayout（Header + StarParticles + Footer）===== */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/tech" element={<Tech />} />
            <Route path="/scenes" element={<Scenes />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/download" element={<Download />} />
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
            <Route path="subscription" element={<Subscription />} />
            <Route path="credits" element={<Credits />} />
            <Route path="apikeys" element={<ApiKeys />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="agents/:agentId" element={<AgentDetailPage />} />
            <Route path="agents/:agentId/chat" element={<AgentChatPage />} />
          </Route>
        </Routes>
        <LoginModal />
      </div>
    </BrowserRouter>
  )
}
