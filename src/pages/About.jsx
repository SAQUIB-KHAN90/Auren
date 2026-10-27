import { ArrowUpRight, Factory, Hammer, PenTool, Ruler } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '@/components/layout/SiteHeader'
import FinalCta from '@/components/sections/FinalCta'
import bench from '@/assets/about/bench.webp'
import clay from '@/assets/about/clay.webp'
import inspection from '@/assets/about/inspection.webp'
import line from '@/assets/about/line.webp'
import sparks from '@/assets/about/sparks.webp'
import bodywork from '@/assets/details/bodywork.webp'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: '01',
    title: 'It starts as an argument',
    copy: 'Two pages, written in 2019, that nobody has been allowed to rewrite since. Every decision on every car gets measured against them, and most of the arguments we have are about whether something still fits.',
    aside: 'Six months before the first sketch',
    shot: bodywork,
  },
  {
    n: '02',
    title: 'Then it becomes a shape',
    copy: 'We still model in clay at full size. A screen will tell you the surface is correct; only a model in a room with daylight in it will tell you the surface is right. The first GT buck was cut eleven times.',
    aside: '1:1 clay, cut by hand',
    shot: clay,
  },
  {
    n: '03',
    title: 'The hard part is underneath',
    copy: 'Pack, structure, motors and software are developed together rather than handed between teams. That is slower at the start and much faster afterwards, because nothing has to be made to fit something it was never designed around.',
    aside: 'One team, four disciplines',
    shot: sparks,
  },
  {
    n: '04',
    title: 'Then we try to break it',
    copy: 'Two point four million kilometres before a car is signed off — desert heat, Arctic cold, and eleven months of a route in the Alps that we will not describe because it is the worst road we have found.',
    aside: '2.4 million km of testing',
    shot: bench,
  },
  {
    n: '05',
    title: 'Built where it was drawn',
    copy: 'One line, in a building from 1908 that we spent two years putting right. Bodies are bonded and riveted rather than spot-welded, which is slower per car and the reason the panel gaps hold to three millimetres.',
    aside: '48 cars a day, one line',
    shot: line,
  },
  {
    n: '06',
    title: 'Nothing leaves unchecked',
    copy: 'Every car is driven on the road before it is released — not a rolling road, an actual road, by a person whose name goes in the file. About one in forty goes back inside.',
    aside: 'Road-tested, every car',
    shot: inspection,
  },
]

const FIGURES = [
  { value: 2019, label: 'Founded', decimals: 0, plain: true },
  { value: 1840, label: 'People', decimals: 0 },
  { value: 2.4, label: 'Million km tested', decimals: 1 },
  { value: 312, label: 'Patents filed', decimals: 0 },
]

const CRAFT = [
  {
    icon: PenTool,
    title: 'Drawn in Stuttgart',
    copy: 'Design, colour and materials sit in one studio with the clay room next door, so nothing is signed off on a screen alone.',
  },
  {
    icon: Ruler,
    title: 'Engineered in Graz',
    copy: 'Chassis, pack and structure. The team that argues with the designers, and wins about half the time.',
  },
  {
    icon: Factory,
    title: 'Built in Sindelfingen',
    copy: 'A single line in a converted 1908 hall. Forty-eight cars a day, bonded and riveted rather than welded.',
  },
  {
    icon: Hammer,
    title: 'Finished by hand',
    copy: 'Leather cut and stitched in-house, ash veneer matched per car, and a final polish that takes four hours.',
  },
]

const BELIEFS = [
  ['We build fewer things, properly', 'Twelve cars, one line, and no model we cannot explain the reason for.'],
  ['The right answer is usually slower', 'Bonding a body takes longer than welding it. We do it anyway, because you can see the difference in the panel gaps.'],
  ['Nothing pretends to be something else', 'No printed wood, no fake vents, no speaker noise piped in to sound like an engine.'],
  ['It has to last', 'Parts availability guaranteed for twenty years, and a structure designed to come apart again at the end.'],
]

