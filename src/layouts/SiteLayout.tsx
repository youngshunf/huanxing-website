import { Outlet } from 'react-router-dom'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import StarParticles from '../components/shared/StarParticles'
import StarHelperBubble from '../components/shared/StarHelperBubble'

export default function SiteLayout() {
  return (
    <>
      <Header />
      <StarParticles />
      <main>
        <Outlet />
      </main>
      <Footer />
      {/* 右下角星仔助手 — 帮助信息 / 产品介绍入口 */}
      <StarHelperBubble />
    </>
  )
}
