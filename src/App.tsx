import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Subscription from './pages/dashboard/Subscription'
import Credits from './pages/dashboard/Credits'
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
          </Route>
        </Routes>
        <LoginModal />
      </div>
    </BrowserRouter>
  )
}
