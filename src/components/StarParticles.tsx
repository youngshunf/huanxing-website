import { useEffect, useRef } from 'react'
import { useThemeStore } from '../stores/useThemeStore'

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  direction: number
  pulse: number
  pulseSpeed: number
}

export default function StarParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Particle[] = []
    const count = 40
    const isDark = resolvedTheme === 'dark'

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() * Math.PI * 2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    // Light 模式：使用星紫色粒子，降低透明度
    // Dark 模式：使用星光金粒子
    const particleColor = isDark
      ? { r: 255, g: 217, b: 61 }
      : { r: 108, g: 92, b: 231 }
    const opacityScale = isDark ? 1 : 0.5

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += Math.cos(p.direction) * p.speed
        p.y += Math.sin(p.direction) * p.speed
        p.pulse += p.pulseSpeed

        const currentOpacity = (p.opacity + Math.sin(p.pulse) * 0.2) * opacityScale

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const { r, g, b } = particleColor

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.05, Math.min(0.6, currentOpacity))})`
        ctx.fill()

        // glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.3})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
