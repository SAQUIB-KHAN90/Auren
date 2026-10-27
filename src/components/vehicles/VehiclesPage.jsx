import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '@/components/layout/SiteHeader'
import FinalCta from '@/components/sections/FinalCta'
import { CATEGORIES, VEHICLES, formatPrice } from '@/data/vehicles'

gsap.registerPlugin(ScrollTrigger)

export default function VehiclesPage() {
  const [filter, setFilter] = useState('All')
  const root = useRef(null)
  const grid = useRef(null)

  const shown = useMemo(
    () => (filter === 'All' ? VEHICLES : VEHICLES.filter((v) => v.category === filter)),
    [filter],
  )

  // Heading plays once; the grid replays whenever the filter changes.
  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')
        .from(q('[data-anim="intro"]'), { opacity: 0, y: 20, duration: 0.9 }, '-=0.8')
        .from(q('[data-anim="filter"]'), { opacity: 0, y: 16, stagger: 0.05, duration: 0.6 }, '-=0.6')
    }, root)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector
      gsap.from(q('[data-card]'), {
        opacity: 0,
        y: 46,
        stagger: 0.07,
        duration: 0.95,
        ease: 'power3.out',
      })

      // Each cover drifts a little inside its frame as the page scrolls.
      q('[data-plate]').forEach((node) => {
        gsap.fromTo(
          node,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: node.closest('[data-card]') || node,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, grid)

    return () => ctx.revert()
  }, [filter])

  return (
    <div className="bg-auren-black text-auren-white">
      <SiteHeader />

      <main ref={root} className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[min(1100px,120vw)] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.14),transparent_70%)] blur-2xl" />

        <div className="mx-auto max-w-[1500px] px-6 pt-20 md:px-10 lg:px-14 lg:pt-28">
          {/* ---- heading ---- */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div data-anim="eyebrow" className="flex items-center gap-5">
                <span className="text-[11px] tracking-[0.3em] text-auren-silver">
                  {String(VEHICLES.length).padStart(2, '0')}
                </span>
                <span className="h-px w-10 bg-white/25" />
                <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                  The full range
                </span>
              </div>

              <h1 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-white">Twelve cars.</span>
                </span>
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-blue">One way of thinking.</span>
                </span>
              </h1>
            </div>

            <p
              data-anim="intro"
              className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80 lg:pb-3"
            >
              Every car here shares a drivetrain philosophy and a set of
              materials. What changes is how far it goes, how hard it stops, and
              who it is for.
            </p>
          </div>

          {/* ---- filters ---- */}
          <div className="mt-14 flex flex-wrap items-center gap-3 border-b border-white/10 pb-7">
            {CATEGORIES.map((item) => {
              const count =
                item === 'All'
                  ? VEHICLES.length
                  : VEHICLES.filter((v) => v.category === item).length
              const active = filter === item

              return (
                <motion.button
                  key={item}
                  type="button"
                  data-anim="filter"
                  onClick={() => setFilter(item)}
                  whileTap={{ scale: 0.97 }}
                  aria-pressed={active}
                  className={`rounded-full border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active
                      ? 'border-auren-blue bg-auren-blue/12 text-auren-white'
                      : 'border-white/15 text-auren-muted hover:border-white/35 hover:text-auren-silver'
                  }`}
                >
                  {item}
                  <span className="ml-2 text-auren-muted/60">{count}</span>
                </motion.button>
              )
            })}
          </div>

          {/* ---- grid ---- */}
          <div
            ref={grid}
            className="grid gap-6 pb-28 pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 lg:pb-36"
          >
            {shown.map((vehicle) => (
              <motion.article
                key={vehicle.slug}
                data-card
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="group"
              >
                <Link
                  to={`/vehicles/${vehicle.slug}`}
                  className="block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-colors duration-500 hover:border-auren-blue/45"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      data-plate
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-[-8%] size-[116%] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(9,11,14,0.92),rgba(9,11,14,0.15)_55%,transparent)]" />

                    <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-auren-black/45 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.22em] text-auren-silver backdrop-blur-sm">
                      {vehicle.category}
                    </span>

                    <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.26em] text-auren-blue">
                          {vehicle.tagline}
                        </p>
                        <h2 className="mt-2 text-[22px] font-light leading-tight tracking-[-0.01em]">
                          {vehicle.name}
                        </h2>
                      </div>
                      <ArrowUpRight
                        className="size-5 shrink-0 text-auren-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-auren-blue"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <p className="min-h-[3.4em] text-[13px] leading-[1.75] text-auren-silver/70">
                      {vehicle.summary}
                    </p>

                    <dl className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                      {[
                        [vehicle.specs.power, 'hp'],
                        [vehicle.specs.sprint.toFixed(1), 's'],
                        [vehicle.specs.range, 'km'],
                      ].map(([value, unit]) => (
                        <div key={unit}>
                          <dd className="flex items-baseline gap-1 text-lg font-light leading-none">
                            {value}
                            <span className="text-[10px] uppercase tracking-[0.18em] text-auren-silver">
                              {unit}
                            </span>
                          </dd>
                        </div>
                      ))}
                      <div className="text-right">
                        <dd className="text-[11px] uppercase tracking-[0.18em] text-auren-muted">
                          from {formatPrice(vehicle.price)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <FinalCta />
    </div>
  )
}
