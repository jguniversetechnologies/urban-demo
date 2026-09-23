"use client"

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  BadgePercent,
  ChevronRight,
  ClipboardList,
  Gift,
  Headphones,
  Info,
  MapPin,
  Settings,
  Smartphone,
  Star,
  Wallet,
  WalletCards,
} from "lucide-react"
import { BottomNav, Header } from "@/components/AppChrome"
import { findService } from "@/data/services"
import { servicePath } from "@/lib/paths"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits ? `+91 ${digits}` : "Number not saved"
}

export function Profile({ panel = "" }: { panel?: string }) {
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()
  const [help, setHelp] = useState("")
  const [addressLabel, setAddressLabel] = useState("")
  const [addressLine, setAddressLine] = useState("")
  const [draftName, setDraftName] = useState(demo.customerName)
  const incomplete = !demo.customerName
  const place = [demo.area, demo.city].filter(Boolean).join(", ")
  const notices = demo.notices.filter((item) => item.audience === "customer")

  const openBooking = (name: string) => {
    const match = findService(name)
    if (!match) {
      router.push("/services/cleaning")
      return
    }
    demo.setActiveCategory(match.category)
    demo.setSelection(match)
    router.push(servicePath(match.category, match.name))
  }

  const rows = [
    ["My Plans", BadgePercent, "/profile/plans"],
    ["Wallet", Wallet, "/profile/wallet"],
    ["Gift cards", Gift, "/profile/gifts"],
    ["Passes & membership", BadgePercent, "/profile/passes"],
    ["My rating", Star, "/profile/rating"],
    ["Manage addresses", MapPin, "/profile/addresses"],
    ["Manage payment methods", WalletCards, "/profile/payments"],
    ["Settings", Settings, "/profile/settings"],
    ["About Homify", Info, "/profile/about"],
  ] as const

  const cards = [
    ["My bookings", ClipboardList, "/profile/history"],
    ["Native devices", Smartphone, "/profile/devices"],
    ["Help & support", Headphones, "/profile/help"],
  ] as const

  let detail: ReactNode = null
  if (panel === "Booking history") {
    const rowsToShow = [
      ...(demo.booking
        ? [[
            demo.booking.serviceName,
            `${demo.booking.dateLabel} · ${demo.booking.status.split("_").join(" ")}`,
            `₹${demo.orderTotal(demo.booking)}`,
          ]]
        : []),
      ...demo.history.map((item) => [item.name, item.when, item.price]),
    ]
    detail = (
      <>
        <h2 className="section-title mt-6">My bookings</h2>
        {rowsToShow.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">No bookings yet.</p>
        )}
        {rowsToShow.map(([name, status, price]) => (
          <div key={`${name}-${status}`} className="mt-3 rounded-2xl border border-slate-100 p-4">
            <div className="flex justify-between">
              <b className="text-sm">{name}</b>
              <b className="text-sm">{price}</b>
            </div>
            <p className="mt-2 text-xs capitalize text-slate-500">{status}</p>
            <button
              onClick={() => openBooking(name)}
              className="mt-3 text-xs font-bold text-teal-700"
            >
              Book again
            </button>
          </div>
        ))}
      </>
    )
  } else if (panel === "Native devices") {
    detail = (
      <>
        <h2 className="section-title mt-6">Native devices</h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          This phone is tied to your login. Booking alerts use this device token.
        </p>
        <div className="mt-4 rounded-2xl border border-slate-100 p-4">
          <b className="text-sm">This phone</b>
          <p className="mt-1 text-xs text-slate-500">{formatPhone(demo.customerPhone)}</p>
          <p className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-600">
            {demo.customerToken || "Sign in to create a token"}
          </p>
        </div>
      </>
    )
  } else if (panel === "Alerts") {
    detail = (
      <>
        <h2 className="section-title mt-6">Notifications</h2>
        {notices.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">No alerts yet.</p>
        )}
        {notices.map((item) => (
          <div key={item.id} className="mt-3 rounded-2xl border border-slate-100 p-4">
            <b className="text-sm">{item.title}</b>
            <p className="mt-1 text-xs text-slate-500">{item.body}</p>
          </div>
        ))}
      </>
    )
  } else if (panel === "Saved addresses") {
    detail = (
      <>
        <h2 className="section-title mt-6">Manage addresses</h2>
        {demo.addresses.map((item) => (
          <div key={item.label} className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
            <MapPin size={18} className="text-teal-600" />
            <div>
              <b className="text-sm">{item.label}</b>
              <p className="mt-1 text-xs text-slate-500">
                {item.line}
                {place ? `, ${place}` : ""}
              </p>
            </div>
          </div>
        ))}
        <label className="form-label mt-6">
          Label
          <input value={addressLabel} onChange={(event) => setAddressLabel(event.target.value)} className="form-input" placeholder="Parents" />
        </label>
        <label className="form-label">
          Address
          <input value={addressLine} onChange={(event) => setAddressLine(event.target.value)} className="form-input" placeholder="Street and area" />
        </label>
        <button
          className="primary-btn w-full"
          onClick={() => {
            if (!addressLabel.trim() || !addressLine.trim()) return
            demo.addAddress(addressLabel.trim(), addressLine.trim())
            setAddressLabel("")
            setAddressLine("")
          }}
        >
          Add address
        </button>
      </>
    )
  } else if (panel === "Payment methods") {
    detail = (
      <>
        <h2 className="section-title mt-6">Payment methods</h2>
        {demo.cards.map((card) => (
          <div key={card.label} className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
            <WalletCards className="text-teal-600" />
            <div className="flex-1">
              <b className="text-sm">{card.label}</b>
              <p className="text-xs text-slate-500">{card.detail}</p>
            </div>
          </div>
        ))}
        <button className="secondary-btn mt-4 w-full" onClick={demo.addCard}>
          Add payment method
        </button>
      </>
    )
  } else if (panel === "Help & support") {
    const answers: Record<string, string> = {
      "Chat with support": "Demo chat: write to help@homify.in. A person replies in the full app.",
      "Call customer care": "Demo care number: 1800 202 4455, 8am to 8pm.",
      "Frequently asked questions": "Use code HOME100 for ₹100 off. Partner start code is 7291.",
    }
    detail = (
      <>
        <h2 className="section-title mt-6">Help & support</h2>
        {Object.keys(answers).map((item) => (
          <button
            key={item}
            onClick={() => setHelp(help === item ? "" : item)}
            className="mt-3 w-full rounded-2xl border border-slate-100 p-4 text-left"
          >
            <span className="flex items-center justify-between text-sm font-bold">
              {item}
              <ChevronRight size={17} />
            </span>
            {help === item && (
              <p className="mt-2 text-xs leading-5 text-slate-500">{answers[item]}</p>
            )}
          </button>
        ))}
      </>
    )
  } else if (panel === "My Plans") {
    detail = <p className="mt-6 text-sm text-slate-500">No active plan. Plans are added when the full app is built.</p>
  } else if (panel === "Wallet") {
    detail = (
      <>
        <h2 className="section-title mt-6">Wallet</h2>
        <p className="mt-3 text-3xl font-extrabold">₹0</p>
        <p className="mt-2 text-sm text-slate-500">Pay on the booking screen. Wallet top-up comes with the full app.</p>
      </>
    )
  } else if (panel === "Gift cards") {
    detail = <p className="mt-6 text-sm text-slate-500">No gift cards yet.</p>
  } else if (panel === "Passes & membership") {
    detail = <p className="mt-6 text-sm text-slate-500">No membership yet. Use coupon HOME100 at payment.</p>
  } else if (panel === "My rating") {
    detail = (
      <>
        <h2 className="section-title mt-6">My rating</h2>
        <p className="mt-3 text-3xl font-extrabold">
          {demo.customerRating ? `${demo.customerRating}.0` : "—"}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {demo.customerRating
            ? "Saved from your last visit review."
            : "Rate a completed visit and it will show here."}
        </p>
      </>
    )
  } else if (panel === "Settings") {
    detail = (
      <>
        <h2 className="section-title mt-6">Settings</h2>
        <p className="mt-3 text-sm text-slate-500">
          Alerts for this number are on. Token {demo.customerToken.slice(0, 12) || "pending"}.
        </p>
        <button
          onClick={() => {
            demo.signOutCustomer()
            go("login")
          }}
          className="mt-8 text-sm font-bold text-rose-600"
        >
          Sign out
        </button>
      </>
    )
  } else if (panel === "About") {
    detail = (
      <>
        <h2 className="section-title mt-6">About Homify</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Homify connects you with local partners for cleaning, repairs, and beauty. This demo shows the customer, partner, and admin on one booking.
        </p>
      </>
    )
  } else if (panel === "Complete profile") {
    detail = (
      <>
        <h2 className="section-title mt-6">Complete profile</h2>
        <label className="form-label mt-5">
          Full name
          <input value={draftName} onChange={(event) => setDraftName(event.target.value)} className="form-input" placeholder="Your name" />
        </label>
        <p className="mb-4 text-xs text-slate-500">{formatPhone(demo.customerPhone)} is already verified.</p>
        <button
          className="primary-btn w-full"
          onClick={() => {
            if (draftName.trim().length < 2) return
            demo.setCustomerProfile({ name: draftName.trim() })
            router.push("/profile")
          }}
        >
          Save
        </button>
      </>
    )
  }

  return (
    <div className="screen bg-white">
      {panel ? (
        <Header title={panel} onBack={() => router.push("/profile")} />
      ) : (
        <header className="flex h-16 shrink-0 items-center px-4">
          <button className="icon-btn" onClick={() => go("home")} aria-label="Go back">
            <ChevronRight className="rotate-180" size={20} />
          </button>
        </header>
      )}
      <main className="flex-1 overflow-y-auto pb-24">
        {!panel && (
          <>
            <div className="flex items-center justify-between px-5">
              {incomplete ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] text-white">!</span>
                  Incomplete profile
                </span>
              ) : (
                <span />
              )}
              {incomplete && (
                <button
                  onClick={() => router.push("/profile/complete")}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                  Complete
                </button>
              )}
            </div>
            <h1 className="mt-4 px-5 text-[32px] font-extrabold tracking-tight text-slate-900">
              Verified Customer
            </h1>
            <p className="mt-1 px-5 text-sm text-slate-500">{formatPhone(demo.customerPhone)}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 px-5">
              {cards.map(([label, Icon, href]) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 p-3 text-left"
                >
                  <Icon size={22} strokeWidth={1.75} />
                  <span className="text-sm font-semibold leading-5">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 border-t border-slate-100 bg-slate-50/60 px-5">
              {rows.map(([label, Icon, href]) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex w-full items-center gap-3 border-b border-slate-100 py-4 text-sm font-semibold"
                >
                  <Icon size={18} className="text-slate-700" />
                  <span className="flex-1 text-left">{label}</span>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
            </div>
          </>
        )}
        {panel && <div className="px-5">{detail}</div>}
      </main>
      <BottomNav active="profile" />
    </div>
  )
}
