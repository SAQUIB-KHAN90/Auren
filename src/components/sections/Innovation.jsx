import {
  BatteryCharging,
  Cpu,
  Gauge,
  Radar,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wifi,
} from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CAPABILITIES = [
  {
    icon: Radar,
    title: 'Intelligent driving',
    copy: 'Thirty-two sensors build a live model of the road, so the car reads the lane, the traffic and the weather before you do.',
    metric: 'Level 3',
    metricLabel: 'Autonomy',
  },
  {
    icon: Gauge,
    title: 'Digital cockpit',
    copy: 'A single 14-inch surface replaces the switchgear, learns the routes you drive, and updates itself overnight.',
    metric: '14"',
    metricLabel: 'Curved display',
  },
]

const FOOTNOTES = [
  { icon: Cpu, label: 'Dual neural chip' },
  { icon: ShieldCheck, label: '5-star safety' },
  { icon: Wifi, label: 'Over-the-air updates' },
  { icon: Smartphone, label: 'Phone as key' },
]

export default function Innovation() {
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
        .from(q('[data-anim="card"]'), { opacity: 0, y: 44, stagger: 0.12, duration: 1 }, '-=0.6')
        // The charge meter fills once the battery card is on screen.
        .from(q('[data-anim="charge"]'), {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.6,
          ease: 'power2.inOut',
        }, '-=0.5')
        .from(q('[data-anim="cell"]'), { opacity: 0, scaleY: 0.2, stagger: 0.05, duration: 0.5 }, '-=1.2')
        .from(q('[data-anim="note"]'), { opacity: 0, y: 16, stagger: 0.08, duration: 0.6 }, '-=0.8')
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-auren-black py-28 text-auren-white lg:py-36"
    >
      <div className="pointer-events-none absolute left-[-15%] top-[18%] -z-10 size-[min(760px,80vw)] rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.12),transparent_70%)] blur-2xl" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14 lg:pr-28">
        {/* ---- heading ---- */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-anim="eyebrow" className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">04</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                Innovation &amp; technology
              </span>
            </div>

            <h2 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-white">Engineered</span>
              </span>
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-blue">around the driver.</span>
              </span>
            </h2>
          </div>

          <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80 lg:pb-3">
            Three systems carry the car: a solid-state pack, a sensor stack that
            never blinks, and a cockpit that gets better the longer you own it.
          </p>
        </div>

        {/* ---- bento ---- */}
        <div className="mt-16 grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
          {/* battery — the hero card */}
          <article
            data-anim="card"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 transition-colors duration-500 hover:border-auren-blue/45 lg:p-10"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(76,141,255,0.14),transparent_62%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

            <div>
              <span className="inline-grid size-12 place-items-center rounded-2xl border border-white/12 bg-white/[0.04]">
                <BatteryCharging className="size-5 text-auren-blue" strokeWidth={1.4} />
              </span>

              <h3 className="mt-8 text-2xl font-light tracking-[-0.01em]">
                Solid-state battery
              </h3>
              <p className="mt-4 max-w-[44ch] text-[15px] leading-[1.85] text-auren-silver/75">
                A denser cell chemistry with no liquid electrolyte — more range
                in less space, stable under load, and charging that stays fast
                deep into the pack.
              </p>
            </div>

            {/* charge meter */}
            <div className="mt-12">
              <div className="flex items-end justify-between">
                <span className="text-[10px] uppercase tracking-[0.26em] text-auren-muted">
                  10 – 80% in 18 min
                </span>
                <span className="flex items-baseline gap-1.5 text-3xl font-light leading-none">
                  620
                  <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                    km
                  </span>
                </span>
              </div>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  data-anim="charge"
                  className="h-full w-[82%] rounded-full bg-gradient-to-r from-auren-blue/50 via-auren-blue to-[#9cc0ff]"
                />
              </div>

              <div className="mt-5 flex gap-1.5">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    data-anim="cell"
                    className={`h-7 flex-1 rounded-sm ${
                      i < 14 ? 'bg-auren-blue/25' : 'bg-white/[0.06]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </article>

          {/* the two stacked cards */}
          <div className="grid gap-5 lg:gap-6">
            {CAPABILITIES.map(({ icon: Icon, title, copy, metric, metricLabel }) => (
              <article
                key={title}
                data-anim="card"
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 transition-colors duration-500 hover:border-auren-blue/45"
              >
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_90%_at_100%_0%,rgba(76,141,255,0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-6">
                  <span className="inline-grid size-12 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/[0.04]">
                    <Icon className="size-5 text-auren-blue" strokeWidth={1.4} />
                  </span>

                  <div className="text-right">
                    <p className="text-2xl font-light leading-none">{metric}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-auren-muted">
                      {metricLabel}
                    </p>
                  </div>
                </div>

                <h3 className="mt-7 text-xl font-light tracking-[-0.01em]">{title}</h3>
                <p className="mt-3 max-w-[46ch] text-[14px] leading-[1.8] text-auren-silver/75">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* ---- footnotes ---- */}
        <ul className="mt-14 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-white/10 pt-10 sm:grid-cols-4">
          {FOOTNOTES.map(({ icon: Icon, label }) => (
            <li key={label} data-anim="note" className="flex items-center gap-3.5">
              <Icon className="size-4 shrink-0 text-auren-muted" strokeWidth={1.4} />
              <span className="text-[10px] uppercase tracking-[0.22em] text-auren-silver">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- slide index ---- */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:right-14">
        {['01', '02', '03', '04'].map((n) => (
          <div key={n} className="flex flex-col items-end gap-2">
            <span
              className={`text-[11px] tracking-[0.18em] ${
                n === '04' ? 'text-auren-blue' : 'text-auren-muted/55'
              }`}
            >
              {n}
            </span>
            <span className={n === '04' ? 'h-px w-7 bg-auren-blue' : 'h-px w-4 bg-white/15'} />
          </div>
        ))}
      </div>
    </section>
  )
}
