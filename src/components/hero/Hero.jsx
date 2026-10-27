import { motion } from 'motion/react'
import { ArrowRight, BatteryCharging, Gauge, Menu, Play, Zap } from 'lucide-react'
import { Suspense, lazy, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV } from '@/data/nav'
import NavDrawer from '@/components/layout/NavDrawer'
import backdrop from '@/assets/hero-backdrop.webp'
import carStill from '@/assets/m4-cutout-clean.webp'
import useMediaQuery from '@/hooks/useMediaQuery'

const CarStage = lazy(() => import('./CarStage'))


const STATS = [
  { icon: Zap, label: 'Up to', value: '620', unit: 'km', caption: 'Range' },
  { icon: Gauge, label: '0 – 100 km/h', value: '3.2', unit: 's', caption: 'Acceleration' },
  { icon: BatteryCharging, label: 'Fast charging', value: '10 – 80', unit: '%', caption: 'in 18 min' },
]

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [carReady, setCarReady] = useState(false)
  const handleCarReady = useCallback(() => setCarReady(true), [])

  // Phones and tablets get a still of the same car: the canvas costs about two
  // megabytes of three.js and model before it draws anything.
  const render3D = useMediaQuery('(min-width: 1024px)')
  const loaded = !render3D || carReady

  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-auren-black text-auren-white lg:block">
      {/* ---- backdrop ---- */}
      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 size-full object-cover object-[70%_center]"
      />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(100deg,#05070a_8%,rgba(7,10,14,0.82)_30%,rgba(7,10,14,0.15)_58%,transparent_78%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-auren-black via-auren-black/75 to-transparent" />

      {/* ---- the car — draggable, so it keeps its own hit area ---- */}
      {/* The car takes its own band in the stack on a phone. The left fade is a
          desktop device — it only matters where the copy sits over the car. */}
      <div
        className={`relative z-0 order-3 h-[38vh] min-h-[230px] w-full shrink-0 cursor-grab transition-opacity duration-[1400ms] ease-out active:cursor-grabbing lg:absolute lg:inset-y-0 lg:left-[38%] lg:right-0 lg:order-none lg:h-auto lg:w-auto lg:translate-y-[11%] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.3)_10%,#000_26%,#000_100%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.3)_10%,#000_26%,#000_100%)] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {render3D ? (
          <Suspense fallback={null}>
            <CarStage onReady={handleCarReady} />
          </Suspense>
        ) : (
          <img
            src={carStill}
            alt="AUREN coupe"
            className="size-full object-contain object-bottom"
            draggable={false}
          />
        )}
      </div>

      {/* ---- nav ---- */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={rise}
        className="relative z-20 order-1 flex items-center justify-between gap-8 px-6 py-7 md:px-10 lg:order-none lg:px-14"
      >
        <a href="#" className="text-xl font-light tracking-[0.42em] text-auren-white">
          AUREN
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map(({ label, to }, i) => {
            const inner = (
              <>
                <span className={i === 0 ? 'text-auren-white' : undefined}>{label}</span>
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-auren-blue transition-all duration-300 ${
                    i === 0 ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </>
            )
            const cls =
              'group relative text-[11px] font-medium uppercase tracking-[0.22em] text-auren-muted transition-colors hover:text-auren-white'

            // About and Contact have no page yet, so they stay inert.
            return to ? (
              <Link key={label} to={to} className={cls}>
                {inner}
              </Link>
            ) : (
              <a key={label} href="#" className={cls}>
                {inner}
              </a>
            )
          })}
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
      </motion.header>

      {/* ---- copy ---- */}
      <div className="pointer-events-none relative z-10 order-2 px-6 pt-8 md:px-10 lg:order-none lg:px-14 lg:pt-20">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={rise}
          className="text-[11px] font-medium uppercase tracking-[0.34em] text-auren-muted"
        >
          The next generation of mobility
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={rise}
          className="mt-6 max-w-[16ch] text-[clamp(3rem,8vw,6.6rem)] font-light leading-[0.98] tracking-[-0.02em]"
        >
          The Future,
          <br />
          <span className="text-auren-blue">Refined.</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={rise}
          className="mt-8 max-w-[42ch] text-base leading-[1.75] text-auren-silver/85"
        >
          AUREN blends cutting-edge technology with timeless design to create an
          electric driving experience like no other.
        </motion.p>

        <motion.div custom={3} initial="hidden" animate="show" variants={rise}>
          <Link
            to="/vehicles"
            className="pointer-events-auto group mt-10 inline-flex items-center gap-5 rounded-full border border-white/30 py-4 pl-8 pr-6 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue"
          >
            Explore the range
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>

      {/* ---- model load progress ---- */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 h-px transition-opacity duration-500 ${
          loaded || !render3D ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <motion.div
          className="h-px w-1/3 bg-auren-blue"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ---- slide index ---- */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="show"
        variants={rise}
        className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:right-14"
      >
        {['01', '02', '03', '04'].map((n, i) => (
          <button
            key={n}
            type="button"
            onClick={() => setSlide(i)}
            className="flex flex-col items-end gap-2"
          >
            <span
              className={`text-[11px] tracking-[0.18em] transition-colors ${
                i === slide ? 'text-auren-white' : 'text-auren-muted/55'
              }`}
            >
              {n}
            </span>
            <span
              className={`h-px transition-all duration-500 ${
                i === slide ? 'w-7 bg-auren-blue' : 'w-4 bg-white/15'
              }`}
            />
          </button>
        ))}
      </motion.div>

      {/* ---- scroll cue ---- */}
      <motion.div
        custom={5}
        initial="hidden"
        animate="show"
        variants={rise}
        className="absolute bottom-44 left-6 z-20 hidden items-end gap-3 lg:flex lg:left-14"
      >
        <span className="relative block h-12 w-px bg-white/15">
          <motion.span
            animate={{ y: [0, 44, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-[1.5px] top-0 size-1 rounded-full bg-auren-blue"
          />
        </span>
        <span className="pb-0.5 text-[10px] uppercase tracking-[0.28em] text-auren-muted">
          Scroll down
        </span>
      </motion.div>

      {/* ---- drag hint ---- */}
      <motion.p
        custom={6}
        initial="hidden"
        animate="show"
        variants={rise}
        className="pointer-events-none absolute bottom-44 right-6 z-10 hidden text-[10px] uppercase tracking-[0.26em] text-auren-muted/70 lg:block lg:right-14"
      >
        Drag to rotate
      </motion.p>

      {/* ---- stat bar ---- */}
      <motion.div
        custom={6}
        initial="hidden"
        animate="show"
        variants={rise}
        className="relative z-20 order-4 mt-auto px-6 pb-9 pt-2 md:px-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:order-none lg:px-14 lg:pt-0"
      >
        <div className="flex flex-col gap-6 border-t border-white/10 pt-6 sm:pt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <dl className="grid grid-cols-3 gap-3 sm:gap-0">
            {STATS.map(({ icon: Icon, label, value, unit, caption }, i) => (
              <div
                key={caption}
                className={`flex items-center gap-4 sm:px-10 ${
                  i === 0 ? 'sm:pl-0' : 'border-l border-white/10 pl-3 sm:pl-10'
                }`}
              >
                <Icon className="hidden size-5 shrink-0 text-auren-white/80 sm:block" strokeWidth={1.3} />
                <div>
                  <dt className="hidden text-[10px] uppercase tracking-[0.22em] text-auren-muted sm:block">
                    {label}
                  </dt>
                  <dd className="flex items-baseline gap-1 whitespace-nowrap text-[17px] font-light leading-none sm:mt-1 sm:gap-1.5 sm:text-2xl">
                    {value}
                    <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                      {unit}
                    </span>
                  </dd>
                  <p className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-auren-muted/80 sm:text-[10px] sm:tracking-[0.22em]">
                    {caption}
                  </p>
                </div>
              </div>
            ))}
          </dl>

          <button
            type="button"
            className="group flex items-center gap-4 self-start lg:self-auto"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 backdrop-blur-sm transition-colors duration-300 group-hover:bg-auren-blue">
              <Play className="size-4 fill-current text-auren-white" strokeWidth={0} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-auren-white">
              Watch full video
            </span>
          </button>
        </div>
      </motion.div>

      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  )
}