export default function About() {
  const [step, setStep] = useState(0)
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')
        .from(q('[data-anim="intro"] > *'), { opacity: 0, y: 22, stagger: 0.08, duration: 0.85 }, '-=0.8')

      // The founding story and the banner quote.
      gsap.from(q('[data-anim="story"] > *'), {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="story"]')[0], start: 'top 80%' },
      })

      const banner = q('[data-anim="banner"]')[0]
      if (banner) {
        gsap.timeline({
          scrollTrigger: { trigger: banner, start: 'top 82%' },
          defaults: { ease: 'power3.out' },
        })
          .from(banner, { clipPath: 'inset(30% 0% 30% 0%)', duration: 1.4 })
          .from(q('[data-anim="quote"] span'), { yPercent: 110, stagger: 0.1, duration: 1.1 }, '-=0.85')

        gsap.fromTo(
          q('[data-plate]'),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: banner, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }

      // Each step drives the pinned image beside it.
      q('[data-step]').forEach((node) => {
        gsap.from(node.querySelectorAll('[data-step-body] > *'), {
          opacity: 0,
          y: 26,
          stagger: 0.08,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 78%' },
        })

        ScrollTrigger.create({
          trigger: node,
          start: 'top 58%',
          end: 'bottom 58%',
          onToggle: ({ isActive }) => isActive && setStep(Number(node.dataset.step)),
        })
      })

      // Figures count up.
      q('[data-count]').forEach((node) => {
        const to = Number(node.dataset.count)
        const decimals = Number(node.dataset.decimals || 0)
        const plain = node.dataset.plain === 'true'
        const proxy = { v: plain ? to - 12 : 0 }

        gsap.to(proxy, {
          v: to,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 90%' },
          onUpdate() {
            node.textContent = plain
              ? Math.round(proxy.v).toString()
              : proxy.v.toFixed(decimals)
          },
        })
      })

      gsap.from(q('[data-anim="craft"]'), {
        opacity: 0,
        y: 38,
        stagger: 0.1,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="craft"]')[0], start: 'top 85%' },
      })

      gsap.from(q('[data-anim="belief"]'), {
        opacity: 0,
        y: 26,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="belief"]')[0], start: 'top 85%' },
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
          <div className="absolute left-1/2 top-0 size-[min(1150px,125vw)] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.14),transparent_70%)] blur-2xl" />
        </div>

        <div className="mx-auto max-w-[1500px] px-6 pt-20 md:px-10 lg:px-14 lg:pt-28">
          {/* ---- heading ---- */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div data-anim="eyebrow" className="flex items-center gap-5">
                <span className="text-[11px] tracking-[0.3em] text-auren-silver">01</span>
                <span className="h-px w-10 bg-white/25" />
                <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                  About AUREN
                </span>
              </div>

              <h1 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-white">A small company</span>
                </span>
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-blue">that takes its time.</span>
                </span>
              </h1>
            </div>

            <div data-anim="intro" className="lg:pb-3">
              <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80">
                Eighteen hundred people, one assembly line and twelve cars. We
                are not trying to be the biggest electric manufacturer in
                Europe, and we have turned down the money that would have made
                us one.
              </p>
              <Link
                to="/innovation"
                className="group mt-7 inline-flex items-center gap-4 border-b border-white/25 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
              >
                The technology behind it
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>

          {/* ---- how it started ---- */}
          <div
            data-anim="story"
            className="mt-24 grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20"
          >
            <div>
              <h2 className="max-w-[20ch] text-[clamp(1.8rem,3.4vw,2.8rem)] font-light leading-[1.16] tracking-[-0.02em]">
                It began because somebody kept a bad car for eleven years
              </h2>
            </div>

            <div>
              <p className="text-[16px] leading-[1.85] text-auren-silver">
                Our founder ran a coachbuilding shop that fixed other people’s
                mistakes for a living. The car she drove home in every night was
                slow, loud and twenty years old, and she kept it because
                everything on it had been built by somebody who meant it.
              </p>
              <p className="mt-6 text-[15px] leading-[1.9] text-auren-silver/75">
                AUREN started in 2019 with nine people, a lease on a hall that
                was falling down, and a conviction that an electric car did not
                have to feel like an appliance. The first prototype ran in 2021.
                The first customer car left the building in 2024. We are still
                arguing about most of it.
              </p>
              <p className="mt-6 text-[15px] leading-[1.9] text-auren-silver/75">
                There is no outside investor with a seat at the table and no
                plan to list. That is the reason we can spend four hours
                polishing a car nobody will inspect that closely, and the reason
                we build forty-eight a day instead of four hundred.
              </p>
            </div>
          </div>
        </div>

        {/* ---- banner quote ---- */}
        <figure className="relative mt-24 lg:mt-32">
          <div
            data-anim="banner"
            className="relative h-[min(64vh,540px)] w-full overflow-hidden"
          >
            <img
              data-plate
              src={line}
              alt="Bodies in white on the assembly line"
              className="absolute inset-[-10%] size-[120%] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-auren-black via-auren-black/45 to-auren-black/75" />

            <figcaption className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <blockquote
                data-anim="quote"
                className="max-w-[24ch] text-[clamp(1.6rem,3.8vw,3rem)] font-light leading-[1.16] tracking-[-0.02em]"
              >
                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="block">Anyone can make</span>
                </span>
                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="block">a car quickly.</span>
                </span>
                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-blue">We are not in that race.</span>
                </span>
              </blockquote>
            </figcaption>
          </div>
        </figure>

        <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14">
          {/* ---- how we make a car ---- */}
          <div className="mt-24 lg:mt-32">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-5">
                  <span className="text-[11px] tracking-[0.3em] text-auren-silver">02</span>
                  <span className="h-px w-10 bg-white/25" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                    How we make a car
                  </span>
                </div>
                <h2 className="mt-8 max-w-[18ch] text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.14] tracking-[-0.02em]">
                  Six stages, about
                  <span className="text-auren-blue"> four years.</span>
                </h2>
              </div>

              <p className="max-w-[38ch] text-[15px] leading-[1.85] text-auren-silver/75">
                Most of it happens long before anything looks like a car. The
                last stage is a person driving it on a public road and signing
                their name.
              </p>
            </div>

            <div className="mt-16 lg:grid lg:grid-cols-2 lg:gap-16">
              {/* the frame stays put while the stages scroll past it */}
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
                    {STEPS.map(({ n, shot, title }, i) => (
                      <img
                        key={n}
                        src={shot}
                        alt={title}
                        className={`absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-out ${
                          i === step ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ))}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_10%,transparent_55%,rgba(9,11,14,0.66))]" />

                    <div className="pointer-events-none absolute inset-x-8 bottom-8 flex items-end justify-between">
                      <span className="text-[10px] uppercase tracking-[0.26em] text-auren-silver">
                        {STEPS[step].aside}
                      </span>
                      <span className="text-[11px] tracking-[0.22em] text-auren-blue">
                        {STEPS[step].n}
                        <span className="text-auren-muted/50"> / 06</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <ol>
                {STEPS.map(({ n, title, copy, aside, shot }, i) => (
                  <li
                    key={n}
                    data-step={i}
                    className="flex flex-col justify-center border-t border-white/10 py-14 first:border-t-0 first:pt-0 lg:min-h-[76vh] lg:border-t-0 lg:py-0"
                  >
                    {/* on a phone each stage carries its own frame */}
                    <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 lg:hidden">
                      <img src={shot} alt={title} loading="lazy" className="size-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(9,11,14,0.85),transparent_60%)]" />
                      <span className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.24em] text-auren-silver">
                        {aside}
                      </span>
                    </div>

                    <div data-step-body>
                      <span className="text-[11px] tracking-[0.26em] text-auren-blue">{n}</span>
                      <h3 className="mt-5 max-w-[20ch] text-[clamp(1.5rem,2.6vw,2.2rem)] font-light leading-[1.2] tracking-[-0.02em]">
                        {title}
                      </h3>
                      <p className="mt-6 max-w-[48ch] text-[15px] leading-[1.9] text-auren-silver/75">
                        {copy}
                      </p>
                      <p className="mt-6 hidden text-[10px] uppercase tracking-[0.24em] text-auren-muted lg:block">
                        {aside}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ---- figures ---- */}
          <dl className="mt-24 grid grid-cols-2 gap-x-8 gap-y-10 border-y border-white/10 py-14 lg:grid-cols-4 lg:gap-x-10">
            {FIGURES.map(({ value, label, decimals, plain }) => (
              <div key={label}>
                <dd className="text-[clamp(2.1rem,4vw,3.4rem)] font-light leading-none tracking-[-0.02em]">
                  <span data-count={value} data-decimals={decimals} data-plain={plain ? 'true' : 'false'}>
                    0
                  </span>
                </dd>
                <dt className="mt-3 text-[10px] uppercase tracking-[0.24em] text-auren-muted">
                  {label}
                </dt>
              </div>
            ))}
          </dl>

          {/* ---- where the work happens ---- */}
          <div className="mt-24">
            <div className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">03</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                Where the work happens
              </span>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {CRAFT.map(({ icon: Icon, title, copy }) => (
                <motion.article
                  key={title}
                  data-anim="craft"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 transition-colors duration-500 hover:border-auren-blue/45"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(76,141,255,0.14),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="inline-grid size-11 place-items-center rounded-2xl border border-white/12 bg-white/[0.04]">
                    <Icon className="size-5 text-auren-blue" strokeWidth={1.4} />
                  </span>
                  <h3 className="mt-7 text-lg font-light tracking-[-0.01em]">{title}</h3>
                  <p className="mt-4 text-[14px] leading-[1.8] text-auren-silver/70">{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>

          {/* ---- what we hold to ---- */}
          <div className="mt-24 border-t border-white/10 pt-16 lg:mt-32">
            <h2 className="max-w-[16ch] text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.14] tracking-[-0.02em]">
              Four things we
              <span className="text-auren-blue"> will not trade.</span>
            </h2>

            <ol className="mt-14 grid gap-x-16 gap-y-12 pb-28 sm:grid-cols-2 lg:pb-36">
              {BELIEFS.map(([title, copy], i) => (
                <li key={title} data-anim="belief">
                  <div className="flex items-baseline gap-5">
                    <span className="text-[11px] tracking-[0.24em] text-auren-blue">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-light tracking-[-0.01em]">{title}</h3>
                  </div>
                  <p className="mt-5 max-w-[46ch] pl-10 text-[15px] leading-[1.85] text-auren-silver/75">
                    {copy}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

      <FinalCta />
    </div>
  )
}
