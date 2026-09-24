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
import { loadStore, saveBooking, saveCustomer, saveProvider } from "@/lib/syncLive"

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
  customerPhone: string
  discount: number
  coupon: string
  notes: string
  visitType: "once" | "weekly"
  paymentStatus: "pending" | "paid" | "failed" | "cash"
  walletUsed: number
  reviewNote: string
  proofPhotos: string[]
}

export type KycStatus = "none" | "pending" | "approved" | "rejected"

export type ProviderAccount = {
  phone: string
  name: string
  city: string
  skill: string
  kyc: KycStatus
  kycNote: string
  documents: Record<string, string>
  token: string
  online: boolean
  earned: number
  bankName: string
  ifsc: string
  accountNo: string
  emergency: string
  trainingDone: boolean
  onLeave: boolean
  sosNote: string
  customerScore: number | null
}

export type AppNotice = {
  id: string
  audience: "customer" | "provider"
  title: string
  body: string
}

export type Coupon = {
  code: string
  off: number
  label: string
  active: boolean
}

export type RosterReview = "pending" | "approved" | "rejected"

export type RosterPartner = {
  name: string
  service: string
  docs: string
  review: RosterReview
}

export type SavedAddress = {
  label: string
  line: string
  kind?: "Home" | "Work" | "Other"
  landmark?: string
}

export type SupportTicket = {
  id: string
  from: "customer" | "provider"
  topic: string
  detail: string
  status: "open" | "resolved"
  photo: string
}
export type SavedCard = { label: string; detail: string }
export type PastBooking = { id: string; name: string; when: string; price: string }

type PlaceBookingInput = {
  serviceName: string
  category: string
  packageLabel: string
  basePrice: number
  dateLabel: string
  time: string
  address: string
  payment: "online" | "cash"
  notes?: string
  visitType?: "once" | "weekly"
  paymentStatus?: LiveBooking["paymentStatus"]
  walletUsed?: number
}

export type ScheduleDraft = {
  dateId: string
  time: string
  address: string
  payment: "online" | "cash"
  notes: string
  visitType: "once" | "weekly" | "monthly"
  useWallet: boolean
  sameProvider: boolean
}

type AuthDraft = {
  phone: string
  name: string
  email: string
}

