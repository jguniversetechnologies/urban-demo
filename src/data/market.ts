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
  { id: "eco-cleaner", name: "Eco-friendly cleaner", price: 99 },
  { id: "microfiber", name: "Premium microfiber cloths", price: 79 },
  { id: "protectant", name: "Surface protectant", price: 149 },
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
  if (/clean/i.test(service.name)) {
    return [
      { id: "60min", label: "60 minutes", detail: "Quick clean", price: base },
      {
        id: "90min",
        label: "90 minutes",
        detail: "Thorough clean",
        price: base + 200,
      },
      {
        id: "120min",
        label: "120 minutes",
        detail: "Deep clean",
        price: base + 400,
      },
    ]
  }
  return [
    { id: "60min", label: "60 minutes", detail: service.time, price: base },
    {
      id: "90min",
      label: "90 minutes",
      detail: "Extended service",
      price: base + 200,
    },
  ]
}

export function bookingTotal(basePrice: number, extras: { price: number }[]) {
  return basePrice + platformFee + extras.reduce((sum, item) => sum + item.price, 0)
}

export function subscriptionPricing(basePrice: number, frequency: "daily" | "weekly" | "monthly") {
  const visitCounts = {
    daily: 30,
    weekly: 4,
    monthly: 4
  }
  const discounts = {
    daily: 0.25,
    weekly: 0.15,
    monthly: 0.20
  }
  
  const visits = visitCounts[frequency]
  const discountRate = discounts[frequency]
  const singleVisitPrice = basePrice * visits
  const subscriptionPrice = Math.round(singleVisitPrice * (1 - discountRate))
  
  return {
    visits,
    subscriptionPrice,
    perVisitPrice: Math.round(subscriptionPrice / visits),
    discount: Math.round(singleVisitPrice - subscriptionPrice)
  }
}
