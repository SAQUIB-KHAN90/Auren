import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCw } from 'lucide-react'
import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import useNearViewport from '@/hooks/useNearViewport'

const GalleryStage = lazy(() => import('./GalleryStage'))

gsap.registerPlugin(ScrollTrigger)

const CARS = [
  {
    id: 'gt',
    slug: 'gt',
    name: 'AUREN GT',
    line: 'Grand tourer',
    url: '/models/3d-mclaren-720s-sports-car.glb',
    spin: -0.5,
    length: 4.6,
    blurb:
      'The flagship. Long-legged, quiet at a cruise, and quick enough to make the distance disappear.',
    specs: [
      ['680', 'hp'],
      ['3.2', 's'],
      ['620', 'km'],
    ],
  },
  {
    id: 'coupe-s',
    slug: 'coupe-s',
    name: 'AUREN Coupé S',
    line: 'Everyday sports',
    url: '/models/chevrolet_corvette_c7_stingray.glb',
    spin: -0.55,
    length: 4.5,
    blurb:
      'The one you drive on a Tuesday. Same drivetrain philosophy, softened for the commute and the weekend both.',
    specs: [
      ['495', 'hp'],
      ['3.9', 's'],
      ['580', 'km'],
    ],
  },
  {
    id: 'zr',
    slug: 'zr-edition',
    name: 'AUREN ZR Edition',
    line: 'Limited run',
    url: '/models/chevrolet_corvette_zr1_c7.glb',
    spin: -0.5,
    length: 4.55,
    blurb:
      'Two hundred cars. Carbon aero, stiffer springs, and a rear wing that earns its drag at speed.',
    specs: [
      ['755', 'hp'],
      ['2.9', 's'],
      ['540', 'km'],
    ],
  },
  {
    id: 'vector',
    slug: 'vector',
    name: 'AUREN Vector',
    line: 'Hypercar',
    url: '/models/2025_chevrolet_corvette_zr1.glb',
    spin: -0.5,
    length: 4.7,
    blurb:
      'The halo. Everything we know about aero and power delivery, with nothing held back for the next car.',
    specs: [
      ['1064', 'hp'],
      ['2.3', 's'],
      ['490', 'km'],
    ],
  },
  {
    id: 'gtr',
    slug: 'gt-r',
    name: 'AUREN GT-R',
    line: 'Competition',
    url: '/models/2010_chevrolet_corvette_c6.r.glb',
    spin: -0.5,
    length: 4.65,
    blurb:
      'Homologated for endurance racing. Stripped, caged, and the reason the road cars stop as well as they go.',
    specs: [
      ['590', 'hp'],
      ['3.1', 's'],
      ['24', 'h'],
    ],
  },
]

export default function Gallery() {
  const [stageRef, stageNear] = useNearViewport()
  const [active, setActive] = useState(0)
  // Models load only once they have been visited, then stay on the rail.
  const [mounted, setMounted] = useState(() => new Set([0]))
  const root = useRef(null)
  const copy = useRef(null)
  const [stageReady, setStageReady] = useState(false)

  const go = useCallback((next) => {
    const index = (next + CARS.length) % CARS.length
    setActive(index)
    setMounted((prev) => (prev.has(index) ? prev : new Set(prev).add(index)))
  }, [])

  // Arrow keys move through the range whenever the gallery is on screen.
  useEffect(() => {
    const onKey = (event) => {
      if (!root.current) return
      const box = root.current.getBoundingClientRect()
      if (box.bottom < 0 || box.top > window.innerHeight) return
      if (event.key === 'ArrowRight') go(active + 1)
      if (event.key === 'ArrowLeft') go(active - 1)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, go])

  // The copy block re-plays whenever the car changes.
  useLayoutEffect(() => {
    if (!copy.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-slide] > *', {
        opacity: 0,
        y: 22,
        stagger: 0.07,
        duration: 0.8,
        ease: 'power3.out',
      })
    }, copy)

    return () => ctx.revert()
  }, [active])

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
        defaults: { ease: 'power3.out', duration: 1 },
      })

      tl.from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')
        .from(q('[data-anim="stage"]'), { opacity: 0, scale: 0.95, duration: 1.3 }, '-=0.8')
        .from(q('[data-anim="rail"]'), { opacity: 0, y: 24, duration: 0.8 }, '-=0.8')
    }, root)

    return () => ctx.revert()
  }, [])

  const car = CARS[active]

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-auren-black py-28 text-auren-white lg:py-36"
    >
      <div className="pointer-events-none absolute left-1/2 top-[46%] -z-10 size-[min(1000px,110vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.12),transparent_72%)] blur-2xl" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14">
        {/* ---- heading ---- */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-anim="eyebrow" className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">06</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                The range
              </span>
            </div>

            <h2 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-white">Five cars.</span>
              </span>
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-blue">One idea, five answers.</span>
              </span>
            </h2>
          </div>

          <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80 lg:pb-3">
            From the grand tourer you live with to the car we built to win on
            Sunday. Take each one in your hands — drag to turn it, then move
            along the range.
          </p>
        </div>

        {/* ---- the slide ---- */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-6">
          {/* copy */}
          <div ref={copy} className="order-2 lg:order-1">
            <div data-slide>
              <p className="text-[10px] uppercase tracking-[0.3em] text-auren-blue">
                {car.line}
              </p>
              <h3 className="mt-5 text-[clamp(2rem,3.4vw,2.9rem)] font-light leading-[1.1] tracking-[-0.02em]">
                {car.name}
              </h3>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.85] text-auren-silver/80">
                {car.blurb}
              </p>

              <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
                {car.specs.map(([value, unit], i) => (
                  <div key={i}>
                    <dd className="flex items-baseline gap-1.5 text-3xl font-light leading-none">
                      {value}
                      <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                        {unit}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                to={`/vehicles/${car.slug}`}
                className="group mt-10 inline-flex items-center gap-4 border-b border-white/25 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
              >
                Configure {car.name}
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>

          {/* stage */}
          <div
            ref={stageRef}
            data-anim="stage"
            className="relative order-1 h-[min(56vh,460px)] w-full cursor-grab active:cursor-grabbing lg:order-2 lg:h-[min(66vh,580px)]"
          >
            {stageNear && (
              <Suspense fallback={null}>
                <GalleryStage
                  cars={CARS}
                  active={active}
                  mounted={mounted}
                  onReady={() => setStageReady(true)}
                />
              </Suspense>
            )}

            <span className="pointer-events-none absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-auren-muted/70">
              <RotateCw className="size-3.5" strokeWidth={1.4} />
              {stageNear && !stageReady ? 'Loading' : 'Drag to rotate'}
            </span>
          </div>
        </div>

        {/* ---- rail ---- */}
        <div
          data-anim="rail"
          className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <ol className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {CARS.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`text-[11px] tracking-[0.2em] transition-colors ${
                      i === active ? 'text-auren-blue' : 'text-auren-muted/55'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      i === active
                        ? 'text-auren-white'
                        : 'text-auren-muted/55 group-hover:text-auren-silver'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex items-center gap-4">
            <span className="mr-2 text-[11px] tracking-[0.2em] text-auren-muted">
              {String(active + 1).padStart(2, '0')}
              <span className="text-auren-muted/50"> / {String(CARS.length).padStart(2, '0')}</span>
            </span>

            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous vehicle"
              className="grid size-12 place-items-center rounded-full border border-white/25 transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next vehicle"
              className="grid size-12 place-items-center rounded-full border border-white/25 transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
            >
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