type Persisted = {
  customerAuthed: boolean
  customerPhone: string
  customerName: string
  customerEmail: string
  customerToken: string
  customerRating: number | null
  city: string
  area: string
  packageChoice: PackageChoice | null
  booking: LiveBooking | null
  history: PastBooking[]
  addresses: SavedAddress[]
  cards: SavedCard[]
  notices: AppNotice[]
  coupons: Coupon[]
  couponCode: string
  wallet: number
  favorites: string[]
  tickets: SupportTicket[]
  reviewNote: string
  blockedPhones: string[]
  audit: string[]
  provider: ProviderAccount
  roster: RosterPartner[]
  extraCategories: string[]
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
  signInProvider: (phone: string) => void
  signOutCustomer: () => void
  deleteCustomer: () => void
  signOutProvider: () => void
  setCustomerProfile: (patch: { name?: string; email?: string }) => void
  setProviderProfile: (patch: Partial<Pick<ProviderAccount, "name" | "city" | "skill">>) => void
  setProviderDocument: (name: string, fileName: string) => void
  submitProviderKyc: () => void
  reviewProviderKyc: (status: "approved" | "rejected", note?: string) => void
  reviewRoster: (name: string, review: RosterReview) => void
  addCategory: (name: string) => void
  setProviderOnline: (online: boolean) => void
  applyCoupon: (code: string) => boolean
  clearCoupon: () => void
  toggleCoupon: (code: string) => void
  addAddress: (label: string, line: string, landmark?: string) => void
  removeAddress: (label: string) => void
  cancelBooking: (reason: string) => void
  rescheduleBooking: (dateLabel: string, time: string) => void
  saveReview: (rating: number, note: string) => void
  raiseTicket: (from: SupportTicket["from"], topic: string, detail: string, photo?: string) => void
  setTicketStatus: (id: string, status: SupportTicket["status"]) => void
  toggleFavorite: (name: string) => void
  setProviderBank: (patch: Partial<Pick<ProviderAccount, "bankName" | "ifsc" | "accountNo" | "emergency">>) => void
  completeTraining: () => void
  setProviderLeave: (onLeave: boolean) => void
  addProofPhoto: (name: string) => void
  rateCustomer: (score: number) => void
  raiseSos: (note: string) => void
  createCoupon: (code: string, off: number, label: string) => void
  blockCustomer: (phone: string) => void
  areaServed: (city: string) => boolean
  addCard: () => void
  setCustomerRating: (rating: number) => void
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

const starterRoster: RosterPartner[] = [
  { name: "Ravi Kumar", service: "Cleaning", docs: "Aadhaar + PAN", review: "pending" },
  { name: "Imran Ali", service: "AC repair", docs: "Aadhaar + Certificate", review: "pending" },
  { name: "Nisha Shah", service: "Beauty", docs: "Aadhaar + PAN", review: "pending" },
]

const emptyProvider: ProviderAccount = {
  phone: "",
  name: "",
  city: "",
  skill: "",
  kyc: "none",
  kycNote: "",
  documents: {},
  token: "",
  online: false,
  earned: 0,
  bankName: "",
  ifsc: "",
  accountNo: "",
  emergency: "",
  trainingDone: false,
  onLeave: false,
  sosNote: "",
  customerScore: null,
}

const initialPersisted: Persisted = {
  customerAuthed: false,
  customerPhone: "",
  customerName: "",
  customerEmail: "",
  customerToken: "",
  customerRating: null,
  city: "",
  area: "",
  packageChoice: null,
  booking: null,
  history: [],
  addresses: [
    { label: "Home", line: "12, 4th Cross" },
    { label: "Office", line: "80 Feet Road" },
  ],
  cards: [{ label: "HDFC Visa •••• 4820", detail: "Expires 09/28" }],
  notices: [],
  coupons: [
    { code: "HOME100", off: 100, label: "₹100 off your visit", active: true },
    { code: "WELCOME50", off: 50, label: "₹50 off your first booking", active: true },
  ],
  couponCode: "",
  wallet: 150,
  favorites: [],
  tickets: [],
  reviewNote: "",
  blockedPhones: [],
  audit: [],
  provider: emptyProvider,
  roster: starterRoster,
  extraCategories: [],
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
    notes: "",
    visitType: "once",
    useWallet: false,
    sameProvider: false,
  },
  adminAuthenticated: false,
  adminCity: "Bengaluru",
}

