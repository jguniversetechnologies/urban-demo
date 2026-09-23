"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  bookingTotal,
  startOtp,
  type PackageChoice,
} from "@/data/market"
import type { CatalogMatch } from "@/data/services"
import type { Mode } from "@/types/navigation"

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

export type ScheduleDraft = {
  dateId: string
  time: string
  address: string
  payment: "online" | "cash"
}

type AuthDraft = {
  phone: string
  name: string
  email: string
}

type Persisted = {
  customerAuthed: boolean
  customerPhone: string
  city: string
  area: string
  packageChoice: PackageChoice | null
  booking: LiveBooking | null
  suspended: string[]
  hiddenCategories: string[]
  role: Mode
  pendingPath: string | null
  authDraft: AuthDraft
  activeCategory: string
  selection: CatalogMatch | null
  schedule: ScheduleDraft
  adminAuthenticated: boolean
  adminCity: string
}

type DemoValue = Persisted & {
  ready: boolean
  rewardPoints: number
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
  setRole: (role: Mode) => void
  setPendingPath: (path: string | null) => void
  patchAuthDraft: (patch: Partial<AuthDraft>) => void
  setActiveCategory: (category: string) => void
  setSelection: (selection: CatalogMatch | null) => void
  patchSchedule: (patch: Partial<ScheduleDraft>) => void
  authenticateAdmin: () => void
  signOutAdmin: () => void
  setAdminCity: (city: string) => void
}

const STORAGE_KEY = "homify-demo"

const initialPersisted: Persisted = {
  customerAuthed: false,
  customerPhone: "",
  city: "",
  area: "",
  packageChoice: null,
  booking: null,
  suspended: [],
  hiddenCategories: [],
  role: "customer",
  pendingPath: null,
  authDraft: { phone: "", name: "", email: "" },
  activeCategory: "Cleaning",
  selection: null,
  schedule: {
    dateId: "",
    time: "10:00 AM",
    address: "Home",
    payment: "online",
  },
  adminAuthenticated: false,
  adminCity: "Bengaluru",
}

const DemoContext = createContext<DemoValue | null>(null)

function loadPersisted(): Persisted | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return {
      ...initialPersisted,
      ...parsed,
      authDraft: { ...initialPersisted.authDraft, ...parsed.authDraft },
      schedule: { ...initialPersisted.schedule, ...parsed.schedule },
    }
  } catch {
    return null
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(initialPersisted)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = loadPersisted()
    if (saved) setData(saved)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data, ready])

  const value = useMemo<DemoValue>(() => {
    const patch = (partial: Partial<Persisted>) => {
      setData((current) => ({ ...current, ...partial }))
    }

    return {
      ...data,
      ready,
      rewardPoints: 240,
      categoryLive: (nextCity, category) =>
        !data.hiddenCategories.includes(`${nextCity}:${category}`),
      signInCustomer: (phone) =>
        patch({ customerAuthed: true, customerPhone: phone }),
      signOutCustomer: () => patch({ customerAuthed: false, customerPhone: "" }),
      setLocation: (city, area) => patch({ city, area }),
      setPackageChoice: (packageChoice) => patch({ packageChoice }),
      placeBooking: (input) =>
        patch({
          booking: {
            ...input,
            id: "HM240518",
            extras: [],
            status: "requested",
            startOtp,
            customerName: "Aarav Sharma",
          },
        }),
      acceptJob: () =>
        setData((current) => ({
          ...current,
          booking: current.booking
            ? { ...current.booking, status: "accepted" }
            : current.booking,
        })),
      declineJob: () =>
        setData((current) => ({
          ...current,
          booking:
            current.booking?.status === "requested" ? null : current.booking,
        })),
      setJobStatus: (status) =>
        setData((current) => ({
          ...current,
          booking: current.booking
            ? { ...current.booking, status }
            : current.booking,
        })),
      verifyStartOtp: (code) => {
        const matches = code === startOtp
        if (matches) {
          setData((current) => ({
            ...current,
            booking: current.booking
              ? { ...current.booking, status: "started" }
              : current.booking,
          }))
        }
        return matches
      },
      toggleExtra: (extra) =>
        setData((current) => {
          if (!current.booking) return current
          const exists = current.booking.extras.some((item) => item.id === extra.id)
          return {
            ...current,
            booking: {
              ...current.booking,
              extras: exists
                ? current.booking.extras.filter((item) => item.id !== extra.id)
                : [...current.booking.extras, extra],
            },
          }
        }),
      toggleCategory: (nextCity, category) => {
        const key = `${nextCity}:${category}`
        setData((current) => ({
          ...current,
          hiddenCategories: current.hiddenCategories.includes(key)
            ? current.hiddenCategories.filter((item) => item !== key)
            : [...current.hiddenCategories, key],
        }))
      },
      toggleSuspend: (name) =>
        setData((current) => ({
          ...current,
          suspended: current.suspended.includes(name)
            ? current.suspended.filter((item) => item !== name)
            : [...current.suspended, name],
        })),
      orderTotal: (current) => bookingTotal(current.basePrice, current.extras),
      setRole: (role) => patch({ role }),
      setPendingPath: (pendingPath) =>
        setData((current) =>
          current.pendingPath === pendingPath ? current : { ...current, pendingPath },
        ),
      patchAuthDraft: (authPatch) =>
        setData((current) => ({
          ...current,
          authDraft: { ...current.authDraft, ...authPatch },
        })),
      setActiveCategory: (activeCategory) => patch({ activeCategory }),
      setSelection: (selection) => patch({ selection }),
      patchSchedule: (schedulePatch) =>
        setData((current) => ({
          ...current,
          schedule: { ...current.schedule, ...schedulePatch },
        })),
      authenticateAdmin: () => patch({ adminAuthenticated: true }),
      signOutAdmin: () => patch({ adminAuthenticated: false }),
      setAdminCity: (adminCity) => patch({ adminCity }),
    }
  }, [data, ready])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error("useDemo must be used inside DemoProvider")
  return value
}
