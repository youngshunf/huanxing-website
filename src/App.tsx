import StarParticles from './components/StarParticles'
import Hero from './components/Hero'
import Features from './components/Features'
import GrowthSystem from './components/GrowthSystem'
import ChatPreview from './components/ChatPreview'
import Pricing from './components/Pricing'
import BrandStory from './components/BrandStory'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-space-black">
      <StarParticles />
      <Hero />
      <Features />
      <GrowthSystem />
      <ChatPreview />
      <Pricing />
      <BrandStory />
      <Footer />
    </div>
  )
}
