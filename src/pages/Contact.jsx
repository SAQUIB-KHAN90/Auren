import {
  ArrowUpRight,
  Check,
  Clock,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Wrench,
} from 'lucide-react'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '@/components/layout/SiteHeader'
import FinalCta from '@/components/sections/FinalCta'
import { useSearchParams } from 'react-router-dom'
import { VEHICLES } from '@/data/vehicles'

gsap.registerPlugin(ScrollTrigger)

const REASONS = [
  'Book a test drive',
  'Configure a car',
  'Service and support',
  'Press enquiry',
  'Something else',
]

const CHANNELS = [
  {
    icon: Phone,
    label: 'Sales',
    value: '+49 711 0000 100',
    note: 'Mon – Sat, 09:00 – 19:00 CET',
    href: 'tel:+497110000100',
  },
  {
    icon: Wrench,
    label: 'Service',
    value: '+49 711 0000 200',
    note: 'Roadside assistance, 24 hours',
    href: 'tel:+497110000200',
  },
  {
    icon: Mail,
    label: 'General',
    value: 'hello@auren.com',
    note: 'We answer within one working day',
    href: 'mailto:hello@auren.com',
  },
  {
    icon: Mail,
    label: 'Press',
    value: 'press@auren.com',
    note: 'Images and specifications on request',
    href: 'mailto:press@auren.com',
  },
]

const SHOWROOMS = [
  {
    city: 'Stuttgart',
    role: 'Design studio and flagship',
    address: 'Königstraße 14, 70173 Stuttgart',
    phone: '+49 711 0000 100',
    hours: 'Mon – Sat, 09:00 – 19:00',
  },
  {
    city: 'Munich',
    role: 'Showroom',
    address: 'Maximilianstraße 32, 80539 München',
    phone: '+49 89 0000 140',
    hours: 'Mon – Sat, 10:00 – 19:00',
  },
  {
    city: 'Zurich',
    role: 'Showroom and delivery centre',
    address: 'Bahnhofstrasse 61, 8001 Zürich',
    phone: '+41 44 000 01 60',
    hours: 'Mon – Fri, 09:00 – 18:00',
  },
  {
    city: 'Milan',
    role: 'Showroom',
    address: 'Via della Spiga 26, 20121 Milano',
    phone: '+39 02 0000 180',
    hours: 'Tue – Sat, 10:00 – 19:00',
  },
]

const FAQS = [
  [
    'How long does a test drive take?',
    'Ninety minutes, on a route we have picked rather than a lap of the block. You drive it alone unless you would rather not; we will suggest a road and get out of the way.',
  ],
  [
    'What is the wait on a new car?',
    'Between five and nine months depending on the model, and twelve on the Vector. We tell you the real date at order rather than an optimistic one, and it has not moved on a customer car since 2024.',
  ],
  [
    'Can I change the specification after ordering?',
    'Up to six weeks before the build slot. Paint, wheels, cabin and most options are open until then; structural choices such as the carbon package close earlier.',
  ],
  [
    'Do you service cars outside these cities?',
    'Yes. Most service is done at your address by a mobile technician, and anything needing a lift is collected and returned. Roadside assistance runs 24 hours across Europe.',
  ],
  [
    'Do you take trade-ins?',
    'We do, including cars that are not ours. The valuation is done by an independent assessor so the number is not ours to argue with.',
  ],
]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  reason: REASONS[0],
  vehicle: '',
  message: '',
  consent: false,
}

