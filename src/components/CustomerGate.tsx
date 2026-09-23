"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { useDemo } from "@/state/DemoState"

export function CustomerGate({
  children,
  next,
  requireCity = false,
}: {
  children: ReactNode
  next: string
  requireCity?: boolean
}) {
  const demo = useDemo()
  const router = useRouter()
  const blocked =
    !demo.ready ||
    !demo.customerAuthed ||
    (requireCity && !demo.city)

  useEffect(() => {
    if (!demo.ready) return
    if (!demo.customerAuthed) {
      demo.setPendingPath(next)
      router.replace("/login")
      return
    }
    if (requireCity && !demo.city) {
      demo.setPendingPath(next)
      router.replace("/location")
    }
  }, [demo, next, requireCity, router])

  if (blocked) return null
  return children
}
