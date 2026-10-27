import {
  ArrowUpRight,
  BatteryCharging,
  Cpu,
  Gauge,
  Layers,
  Radar,
  ShieldCheck,
  Wind,
} from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '@/components/layout/SiteHeader'
import FinalCta from '@/components/sections/FinalCta'
import { AeroDiagram, PackDiagram, SensorDiagram } from '@/components/innovation/TechDiagrams'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    id: 'energy',
    icon: BatteryCharging,
    label: 'Energy',
    title: 'A cell with nothing liquid in it',
    lede: 'Solid-state chemistry, built in-house. More range in less space, stable under load, and charging that stays fast deep into the pack.',
    body: 'A conventional lithium-ion cell spends part of its volume on an electrolyte that has to be kept cool and calm. Ours does not have one. The solid separator lets us run the pack harder without the thermal headroom a liquid cell needs, which is why the charge curve stays flat to 80% instead of tapering at 55%. The pack is structural: it carries load between the axles rather than sitting on top of a floor that does.',
    stats: [
      ['102', 'kWh usable'],
      ['780', 'km, best case'],
      ['350', 'kW peak'],
      ['8', 'year warranty'],
    ],
    diagram: 'pack',
    note: '10 – 80% in 18 minutes, measured at 15 °C ambient.',
  },
  {
    id: 'drive',
    icon: Gauge,
    label: 'Drive',
    title: 'Torque decided a thousand times a second',
    lede: 'Up to four motors, each addressed independently, with a two-speed reduction on the rear axle.',
    body: 'Splitting torque between four motors is only useful if you can decide the split faster than the car changes attitude. Ours runs the calculation every millisecond against yaw, steering angle, wheel slip and what the suspension is telling it about the surface. The rear axle has two ratios — a short one that gets the car out of a corner and a long one that keeps the motors efficient at a cruise.',
    stats: [
      ['1064', 'hp, Vector'],
      ['2.3', 's to 100'],
      ['1000', 'Hz control loop'],
      ['2', 'speed rear axle'],
    ],
    diagram: null,
    note: 'Figures quoted for the quad-motor Vector. Rear-drive cars use a single ratio.',
  },
  {
    id: 'chassis',
    icon: Wind,
    label: 'Chassis & aero',
    title: 'A shape argued over in the tunnel',
    lede: 'Drag of 0.19 on the Aero, air suspension that reads the road ahead, and aero surfaces that move when they need to.',
    body: 'Flush glazing, covered rear arches and a floor that is genuinely flat from axle to axle. The suspension scans the surface 18 metres ahead and sets each corner before the wheel arrives, so the car stops reacting and starts anticipating. Above 160 km/h the rear wing and two underbody flaps come into play; below it they stay stowed, because drag you do not need is range you do not have.',
    stats: [
      ['0.19', 'drag coefficient'],
      ['18', 'm road preview'],
      ['4.8', '° rear steer'],
      ['140', 'kg downforce'],
    ],
    diagram: 'aero',
    note: 'Downforce quoted at 200 km/h with the aero package deployed.',
  },
  {
    id: 'sensing',
    icon: Radar,
    label: 'Sensing',
    title: 'Thirty-two sensors, one model of the road',
    lede: 'Cameras, 4D imaging radar and a roof-mounted lidar, fused into a single picture rather than three competing ones.',
    body: 'Each sensor type fails differently. Cameras struggle into low sun, radar is poor on stationary objects, lidar dislikes heavy spray. Fusing them at the raw level instead of the object level means the weaknesses do not line up. The car holds a live model of everything within 250 metres and will drive itself on approved roads up to 130 km/h, handing back with a ten-second warning rather than a chime.',
    stats: [
      ['32', 'sensors'],
      ['250', 'm range'],
      ['3', 'Level, approved roads'],
      ['10', 's handover'],
    ],
    diagram: 'sensor',
    note: 'Level 3 operation is geofenced and depends on local type approval.',
  },
  {
    id: 'cockpit',
    icon: Cpu,
    label: 'Cockpit',
    title: 'Software that gets better after you buy it',
    lede: 'One curved surface, two neural chips, and a car that updates itself overnight.',
    body: 'The 14-inch display replaced forty-one switches, which was only defensible because the software learns. It knows the route you drive on a Tuesday, pre-conditions the cabin before you reach it, and moves the controls you actually use to the top. Updates arrive over the air and install while the car is parked; the drivetrain and chassis get them too, not just the screen.',
    stats: [
      ['14', 'inch display'],
      ['2', 'neural chips'],
      ['41', 'switches removed'],
      ['0', 'cost for updates'],
    ],
    diagram: null,
    note: 'Over-the-air updates cover drivetrain, chassis and cabin software.',
  },
  {
    id: 'materials',
    icon: Layers,
    label: 'Materials',
    title: 'Nothing painted to look like something else',
    lede: 'A carbon monocoque on the hypercars, recycled aluminium everywhere else, and a cabin that is what it says it is.',
    body: 'The Vector and Strato sit on a 68 kg carbon tub. The rest of the range uses an aluminium structure that is 71% recycled content and designed to be taken apart at end of life rather than shredded. Inside, the leather is vegetable-tanned, the weave comes from a mill in Yorkshire, and the trim is open-pore ash — no film, no print, no plastic pretending to be metal.',
    stats: [
      ['68', 'kg carbon tub'],
      ['71', '% recycled alloy'],
      ['92', '% natural cabin'],
      ['4', 'cabin finishes'],
    ],
    diagram: null,
    note: 'Recycled content verified to ISO 14021 by an external auditor.',
  },
]

