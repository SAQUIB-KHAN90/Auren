import { ArrowLeft, ArrowUpRight, BatteryCharging, Check, Gauge, Timer, Zap } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link, Navigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '@/components/layout/SiteHeader'
import FinalCta from '@/components/sections/FinalCta'
import { VEHICLES, formatPrice, getVehicle } from '@/data/vehicles'

gsap.registerPlugin(ScrollTrigger)

const SHOT_LABELS = ['Exterior', 'On the road', 'Cabin']

// Keyed on the slug so moving between cars remounts the page: the gallery
// index starts at the first shot again and every entrance animation replays.
export default function VehicleDetailRoute() {
  const { slug } = useParams()
  return <VehicleDetail key={slug} slug={slug} />
}

function VehicleDetail({ slug }) {
  const vehicle = getVehicle(slug)

  const [shot, setShot] = useState(0)
  const root = useRef(null)
  const stage = useRef(null)

  useLayoutEffect(() => {
    if (!vehicle) return undefined

    const ctx = gsap.context((self) => {
      const q = self.selector

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(q('[data-anim="crumb"]'), { opacity: 0, x: -14, duration: 0.6 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.1, duration: 1.1 }, '-=0.3')
        .from(q('[data-anim="lede"] > *'), { opacity: 0, y: 22, stagger: 0.08, duration: 0.8 }, '-=0.75')
        .from(q('[data-anim="stage"]'), { opacity: 0, scale: 1.04, clipPath: 'inset(14% 0% 14% 0%)', duration: 1.4 }, '-=1.1')
        .from(q('[data-anim="thumb"]'), { opacity: 0, y: 18, stagger: 0.07, duration: 0.6 }, '-=0.8')

      // Figures count up the first time each one comes into view.
      q('[data-count]').forEach((node) => {
        const to = Number(node.dataset.count)
        const decimals = Number(node.dataset.decimals || 0)
        const proxy = { v: 0 }

        gsap.to(proxy, {
          v: to,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 90%' },
          onUpdate() {
            node.textContent = proxy.v.toFixed(decimals)
          },
        })
      })

      gsap.from(q('[data-anim="block"]'), {
        opacity: 0,
        y: 36,
        stagger: 0.1,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="block"]')[0], start: 'top 85%' },
      })

      gsap.from(q('[data-anim="more"]'), {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="more"]')[0], start: 'top 88%' },
      })
    }, root)

    return () => ctx.revert()
  }, [vehicle])

  // Swapping shots wipes the new frame in over the old one.
  useLayoutEffect(() => {
    if (!vehicle) return undefined

    const ctx = gsap.context((self) => {
      const q = self.selector
      gsap.fromTo(
        q('[data-plate]'),
        { opacity: 0, scale: 1.1, clipPath: 'inset(0% 0% 100% 0%)' },
        { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out' },
      )
    }, stage)

    return () => ctx.revert()
  }, [shot, vehicle])

  if (!vehicle) return <Navigate to="/vehicles" replace />

  const { specs } = vehicle
  const others = VEHICLES.filter((v) => v.slug !== vehicle.slug).slice(0, 3)

  const figures = [
    { icon: Zap, label: 'Power', value: specs.power, unit: 'hp', decimals: 0 },
    { icon: Timer, label: '0 – 100 km/h', value: specs.sprint, unit: 's', decimals: 1 },
    { icon: Gauge, label: 'Range', value: specs.range, unit: 'km', decimals: 0 },
    { icon: BatteryCharging, label: '10 – 80%', value: specs.charge, unit: 'min', decimals: 0 },
  ]

  const table = [
    ['Drivetrain', specs.drivetrain],
    ['Battery', `${specs.battery} kWh`],
    ['Top speed', `${specs.topSpeed} km/h`],
    ['Kerb weight', `${specs.weight.toLocaleString('en-GB')} kg`],
    ['Category', vehicle.category],
    ['From', formatPrice(vehicle.price)],
  ]

  return (
    <div className="bg-auren-black text-auren-white">
      <SiteHeader />

      <main ref={root} className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[6%] -z-10 size-[min(900px,95vw)] rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.13),transparent_70%)] blur-2xl" />

        <div className="mx-auto max-w-[1500px] px-6 pt-10 md:px-10 lg:px-14 lg:pt-14">
          {/* ---- back ---- */}
          <Link
            data-anim="crumb"
            to="/vehicles"
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-auren-muted transition-colors duration-300 hover:text-auren-white"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.5}
            />
            All vehicles
          </Link>

          {/* ---- title ---- */}
          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-auren-blue">
                {vehicle.tagline}
              </p>
              <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.8rem)] font-light leading-[1.02] tracking-[-0.03em]">
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block">{vehicle.name}</span>
                </span>
              </h1>
            </div>

            <div data-anim="lede" className="lg:pb-3 lg:text-right">
              <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80">
                {vehicle.summary}
              </p>
              <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-auren-muted">
                From {formatPrice(vehicle.price)}
              </p>
            </div>
          </div>

          {/* ---- gallery ---- */}
          <figure ref={stage} data-anim="stage" className="mt-12 lg:mt-16">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 lg:aspect-[21/9]">
              <img
                data-plate
                src={vehicle.images[shot]}
                alt={`${vehicle.name} — ${SHOT_LABELS[shot]}`}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_10%,transparent_58%,rgba(9,11,14,0.6))]" />

              <span className="pointer-events-none absolute left-7 top-7 text-[10px] uppercase tracking-[0.28em] text-auren-muted/85">
                {String(shot + 1).padStart(2, '0')} / {String(vehicle.images.length).padStart(2, '0')}
                {' · '}
                {SHOT_LABELS[shot]}
              </span>
            </div>

            <figcaption className="mt-5 flex gap-4">
              {vehicle.images.map((src, i) => (
                <motion.button
                  key={src}
                  type="button"
                  data-anim="thumb"
                  onClick={() => setShot(i)}
                  aria-label={`Show ${SHOT_LABELS[i]}`}
                  aria-current={i === shot}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-colors duration-300 sm:h-20 sm:w-32 ${
                    i === shot ? 'border-auren-blue' : 'border-white/12 hover:border-white/35'
                  }`}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                  {i !== shot && <span className="absolute inset-0 bg-auren-black/45" />}
                </motion.button>
              ))}
            </figcaption>
          </figure>

          {/* ---- figures ---- */}
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-12 lg:grid-cols-4 lg:gap-x-10">
            {figures.map(({ icon: Icon, label, value, unit, decimals }) => (
              <div key={label}>
                <Icon className="size-5 text-auren-blue" strokeWidth={1.3} />
                <dt className="mt-5 text-[10px] uppercase tracking-[0.24em] text-auren-muted">
                  {label}
                </dt>
                <dd className="mt-3 flex items-baseline gap-2 text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-none tracking-[-0.02em]">
                  <span data-count={value} data-decimals={decimals}>
                    0
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                    {unit}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {/* ---- story, spec table, features ---- */}
          <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div data-anim="block">
              <h2 className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-light leading-[1.2] tracking-[-0.02em]">
                Why it exists
              </h2>
              <p className="mt-7 max-w-[56ch] text-[15px] leading-[1.9] text-auren-silver/80">
                {vehicle.story}
              </p>

              <ul className="mt-10 space-y-4">
                {vehicle.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4">
                    <Check className="mt-0.5 size-4 shrink-0 text-auren-blue" strokeWidth={2} />
                    <span className="text-[14px] leading-[1.75] text-auren-silver/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                  <Link
                    to={`/contact?vehicle=${vehicle.slug}&reason=test-drive`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-auren-white px-9 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-auren-black transition-colors duration-300 hover:bg-auren-blue hover:text-auren-white sm:w-auto"
                  >
                    Book a test drive
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                  <Link
                    to={`/contact?vehicle=${vehicle.slug}&reason=configure`}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/25 px-9 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue sm:w-auto"
                  >
                    Configure this car
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.5}
                    />
                  </Link>
                </motion.div>
              </div>
            </div>

            <div data-anim="block">
              <h2 className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-light leading-[1.2] tracking-[-0.02em]">
                Specification
              </h2>

              <dl className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {table.map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-6 py-4">
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-auren-muted">
                      {key}
                    </dt>
                    <dd className="text-right text-[15px] font-light text-auren-white">{value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-12 text-[10px] uppercase tracking-[0.3em] text-auren-muted">
                Finishes
              </h3>
              <ul className="mt-6 flex flex-wrap gap-3">
                {vehicle.colours.map((colour) => (
                  <li
                    key={colour}
                    className="rounded-full border border-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-auren-silver/80"
                  >
                    {colour}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- the rest of the range ---- */}
          <div className="mt-24 border-t border-white/10 pt-14 lg:mt-32">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-[clamp(1.4rem,2.4vw,2rem)] font-light tracking-[-0.02em]">
                Also in the range
              </h2>
              <Link
                to="/vehicles"
                className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-auren-muted transition-colors duration-300 hover:text-auren-blue"
              >
                See all 12
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            <div className="grid gap-6 pb-28 pt-10 sm:grid-cols-3 lg:gap-7 lg:pb-36">
              {others.map((other) => (
                <motion.div
                  key={other.slug}
                  data-anim="more"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                >
                  <Link
                    to={`/vehicles/${other.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-white/10 transition-colors duration-500 hover:border-auren-blue/45"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={other.images[0]}
                        alt={other.name}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(9,11,14,0.9),transparent_60%)]" />
                      <div className="absolute inset-x-5 bottom-5">
                        <p className="text-[9px] uppercase tracking-[0.24em] text-auren-blue">
                          {other.category}
                        </p>
                        <p className="mt-1.5 text-[17px] font-light">{other.name}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <FinalCta />
    </div>
  )
}
