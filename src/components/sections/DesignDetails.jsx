import { Disc3, Lightbulb, Scan, Sofa } from 'lucide-react'
// Close-ups from Unsplash (free licence). Source photo ids, in case they need swapping:
// headlights 1763313299304-606adcbcc965 · wheels 1621712151262-60bd142ba19f
// bodywork 1773236321529-fe13541e95f2 · interior 1616196334411-1d8d09708ca6
import bodyworkShot from '@/assets/details/bodywork.webp'
import headlightShot from '@/assets/details/headlights.webp'
import interiorShot from '@/assets/details/interior.webp'
import wheelShot from '@/assets/details/wheels.webp'
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DETAILS = [
  {
    id: 'light',
    shot: headlightShot,
    icon: Lightbulb,
    label: 'Headlights',
    title: 'A signature you read at 200 m',
    copy:
      'Two matrix blades sit behind a single lens. Eighty-four addressable pixels shape the beam around oncoming traffic without ever dropping the road.',
    facts: [
      ['84', 'pixels'],
      ['5 200', 'K'],
    ],
  },
  {
    id: 'wheel',
    shot: wheelShot,
    icon: Disc3,
    label: 'Wheels',
    title: 'Forged, flow-formed, and quiet',
    copy:
      'A 21-inch forged rim with closed aero inserts. Nine kilos lighter per corner than cast, and worth eleven kilometres of range at motorway speed.',
    facts: [
      ['21', 'inch'],
      ['-9', 'kg'],
    ],
  },
  {
    id: 'body',
    shot: bodyworkShot,
    icon: Scan,
    label: 'Bodywork',
    title: 'One crease, carried end to end',
    copy:
      'The shoulder line is pressed in a single stroke, so the reflection never breaks between the front wing and the tail. Panel gaps hold to three millimetres.',
    facts: [
      ['3', 'mm'],
      ['0.21', 'cd'],
    ],
  },
  {
    id: 'cabin',
    shot: interiorShot,
    icon: Sofa,
    label: 'Interior materials',
    title: 'Chosen by hand, finished by hand',
    copy:
      'Vegetable-tanned leather, a wool-blend weave from a mill in Yorkshire, and open-pore ash. Nothing in the cabin is painted to look like something else.',
    facts: [
      ['4', 'finishes'],
      ['92', '% natural'],
    ],
  },
]

const SWATCHES = [
  { name: 'Slate leather', tone: 'linear-gradient(145deg,#2b313a,#14181e)' },
  { name: 'Wool weave', tone: 'linear-gradient(145deg,#6d7480,#3d434c)' },
  { name: 'Open-pore ash', tone: 'linear-gradient(145deg,#8a7a63,#4a4036)' },
  { name: 'Brushed alloy', tone: 'linear-gradient(145deg,#d6dae0,#787f89)' },
]

