"use client"

import { CustomerGate } from "@/components/CustomerGate"
import { Booking } from "@/features/customer/pages/BookingFlow"

export default function Page() {
  return (
    <CustomerGate next="/booking/confirmed">
      <Booking screen="confirmed" />
    </CustomerGate>
  )
}
