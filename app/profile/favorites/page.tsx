"use client"

import { CustomerGate } from "@/components/CustomerGate"
import { Profile } from "@/features/customer/pages/ProfilePage"

export default function Page() {
  return (
    <CustomerGate next="/profile/favorites">
      <Profile panel="Favourites" />
    </CustomerGate>
  )
}
