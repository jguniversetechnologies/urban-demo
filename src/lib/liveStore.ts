import { promises as fs } from "fs"
import path from "path"

export type StoredCustomer = {
  phone: string
  name: string
  email: string
  token: string
  city: string
  area: string
  rating: number | null
}

export type StoredProvider = {
  phone: string
  name: string
  city: string
  skill: string
  kyc: string
  kycNote: string
  documents: Record<string, string>
  token: string
  online: boolean
}

export type StoredBooking = {
  id: string
  serviceName: string
  category: string
  packageLabel: string
  basePrice: number
  extras: { id: string; name: string; price: number }[]
  dateLabel: string
  time: string
  address: string
  payment: "online" | "cash"
  status: string
  startOtp: string
  customerName: string
  customerPhone: string
  providerPhone: string
  discount: number
  coupon: string
  updatedAt: string
}

export type LiveStore = {
  customers: StoredCustomer[]
  providers: StoredProvider[]
  bookings: StoredBooking[]
}

const filePath = path.join(process.cwd(), "data", "live-store.json")

const emptyStore = (): LiveStore => ({
  customers: [],
  providers: [],
  bookings: [],
})

export async function readStore(): Promise<LiveStore> {
  try {
    const raw = await fs.readFile(filePath, "utf8")
    const parsed = JSON.parse(raw) as Partial<LiveStore>
    return {
      customers: parsed.customers ?? [],
      providers: parsed.providers ?? [],
      bookings: parsed.bookings ?? [],
    }
  } catch {
    return emptyStore()
  }
}

export async function writeStore(store: LiveStore) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(store, null, 2))
}
