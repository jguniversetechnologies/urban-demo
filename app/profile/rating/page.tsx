"use client"

import { CustomerGate } from "@/components/CustomerGate"
import { Profile } from "@/features/customer/pages/ProfilePage"

export default function Page() {
  return (
    <CustomerGate next="/profile/rating">
      <Profile panel="My rating" />
    </CustomerGate>
  )
}
