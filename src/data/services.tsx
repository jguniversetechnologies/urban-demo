import {
  AirVent,
  Bath,
  Menu,
  Paintbrush,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react"
import type { ServiceItem } from "@/types/navigation"

export type CatalogMatch = ServiceItem & { category: string }

export const serviceImage =
  "https://images.unsplash.com/photo-1758272422189-b10f36fd4ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlJTIwbW9kZXJuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc5MDA4NzM4OXww&ixlib=rb-4.1.0&q=80&w=1080"

export const categories = [
  { label: "Cleaning", icon: Sparkles, tone: "bg-sky-50 text-sky-700" },
  { label: "Repairs", icon: Wrench, tone: "bg-amber-50 text-amber-700" },
  { label: "Beauty", icon: Paintbrush, tone: "bg-rose-50 text-rose-700" },
  { label: "AC Service", icon: AirVent, tone: "bg-cyan-50 text-cyan-700" },
  {
    label: "Pest Control",
    icon: ShieldCheck,
    tone: "bg-emerald-50 text-emerald-700",
  },
  { label: "Electrician", icon: PlugZap, tone: "bg-violet-50 text-violet-700" },
  { label: "Plumber", icon: Bath, tone: "bg-indigo-50 text-indigo-700" },
  { label: "View all", icon: Menu, tone: "bg-slate-50 text-slate-600" },
]

export const serviceCatalog: Record<string, ServiceItem[]> = {
  Cleaning: [
    {
      name: "Essential home cleaning",
      rating: "4.8",
      time: "45–60 min",
      price: "₹499",
      description:
        "A thorough clean for bedrooms, living areas and common spaces.",
    },
    {
      name: "Full home deep clean",
      rating: "4.9",
      time: "2–3 hours",
      price: "₹1,299",
      description: "Intensive end-to-end cleaning for your entire home.",
    },
    {
      name: "Kitchen intensive clean",
      rating: "4.7",
      time: "60–90 min",
      price: "₹699",
      description:
        "Degreasing, cabinet cleaning and complete kitchen sanitation.",
    },
  ],
  Repairs: [
    {
      name: "Furniture repair",
      rating: "4.8",
      time: "60 min",
      price: "₹449",
      description: "Professional repair for beds, tables, cabinets and more.",
    },
    {
      name: "Wall drilling & mounting",
      rating: "4.9",
      time: "30–45 min",
      price: "₹299",
      description: "Safe mounting for shelves, frames, TVs and fixtures.",
    },
    {
      name: "Door & lock repair",
      rating: "4.7",
      time: "45 min",
      price: "₹399",
      description: "Fix jammed doors, hinges, handles and locks.",
    },
  ],
  Beauty: [
    {
      name: "Salon classic package",
      rating: "4.9",
      time: "60 min",
      price: "₹799",
      description: "Threading, waxing and a refreshing cleanup at home.",
    },
    {
      name: "Glow facial",
      rating: "4.8",
      time: "75 min",
      price: "₹999",
      description: "A premium facial tailored to your skin type.",
    },
    {
      name: "Manicure & pedicure",
      rating: "4.7",
      time: "90 min",
      price: "₹899",
      description: "Complete hand and foot care in the comfort of home.",
    },
  ],
  "AC Service": [
    {
      name: "AC general service",
      rating: "4.8",
      time: "45 min",
      price: "₹599",
      description: "Filter, coil and drain cleaning with performance check.",
    },
    {
      name: "AC deep jet service",
      rating: "4.9",
      time: "60 min",
      price: "₹799",
      description: "High-pressure indoor and outdoor unit cleaning.",
    },
    {
      name: "AC repair & inspection",
      rating: "4.7",
      time: "45 min",
      price: "₹349",
      description: "Complete diagnosis with repair estimate before work.",
    },
  ],
  "Pest Control": [
    {
      name: "Cockroach control",
      rating: "4.8",
      time: "60 min",
      price: "₹899",
      description: "Odourless gel treatment with a 90-day warranty.",
    },
    {
      name: "Termite treatment",
      rating: "4.9",
      time: "2 hours",
      price: "₹1,499",
      description: "Targeted termite treatment by certified experts.",
    },
    {
      name: "Mosquito control",
      rating: "4.7",
      time: "45 min",
      price: "₹699",
      description: "Indoor and outdoor mosquito reduction treatment.",
    },
  ],
  Electrician: [
    {
      name: "Electrical inspection",
      rating: "4.8",
      time: "30 min",
      price: "₹249",
      description: "Troubleshooting for switches, sockets and wiring faults.",
    },
    {
      name: "Fan installation",
      rating: "4.9",
      time: "45 min",
      price: "₹349",
      description: "Safe installation of ceiling, wall or exhaust fans.",
    },
    {
      name: "Switchboard repair",
      rating: "4.8",
      time: "30 min",
      price: "₹299",
      description: "Repair or replacement of faulty switches and sockets.",
    },
  ],
  Plumber: [
    {
      name: "Leakage repair",
      rating: "4.8",
      time: "45 min",
      price: "₹299",
      description: "Fix leaking taps, pipes, sinks and bathroom fixtures.",
    },
    {
      name: "Drain blockage removal",
      rating: "4.9",
      time: "60 min",
      price: "₹499",
      description: "Professional clearing for kitchen and bathroom drains.",
    },
    {
      name: "Tap installation",
      rating: "4.7",
      time: "30 min",
      price: "₹249",
      description: "Installation or replacement of taps and fixtures.",
    },
  ],
}

export const categoryIncludes: Record<string, string[]> = {
  Cleaning: [
    "Dusting and surface cleaning",
    "Floor vacuuming and mopping",
    "Bathroom sanitation",
  ],
  Repairs: [
    "On-site inspection",
    "Basic fittings and adjustments",
    "Cleanup after the job",
  ],
  Beauty: [
    "Disposable kit and hygiene cover",
    "Skin-type product check",
    "Aftercare guidance",
  ],
  "AC Service": [
    "Filter and coil cleaning",
    "Cooling performance check",
    "30-day service cover",
  ],
  "Pest Control": [
    "Targeted treatment",
    "Odour-controlled application",
    "Follow-up guidance",
  ],
  Electrician: [
    "Fault diagnosis",
    "Safe repair or install",
    "Post-work safety check",
  ],
  Plumber: [
    "Leak and fixture inspection",
    "Repair with standard fittings",
    "Flow check before leaving",
  ],
}

export function searchServices(query: string): CatalogMatch[] {
  const needle = query.trim().toLowerCase()
  if (needle.length < 2) return []
  return Object.entries(serviceCatalog).flatMap(([category, items]) =>
    items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle) ||
          category.toLowerCase().includes(needle),
      )
      .map((item) => ({ ...item, category })),
  )
}

export function findService(name: string): CatalogMatch | undefined {
  for (const [category, items] of Object.entries(serviceCatalog)) {
    const match = items.find((item) => item.name === name)
    if (match) return { ...match, category }
  }
  return undefined
}
