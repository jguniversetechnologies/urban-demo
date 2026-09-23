"use client"

import { CustomerGate } from "@/components/CustomerGate"
import { Profile } from "@/features/customer/pages/ProfilePage"

export default function Page() {
  return (
    <CustomerGate next="/profile/devices">
      <Profile panel="Native devices" />
    </CustomerGate>
  )
}
