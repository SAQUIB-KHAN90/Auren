import { ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import car from '@/assets/m4-cutout.webp'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = ['Innovation', 'Sustainability', 'A better tomorrow']

export default function BrandIntro() {
  const root = useRef(null)
  const carRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector
      const ease = 'power3.out'

      // One timeline for the whole left column, played once as it enters.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
        defaults: { ease, duration: 1 },
      })

      tl.from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="rule"]'), { scaleX: 0, transformOrigin: 'left center', duration: 0.8 }, '<0.1')
        // Each headline line wipes up from behind its own clip, so the words
        // arrive rather than fade.
        .from(q('[data-anim="line"] span'), {
          yPercent: 115,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
        }, '-=0.5')
        .from(q('[data-anim="copy"]'), { opacity: 0, y: 24 }, '-=0.7')
        .from(q('[data-anim="cta"]'), { opacity: 0, y: 24 }, '-=0.8')
        .from(q('[data-anim="accent"]'), { scaleY: 0, transformOrigin: 'top center', duration: 0.9 }, '<')
        .from(q('[data-anim="pillar"]'), { opacity: 0, y: 16, stagger: 0.1, duration: 0.7 }, '-=0.6')

      // The car slides in from the right, then keeps drifting as you scroll —
      // a slow parallax against the static copy.
      gsap.from(carRef.current, {
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
        opacity: 0,
        x: 90,
        duration: 1.4,
        ease: 'power3.out',
      })

      gsap.to(carRef.current, {
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: -11,
        ease: 'none',
      })

      gsap.to(q('[data-anim="glow"]'), {
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
        xPercent: -8,
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
      {/* a single cool pool of light behind the car, nothing else */}
      <div
        data-anim="glow"
        className="pointer-events-none absolute right-[-10%] top-1/2 -z-10 size-[min(900px,85vw)] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.16),rgba(76,141,255,0.05)_45%,transparent_72%)] blur-xl"
      />

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-16 px-6 md:px-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 lg:px-14 lg:pr-28">
        {/* ---- copy ---- */}
        <div>
          <div data-anim="eyebrow" className="flex items-center gap-5">
            <span className="text-[11px] tracking-[0.3em] text-auren-silver">02</span>
            <span data-anim="rule" className="h-px w-10 bg-white/25" />
            <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
              Brand introduction
            </span>
          </div>

          <h2 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
            {[
              ['Not just a drive.', 'text-auren-silver'],
              ['A different', 'text-auren-white'],
              ['perspective.', 'text-auren-blue'],
            ].map(([text, tone]) => (
              <span key={text} data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className={`block ${tone}`}>{text}</span>
              </span>
            ))}
          </h2>

          <p
            data-anim="copy"
            className="mt-9 max-w-[46ch] text-[15px] leading-[1.85] text-auren-silver/80"
          >
            At AUREN, we believe in more than just getting you from one place to
            another. We create electric vehicles that change the way you see the
            world — with purpose, precision and a new perspective on what&rsquo;s
            possible.
          </p>

          <div className="mt-12 flex items-stretch gap-8">
            <span
              data-anim="accent"
              className="w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"
            />
            <button
              data-anim="cta"
              type="button"
              className="group inline-flex items-center gap-5 rounded-full border border-white/30 py-4 pl-8 pr-6 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue"
            >
              Explore our vision
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* ---- car ---- */}
        <figure ref={carRef} className="relative">
          <img
            src={car}
            alt="AUREN coupe, three-quarter front view"
            className="relative z-10 w-full select-none drop-shadow-[0_40px_60px_rgba(0,0,0,0.65)]"
            draggable={false}
          />
          {/* the pool of light the car stands in, standing in for a floor */}
          <div className="pointer-events-none absolute inset-x-[8%] bottom-[2%] z-0 h-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(140,180,240,0.28),transparent_75%)] blur-md" />
        </figure>
      </div>

      {/* ---- slide index ---- */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:right-14">
        {['01', '02', '03', '04'].map((n) => (
          <div key={n} className="flex flex-col items-end gap-2">
            <span
              className={`text-[11px] tracking-[0.18em] ${
                n === '02' ? 'text-auren-blue' : 'text-auren-muted/55'
              }`}
            >
              {n}
            </span>
            <span className={n === '02' ? 'h-px w-7 bg-auren-blue' : 'h-px w-4 bg-white/15'} />
          </div>
        ))}
      </div>

      {/* ---- pillars ---- */}
      <div className="mt-20 flex items-center gap-6 px-6 md:px-10 lg:mt-28 lg:px-14">
        <span className="hidden h-px w-24 bg-gradient-to-r from-auren-blue/60 to-transparent lg:block" />
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {PILLARS.map((pillar, i) => (
            <li key={pillar} data-anim="pillar" className="flex items-center gap-6">
              {i > 0 && <span className="h-px w-10 bg-white/15" />}
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-auren-blue/90">
                {pillar}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
