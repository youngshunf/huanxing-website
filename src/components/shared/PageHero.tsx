import { motion } from 'framer-motion'

interface Props {
  /** 主标题 */
  title: string
  /** 可选的高亮部分（渐变色） */
  titleHighlight?: string
  /** 副标题文案 */
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHero({ title, titleHighlight, subtitle, children }: Props) {
  return (
    <section className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 pt-28 pb-16 md:px-8 md:pt-36 md:pb-20">
      <motion.h1
        className="mb-6 text-center text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {titleHighlight ? (
          <>
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              {titleHighlight}
            </span>
            <span className="mt-4 block text-text-primary">{title}</span>
          </>
        ) : (
          <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
            {title}
          </span>
        )}
      </motion.h1>

      {subtitle && (
        <motion.p
          className="mx-auto mb-10 max-w-2xl text-center text-lg text-text-secondary md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}

      {children}
    </section>
  )
}
