// Schematics rather than photographs: a technology page should show how the
// thing works. Every animated element is tagged so the page's GSAP context can
// find it — nothing animates itself.

/* ---- the pack: cells filling, then the charge curve drawing over them ---- */
export function PackDiagram() {
  const CHARGE = [10, 28, 45, 58, 68, 75, 79, 80]
  const pts = CHARGE.map((v, i) => [
    40 + (i / (CHARGE.length - 1)) * 420,
    210 - ((v - 10) / 70) * 140,
  ])
  const d = pts.reduce(
    (acc, [x, y], i) => (i === 0 ? `M${x},${y}` : `${acc}L${x},${y}`),
    '',
  )

  return (
    <svg viewBox="0 0 500 260" className="w-full" aria-hidden="true">
      <defs>
        <linearGradient id="in-cell" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#4C8DFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#9cc0ff" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {[0, 70, 140, 210].map((y) => (
        <line key={y} x1="40" x2="460" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" />
      ))}

      {/* the stack, filling from the floor up */}
      {Array.from({ length: 22 }).map((_, i) => (
        <rect
          key={i}
          data-cell
          x={44 + i * 19}
          y={132}
          width="12"
          height="78"
          rx="2.5"
          fill="url(#in-cell)"
          style={{ transformOrigin: `${50 + i * 19}px 210px` }}
        />
      ))}

      <path
        data-draw
        d={d}
        fill="none"
        stroke="#e6f0ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line x1="40" x2="460" y1="210" y2="210" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <text x="40" y="238" fill="#A7AFBA" fontSize="11" letterSpacing="2">0 MIN</text>
      <text x="460" y="238" fill="#A7AFBA" fontSize="11" letterSpacing="2" textAnchor="end">
        18 MIN
      </text>
    </svg>
  )
}

/* ---- sensing: overlapping coverage arcs sweeping out from the car ---- */
export function SensorDiagram() {
  const arc = (r, start, end) => {
    const p = (a, radius) => [
      250 + Math.cos((a * Math.PI) / 180) * radius,
      150 + Math.sin((a * Math.PI) / 180) * radius,
    ]
    const [x1, y1] = p(start, r)
    const [x2, y2] = p(end, r)
    const large = end - start > 180 ? 1 : 0
    return `M250,150 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`
  }

  const FIELDS = [
    { d: arc(132, -108, -72), fill: 'rgba(76,141,255,0.30)' },
    { d: arc(108, -150, -30), fill: 'rgba(76,141,255,0.18)' },
    { d: arc(126, 30, 150), fill: 'rgba(200,205,211,0.14)' },
    { d: arc(86, 150, 210), fill: 'rgba(76,141,255,0.16)' },
    { d: arc(86, -30, 30), fill: 'rgba(76,141,255,0.16)' },
  ]

  return (
    <svg viewBox="0 0 500 300" className="w-full" aria-hidden="true">
      {[52, 86, 120].map((r) => (
        <circle
          key={r}
          cx="250"
          cy="150"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeDasharray="3 6"
        />
      ))}

      {FIELDS.map((f, i) => (
        <path
          key={i}
          data-field
          d={f.d}
          fill={f.fill}
          style={{ transformOrigin: '250px 150px' }}
        />
      ))}

      {/* the car, seen from above */}
      <rect x="234" y="118" width="32" height="64" rx="13" fill="#20283a" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <rect x="239" y="130" width="22" height="18" rx="5" fill="rgba(156,192,255,0.45)" />

      {/* sensor nodes around the body */}
      {[[250, 112], [250, 188], [230, 126], [270, 126], [230, 174], [270, 174]].map(([cx, cy], i) => (
        <circle key={i} data-node cx={cx} cy={cy} r="3.5" fill="#4C8DFF" />
      ))}
    </svg>
  )
}

/* ---- aero: streamlines passing over the body ---- */
export function AeroDiagram() {
  const LINES = [
    'M-40,120 C120,96 220,84 330,92 C410,98 470,112 540,132',
    'M-40,150 C120,124 230,110 340,118 C420,124 475,138 540,158',
    'M-40,182 C120,160 240,150 350,158 C430,164 480,176 540,192',
    'M-40,214 C120,198 240,192 350,198 C430,203 480,212 540,222',
  ]

  return (
    <svg viewBox="0 0 500 280" className="w-full" aria-hidden="true">
      {/* body section */}
      <path
        d="M70,214 C110,150 180,118 260,118 C330,118 390,142 440,214 Z"
        fill="#161c26"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
      />
      <path
        d="M70,214 C110,150 180,118 260,118 C330,118 390,142 440,214"
        fill="none"
        stroke="rgba(230,240,255,0.4)"
        strokeWidth="2"
      />

      {LINES.map((d, i) => (
        <path
          key={i}
          data-stream
          d={d}
          fill="none"
          stroke={i < 2 ? 'rgba(76,141,255,0.65)' : 'rgba(200,205,211,0.3)'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      <line x1="60" x2="450" y1="238" y2="238" stroke="rgba(255,255,255,0.12)" />
      <text x="60" y="262" fill="#A7AFBA" fontSize="11" letterSpacing="2">Cd 0.19</text>
      <text x="450" y="262" fill="#A7AFBA" fontSize="11" letterSpacing="2" textAnchor="end">
        FLAT FLOOR
      </text>
    </svg>
  )
}