export default function DesignDetails() {
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const frame = useRef(null)

  // Heading, frame and index come in on scroll — same cadence as the other sections.
  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
        defaults: { ease: 'power3.out', duration: 1 },
      })

      tl.from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')
        .from(q('[data-anim="frame"]'), {
          opacity: 0,
          scale: 1.06,
          clipPath: 'inset(16% 0% 16% 0%)',
          duration: 1.4,
        }, '-=0.7')
        .from(q('[data-anim="row"]'), { opacity: 0, x: 26, stagger: 0.1, duration: 0.8 }, '-=0.9')
        .from(q('[data-anim="swatch"]'), { opacity: 0, y: 18, stagger: 0.07, duration: 0.6 }, '-=0.6')

      // The close-up drifts a little against the scroll, so it reads as a real lens.
      gsap.to(q('[data-art]'), {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  // Each switch: the frame wipes, the photograph lands, then a light passes over it.
  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          q('[data-art]'),
          { opacity: 0, scale: 1.16, clipPath: 'inset(0% 0% 100% 0%)' },
          { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2 },
        )
        // a slow push in, so the still never sits completely still
        .to(q('[data-art]'), { scale: 1.07, duration: 9, ease: 'none' }, '-=0.2')
        .fromTo(
          q('[data-sweep]'),
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 1, duration: 1.5, ease: 'power2.inOut' },
          '-=9.4',
        )
        .to(q('[data-sweep]'), { opacity: 0, duration: 0.3 }, '-=0.3')
        .fromTo(
          q('[data-caption] > *'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.7 },
          '-=10.4',
        )
    }, frame)

    return () => ctx.revert()
  }, [active])


  const detail = DETAILS[active]

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-auren-black py-28 text-auren-white lg:py-36"
    >
      <div className="pointer-events-none absolute right-[-12%] top-[22%] -z-10 size-[min(820px,85vw)] rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.11),transparent_70%)] blur-2xl" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14">
        {/* ---- heading ---- */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-anim="eyebrow" className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">07</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                Design details
              </span>
            </div>

            <h2 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-white">Look closer.</span>
              </span>
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-blue">It holds up.</span>
              </span>
            </h2>
          </div>

          <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80 lg:pb-3">
            Four places where the car gives itself away — the light signature,
            the forged rim, a single pressed crease, and what your hands land on
            inside.
          </p>
        </div>

        {/* ---- viewer ---- */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-6">
          {/* the lens */}
          <div
            ref={frame}
            data-anim="frame"
            className="relative order-1 overflow-hidden rounded-3xl border border-white/10 bg-auren-graphite/40"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden">
              {/* kept as one node across switches, so the scroll parallax stays attached */}
              <div data-art className="absolute inset-[-8%]">
                <img
                  src={detail.shot}
                  alt={`${detail.label} — ${detail.title}`}
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>

              {/* the light that passes over the still on every switch */}
              <div
                data-sweep
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0"
              />

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_8%,transparent_58%,rgba(9,11,14,0.58))]" />

              {/* framing marks */}
              <div className="pointer-events-none absolute inset-6 border border-white/10" />
              <span className="pointer-events-none absolute left-6 top-6 size-4 border-l border-t border-auren-blue/70" />
              <span className="pointer-events-none absolute right-6 top-6 size-4 border-r border-t border-auren-blue/70" />
              <span className="pointer-events-none absolute bottom-6 left-6 size-4 border-b border-l border-auren-blue/70" />
              <span className="pointer-events-none absolute bottom-6 right-6 size-4 border-b border-r border-auren-blue/70" />

              <span className="pointer-events-none absolute left-10 top-10 text-[10px] uppercase tracking-[0.28em] text-auren-muted/80">
                {String(active + 1).padStart(2, '0')} / {String(DETAILS.length).padStart(2, '0')} · {detail.label}
              </span>
            </div>

            {/* caption */}
            <div data-caption className="border-t border-white/10 p-8 lg:p-10">
              <h3 className="text-[clamp(1.5rem,2.3vw,2.1rem)] font-light leading-[1.2] tracking-[-0.02em]">
                {detail.title}
              </h3>
              <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.85] text-auren-silver/75">
                {detail.copy}
              </p>
              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
                {detail.facts.map(([value, unit]) => (
                  <div key={unit}>
                    <dd className="flex items-baseline gap-1.5 text-2xl font-light leading-none">
                      {value}
                      <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                        {unit}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* index + materials */}
          <div className="order-2 flex flex-col">
            <ol className="flex flex-col">
              {DETAILS.map(({ id, icon: Icon, label, title }, i) => (
                <li key={id} data-anim="row">
                  <motion.button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-current={i === active}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="group relative w-full border-t border-white/10 py-7 text-left last:border-b"
                  >
                    <span
                      className={`absolute left-0 top-0 h-px bg-auren-blue transition-[width] duration-700 ease-out ${
                        i === active ? 'w-full' : 'w-0'
                      }`}
                    />

                    <div className="flex items-center gap-5">
                      <Icon
                        className={`size-5 shrink-0 transition-colors duration-500 ${
                          i === active ? 'text-auren-blue' : 'text-auren-muted/60'
                        }`}
                        strokeWidth={1.4}
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-[11px] uppercase tracking-[0.24em] transition-colors duration-500 ${
                            i === active ? 'text-auren-white' : 'text-auren-muted/70'
                          }`}
                        >
                          {label}
                        </p>
                        <p
                          className={`mt-2 truncate text-[13px] leading-relaxed transition-colors duration-500 ${
                            i === active ? 'text-auren-silver/80' : 'text-auren-muted/40'
                          }`}
                        >
                          {title}
                        </p>
                      </div>
                      <span className="ml-auto text-[11px] tracking-[0.2em] text-auren-muted/50">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </motion.button>
                </li>
              ))}
            </ol>

            {/* materials */}
            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-auren-muted">
                In the cabin
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-5">
                {SWATCHES.map(({ name, tone }) => (
                  <li key={name} data-anim="swatch">
                    <motion.div
                      whileHover={{ scale: 1.03, rotate: -0.6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="h-20 w-full rounded-2xl border border-white/10"
                      style={{ backgroundImage: tone }}
                    />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-auren-muted/80">
                      {name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
