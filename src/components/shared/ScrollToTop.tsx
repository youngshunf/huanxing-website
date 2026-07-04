import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * 路由切换时的滚动行为（整站共享一个 window 滚动条）：
 * - 带 #锚点：滚到对应元素（= 上个页面跳转「带了位置」）
 * - 浏览器前进/后退（POP）：交给浏览器恢复到离开时的位置，不强制回顶
 * - 其余情况（点链接进新页面）：默认瞬间回到顶部
 *
 * 挂在 <BrowserRouter> 内、<Routes> 前，只做副作用，不渲染任何内容。
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    // 前进/后退：浏览器 scrollRestoration 会还原离开时的位置
    if (navigationType === 'POP') return

    // 全站 CSS 有 scroll-behavior: smooth。回顶要满足两点：
    // 1) 瞬时跳（否则会从上个位置平滑滚一秒，观感像没重置）；
    // 2) 盖过挂载期的「竞争滚动」——点导航链接会聚焦 <a>，
    //    新页首屏进场动画也会引发布局位移/滚动锚定，
    //    这些会在本次回顶「之后」把页面顶下去几十~几百 px 并停住。
    // 对策：临时关掉 smooth，立刻回顶一次，再在下一帧补一次盖掉竞争滚动。
    const root = document.documentElement
    const prevBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)

    const raf = requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      root.style.scrollBehavior = prevBehavior
    })
    return () => {
      cancelAnimationFrame(raf)
      root.style.scrollBehavior = prevBehavior
    }
  }, [pathname, hash, navigationType])

  return null
}
