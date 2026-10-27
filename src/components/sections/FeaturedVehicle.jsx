import { ArrowUpRight, RotateCw } from 'lucide-react'
import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import useNearViewport from '@/hooks/useNearViewport'

const ShowcaseStage = lazy(() => import('./ShowcaseStage'))

gsap.registerPlugin(ScrollTrigger)

const PAINTS = [
  { name: 'Frozen Silver', hex: '#ffffff', swatch: '#d7dbe0' },
  { name: 'Auren Blue', hex: '#5f93e8', swatch: '#4C8DFF' },
  { name: 'Graphite', hex: '#59616b', swatch: '#2c333c' },
  { name: 'Solar Bronze', hex: '#c79a62', swatch: '#b98a4e' },
  { name: 'Midnight', hex: '#2d3645', swatch: '#141a23' },
]

const SPECS = [
  { label: 'Power', value: '680', unit: 'hp' },
  { label: 'Top speed', value: '250', unit: 'km/h' },
  { label: 'Range', value: '620', unit: 'km' },
  { label: 'Drivetrain', value: 'AWD', unit: '' },
]

export default function FeaturedVehicle() {
  const [stageRef, stageNear] = useNearViewport()
  const [paint, setPaint] = useState(PAINTS[0])
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
        defaults: { ease: 'power3.out', duration: 1 },
      })

      tl.from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')
        .from(q('[data-anim="stage"]'), { opacity: 0, scale: 0.94, duration: 1.4 }, '-=0.9')
        .from(q('[data-anim="swatch"]'), { opacity: 0, y: 18, stagger: 0.07, duration: 0.6 }, '-=0.9')
        .from(q('[data-anim="spec"]'), { opacity: 0, y: 18, stagger: 0.08, duration: 0.6 }, '-=0.5')
        .from(q('[data-anim="link"]'), { opacity: 0, y: 18, duration: 0.7 }, '-=0.4')

      gsap.to(q('[data-anim="halo"]'), {
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
        yPercent: 14,
        ease: 'none',
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-auren-black py-28 text-auren-white lg:py-36"
    >
      <div
        data-anim="halo"
        className="pointer-events-none absolute left-1/2 top-[42%] -z-10 size-[min(1100px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.14),rgba(76,141,255,0.04)_48%,transparent_72%)] blur-2xl"
      />

      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14 lg:pr-28">
        {/* ---- heading ---- */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-anim="eyebrow" className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">03</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                Featured vehicle
              </span>
            </div>

            <h2 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-white">AUREN</span>
              </span>
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-blue">GT&nbsp;Coupé.</span>
              </span>
            </h2>
          </div>

          <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80 lg:pb-3">
            Our flagship grand tourer. Spin it, try it in every finish, and see
            how the light moves across the bodywork before you ever step into a
            showroom.
          </p>
        </div>

        {/* ---- stage ---- */}
        <div
          ref={stageRef}
          data-anim="stage"
          className="relative mt-10 h-[min(62vh,560px)] w-full cursor-grab active:cursor-grabbing lg:mt-4 lg:h-[min(70vh,640px)]"
        >
          {stageNear && (
            <Suspense fallback={null}>
              <ShowcaseStage paint={paint.hex} />
            </Suspense>
          )}

          <span className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-auren-muted/70">
            <RotateCw className="size-3.5" strokeWidth={1.4} />
            Drag to rotate
          </span>
        </div>

        {/* ---- paint + specs ---- */}
        <div className="mt-12 flex flex-col gap-12 border-t border-white/10 pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-auren-muted">
              Paint finish
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {PAINTS.map((option) => {
                const active = option.name === paint.name
                return (
                  <button
                    key={option.name}
                    data-anim="swatch"
                    type="button"
                    onClick={() => setPaint(option)}
                    aria-pressed={active}
                    title={option.name}
                    className={`grid size-11 place-items-center rounded-full border transition-colors duration-300 ${
                      active ? 'border-auren-blue' : 'border-white/20 hover:border-white/50'
                    }`}
                  >
                    <span
                      className="size-7 rounded-full"
                      style={{ background: option.swatch }}
                    />
                  </button>
                )
              })}
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-auren-silver">
              {paint.name}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-4 lg:gap-x-14">
            {SPECS.map(({ label, value, unit }) => (
              <div key={label} data-anim="spec">
                <dt className="text-[10px] uppercase tracking-[0.22em] text-auren-muted">
                  {label}
                </dt>
                <dd className="mt-2 flex items-baseline gap-1.5 text-2xl font-light leading-none">
                  {value}
                  {unit && (
                    <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                      {unit}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <a
            data-anim="link"
            href="#"
            className="group inline-flex items-center gap-4 self-start border-b border-white/25 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
          >
            Vehicle details
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>

      {/* ---- slide index ---- */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:right-14">
        {['01', '02', '03', '04'].map((n) => (
          <div key={n} className="flex flex-col items-end gap-2">
            <span
              className={`text-[11px] tracking-[0.18em] ${
                n === '03' ? 'text-auren-blue' : 'text-auren-muted/55'
              }`}
            >
              {n}
            </span>
            <span className={n === '03' ? 'h-px w-7 bg-auren-blue' : 'h-px w-4 bg-white/15'} />
          </div>
        ))}
      </div>
    </section>
  )
}
