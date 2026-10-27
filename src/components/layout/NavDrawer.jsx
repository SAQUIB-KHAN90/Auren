import { X } from 'lucide-react'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { NAV } from '@/data/nav'

const panel = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { type: 'spring', stiffness: 260, damping: 32 } },
  exit: { x: '100%', transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
}

const list = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

// Below lg the header has no room for the links, so they live here. Without
// this the whole site is unreachable on a phone.
export default function NavDrawer({ open, onClose }) {
  const { pathname } = useLocation()

  // Any navigation closes it, including the browser's own back button.
  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Escape closes, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => event.key === 'Escape' && onClose()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          className="fixed inset-0 z-50 lg:hidden"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 size-full bg-auren-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.nav
            variants={panel}
            aria-label="Main"
            className="absolute inset-y-0 right-0 flex w-[min(86vw,380px)] flex-col border-l border-white/10 bg-auren-graphite/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-7 py-6">
              <span className="text-lg font-light tracking-[0.42em] text-auren-white">
                AUREN
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="-mr-1 p-1 text-auren-white/90 transition-colors hover:text-auren-blue"
              >
                <X className="size-6" strokeWidth={1.4} />
              </button>
            </div>

            <motion.ul variants={list} className="flex flex-col px-7 py-8">
              {NAV.map(({ label, to }, i) => {
                const active = to === '/' ? pathname === '/' : pathname.startsWith(to)

                return (
                  <motion.li key={label} variants={item}>
                    <Link
                      to={to}
                      onClick={onClose}
                      className="flex items-baseline gap-5 border-b border-white/10 py-5"
                    >
                      <span
                        className={`text-[11px] tracking-[0.2em] ${
                          active ? 'text-auren-blue' : 'text-auren-muted/50'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-[1.6rem] font-light tracking-[-0.01em] ${
                          active ? 'text-auren-white' : 'text-auren-silver/80'
                        }`}
                      >
                        {label}
                      </span>
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>

            <div className="mt-auto px-7 pb-9">
              <Link
                to="/contact?reason=test-drive"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-auren-white px-8 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-auren-black"
              >
                Book a test drive
              </Link>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-auren-muted/70">
                hello@auren.com
              </p>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
