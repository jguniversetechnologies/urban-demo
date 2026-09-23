import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  bookingTotal,
  startOtp,
  type PackageChoice,
} from "@/data/market"

export type JobStatus =
  | "requested"
  | "accepted"
  | "on_the_way"
  | "started"
  | "completed"

export type ExtraLine = { id: string; name: string; price: number }

export type LiveBooking = {
  id: string
  serviceName: string
  category: string
  packageLabel: string
  basePrice: number
  extras: ExtraLine[]
  dateLabel: string
  time: string
  address: string
  payment: "online" | "cash"
  status: JobStatus
  startOtp: string
  customerName: string
}

type PlaceBookingInput = {
  serviceName: string
  category: string
  packageLabel: string
  basePrice: number
  dateLabel: string
  time: string
  address: string
  payment: "online" | "cash"
}

type DemoValue = {
  customerAuthed: boolean
  customerPhone: string
  city: string
  area: string
  rewardPoints: number
  packageChoice: PackageChoice | null
  booking: LiveBooking | null
  suspended: string[]
  categoryLive: (city: string, category: string) => boolean
  signInCustomer: (phone: string) => void
  signOutCustomer: () => void
  setLocation: (city: string, area: string) => void
  setPackageChoice: (choice: PackageChoice) => void
  placeBooking: (input: PlaceBookingInput) => void
  acceptJob: () => void
  declineJob: () => void
  setJobStatus: (status: JobStatus) => void
  verifyStartOtp: (code: string) => boolean
  toggleExtra: (extra: ExtraLine) => void
  toggleCategory: (city: string, category: string) => void
  toggleSuspend: (name: string) => void
  orderTotal: (booking: LiveBooking) => number
}

const DemoContext = createContext<DemoValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [customerAuthed, setCustomerAuthed] = useState(false)
  const [customerPhone, setCustomerPhone] = useState("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [packageChoice, setPackageChoice] = useState<PackageChoice | null>(null)
  const [booking, setBooking] = useState<LiveBooking | null>(null)
  const [suspended, setSuspended] = useState<string[]>([])
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([])

  const value = useMemo<DemoValue>(
    () => ({
      customerAuthed,
      customerPhone,
      city,
      area,
      rewardPoints: 240,
      packageChoice,
      booking,
      suspended,
      categoryLive: (nextCity, category) =>
        !hiddenCategories.includes(`${nextCity}:${category}`),
      signInCustomer: (phone) => {
        setCustomerAuthed(true)
        setCustomerPhone(phone)
      },
      signOutCustomer: () => {
        setCustomerAuthed(false)
        setCustomerPhone("")
      },
      setLocation: (nextCity, nextArea) => {
        setCity(nextCity)
        setArea(nextArea)
      },
      setPackageChoice,
      placeBooking: (input) => {
        setBooking({
          ...input,
          id: "HM240518",
          extras: [],
          status: "requested",
          startOtp,
          customerName: "Aarav Sharma",
        })
      },
      acceptJob: () => {
        setBooking((current) =>
          current ? { ...current, status: "accepted" } : current,
        )
      },
      declineJob: () => {
        setBooking((current) =>
          current?.status === "requested" ? null : current,
        )
      },
      setJobStatus: (status) => {
        setBooking((current) => (current ? { ...current, status } : current))
      },
      verifyStartOtp: (code) => {
        const matches = code === startOtp
        if (matches) {
          setBooking((current) =>
            current ? { ...current, status: "started" } : current,
          )
        }
        return matches
      },
      toggleExtra: (extra) => {
        setBooking((current) => {
          if (!current) return current
          const exists = current.extras.some((item) => item.id === extra.id)
          return {
            ...current,
            extras: exists
              ? current.extras.filter((item) => item.id !== extra.id)
              : [...current.extras, extra],
          }
        })
      },
      toggleCategory: (nextCity, category) => {
        const key = `${nextCity}:${category}`
        setHiddenCategories((current) =>
          current.includes(key)
            ? current.filter((item) => item !== key)
            : [...current, key],
        )
      },
      toggleSuspend: (name) => {
        setSuspended((current) =>
          current.includes(name)
            ? current.filter((item) => item !== name)
            : [...current, name],
        )
      },
      orderTotal: (current) => bookingTotal(current.basePrice, current.extras),
    }),
    [
      area,
      booking,
      city,
      customerAuthed,
      customerPhone,
      hiddenCategories,
      packageChoice,
      suspended,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error("useDemo must be used inside DemoProvider")
  return value
}
