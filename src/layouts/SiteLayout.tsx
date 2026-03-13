import { Outlet } from 'react-router-dom'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import StarParticles from '../components/shared/StarParticles'

export default function SiteLayout() {
  return (
    <>
      <Header />
      <StarParticles />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
