"use client"

import { useRouter } from "next/navigation"
import { categoryPath, servicePath } from "@/lib/paths"
import { useDemo } from "@/state/DemoState"
import type { Screen } from "@/types/navigation"

const locked = new Set<Screen>([
  "tracking",
  "profile",
  "booking",
  "payment",
  "confirmed",
  "rating",
])

function hrefFor(
  screen: Screen,
  demo: {
    activeCategory: string
    selection: { category: string; name: string } | null
  },
) {
  switch (screen) {
    case "splash":
      return "/"
    case "location":
      return "/location"
    case "rewards":
      return "/rewards"
    case "login":
      return "/login"
    case "otp":
      return "/otp"
    case "signup":
      return "/signup"
    case "home":
      return "/home"
    case "services":
      return categoryPath(demo.activeCategory || "Cleaning")
    case "detail":
      return demo.selection
        ? servicePath(demo.selection.category, demo.selection.name)
        : categoryPath(demo.activeCategory || "Cleaning")
    case "booking":
      return "/booking"
    case "payment":
      return "/booking/payment"
    case "confirmed":
      return "/booking/confirmed"
    case "tracking":
      return "/bookings"
    case "rating":
      return "/bookings/rate"
    case "profile":
      return "/profile"
    case "provider":
      return "/provider"
    case "requests":
      return "/provider/requests"
    case "active":
      return "/provider/active"
    case "earnings":
      return "/provider/earnings"
    case "kyc":
      return "/provider/kyc"
  }
}

export function useGo() {
  const router = useRouter()
  const demo = useDemo()

  return (screen: Screen) => {
    const href = hrefFor(screen, demo)
    const needsAuth = demo.role !== "provider" && locked.has(screen)
    if (needsAuth && !demo.customerAuthed) {
      demo.setPendingPath(href)
      router.push("/login")
      return
    }
    if ((screen === "booking" || screen === "payment") && !demo.city) {
      demo.setPendingPath(href)
      router.push("/location")
      return
    }
    router.push(href)
  }
}

export function useContinue() {
  const router = useRouter()
  const demo = useDemo()

  return (fallback = "/home") => {
    const next = demo.pendingPath
    demo.setPendingPath(null)
    router.push(next || fallback)
  }
}