function makeToken(prefix: string) {
  const alphabet = "abcdef0123456789"
  let body = ""
  for (let index = 0; index < 24; index += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `${prefix}_${body}`
}

function rememberBooking(booking: LiveBooking | null, providerPhone = "") {
  if (!booking) return
  void saveBooking(booking, providerPhone)
}

function rememberCustomer(current: Persisted) {
  if (!current.customerPhone) return
  void saveCustomer({
    phone: current.customerPhone,
    name: current.customerName,
    email: current.customerEmail,
    token: current.customerToken,
    city: current.city,
    area: current.area,
    rating: current.customerRating,
  })
}

function rememberProvider(provider: ProviderAccount) {
  if (!provider.phone) return
  void saveProvider({
    phone: provider.phone,
    name: provider.name,
    city: provider.city,
    skill: provider.skill,
    kyc: provider.kyc,
    kycNote: provider.kycNote,
    documents: provider.documents,
    token: provider.token,
    online: provider.online,
  })
}

function addNotice(
  notices: AppNotice[],
  audience: AppNotice["audience"],
  title: string,
  body: string,
) {
  return [
    { id: `${Date.now()}-${audience}`, audience, title, body },
    ...notices,
  ].slice(0, 20)
}

const DemoContext = createContext<DemoValue | null>(null)

function mergeCoupons(saved?: Coupon[]) {
  const current = saved?.length ? saved : []
  const missing = initialPersisted.coupons.filter(
    (item) => !current.some((savedItem) => savedItem.code === item.code),
  )
  return current.length ? [...current, ...missing] : initialPersisted.coupons
}

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
      provider: { ...emptyProvider, ...parsed.provider },
      coupons: mergeCoupons(parsed.coupons),
      roster: parsed.roster?.length ? parsed.roster : starterRoster,
      extraCategories: parsed.extraCategories ?? [],
      addresses: parsed.addresses?.length ? parsed.addresses : initialPersisted.addresses,
      cards: parsed.cards?.length ? parsed.cards : initialPersisted.cards,
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
    rememberCustomer(data)
    rememberProvider(data.provider)
    rememberBooking(data.booking, data.provider.phone)
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
        setData((current) => {
          const token = current.customerToken || makeToken("cust")
          const name = current.authDraft.name || current.customerName
          const email = current.authDraft.email || current.customerEmail
          const next = {
            ...current,
            customerAuthed: true,
            customerPhone: phone,
            customerName: name,
            customerEmail: email,
            customerToken: token,
            notices: addNotice(
              current.notices,
              "customer",
              "You're signed in",
              `We'll use +91 ${phone} for booking updates.`,
            ),
          }
          queueMicrotask(() => {
            rememberCustomer(next)
            void loadStore().then((store) => {
              const saved = store.customers.find((item) => item.phone === phone)
              const mine = store.bookings.filter((item) => item.customerPhone === phone)
              const active = mine.find((item) => item.status !== "completed")
              setData((latest) => ({
                ...latest,
                customerName: latest.customerName || saved?.name || "",
                customerEmail: latest.customerEmail || saved?.email || "",
                city: latest.city || saved?.city || "",
                area: latest.area || saved?.area || "",
                customerRating: latest.customerRating ?? saved?.rating ?? null,
                booking:
                  latest.booking ??
                  (active
                    ? {
                        id: active.id,
                        serviceName: active.serviceName,
                        category: active.category,
                        packageLabel: active.packageLabel,
                        basePrice: active.basePrice,
                        extras: active.extras,
                        dateLabel: active.dateLabel,
                        time: active.time,
                        address: active.address,
                        payment: active.payment,
                        status: active.status as JobStatus,
                        startOtp: active.startOtp,
                        customerName: active.customerName,
                        customerPhone: active.customerPhone,
                        discount: active.discount,
                        coupon: active.coupon,
                        notes: "",
                        visitType: "once",
                        paymentStatus: active.payment === "cash" ? "cash" : "paid",
                        walletUsed: 0,
                        reviewNote: "",
                        proofPhotos: [],
                      }
                    : null),
                history: [
                  ...latest.history,
                  ...mine
                    .filter((item) => item.status === "completed")
                    .filter((item) => !latest.history.some((saved) => saved.id === item.id))
                    .map((item) => ({
                      id: item.id,
                      name: item.serviceName,
                      when: `${item.dateLabel} · Completed`,
                      price: `₹${item.basePrice}`,
                    })),
                ],
              }))
            })
          })
          return next
        }),
      signInProvider: (phone) =>
        setData((current) => {
          const same = current.provider.phone === phone && phone !== ""
          const provider: ProviderAccount = same
            ? {
                ...current.provider,
                name: current.authDraft.name || current.provider.name,
                token: current.provider.token || makeToken("prov"),
              }
            : {
                ...emptyProvider,
                phone,
                name: current.authDraft.name || "",
                token: makeToken("prov"),
              }
          queueMicrotask(() => rememberProvider(provider))
          return {
            ...current,
            provider,
            notices: addNotice(
              current.notices,
              "provider",
              "Partner signed in",
              `This device is saved for +91 ${phone}.`,
            ),
          }
        }),
      signOutCustomer: () => patch({ customerAuthed: false }),
      deleteCustomer: () =>
        setData((current) => ({
          ...current,
          customerAuthed: false,
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          customerToken: "",
          favorites: [],
          wallet: 0,
          booking: null,
        })),
      signOutProvider: () =>
        setData((current) => ({
          ...current,
          provider: { ...current.provider, online: false },
        })),
      setCustomerProfile: (profile) =>
        setData((current) => ({
          ...current,
          customerName: profile.name ?? current.customerName,
          customerEmail: profile.email ?? current.customerEmail,
        })),
      setProviderProfile: (profile) =>
        setData((current) => ({
          ...current,
          provider: { ...current.provider, ...profile },
        })),
      setProviderDocument: (name, fileName) =>
        setData((current) => ({
          ...current,
          provider: {
            ...current.provider,
            documents: { ...current.provider.documents, [name]: fileName },
          },
        })),
      submitProviderKyc: () =>
        setData((current) => ({
          ...current,
          provider: {
            ...current.provider,
            kyc: "pending",
            kycNote: "",
          },
          notices: addNotice(
            current.notices,
            "provider",
            "KYC submitted",
            "Admin will check your documents before you can go online.",
          ),
        })),
      reviewProviderKyc: (status, note = "") =>
        setData((current) => ({
          ...current,
          provider: {
            ...current.provider,
            kyc: status,
            kycNote: note,
            online: status === "approved" ? current.provider.online : false,
          },
          notices: addNotice(
            current.notices,
            "provider",
            status === "approved" ? "KYC approved" : "KYC needs a change",
            status === "approved"
              ? "You can go online and accept jobs."
              : note || "Upload the documents again.",
          ),
        })),
      reviewRoster: (name, review) =>
        setData((current) => ({
          ...current,
          roster: current.roster.map((partner) =>
            partner.name === name ? { ...partner, review } : partner,
          ),
        })),
      addCategory: (name) =>
        setData((current) =>
          current.extraCategories.some(
            (item) => item.toLowerCase() === name.toLowerCase(),
          )
            ? current
            : { ...current, extraCategories: [...current.extraCategories, name] },
        ),
      setProviderOnline: (online) =>
        setData((current) => {
          const blocked =
            current.provider.kyc !== "approved" ||
            !current.provider.trainingDone ||
            current.provider.onLeave ||
            current.suspended.includes(current.provider.name)
          if (online && blocked) return current
          return { ...current, provider: { ...current.provider, online } }
        }),
      applyCoupon: (code) => {
        const found = data.coupons.find(
          (item) => item.active && item.code.toLowerCase() === code.trim().toLowerCase(),
        )
        if (!found) return false
        patch({ couponCode: found.code })
        return true
      },
      clearCoupon: () => patch({ couponCode: "" }),
      toggleCoupon: (code) =>
        setData((current) => ({
          ...current,
          coupons: current.coupons.map((item) =>
            item.code === code ? { ...item, active: !item.active } : item,
          ),
          couponCode:
            current.couponCode === code &&
            current.coupons.find((item) => item.code === code)?.active
              ? ""
              : current.couponCode,
        })),
      addAddress: (label, line, landmark = "") =>
        setData((current) => ({
          ...current,
          addresses: [
            ...current.addresses.filter((item) => item.label !== label),
            { label, line, landmark, kind: label === "Work" ? "Work" : label === "Home" ? "Home" : "Other" },
          ],
        })),
      removeAddress: (label) =>
        setData((current) => ({
          ...current,
          addresses: current.addresses.filter((item) => item.label !== label),
        })),
      cancelBooking: (reason) =>
        setData((current) => {
          const booking = current.booking
          if (!booking || booking.status === "started" || booking.status === "completed") {
            return current
          }
          const refund = booking.paymentStatus === "paid" ? booking.walletUsed + booking.discount : booking.walletUsed
          return {
            ...current,
            booking: null,
            wallet: current.wallet + booking.walletUsed + (booking.paymentStatus === "paid" ? Math.min(booking.basePrice, 100) : 0),
            history: [
              {
                id: booking.id,
                name: booking.serviceName,
                when: `${booking.dateLabel} · Cancelled · ${reason}`,
                price: `₹${booking.basePrice}`,
              },
              ...current.history.filter((item) => item.id !== booking.id),
            ],
            notices: addNotice(
              current.notices,
              "customer",
              "Booking cancelled",
              refund ? `${reason}. A credit was added to your wallet.` : reason,
            ),
            audit: [`Cancelled ${booking.id}: ${reason}`, ...current.audit].slice(0, 30),
          }
        }),
      rescheduleBooking: (dateLabel, time) =>
        setData((current) => {
          if (!current.booking || current.booking.status === "completed") return current
          const booking = { ...current.booking, dateLabel, time }
          queueMicrotask(() => rememberBooking(booking, current.provider.phone))
          return {
            ...current,
            booking,
            notices: addNotice(
              current.notices,
              "provider",
              "Visit rescheduled",
              `${booking.serviceName} moved to ${dateLabel} at ${time}.`,
            ),
          }
        }),
      saveReview: (customerRating, reviewNote) =>
        patch({ customerRating, reviewNote }),
      raiseTicket: (from, topic, detail, photo = "") =>
        setData((current) => ({
          ...current,
          tickets: [
            {
              id: `T${Date.now().toString().slice(-5)}`,
              from,
              topic,
              detail,
              status: "open",
              photo,
            },
            ...current.tickets,
          ],
          notices: addNotice(
            current.notices,
            from,
            "Support request sent",
            topic,
          ),
        })),
      setTicketStatus: (id, status) =>
        setData((current) => ({
          ...current,
          tickets: current.tickets.map((item) =>
            item.id === id ? { ...item, status } : item,
          ),
        })),
      toggleFavorite: (name) =>
        setData((current) => ({
          ...current,
          favorites: current.favorites.includes(name)
            ? current.favorites.filter((item) => item !== name)
            : [...current.favorites, name],
        })),
      setProviderBank: (bankPatch) =>
        setData((current) => ({
          ...current,
          provider: { ...current.provider, ...bankPatch },
        })),
      completeTraining: () =>
        setData((current) => ({
          ...current,
          provider: { ...current.provider, trainingDone: true },
          notices: addNotice(
            current.notices,
            "provider",
            "Training complete",
            "Safety and service steps are marked done.",
          ),
        })),
      setProviderLeave: (onLeave) =>
        setData((current) => ({
          ...current,
          provider: {
            ...current.provider,
            onLeave,
            online: onLeave ? false : current.provider.online,
          },
        })),
      addProofPhoto: (name) =>
        setData((current) => {
          if (!current.booking) return current
          return {
            ...current,
            booking: {
              ...current.booking,
              proofPhotos: [...(current.booking.proofPhotos || []), name],
            },
          }
        }),
      rateCustomer: (customerScore) =>
        setData((current) => ({
          ...current,
          provider: { ...current.provider, customerScore },
        })),
      raiseSos: (sosNote) =>
        setData((current) => ({
          ...current,
          provider: { ...current.provider, sosNote },
          notices: addNotice(
            current.notices,
            "provider",
            "SOS sent",
            sosNote || "Homify support has this alert.",
          ),
          audit: [`SOS from ${current.provider.name || "partner"}`, ...current.audit].slice(0, 30),
        })),
      createCoupon: (code, off, label) =>
        setData((current) => {
          const clean = code.trim().toUpperCase()
          if (!clean || off <= 0) return current
          const next = current.coupons.filter((item) => item.code !== clean)
          return {
            ...current,
            coupons: [...next, { code: clean, off, label: label || `₹${off} off`, active: true }],
          }
        }),
      blockCustomer: (phone) =>
        setData((current) => ({
          ...current,
          blockedPhones: current.blockedPhones.includes(phone)
            ? current.blockedPhones.filter((item) => item !== phone)
            : [...current.blockedPhones, phone],
          audit: [
            `${current.blockedPhones.includes(phone) ? "Unblocked" : "Blocked"} ${phone}`,
            ...current.audit,
          ].slice(0, 30),
        })),
      areaServed: (city) => city === "Rasayani",
      addCard: () =>
        setData((current) => ({
          ...current,
          cards: [
            ...current.cards,
            { label: "UPI · you@okhdfc", detail: "Added just now" },
          ],
        })),
      setCustomerRating: (customerRating) => patch({ customerRating }),
      setLocation: (city, area) =>
        setData((current) => {
          const next = { ...current, city, area }
          queueMicrotask(() => rememberCustomer(next))
          return next
        }),
      setPackageChoice: (packageChoice) => patch({ packageChoice }),
      placeBooking: (input) =>
        setData((current) => {
          if (current.blockedPhones.includes(current.customerPhone)) return current
          const coupon = current.coupons.find(
            (item) => item.active && item.code === current.couponCode,
          )
          const walletUsed = input.walletUsed ?? 0
          const booking: LiveBooking = {
            ...input,
            id: `HM${Date.now().toString().slice(-6)}`,
            extras: [],
            status: "requested",
            startOtp,
            customerName: current.customerName || "Customer",
            customerPhone: current.customerPhone,
            discount: coupon?.off ?? 0,
            coupon: coupon?.code ?? "",
            notes: input.notes ?? "",
            visitType: input.visitType ?? "once",
            paymentStatus:
              input.paymentStatus ??
              (input.payment === "cash" ? "cash" : "pending"),
            walletUsed,
            reviewNote: "",
            proofPhotos: [],
          }
          queueMicrotask(() => rememberBooking(booking, current.provider.phone))
          return {
            ...current,
            booking,
            wallet: Math.max(0, current.wallet - walletUsed),
            notices: addNotice(
              current.notices,
              "customer",
              "Request sent",
              `${booking.serviceName} is waiting for a partner to accept.`,
            ),
          }
        }),
      acceptJob: () =>
        setData((current) => {
          const booking = current.booking
            ? { ...current.booking, status: "accepted" as const }
            : current.booking
          queueMicrotask(() => rememberBooking(booking, current.provider.phone))
          return {
            ...current,
            booking,
            notices: current.booking
              ? addNotice(
                  current.notices,
                  "customer",
                  "Booking accepted",
                  `${current.provider.name || "Your partner"} accepted the job.`,
                )
              : current.notices,
          }
        }),
      declineJob: () =>
        setData((current) => ({
          ...current,
          booking:
            current.booking?.status === "requested" ? null : current.booking,
        })),
      setJobStatus: (status) =>
        setData((current) => {
          if (!current.booking) return current
          const booking = { ...current.booking, status }
          const justDone =
            status === "completed" && current.booking.status !== "completed"
          const labels: Record<JobStatus, string> = {
            requested: "Request sent",
            accepted: "Booking accepted",
            on_the_way: "Partner is on the way",
            started: "Service started",
            completed: "Service completed",
          }
          queueMicrotask(() => rememberBooking(booking, current.provider.phone))
          return {
            ...current,
            booking,
            history: justDone
              ? [
                  {
                    id: booking.id,
                    name: booking.serviceName,
                    when: `${booking.dateLabel} · Completed`,
                    price: `₹${booking.basePrice + booking.extras.reduce((sum, item) => sum + item.price, 0)}`,
                  },
                  ...current.history.filter((item) => item.id !== booking.id),
                ]
              : current.history,
            provider: justDone
              ? {
                  ...current.provider,
                  earned: current.provider.earned + booking.basePrice,
                }
              : current.provider,
            notices: addNotice(
              current.notices,
              "customer",
              labels[status],
              booking.serviceName,
            ),
          }
        }),
      verifyStartOtp: (code) => {
        const matches = code === startOtp
        if (matches) {
          setData((current) => ({
            ...current,
            booking: current.booking
              ? { ...current.booking, status: "started" }
              : current.booking,
            notices: current.booking
              ? addNotice(
                  current.notices,
                  "customer",
                  "Service started",
                  current.booking.serviceName,
                )
              : current.notices,
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
      orderTotal: (current) =>
        Math.max(
          0,
          bookingTotal(current.basePrice, current.extras) -
            (current.discount || 0) -
            (current.walletUsed || 0),
        ),
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
