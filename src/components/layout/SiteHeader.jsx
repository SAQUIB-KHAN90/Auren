import { Menu } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Link, NavLink } from 'react-router-dom'
import { NAV } from '@/data/nav'
import NavDrawer from '@/components/layout/NavDrawer'


const linkClass =
  'group relative text-[11px] font-medium uppercase tracking-[0.22em] text-auren-muted transition-colors hover:text-auren-white'

// The hero carries its own header so it can sit over the car. Every other page
// uses this one, which is the same bar on solid ground.
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-white/10 bg-auren-black/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-8 px-6 py-5 md:px-10 lg:px-14">
        <Link to="/" className="text-xl font-light tracking-[0.42em] text-auren-white">
          AUREN
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map(({ label, to }) =>
            to ? (
              <NavLink key={label} to={to} end={to === '/'} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-auren-white' : undefined}>{label}</span>
                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-auren-blue transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ) : (
              <a key={label} href="#" className={linkClass}>
                {label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-auren-blue transition-all duration-300 group-hover:w-full" />
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            to="/contact?reason=test-drive"
            className="hidden rounded-full border border-white/25 px-7 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue sm:block"
          >
            Book a test drive
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="p-1 text-auren-white/90 transition-colors hover:text-auren-blue lg:hidden"
          >
            <Menu className="size-7" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </motion.header>

      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
