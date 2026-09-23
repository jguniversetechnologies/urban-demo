"use client"

import type { ReactNode } from "react"
import { AppFrame } from "@/components/AppFrame"
import { DemoProvider } from "@/state/DemoState"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <AppFrame>{children}</AppFrame>
    </DemoProvider>
  )
}
