import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Cinematic frames from Unsplash (free licence). Source photo ids:
// banner 1603328199263-ebe2c5162b42 · dawn 1776331149094-9d90115155df
// drive 1788664549110-f6b5c1bf13d2 · night 1533584793166-1c9548836381
import banner from '@/assets/lifestyle/banner.webp'
import dawn from '@/assets/lifestyle/dawn.webp'
import drive from '@/assets/lifestyle/drive.webp'
import night from '@/assets/lifestyle/night.webp'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  {
    time: '05:40',
    place: 'Cap de Formentor',
    title: 'You leave before the island is awake',
    copy:
      'Forty minutes of switchbacks with nobody on them. The car is quiet enough that you hear the sea on the left the whole way up, which is the part nobody tells you about.',
    shot: dawn,
  },
  {
    time: '19:12',
    place: 'The long way back',
    title: 'The detour stops being a detour',
    copy:
      'Six hundred kilometres is a number on a spec sheet until it is the reason you take the coast instead of the motorway. You stop when you want to, not when the gauge says.',
    shot: drive,
  },
  {
    time: '23:30',
    place: 'Carrer de la Princesa',
    title: 'It parks like it belongs there',
    copy:
      'No crowd around it. No noise when it arrives. The car is as comfortable outside a restaurant at midnight as it is on an empty mountain at dawn — which was always the brief.',
    shot: night,
  },
]

export default function Lifestyle() {
  const root = useRef(null)
  const stage = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
        defaults: { ease: 'power3.out', duration: 1 },
      })

      tl.from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')

      // The banner opens like a letterbox, then the quote lands on top of it.
      const frame = gsap.timeline({
        scrollTrigger: { trigger: stage.current, start: 'top 82%' },
        defaults: { ease: 'power3.out' },
      })

      frame
        .from(q('[data-anim="banner"]'), { clipPath: 'inset(32% 0% 32% 0%)', duration: 1.5 })
        .from(q('[data-anim="quote"] span'), { yPercent: 110, stagger: 0.1, duration: 1.1 }, '-=0.9')
        .from(q('[data-anim="sign"]'), { opacity: 0, y: 16, duration: 0.8 }, '-=0.6')

      // Everything with a plate drifts against the scroll at its own rate.
      q('[data-plate]').forEach((node) => {
        gsap.fromTo(
          node,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: node.closest('[data-frame]') || node,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      // Each chapter wipes in from its own side.
      q('[data-chapter]').forEach((node, i) => {
        gsap.timeline({
          scrollTrigger: { trigger: node, start: 'top 80%' },
          defaults: { ease: 'power3.out' },
        })
          .from(node.querySelector('[data-frame]'), {
            clipPath: i % 2 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
            duration: 1.3,
          })
          .from(node.querySelectorAll('[data-text] > *'), {
            opacity: 0,
            y: 26,
            stagger: 0.08,
            duration: 0.9,
          }, '-=0.95')
          .from(node.querySelector('[data-rule]'), {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1,
          }, '-=0.9')
      })

      gsap.from(q('[data-anim="close"] > *'), {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="close"]')[0], start: 'top 85%' },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-auren-black py-28 text-auren-white lg:py-36"
    >
      <div className="pointer-events-none absolute left-[-10%] top-[8%] -z-10 size-[min(760px,80vw)] rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.1),transparent_70%)] blur-2xl" />

      {/* ---- heading ---- */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-anim="eyebrow" className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">08</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                The life around it
              </span>
            </div>

            <h2 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-white">A car is a day</span>
              </span>
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-blue">you get to keep.</span>
              </span>
            </h2>
          </div>

          <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80 lg:pb-3">
            We did not set out to build the fastest thing on the road. We set
            out to build the one you would take the long way home in. One day,
            start to finish.
          </p>
        </div>
      </div>

      {/* ---- the cinematic frame ---- */}
      <figure ref={stage} className="relative mt-16 lg:mt-20">
        <div
          data-anim="banner"
          data-frame
          className="relative h-[min(72vh,620px)] w-full overflow-hidden"
        >
          <img
            data-plate
            src={banner}
            alt="An empty road running into morning fog"
            className="absolute inset-[-10%] size-[120%] object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-auren-black via-auren-black/35 to-auren-black/70" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-auren-black to-transparent" />

          <figcaption className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <blockquote
              data-anim="quote"
              className="max-w-[22ch] text-[clamp(1.8rem,4.2vw,3.4rem)] font-light leading-[1.14] tracking-[-0.02em]"
            >
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="block">Build the car</span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="block">people take</span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-blue">the long way in.</span>
              </span>
            </blockquote>

            <p
              data-anim="sign"
              className="mt-9 text-[10px] uppercase tracking-[0.3em] text-auren-muted"
            >
              The brief, 2019 — still on the wall
            </p>
          </figcaption>
        </div>
      </figure>

      {/* ---- the day, in three chapters ---- */}
      <div className="mx-auto mt-24 max-w-[1500px] px-6 md:px-10 lg:mt-32 lg:px-14">
        <ol className="flex flex-col gap-24 lg:gap-32">
          {CHAPTERS.map(({ time, place, title, copy, shot }, i) => (
            <li
              key={time}
              data-chapter
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 ? 'lg:[&>figure]:order-2' : ''
              }`}
            >
              <motion.figure
                data-frame
                whileHover={{ scale: 1.012 }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"
              >
                <img
                  data-plate
                  src={shot}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-[-10%] size-[120%] object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_55%,rgba(9,11,14,0.6))]" />

                <figcaption className="absolute bottom-7 left-7 flex items-center gap-4">
                  <span className="text-[11px] tracking-[0.24em] text-auren-white">{time}</span>
                  <span className="h-px w-8 bg-white/35" />
                  <span className="text-[10px] uppercase tracking-[0.26em] text-auren-muted">
                    {place}
                  </span>
                </figcaption>
              </motion.figure>

              <div data-text className="lg:px-4">
                <span className="text-[11px] tracking-[0.3em] text-auren-blue">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 max-w-[18ch] text-[clamp(1.7rem,3vw,2.6rem)] font-light leading-[1.16] tracking-[-0.02em]">
                  {title}
                </h3>
                <div data-rule className="mt-8 h-px w-24 bg-auren-blue/60" />
                <p className="mt-8 max-w-[44ch] text-[15px] leading-[1.85] text-auren-silver/80">
                  {copy}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ---- close ---- */}
        <div
          data-anim="close"
          className="mt-24 flex flex-col gap-10 border-t border-white/10 pt-14 lg:mt-32 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-[26ch] text-[clamp(1.5rem,2.6vw,2.2rem)] font-light leading-[1.22] tracking-[-0.02em]">
            Everything else is just
            <span className="text-auren-blue"> getting there</span>.
          </p>

          <a
            href="#"
            className="group inline-flex items-center gap-4 border-b border-white/25 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
          >
            Book a day with one
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>
    </section>
  )
}