export default function Contact() {
  const [params] = useSearchParams()

  // Arriving from a car's page prefills the enquiry. The slug is checked
  // against the range so a made-up query string cannot put junk in the form.
  const [form, setForm] = useState(() => {
    const slug = params.get('vehicle')
    const reason = params.get('reason')

    return {
      ...EMPTY,
      reason: reason === 'configure' ? REASONS[1] : REASONS[0],
      vehicle: VEHICLES.some((v) => v.slug === slug) ? slug : '',
    }
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [openFaq, setOpenFaq] = useState(0)

  const root = useRef(null)
  const formId = useId()

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Tell us who you are'
    if (!EMAIL.test(form.email)) next.email = 'We need an address that works'
    if (form.message.trim().length < 10) next.message = 'A sentence or two is plenty'
    if (!form.consent) next.consent = 'We need this to reply to you'
    return next
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    // No backend on this build: the request is simulated so the states are
    // all reachable. Point this at the real endpoint when there is one.
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 1100)
  }

  const reset = () => {
    setForm(EMPTY)
    setErrors({})
    setStatus('idle')
  }

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(q('[data-anim="eyebrow"] > *'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 })
        .from(q('[data-anim="line"] span'), { yPercent: 115, stagger: 0.12, duration: 1.1 }, '-=0.4')
        .from(q('[data-anim="intro"] > *'), { opacity: 0, y: 22, stagger: 0.08, duration: 0.85 }, '-=0.8')
        .from(q('[data-anim="field"]'), { opacity: 0, y: 20, stagger: 0.06, duration: 0.7 }, '-=0.6')

      // Each group gets its own trigger config — a shared object would be
      // taken over by the first tween and leave the rest broken.
      const reveal = (selector, vars = {}) => {
        const targets = q(selector)
        if (!targets.length) return
        gsap.from(targets, {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: targets[0], start: 'top 86%' },
          ...vars,
        })
      }

      reveal('[data-anim="channel"]')
      reveal('[data-anim="showroom"]')
      reveal('[data-anim="faq"]', { y: 22, stagger: 0.06 })
    }, root)

    return () => ctx.revert()
  }, [])

  const field =
    'w-full rounded-2xl border bg-white/[0.03] px-5 py-4 text-[15px] text-auren-white outline-none transition-colors duration-300 placeholder:text-auren-muted/50 focus:border-auren-blue'

  const border = (key) => (errors[key] ? 'border-red-400/70' : 'border-white/12')

  return (
    <div className="bg-auren-black text-auren-white">
      <SiteHeader />

      <main ref={root} className="relative isolate">
        {/* clipped by its own wrapper so nothing inside loses sticky */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 size-[min(1100px,120vw)] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(76,141,255,0.14),transparent_70%)] blur-2xl" />
        </div>

        <div className="mx-auto max-w-[1500px] px-6 pt-20 md:px-10 lg:px-14 lg:pt-28">
          {/* ---- heading ---- */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div data-anim="eyebrow" className="flex items-center gap-5">
                <span className="text-[11px] tracking-[0.3em] text-auren-silver">01</span>
                <span className="h-px w-10 bg-white/25" />
                <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                  Contact
                </span>
              </div>

              <h1 className="mt-9 text-[clamp(2.4rem,5.4vw,4.4rem)] font-light leading-[1.06] tracking-[-0.02em]">
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-white">Talk to someone</span>
                </span>
                <span data-anim="line" className="block overflow-hidden pb-[0.08em]">
                  <span className="block text-auren-blue">who builds them.</span>
                </span>
              </h1>
            </div>

            <div data-anim="intro" className="lg:pb-3">
              <p className="max-w-[40ch] text-[15px] leading-[1.85] text-auren-silver/80">
                No call centre and no chatbot. Messages go to the team in
                Stuttgart, and you will get an answer from a person with a name
                within one working day.
              </p>
            </div>
          </div>

          {/* ---- form + channels ---- */}
          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.75fr)] lg:gap-16">
            <section aria-labelledby={`${formId}-heading`}>
              <h2 id={`${formId}-heading`} className="sr-only">
                Send a message
              </h2>

              <AnimatePresence mode="wait" initial={false}>
                {status === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-3xl border border-auren-blue/35 bg-auren-blue/[0.07] p-10 lg:p-14"
                  >
                    <span className="inline-grid size-12 place-items-center rounded-2xl border border-auren-blue/40 bg-auren-blue/15">
                      <Check className="size-5 text-auren-blue" strokeWidth={2} />
                    </span>
                    <h3 className="mt-8 text-[clamp(1.5rem,2.6vw,2.1rem)] font-light tracking-[-0.02em]">
                      Thank you — that is with us.
                    </h3>
                    <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.85] text-auren-silver/80">
                      A copy is on its way to {form.email || 'your inbox'}. If it
                      is urgent, the sales line is answered until 19:00 CET.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="group mt-9 inline-flex items-center gap-4 border-b border-white/25 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-auren-white transition-colors duration-300 hover:border-auren-blue hover:text-auren-blue"
                    >
                      Send another message
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        strokeWidth={1.5}
                      />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 lg:p-10"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div data-anim="field">
                        <label
                          htmlFor={`${formId}-name`}
                          className="block text-[10px] uppercase tracking-[0.24em] text-auren-muted"
                        >
                          Name
                        </label>
                        <input
                          id={`${formId}-name`}
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={set('name')}
                          placeholder="Your name"
                          aria-invalid={Boolean(errors.name)}
                          className={`mt-3 ${field} ${border('name')}`}
                        />
                        {errors.name && (
                          <p className="mt-2 text-[11px] text-red-300">{errors.name}</p>
                        )}
                      </div>

                      <div data-anim="field">
                        <label
                          htmlFor={`${formId}-email`}
                          className="block text-[10px] uppercase tracking-[0.24em] text-auren-muted"
                        >
                          Email
                        </label>
                        <input
                          id={`${formId}-email`}
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={set('email')}
                          placeholder="you@example.com"
                          aria-invalid={Boolean(errors.email)}
                          className={`mt-3 ${field} ${border('email')}`}
                        />
                        {errors.email && (
                          <p className="mt-2 text-[11px] text-red-300">{errors.email}</p>
                        )}
                      </div>

                      <div data-anim="field">
                        <label
                          htmlFor={`${formId}-phone`}
                          className="block text-[10px] uppercase tracking-[0.24em] text-auren-muted"
                        >
                          Phone <span className="text-auren-muted/50">— optional</span>
                        </label>
                        <input
                          id={`${formId}-phone`}
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={set('phone')}
                          placeholder="+49 …"
                          className={`mt-3 ${field} ${border('phone')}`}
                        />
                      </div>

                      <div data-anim="field">
                        <label
                          htmlFor={`${formId}-reason`}
                          className="block text-[10px] uppercase tracking-[0.24em] text-auren-muted"
                        >
                          What is it about
                        </label>
                        <select
                          id={`${formId}-reason`}
                          value={form.reason}
                          onChange={set('reason')}
                          className={`mt-3 ${field} ${border('reason')} appearance-none`}
                        >
                          {REASONS.map((item) => (
                            <option key={item} value={item} className="bg-auren-graphite">
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div data-anim="field" className="sm:col-span-2">
                        <label
                          htmlFor={`${formId}-vehicle`}
                          className="block text-[10px] uppercase tracking-[0.24em] text-auren-muted"
                        >
                          Car you have in mind <span className="text-auren-muted/50">— optional</span>
                        </label>
                        <select
                          id={`${formId}-vehicle`}
                          value={form.vehicle}
                          onChange={set('vehicle')}
                          className={`mt-3 ${field} ${border('vehicle')} appearance-none`}
                        >
                          <option value="" className="bg-auren-graphite">
                            No preference yet
                          </option>
                          {VEHICLES.map((vehicle) => (
                            <option
                              key={vehicle.slug}
                              value={vehicle.slug}
                              className="bg-auren-graphite"
                            >
                              {vehicle.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div data-anim="field" className="sm:col-span-2">
                        <label
                          htmlFor={`${formId}-message`}
                          className="block text-[10px] uppercase tracking-[0.24em] text-auren-muted"
                        >
                          Message
                        </label>
                        <textarea
                          id={`${formId}-message`}
                          rows={5}
                          value={form.message}
                          onChange={set('message')}
                          placeholder="Tell us what you need and when."
                          aria-invalid={Boolean(errors.message)}
                          className={`mt-3 resize-none ${field} ${border('message')}`}
                        />
                        {errors.message && (
                          <p className="mt-2 text-[11px] text-red-300">{errors.message}</p>
                        )}
                      </div>
                    </div>

                    <label
                      data-anim="field"
                      htmlFor={`${formId}-consent`}
                      className="mt-8 flex cursor-pointer items-start gap-4"
                    >
                      <input
                        id={`${formId}-consent`}
                        type="checkbox"
                        checked={form.consent}
                        onChange={set('consent')}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-auren-blue ${
                          form.consent
                            ? 'border-auren-blue bg-auren-blue/25'
                            : errors.consent
                              ? 'border-red-400/70'
                              : 'border-white/25'
                        }`}
                      >
                        {form.consent && <Check className="size-3.5 text-auren-blue" strokeWidth={3} />}
                      </span>
                      <span className="text-[13px] leading-[1.7] text-auren-silver/75">
                        You may hold my details in order to answer this message.
                        {errors.consent && (
                          <span className="mt-1 block text-[11px] text-red-300">
                            {errors.consent}
                          </span>
                        )}
                      </span>
                    </label>

                    <motion.button
                      data-anim="field"
                      type="submit"
                      disabled={status === 'sending'}
                      whileHover={status === 'sending' ? undefined : { y: -3 }}
                      whileTap={status === 'sending' ? undefined : { scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-auren-white px-10 py-5 text-[11px] font-medium uppercase tracking-[0.18em] text-auren-black transition-colors duration-300 hover:bg-auren-blue hover:text-auren-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {status === 'sending' ? 'Sending…' : 'Send message'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </section>

            {/* ---- direct channels ---- */}
            <aside>
              <p className="text-[10px] uppercase tracking-[0.3em] text-auren-muted">
                Or reach us directly
              </p>

              <ul className="mt-7 flex flex-col gap-4">
                {CHANNELS.map(({ icon: Icon, label, value, note, href }) => (
                  <motion.li
                    key={label + value}
                    data-anim="channel"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  >
                    <a
                      href={href}
                      className="group flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-500 hover:border-auren-blue/45"
                    >
                      <span className="mt-0.5 inline-grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.04]">
                        <Icon className="size-4 text-auren-blue" strokeWidth={1.5} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-[0.24em] text-auren-muted">
                          {label}
                        </span>
                        <span className="mt-2 block truncate text-[15px] text-auren-white">
                          {value}
                        </span>
                        <span className="mt-1.5 block text-[11px] leading-relaxed text-auren-muted/80">
                          {note}
                        </span>
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </aside>
          </div>

          {/* ---- showrooms ---- */}
          <div className="mt-28 border-t border-white/10 pt-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-5">
                  <span className="text-[11px] tracking-[0.3em] text-auren-silver">02</span>
                  <span className="h-px w-10 bg-white/25" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                    Where to find us
                  </span>
                </div>
                <h2 className="mt-8 max-w-[18ch] text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.14] tracking-[-0.02em]">
                  Four rooms,
                  <span className="text-auren-blue"> no dealerships.</span>
                </h2>
              </div>

              <p className="max-w-[38ch] text-[15px] leading-[1.85] text-auren-silver/75">
                Every one is staffed by people who are paid the same whether you
                buy a car or not.
              </p>
            </div>

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {SHOWROOMS.map(({ city, role, address, phone, hours }) => (
                <motion.li
                  key={city}
                  data-anim="showroom"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition-colors duration-500 hover:border-auren-blue/45"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(76,141,255,0.14),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <MapPin className="size-5 text-auren-blue" strokeWidth={1.4} />
                  <h3 className="mt-6 text-xl font-light tracking-[-0.01em]">{city}</h3>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-auren-muted">
                    {role}
                  </p>

                  <address className="mt-6 not-italic text-[13px] leading-[1.75] text-auren-silver/75">
                    {address}
                  </address>

                  <dl className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-3">
                      <Phone className="size-3.5 shrink-0 text-auren-muted" strokeWidth={1.5} />
                      <dd className="text-[12px] text-auren-silver/80">{phone}</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="size-3.5 shrink-0 text-auren-muted" strokeWidth={1.5} />
                      <dd className="text-[12px] text-auren-silver/80">{hours}</dd>
                    </div>
                  </dl>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ---- questions ---- */}
          <div className="mt-28 border-t border-white/10 pb-28 pt-16 lg:pb-36">
            <div className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.3em] text-auren-silver">03</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-auren-muted">
                Asked often
              </span>
            </div>

            <ul className="mt-12 border-t border-white/10">
              {FAQS.map(([question, answer], i) => {
                const open = openFaq === i

                return (
                  <li key={question} data-anim="faq" className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className="group flex w-full items-center justify-between gap-8 py-7 text-left"
                    >
                      <span
                        className={`max-w-[46ch] text-[clamp(1.05rem,1.7vw,1.3rem)] font-light leading-snug transition-colors duration-300 ${
                          open ? 'text-auren-white' : 'text-auren-silver/85 group-hover:text-auren-white'
                        }`}
                      >
                        {question}
                      </span>
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                          open
                            ? 'border-auren-blue text-auren-blue'
                            : 'border-white/20 text-auren-muted group-hover:border-white/40'
                        }`}
                      >
                        {open ? (
                          <Minus className="size-4" strokeWidth={1.6} />
                        ) : (
                          <Plus className="size-4" strokeWidth={1.6} />
                        )}
                      </span>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-8 pr-14 text-[15px] leading-[1.9] text-auren-silver/75">
                        {answer}
                      </p>
                    </motion.div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </main>

      <FinalCta />
    </div>
  )
}