const HEADLINE_FIGURES = [
  { value: 780, unit: 'km', label: 'Longest range', decimals: 0 },
  { value: 18, unit: 'min', label: '10 – 80% charge', decimals: 0 },
  { value: 32, unit: '', label: 'Sensors on board', decimals: 0 },
  { value: 0.19, unit: 'cd', label: 'Lowest drag', decimals: 2 },
]

const TIMELINE = [
  ['2019', 'The brief', 'Two pages, one sentence that mattered: build the car people take the long way in.'],
  ['2021', 'First pack', 'A solid-state cell that survived a full cycle on the bench. It took nine months to repeat it.'],
  ['2023', 'First tub', 'The carbon monocoque comes in at 68 kg, eleven under target.'],
  ['2024', 'Level 3 approval', 'Hands-off operation signed off on approved roads in the first three markets.'],
  ['2026', 'Vector', 'Four motors, a thousand-hertz control loop, and everything we had been saving.'],
  ['2028', 'Second generation', 'A denser cell and a pack that carries more of the structure. In testing now.'],
]

const PRINCIPLES = [
  { icon: ShieldCheck, label: 'Five-star safety across the range' },
  { icon: Cpu, label: 'Every car on the same software' },
  { icon: Layers, label: 'Designed to come apart again' },
  { icon: Wind, label: 'Aero before power, always' },
]

const DIAGRAMS = { pack: PackDiagram, sensor: SensorDiagram, aero: AeroDiagram }

