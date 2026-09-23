"use client"

import type { ReactNode } from "react"
import { ProviderStateProvider } from "@/features/provider/ProviderState"

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return <ProviderStateProvider>{children}</ProviderStateProvider>
}
