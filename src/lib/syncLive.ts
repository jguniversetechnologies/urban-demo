import type { LiveBooking } from "@/state/DemoState"
import type { StoredBooking, StoredCustomer, StoredProvider } from "@/lib/liveStore"

async function postLive(type: string, record: StoredCustomer | StoredProvider | StoredBooking) {
  await fetch("/api/live", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, record }),
  })
}

export function saveCustomer(record: StoredCustomer) {
  return postLive("customer", record)
}

export function saveProvider(record: StoredProvider) {
  return postLive("provider", record)
}

export function saveBooking(booking: LiveBooking, providerPhone = "") {
  const record: StoredBooking = {
    ...booking,
    providerPhone,
    updatedAt: new Date().toISOString(),
  }
  return postLive("booking", record)
}

export async function loadStore() {
  const response = await fetch("/api/live", { cache: "no-store" })
  if (!response.ok) {
    return { customers: [], providers: [], bookings: [] }
  }
  return response.json() as Promise<{
    customers: StoredCustomer[]
    providers: StoredProvider[]
    bookings: StoredBooking[]
  }>
}
