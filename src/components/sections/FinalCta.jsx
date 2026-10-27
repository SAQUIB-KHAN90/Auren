import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { NAV } from '@/data/nav'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// The shipped cutout was exported on white, so its feathered edge glows on a
// dark page; this copy has the fringe pulled back to the page colour.
import car from '@/assets/m4-cutout-clean.webp'

gsap.registerPlugin(ScrollTrigger)

// Same five as the header, so the page closes on the nav it opened with.
const SOCIAL = [
  {
    label: 'GitHub',
    href: 'https://github.com/SAQUIB-KHAN90',
    title: 'github.com/SAQUIB-KHAN90',
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:saquibkhan890098@gmail.com',
    title: 'saquibkhan890098@gmail.com',
  },
  {
    label: 'Phone',
    href: 'tel:+919044500609',
    title: '+91 90445 00609',
  },
]
const LEGAL = ['Privacy', 'Terms', 'Cookies']

export default function FinalCta() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 68%' },
        defaults: { ease: 'power3.out' },
      })

      tl.from(q('[data-anim="car"]'), { opacity: 0, y: 70, scale: 0.94, duration: 1.5 })
        .from(q('[data-anim="pool"]'), { opacity: 0, scaleX: 0.5, duration: 1.2 }, '-=1.1')
        .from(q('[data-anim="line"] span'), { yPercent: 112, stagger: 0.12, duration: 1.1 }, '-=0.95')
        .from(q('[data-anim="cta"]'), { opacity: 0, y: 24, stagger: 0.1, duration: 0.9 }, '-=0.6')
        .from(q('[data-anim="rule"]'), { scaleX: 0, transformOrigin: 'left center', duration: 1.1 }, '-=0.5')
        .from(q('[data-anim="link"]'), { opacity: 0, y: 14, stagger: 0.05, duration: 0.6 }, '-=0.8')
        .from(q('[data-anim="fine"]'), { opacity: 0, duration: 0.9 }, '-=0.4')

      // The car keeps breathing once it has landed.
      gsap.to(q('[data-anim="car"]'), {
        y: -14,
        duration: 4.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={root}
      className="relative isolate overflow-hidden bg-auren-black pt-28 text-auren-white lg:pt-36"
    >
      {/* the pool of light the whole section sits in */}
      <div className="pointer-events-none absolute left-1/2 top-[12%] -z-10 size-[min(1100px,120vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.16),transparent_70%)] blur-2xl" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14">
        {/* ---- the car ---- */}
        <figure className="relative mx-auto max-w-[620px]">
          <img
            data-anim="car"
            src={car}
            alt="AUREN coupe, three-quarter front view"
            className="relative z-10 w-full select-none drop-shadow-[0_28px_40px_rgba(0,0,0,0.8)]"
            draggable={false}
          />
          <div
            data-anim="pool"
            className="pointer-events-none absolute inset-x-[10%] bottom-[3%] z-0 h-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(140,180,240,0.32),transparent_75%)] blur-md"
          />
        </figure>

        {/* ---- the ask ---- */}
        <div className="mt-10 text-center lg:mt-12">
          <h2 className="text-[clamp(2.8rem,8vw,7rem)] font-light leading-[1.02] tracking-[-0.03em]">
            <span data-anim="line" className="block overflow-hidden pb-[0.06em]">
              <span className="block">Experience</span>
            </span>
            <span data-anim="line" className="block overflow-hidden pb-[0.1em]">
              <span className="block font-serif italic text-auren-blue">
                AUREN<span className="text-auren-white">.</span>
              </span>
            </span>
          </h2>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <motion.div
              data-anim="cta"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/contact?reason=test-drive"
                className="inline-flex w-full items-center justify-center rounded-full bg-auren-white px-11 py-5 text-[12px] font-medium uppercase tracking-[0.18em] text-auren-black transition-colors duration-300 hover:bg-auren-blue hover:text-auren-white sm:w-auto"
              >
                Book a test drive
              </Link>
            </motion.div>

            <motion.a
              data-anim="cta"
              href="#"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/25 px-11 py-5 text-[12px] font-medium uppercase tracking-[0.18em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue sm:w-auto"
            >
              Find a showroom
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </motion.a>
          </div>

          {/* ---- navigation ---- */}
          <nav className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 sm:gap-x-10">
            {NAV.map(({ label, to }) => {
              const cls =
                'text-[13px] text-auren-silver/75 transition-colors duration-300 hover:text-auren-white'

              return to ? (
                <Link key={label} data-anim="link" to={to} className={cls}>
                  {label}
                </Link>
              ) : (
                <a key={label} data-anim="link" href="#" className={cls}>
                  {label}
                </a>
              )
            })}
          </nav>

          {/* ---- social ---- */}
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-9">
            {SOCIAL.map(({ label, href, title, external }) => (
              <li key={label}>
                <a
                  data-anim="link"
                  href={href}
                  title={title}
                  aria-label={`${label} — ${title}`}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
                  className="text-[11px] uppercase tracking-[0.22em] text-auren-muted/70 transition-colors duration-300 hover:text-auren-blue"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- fine print ---- */}
        <div data-anim="rule" className="mt-16 h-px w-full bg-white/10" />

        <div
          data-anim="fine"
          className="flex flex-col items-center gap-5 py-10 text-center md:flex-row md:justify-between md:text-left"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-auren-muted/60">
            © 2026 AUREN Motors · Delivery from Q3 · hello@auren.com
          </p>

          <ul className="flex items-center gap-7">
            {LEGAL.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[11px] uppercase tracking-[0.22em] text-auren-muted/60 transition-colors duration-300 hover:text-auren-silver"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- credit ---- */}
        <p
          data-anim="fine"
          className="border-t border-white/10 py-8 text-center text-[11px] uppercase tracking-[0.22em] text-auren-muted/60"
        >
          Designed and developed by{' '}
          <span className="text-auren-silver">Saquib</span>{' '}
          {/* a text glyph rather than the emoji, so it takes the brand blue
              instead of whatever red the platform paints ❤️ */}
          <span aria-hidden="true" className="not-italic text-auren-blue">
            ♥
          </span>
        </p>
      </div>
    </footer>
  )
}
