"use client"

import { CustomerGate } from "@/components/CustomerGate"
import { Rating } from "@/features/customer/pages/RatingPage"

export default function Page() {
  return (
    <CustomerGate next="/bookings/rate">
      <Rating />
    </CustomerGate>
  )
}
