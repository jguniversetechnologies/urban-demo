"use client"

import { CustomerGate } from "@/components/CustomerGate"
import { Profile } from "@/features/customer/pages/ProfilePage"

export default function Page() {
  return (
    <CustomerGate next="/profile/history">
      <Profile panel="Booking history" />
    </CustomerGate>
  )
}
