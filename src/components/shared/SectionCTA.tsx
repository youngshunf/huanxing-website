import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

interface Props {
  title: string
  subtitle?: string
  buttonText: string
  buttonHref: string
  /** true = 用 react-router Link，false = 普通 <a> */
  isRoute?: boolean
}

export default function SectionCTA({ title, subtitle, buttonText, buttonHref, isRoute = true }: Props) {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="relative mx-auto max-w-3xl text-center">
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 -z-10 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="h-[400px] w-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(108,92,231,0.3) 0%, transparent 70%)' }}
          />
        </motion.div>

        <ScrollReveal>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          {subtitle && (
            <p className="mx-auto mb-10 max-w-xl text-text-secondary">{subtitle}</p>
          )}

          {isRoute ? (
            <Link
              to={buttonHref}
              className="inline-block rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(108,92,231,0.4)]"
            >
              {buttonText}
            </Link>
          ) : (
            <a
              href={buttonHref}
              className="inline-block rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(108,92,231,0.4)]"
            >
              {buttonText}
            </a>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
