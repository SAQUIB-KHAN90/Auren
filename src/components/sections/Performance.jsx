import { Gauge, Timer, Zap } from 'lucide-react'
import { Suspense, lazy, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import useNearViewport from '@/hooks/useNearViewport'

const DriveStage = lazy(() => import('./DriveStage'))

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { icon: Zap, label: 'Range', to: 620, unit: 'km', decimals: 0, note: 'WLTP combined' },
  { icon: Timer, label: '0 – 100 km/h', to: 3.2, unit: 's', decimals: 1, note: 'with launch' },
  { icon: Gauge, label: 'Top speed', to: 250, unit: 'km/h', decimals: 0, note: 'limited' },
  { icon: Zap, label: '10 – 80% charge', to: 18, unit: 'min', decimals: 0, note: '350 kW peak' },
]

// Speed against time, and state of charge against minutes on a 350 kW charger.
const ACCELERATION = [0, 62, 118, 160, 191, 214, 231, 242, 248, 250]
const CHARGE = [10, 26, 41, 54, 64, 72, 77, 80]
const TORQUE = [38, 62, 84, 97, 100, 96, 88, 76, 63, 49]

// Catmull-ish smoothing — the same trick the bento charts use, no dependency.
function smoothPath(points) {
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const k = 0.17
    d += `C${p1[0] + (p2[0] - p0[0]) * k},${p1[1] + (p2[1] - p0[1]) * k} ${
      p2[0] - (p3[0] - p1[0]) * k
    },${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]},${p2[1]}`
  }
  return d
}

function toPoints(values, width, height, pad = 6) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  return values.map((v, i) => [
    (i / (values.length - 1)) * width,
    height - pad - ((v - min) / span) * (height - pad * 2),
  ])
}

export default function Performance() {
  const [stageRef, stageNear] = useNearViewport()
  const root = useRef(null)
  const scene = useRef(null)
  const progress = useRef(0)

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      // Scroll drives the camera: the stage sticks while the travel plays out.
      ScrollTrigger.create({
        trigger: scene.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (t) => {
          progress.current = t.progress
        },
      })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
        defaults: { ease: 'power3.out', duration: 1 },
      })

      tl.from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')

      // Numbers count up the first time the figures come into view.
      q('[data-count]').forEach((node) => {
        const to = Number(node.dataset.count)
        const decimals = Number(node.dataset.decimals || 0)
        const proxy = { v: 0 }

        gsap.to(proxy, {
          v: to,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 88%' },
          onUpdate() {
            node.textContent = proxy.v.toFixed(decimals)
          },
        })
      })

      // Each chart draws itself in, then the bars grow.
      q('[data-draw]').forEach((path) => {
        const length = path.getTotalLength()
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: path, start: 'top 90%' },
          },
        )
      })

      gsap.from(q('[data-anim="bar"]'), {
        scaleY: 0,
        transformOrigin: 'bottom center',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="bars"]')[0], start: 'top 88%' },
      })

      gsap.from(q('[data-anim="card"]'), {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('[data-anim="card"]')[0], start: 'top 85%' },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const accel = toPoints(ACCELERATION, 300, 120)
  const charge = toPoints(CHARGE, 300, 120)

  return (
    <section ref={root} className="relative isolate bg-auren-black text-auren-white">
      {/* ---- heading ---- */}
      <div className="mx-auto max-w-[1500px] px-6 pt-28 md:px-10 lg:px-14 lg:pt-36">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-anim="eyebrow" className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">05</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                Performance
              </span>
            </div>

            <h2 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-white">Quiet at a standstill.</span>
              </span>
              <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                <span className="block text-auren-blue">Relentless in motion.</span>
              </span>
            </h2>
          </div>

          <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80 lg:pb-3">
            Scroll to ride the camera around the car as it runs — the figures
            below are the ones that matter when the road opens up.
          </p>
        </div>
      </div>

      {/* ---- full-width driving scene, camera driven by scroll ---- */}
      <div ref={scene} className="relative mt-12 h-[220vh]">
        <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_50%_75%,rgba(76,141,255,0.14),transparent_70%)]" />
          {stageNear && (
            <Suspense fallback={null}>
              <DriveStage progress={progress} />
            </Suspense>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-auren-black to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-auren-black via-auren-black/70 to-transparent" />

          <span className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.28em] text-auren-muted/70">
            Keep scrolling
          </span>
        </div>
      </div>

      {/* ---- counters ---- */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14">
        <dl className="grid grid-cols-2 gap-x-10 gap-y-10 border-t border-white/10 pt-12 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, label, to, unit, decimals, note }) => (
            <div key={label}>
              <Icon className="size-5 text-auren-blue" strokeWidth={1.3} />
              <dt className="mt-5 text-[10px] uppercase tracking-[0.24em] text-auren-muted">
                {label}
              </dt>
              <dd className="mt-3 flex items-baseline gap-2 text-[clamp(2.2rem,4vw,3.4rem)] font-light leading-none tracking-[-0.02em]">
                <span data-count={to} data-decimals={decimals}>
                  0
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-auren-silver">
                  {unit}
                </span>
              </dd>
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-auren-muted/80">
                {note}
              </p>
            </div>
          ))}
        </dl>

        {/* ---- charts ---- */}
        <div className="mt-16 grid gap-5 pb-28 lg:grid-cols-3 lg:gap-6 lg:pb-36">
          <article
            data-anim="card"
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.26em] text-auren-muted">
              Acceleration
            </p>
            <p className="mt-3 text-xl font-light">0 – 250 km/h in 9.4 s</p>

            <svg viewBox="0 0 300 120" className="mt-7 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="accel-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#4C8DFF" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#4C8DFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 40, 80, 120].map((y) => (
                <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
              ))}
              <path
                d={`${smoothPath(accel)}L300,120L0,120Z`}
                fill="url(#accel-fill)"
              />
              <path
                data-draw
                d={smoothPath(accel)}
                fill="none"
                stroke="#4C8DFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </article>

          <article
            data-anim="card"
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.26em] text-auren-muted">
              Charge curve
            </p>
            <p className="mt-3 text-xl font-light">10 – 80% in 18 min</p>

            <svg viewBox="0 0 300 120" className="mt-7 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="charge-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#C8CDD3" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#C8CDD3" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 40, 80, 120].map((y) => (
                <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
              ))}
              <path d={`${smoothPath(charge)}L300,120L0,120Z`} fill="url(#charge-fill)" />
              <path
                data-draw
                d={smoothPath(charge)}
                fill="none"
                stroke="#C8CDD3"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </article>

          <article
            data-anim="card"
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.26em] text-auren-muted">
              Power delivery
            </p>
            <p className="mt-3 text-xl font-light">680 hp, flat from 0 rpm</p>

            <div data-anim="bars" className="mt-9 flex h-[120px] items-end gap-2">
              {TORQUE.map((value, i) => (
                <span
                  key={i}
                  data-anim="bar"
                  className={`flex-1 rounded-sm ${
                    value >= 95 ? 'bg-auren-blue' : 'bg-auren-blue/30'
                  }`}
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
