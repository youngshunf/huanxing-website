import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  className?: string
}

/**
 * 场景页图标包装：给 lucide 图标挂上原型的 `.ic` 类，
 * 让 `width/height:1em` 生效——尺寸由父容器 font-size 控制（与原型 SVG sprite 行为一致）。
 */
export default function Ic({ icon: Icon, className = '' }: Props) {
  return <Icon className={`ic ${className}`.trim()} aria-hidden strokeWidth={2} />
}
