"use client"

import { CustomerGate } from "@/components/CustomerGate"
import { Tracking } from "@/features/customer/pages/TrackingPage"

export default function Page() {
  return (
    <CustomerGate next="/bookings">
      <Tracking />
    </CustomerGate>
  )
}