export default function Innovation() {
  const [active, setActive] = useState(PILLARS[0].id)
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')
        .from(q('[data-anim="intro"] > *'), { opacity: 0, y: 22, stagger: 0.08, duration: 0.85 }, '-=0.8')

      // Headline figures count up as they arrive.
      q('[data-count]').forEach((node) => {
        const to = Number(node.dataset.count)
        const decimals = Number(node.dataset.decimals || 0)
        const proxy = { v: 0 }

        gsap.to(proxy, {
          v: to,
          duration: 1.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 90%' },
          onUpdate() {
            node.textContent = proxy.v.toFixed(decimals)
          },
        })
      })

      // Each pillar reveals, and tells the sticky index that it is in view.
      q('[data-pillar]').forEach((node) => {
        gsap.timeline({
          scrollTrigger: { trigger: node, start: 'top 78%' },
          defaults: { ease: 'power3.out' },
        })
          .from(node.querySelectorAll('[data-pillar-head] > *'), {
            opacity: 0,
            y: 26,
            stagger: 0.08,
            duration: 0.85,
          })
          .from(node.querySelectorAll('[data-pillar-stat]'), {
            opacity: 0,
            y: 20,
            stagger: 0.07,
            duration: 0.7,
          }, '-=0.5')
          .from(node.querySelector('[data-pillar-figure]'), {
            opacity: 0,
            scale: 0.96,
            duration: 1,
          }, '-=0.9')

        ScrollTrigger.create({
          trigger: node,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: ({ isActive }) => isActive && setActive(node.dataset.pillar),
        })
      })

      // Diagram internals, once their pillar is on screen.
      q('[data-pillar-figure]').forEach((figure) => {
        const cells = figure.querySelectorAll('[data-cell]')
        const fields = figure.querySelectorAll('[data-field]')
        const nodes = figure.querySelectorAll('[data-node]')
        const streams = figure.querySelectorAll('[data-stream]')
        const draws = figure.querySelectorAll('[data-draw]')
        // A fresh config per tween: GSAP takes ownership of the vars object it is
        // handed, so sharing one scrollTrigger literal across several tweens
        // leaves every one after the first with a corrupted instance.
        const onView = () => ({ scrollTrigger: { trigger: figure, start: 'top 82%' } })

        if (cells.length) {
          gsap.from(cells, {
            scaleY: 0,
            stagger: { each: 0.035, from: 'start' },
            duration: 0.8,
            ease: 'power3.out',
            ...onView(),
          })
        }

        if (fields.length) {
          gsap.from(fields, {
            opacity: 0,
            scale: 0.4,
            stagger: 0.09,
            duration: 1,
            ease: 'power3.out',
            ...onView(),
          })
          gsap.from(nodes, {
            opacity: 0,
            stagger: 0.06,
            duration: 0.5,
            delay: 0.4,
            ...onView(),
          })
        }

        if (streams.length) {
          streams.forEach((path, i) => {
            const length = path.getTotalLength()
            gsap.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                duration: 1.5,
                delay: i * 0.12,
                ease: 'power2.inOut',
                ...onView(),
              },
            )
          })
        }

        draws.forEach((path) => {
          const length = path.getTotalLength()
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', ...onView() },
          )
        })
      })

      // Timeline rail draws down as you pass it.
      const rail = q('[data-anim="rail"]')[0]
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: rail.parentElement,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: true,
            },
          },
        )
      }

      gsap.from(q('[data-anim="step"]'), {
        opacity: 0,
        x: -24,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="step"]')[0], start: 'top 82%' },
      })

      gsap.from(q('[data-anim="principle"]'), {
        opacity: 0,
        y: 18,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="principle"]')[0], start: 'top 88%' },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-auren-black text-auren-white">
      <SiteHeader />

      <main ref={root} className="relative isolate">
        {/* The glow is clipped by its own wrapper rather than by `main`: an
            overflow-hidden ancestor stops anything inside from sticking. */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 size-[min(1150px,125vw)] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.15),transparent_70%)] blur-2xl" />
        </div>

        <div className="mx-auto max-w-[1500px] px-6 pt-20 md:px-10 lg:px-14 lg:pt-28">
          {/* ---- heading ---- */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div data-anim="eyebrow" className="flex items-center gap-5">
                <span className="text-[11px] tracking-[0.3em] text-auren-silver">
                  {String(PILLARS.length).padStart(2, '0')}
                </span>
                <span className="h-px w-10 bg-white/25" />
                <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                  Innovation &amp; technology
                </span>
              </div>

              <h1 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-white">Six systems.</span>
                </span>
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-blue">One car underneath.</span>
                </span>
              </h1>
            </div>

            <div data-anim="intro" className="lg:pb-3">
              <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80">
                Nothing here is bought in and badged. The cell chemistry, the
                control software and the structure are ours, which is the only
                reason they work together as well as they do.
              </p>
              <Link
                to="/vehicles"
                className="group mt-7 inline-flex items-center gap-4 border-b border-white/25 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
              >
                See it in the range
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>

          {/* ---- headline figures ---- */}
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-y border-white/10 py-12 lg:grid-cols-4 lg:gap-x-10">
            {HEADLINE_FIGURES.map(({ value, unit, label, decimals }) => (
              <div key={label}>
                <dd className="flex items-baseline gap-2 text-[clamp(2.1rem,4vw,3.4rem)] font-light leading-none tracking-[-0.02em]">
                  <span data-count={value} data-decimals={decimals}>
                    0
                  </span>
                  {unit && (
                    <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                      {unit}
                    </span>
                  )}
                </dd>
                <dt className="mt-3 text-[10px] uppercase tracking-[0.24em] text-auren-muted">
                  {label}
                </dt>
              </div>
            ))}
          </dl>

          {/* ---- the six pillars, with a sticky index beside them ---- */}
          <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,0.26fr)_minmax(0,1fr)] lg:gap-16">
            <nav className="hidden lg:block">
              <div className="sticky top-32">
                <p className="text-[10px] uppercase tracking-[0.3em] text-auren-muted">
                  Systems
                </p>
                <ol className="mt-7 flex flex-col gap-1">
                  {PILLARS.map(({ id, label }, i) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        aria-current={active === id}
                        className="group flex items-center gap-4 py-2.5"
                      >
                        <span
                          className={`text-[11px] tracking-[0.2em] transition-colors duration-300 ${
                            active === id ? 'text-auren-blue' : 'text-auren-muted/45'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`h-px transition-all duration-500 ${
                            active === id ? 'w-7 bg-auren-blue' : 'w-3 bg-white/15'
                          }`}
                        />
                        <span
                          className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                            active === id
                              ? 'text-auren-white'
                              : 'text-auren-muted/55 group-hover:text-auren-silver'
                          }`}
                        >
                          {label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <ol className="flex flex-col gap-24 lg:gap-32">
              {PILLARS.map(({ id, icon: Icon, label, title, lede, body, stats, diagram, note }, i) => {
                const Diagram = diagram ? DIAGRAMS[diagram] : null

                return (
                  <li key={id} id={id} data-pillar={id} className="scroll-mt-32">
                    <div data-pillar-head>
                      <div className="flex items-center gap-5">
                        <span className="inline-grid size-11 place-items-center rounded-2xl border border-white/12 bg-white/[0.04]">
                          <Icon className="size-5 text-auren-blue" strokeWidth={1.4} />
                        </span>
                        <span className="text-[11px] tracking-[0.2em] text-auren-muted/60">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-auren-muted">
                          {label}
                        </span>
                      </div>

                      <h2 className="mt-8 max-w-[22ch] text-[clamp(1.8rem,3.4vw,2.9rem)] font-light leading-[1.14] tracking-[-0.02em]">
                        {title}
                      </h2>
                      <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.8] text-auren-silver">
                        {lede}
                      </p>
                      <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.9] text-auren-silver/70">
                        {body}
                      </p>
                    </div>

                    {Diagram && (
                      <div
                        data-pillar-figure
                        className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 lg:p-10"
                      >
                        <Diagram />
                      </div>
                    )}

                    <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/10 pt-9 sm:grid-cols-4">
                      {stats.map(([value, caption]) => (
                        <div key={caption} data-pillar-stat>
                          <dd className="text-2xl font-light leading-none tracking-[-0.01em]">
                            {value}
                          </dd>
                          <dt className="mt-3 text-[10px] uppercase tracking-[0.2em] text-auren-muted">
                            {caption}
                          </dt>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-7 text-[11px] leading-relaxed text-auren-muted/70">{note}</p>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* ---- how it got here ---- */}
          <div className="mt-28 border-t border-white/10 pt-16 lg:mt-36">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.14] tracking-[-0.02em]">
                Nine years,
                <span className="text-auren-blue"> six of them quiet.</span>
              </h2>
              <p className="max-w-[38ch] text-[15px] leading-[1.85] text-auren-silver/75">
                Most of this was built before anyone outside the company had
                driven one of our cars.
              </p>
            </div>

            <div className="relative mt-16 pl-10">
              <span className="absolute left-[3px] top-1 h-full w-px bg-white/10" />
              <span
                data-anim="rail"
                className="absolute left-[3px] top-1 h-full w-px origin-top bg-auren-blue"
              />

              <ol className="flex flex-col gap-12">
                {TIMELINE.map(([year, title, copy]) => (
                  <li key={year} data-anim="step" className="relative">
                    <span className="absolute -left-10 top-1.5 size-[7px] rounded-full bg-auren-blue ring-4 ring-auren-black" />
                    <p className="text-[11px] tracking-[0.24em] text-auren-blue">{year}</p>
                    <h3 className="mt-3 text-xl font-light tracking-[-0.01em]">{title}</h3>
                    <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.85] text-auren-silver/75">
                      {copy}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ---- principles ---- */}
          <ul className="mt-24 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-white/10 pb-28 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:pb-36">
            {PRINCIPLES.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                data-anim="principle"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="flex items-start gap-3.5"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-auren-muted" strokeWidth={1.4} />
                <span className="text-[11px] uppercase leading-relaxed tracking-[0.2em] text-auren-silver">
                  {label}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </main>

      <FinalCta />
    </div>
  )
}
