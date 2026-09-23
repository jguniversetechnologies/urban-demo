"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { useDemo } from "@/state/DemoState"
import type { Mode } from "@/types/navigation"

const customerRoots = [
  "/home",
  "/location",
  "/rewards",
  "/services",
  "/booking",
  "/bookings",
  "/profile",
]

function isCustomerPath(path: string) {
  return (
    path === "/" ||
    customerRoots.some((root) => path === root || path.startsWith(`${root}/`))
  )
}

export function AppFrame({ children }: { children: ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const demo = useDemo()
  const admin = path.startsWith("/admin")

  useEffect(() => {
    if (!demo.ready) return
    if (admin) {
      if (demo.role !== "admin") demo.setRole("admin")
      return
    }
    if (path.startsWith("/provider")) {
      if (demo.role !== "provider") demo.setRole("provider")
      return
    }
    if (isCustomerPath(path) && demo.role !== "customer") demo.setRole("customer")
  }, [admin, demo, path])

  if (admin) return children

  const mode: Mode =
    path.startsWith("/provider") || demo.role === "provider"
      ? "provider"
      : "customer"

  const switchMode = (nextMode: Mode) => {
    if (nextMode === "admin") {
      demo.setRole("admin")
      demo.setPendingPath(null)
      router.push("/admin")
      return
    }
    if (nextMode === mode) return
    demo.setRole(nextMode)
    demo.setPendingPath(null)
    router.push("/login")
  }

  return (
    <div className="app-stage">
      <div className="prototype-switcher" aria-label="Demo role selector">
        <button
          onClick={() => switchMode("customer")}
          className={mode === "customer" ? "active" : ""}
        >
          Customer
        </button>
        <button
          onClick={() => switchMode("provider")}
          className={mode === "provider" ? "active" : ""}
        >
          Provider
        </button>
        <button onClick={() => switchMode("admin")}>Admin</button>
      </div>
      <div className="phone-shell">{children}</div>
    </div>
  )
}
