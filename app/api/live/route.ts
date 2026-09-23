import { NextResponse } from "next/server"
import {
  readStore,
  writeStore,
  type StoredBooking,
  type StoredCustomer,
  type StoredProvider,
} from "@/lib/liveStore"

export async function GET() {
  return NextResponse.json(await readStore())
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    type?: string
    record?: StoredCustomer | StoredProvider | StoredBooking
  }
  const store = await readStore()

  if (body.type === "customer" && body.record && "phone" in body.record) {
    const record = body.record as StoredCustomer
    const index = store.customers.findIndex((item) => item.phone === record.phone)
    if (index >= 0) store.customers[index] = { ...store.customers[index], ...record }
    else store.customers.push(record)
  }

  if (body.type === "provider" && body.record && "phone" in body.record) {
    const record = body.record as StoredProvider
    const index = store.providers.findIndex((item) => item.phone === record.phone)
    if (index >= 0) store.providers[index] = { ...store.providers[index], ...record }
    else store.providers.push(record)
  }

  if (body.type === "booking" && body.record && "id" in body.record) {
    const record = body.record as StoredBooking
    const index = store.bookings.findIndex((item) => item.id === record.id)
    if (index >= 0) store.bookings[index] = { ...store.bookings[index], ...record }
    else store.bookings.unshift(record)
  }

  await writeStore(store)
  return NextResponse.json(store)
}
