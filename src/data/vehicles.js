// The range. Every car carries the same shape of data so the listing and the
// detail page can both read it without special-casing anything.

// Vite resolves glob patterns itself, so this one stays relative — the `@`
// alias is not applied inside import.meta.glob.
const shots = import.meta.glob('../assets/vehicles/*.webp', {
  eager: true,
  import: 'default',
})

// import.meta.glob keys are full paths; index them by the "v01-a" stem instead.
const img = Object.fromEntries(
  Object.entries(shots).map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url]),
)

const gallery = (n) => [img[`v${n}-a`], img[`v${n}-b`], img[`v${n}-c`]]

export const CATEGORIES = [
  'All',
  'Grand tourer',
  'Sports',
  'Hypercar',
  'SUV',
  'Competition',
]

export const VEHICLES = [
  {
    slug: 'gt',
    name: 'AUREN GT',
    category: 'Grand tourer',
    tagline: 'The flagship',
    price: 184500,
    summary:
      'Long-legged, quiet at a cruise, and quick enough to make the distance disappear. The car the rest of the range is measured against.',
    story:
      'The GT was the first car we drew and the last one we signed off. Everything about it is built for the fourth hour of a drive rather than the first ten minutes — the seat, the ride, the way the cabin stays quiet at motorway speed. It will still run to 100 in 3.2 seconds, but that was never the point.',
    specs: {
      power: 680,
      sprint: 3.2,
      range: 620,
      topSpeed: 250,
      charge: 18,
      drivetrain: 'AWD',
      battery: 102,
      weight: 2180,
    },
    features: [
      'Air suspension with road-scanning preview',
      'Rear-axle steering, 4.8° lock',
      'Matrix headlights, 84 addressable pixels',
      'Vegetable-tanned leather and open-pore ash',
    ],
    colours: ['Frozen Silver', 'Midnight', 'Carbon Grey', 'Sahara'],
    images: gallery('01'),
  },
  {
    slug: 'coupe-s',
    name: 'AUREN Coupé S',
    category: 'Sports',
    tagline: 'Everyday sports',
    price: 142000,
    summary:
      'The one you drive on a Tuesday. The same drivetrain philosophy, softened for the commute and the weekend both.',
    story:
      'We took the GT’s rear motor, shortened the wheelbase by 140 mm and stiffened the springs enough to matter without making the car tiring. It is the easiest car in the range to live with, and the one most owners keep longest.',
    specs: {
      power: 495,
      sprint: 3.9,
      range: 580,
      topSpeed: 240,
      charge: 19,
      drivetrain: 'RWD',
      battery: 94,
      weight: 1980,
    },
    features: [
      'Adaptive dampers, three modes',
      'Torque vectoring across the rear axle',
      '19-inch forged wheels as standard',
      'Wool-blend weave interior',
    ],
    colours: ['Frozen Silver', 'Midnight', 'Signal Red'],
    images: gallery('02'),
  },
  {
    slug: 'zr-edition',
    name: 'AUREN ZR Edition',
    category: 'Sports',
    tagline: 'Limited run of 200',
    price: 268000,
    summary:
      'Carbon aero, stiffer springs, and a rear wing that earns its drag at speed. Two hundred cars, then the tooling goes.',
    story:
      'The ZR started as an engineering exercise and ended up as a product because nobody wanted to give the prototype back. Everything that could be carbon is carbon. The rear wing is not decoration — it is worth 140 kg of downforce at 200 km/h.',
    specs: {
      power: 755,
      sprint: 2.9,
      range: 540,
      topSpeed: 290,
      charge: 17,
      drivetrain: 'AWD',
      battery: 98,
      weight: 1940,
    },
    features: [
      'Full carbon aero package',
      'Carbon-ceramic brakes, 410 mm front',
      'Track telemetry with lap overlay',
      'Six-point harness mounts',
    ],
    colours: ['Carbon Grey', 'Midnight', 'Chalk'],
    images: gallery('03'),
  },
  {
    slug: 'vector',
    name: 'AUREN Vector',
    category: 'Hypercar',
    tagline: 'The halo',
    price: 1240000,
    summary:
      'Everything we know about aero and power delivery, with nothing held back for the next car.',
    story:
      'Fifty cars a year, built one at a time. The Vector runs a four-motor layout with torque split calculated a thousand times a second, and a body shaped in the same tunnel as our endurance racer. It is the only car in the range we will not sell you without a day of instruction.',
    specs: {
      power: 1064,
      sprint: 2.3,
      range: 490,
      topSpeed: 350,
      charge: 16,
      drivetrain: 'Quad motor',
      battery: 110,
      weight: 1890,
    },
    features: [
      'Four-motor torque vectoring',
      'Active rear wing and underbody flaps',
      'Carbon monocoque, 68 kg',
      'Driver instruction included',
    ],
    colours: ['Chalk', 'Carbon Grey', 'Midnight'],
    images: gallery('04'),
  },
  {
    slug: 'aero',
    name: 'AUREN Aero',
    category: 'Grand tourer',
    tagline: 'The long-distance one',
    price: 158000,
    summary:
      'The most efficient shape we have ever built. A drag coefficient of 0.19 and the range to prove it.',
    story:
      'Every panel on the Aero was argued over in the wind tunnel. Flush glazing, covered rear arches, and a floor that is genuinely flat from axle to axle. The result is a car that will cross a country on one charge and arrive without anyone in it feeling like they have been travelling.',
    specs: {
      power: 544,
      sprint: 4.1,
      range: 780,
      topSpeed: 230,
      charge: 20,
      drivetrain: 'AWD',
      battery: 106,
      weight: 2090,
    },
    features: [
      '0.19 drag coefficient',
      'Covered rear arches and flush glazing',
      'Heat-pump climate, −18 °C rated',
      'Route planner with live charger load',
    ],
    colours: ['Frozen Silver', 'Sahara', 'Midnight'],
    images: gallery('05'),
  },
  {
    slug: 'lumen',
    name: 'AUREN Lumen',
    category: 'Sports',
    tagline: 'The city car that is not a city car',
    price: 118000,
    summary:
      'Short, light and quick to turn. Built for the kind of road that never runs straight for more than a hundred metres.',
    story:
      'The Lumen is the smallest car we make and the one our engineers fight over at weekends. It weighs 1,760 kg, which for a car with a 90 kWh pack took three years of arguing. Nothing in the range changes direction like it.',
    specs: {
      power: 428,
      sprint: 4.3,
      range: 510,
      topSpeed: 225,
      charge: 18,
      drivetrain: 'RWD',
      battery: 88,
      weight: 1760,
    },
    features: [
      'Shortest wheelbase in the range',
      'Passive dampers, fixed rate',
      'Manual seat adjustment to save 9 kg',
      'No rear screen — camera mirror only',
    ],
    colours: ['Signal Red', 'Chalk', 'Midnight'],
    images: gallery('06'),
  },
  {
    slug: 'noct',
    name: 'AUREN Noct',
    category: 'Grand tourer',
    tagline: 'Night specification',
    price: 196000,
    summary:
      'A GT finished entirely in low-gloss black, with a lighting signature designed to be read after dark.',
    story:
      'The Noct began as a paint study and became a specification of its own. Everything bright on a standard GT — the window surrounds, the badges, the wheels — is anodised dark. The only thing that catches the light is the lamp signature, which is exactly the point.',
    specs: {
      power: 680,
      sprint: 3.2,
      range: 600,
      topSpeed: 250,
      charge: 18,
      drivetrain: 'AWD',
      battery: 102,
      weight: 2195,
    },
    features: [
      'Low-gloss paint, hand-finished',
      'Anodised dark trim throughout',
      'Illuminated lamp signature',
      'Black-on-black cabin with blue stitch',
    ],
    colours: ['Midnight', 'Carbon Grey'],
    images: gallery('07'),
  },
  {
    slug: 'solace',
    name: 'AUREN Solace',
    category: 'Grand tourer',
    tagline: 'Four doors, same car',
    price: 172000,
    summary:
      'The GT with a rear bench people can actually sit on, and a boot that takes a weekend for four.',
    story:
      'We added 210 mm between the axles and rebuilt the rear of the cabin around two proper seats. It drives within a tenth of the GT and takes twice the luggage, which is the whole argument for it.',
    specs: {
      power: 625,
      sprint: 3.5,
      range: 640,
      topSpeed: 245,
      charge: 18,
      drivetrain: 'AWD',
      battery: 104,
      weight: 2270,
    },
    features: [
      '210 mm longer wheelbase',
      'Reclining rear bench, heated',
      '480 litres of luggage space',
      'Rear climate and screen controls',
    ],
    colours: ['Frozen Silver', 'Midnight', 'Sahara'],
    images: gallery('08'),
  },
  {
    slug: 'terra',
    name: 'AUREN Terra',
    category: 'SUV',
    tagline: 'The one that goes further than the road',
    price: 164000,
    summary:
      'Ride height you can raise by 60 mm, a floor you can hose out, and the same drivetrain as the GT.',
    story:
      'The Terra exists because owners kept asking where they were supposed to put the dog. It rides higher, carries more, and will cross a field without drama — but it shares its motors, its pack and its cabin materials with the grand tourer.',
    specs: {
      power: 640,
      sprint: 4.0,
      range: 590,
      topSpeed: 220,
      charge: 19,
      drivetrain: 'AWD',
      battery: 106,
      weight: 2480,
    },
    features: [
      'Air suspension, 60 mm of lift',
      'Underbody protection as standard',
      '2,100 kg braked towing',
      'Washable load floor',
    ],
    colours: ['Sahara', 'Midnight', 'Frozen Silver'],
    images: gallery('09'),
  },
  {
    slug: 'vesper',
    name: 'AUREN Vesper',
    category: 'Sports',
    tagline: 'Roof optional',
    price: 156000,
    summary:
      'The Coupé S with the roof taken off and the structure put back in. Twelve seconds to open, at any speed up to 60.',
    story:
      'Taking a roof off costs you stiffness, so we spent it back: a cross-brace behind the seats, thicker sills, and a windscreen frame that does real work. It is 60 kg heavier than the Coupé S and worth every gram.',
    specs: {
      power: 495,
      sprint: 4.0,
      range: 555,
      topSpeed: 240,
      charge: 19,
      drivetrain: 'RWD',
      battery: 94,
      weight: 2040,
    },
    features: [
      'Fabric roof, 12 seconds to open',
      'Operates at up to 60 km/h',
      'Neck-level warm air to each seat',
      'Wind deflector stows in the boot',
    ],
    colours: ['Signal Red', 'Frozen Silver', 'Midnight'],
    images: gallery('10'),
  },
  {
    slug: 'strato',
    name: 'AUREN Strato',
    category: 'Hypercar',
    tagline: 'Track-focused',
    price: 890000,
    summary:
      'A Vector with the road compromises removed. Slick-shod, cage-equipped, and not registered for the public road.',
    story:
      'The Strato is what the Vector becomes when nobody has to drive it home. No sound deadening, no infotainment, no number plate. It runs 90 kg lighter and generates half as much downforce again, and we will store and transport it for you between track days.',
    specs: {
      power: 1064,
      sprint: 2.2,
      range: 380,
      topSpeed: 330,
      charge: 15,
      drivetrain: 'Quad motor',
      battery: 110,
      weight: 1800,
    },
    features: [
      'Not road registered',
      'FIA-specification roll cage',
      'Slick tyres, 18-inch centre-lock',
      'Storage and transport programme',
    ],
    colours: ['Chalk', 'Carbon Grey'],
    images: gallery('11'),
  },
  {
    slug: 'gt-r',
    name: 'AUREN GT-R',
    category: 'Competition',
    tagline: 'Homologated for endurance',
    price: 740000,
    summary:
      'Stripped, caged, and the reason the road cars stop as well as they go.',
    story:
      'Built to the regulations rather than to a brief. The GT-R runs a 24-hour duty cycle, which means every component is specified for the end of the race instead of the start. Most of what we learned here is now standard on the GT.',
    specs: {
      power: 590,
      sprint: 3.1,
      range: 310,
      topSpeed: 300,
      charge: 12,
      drivetrain: 'AWD',
      battery: 78,
      weight: 1620,
    },
    features: [
      'Built to endurance regulations',
      '24-hour component duty cycle',
      'Quick-change brake and motor modules',
      'Run by our works team or yours',
    ],
    colours: ['Chalk', 'Midnight'],
    images: gallery('12'),
  },
]

export const getVehicle = (slug) => VEHICLES.find((v) => v.slug === slug)

export const formatPrice = (value) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
