import type { ServiceItem } from "@/types/navigation"

export const platformFee = 49
export const startOtp = "7291"

export const servedCity = "Rasayani"

export const cities = [
  {
    city: "Rasayani",
    areas: ["Rasayani", "Mohpada", "Apte"],
  },
  {
    city: "Bengaluru",
    areas: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield"],
  },
  { city: "Mumbai", areas: ["Andheri", "Bandra", "Powai"] },
  { city: "Delhi NCR", areas: ["Gurugram", "Noida", "Dwarka"] },
  { city: "Hyderabad", areas: ["Madhapur", "Gachibowli", "Banjara Hills"] },
]

export const promoBanners = [
  {
    id: "festive",
    eyebrow: "This week",
    title: "Festive home refresh",
    subtitle: "Deep cleaning from ₹999",
    category: "Cleaning",
    className: "bg-slate-900",
  },
  {
    id: "ac",
    eyebrow: "Same day",
    title: "AC service at ₹599",
    subtitle: "Slots open in your area",
    category: "AC Service",
    className: "bg-teal-800",
  },
]

export const rewardOffers = [
  {
    title: "₹100 off deep cleaning",
    detail: "Applies after your first completed visit",
    points: 100,
  },
  {
    title: "Salon add-on",
    detail: "Unlocks when you reach 200 points",
    points: 200,
  },
  {
    title: "Priority morning slot",
    detail: "Book before 9 AM on weekdays",
    points: 80,
  },
]

export const materialExtras = [
  { id: "cleaner", name: "Premium cleaner", price: 149 },
  { id: "filter", name: "Spare filter", price: 299 },
  { id: "sealant", name: "Sealant and fittings", price: 99 },
]

export type PackageChoice = {
  id: string
  label: string
  detail: string
  price: number
}

export function parseRupees(price: string) {
  return Number(price.replace(/[^\d]/g, "")) || 0
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}

export function packagesFor(service: ServiceItem): PackageChoice[] {
  const base = parseRupees(service.price)
  if (/home|deep/i.test(service.name) && /clean/i.test(service.name)) {
    return [
      { id: "1bhk", label: "1 BHK", detail: "Up to 450 sq ft", price: base },
      {
        id: "2bhk",
        label: "2 BHK",
        detail: "Up to 800 sq ft",
        price: base + 400,
      },
      {
        id: "3bhk",
        label: "3 BHK",
        detail: "Up to 1,200 sq ft",
        price: base + 800,
      },
    ]
  }
  return [
    { id: "standard", label: "Standard", detail: service.time, price: base },
    {
      id: "plus",
      label: "Plus",
      detail: "Includes common spare parts",
      price: base + 150,
    },
  ]
}

export function bookingTotal(basePrice: number, extras: { price: number }[]) {
  return basePrice + platformFee + extras.reduce((sum, item) => sum + item.price, 0)
}
