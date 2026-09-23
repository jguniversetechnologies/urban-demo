"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Phone,
  WalletCards,
} from "lucide-react"
import { BottomNav, Header } from "@/components/AppChrome"
import { findService } from "@/data/services"
import { profilePath, servicePath } from "@/lib/paths"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"

export function Profile({ panel = "" }: { panel?: string }) {
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()
  const onBookAgain = (name: string) => {
    const match = findService(name)
    if (!match) {
      router.push("/services/cleaning")
      return
    }
    demo.setActiveCategory(match.category)
    demo.setSelection(match)
    router.push(servicePath(match.category, match.name))
  }
  const detail =
    panel === "Booking history" ? (
      <>
        <h2 className="section-title mt-6">Recent bookings</h2>
        {[
          ["Essential home cleaning", "18 May · Completed", "₹499"],
          ["AC general service", "02 May · Completed", "₹599"],
          ["Leakage repair", "22 Apr · Cancelled", "₹299"],
        ].map(([name, status, price]) => (
          <div
            key={name}
            className="mt-3 rounded-2xl border border-slate-100 p-4"
          >
            <div className="flex justify-between">
              <b className="text-sm">{name}</b>
              <b className="text-sm">{price}</b>
            </div>
            <p className="mt-2 text-xs text-slate-500">{status}</p>
            <button
              onClick={() => onBookAgain(name)}
              className="mt-3 text-xs font-bold text-teal-700"
            >
              Book again
            </button>
          </div>
        ))}
      </>
    ) : panel === "Saved addresses" ? (
      <>
        <div className="mt-6 flex items-center justify-between">
          <h2 className="section-title">Saved addresses</h2>
          <button className="text-xs font-bold text-teal-700">+ Add new</button>
        </div>
        {[
          ["Home", "12, 4th Cross, Koramangala"],
          ["Office", "80 Feet Road, Indiranagar"],
        ].map(([label, address]) => (
          <div
            key={label}
            className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 p-4"
          >
            <MapPin size={18} className="text-teal-600" />
            <div className="flex-1">
              <b className="text-sm">{label}</b>
              <p className="mt-1 text-xs text-slate-500">{address}</p>
            </div>
            <button className="text-xs font-bold text-teal-700">Edit</button>
          </div>
        ))}
      </>
    ) : panel === "Payment methods" ? (
      <>
        <h2 className="section-title mt-6">Payment methods</h2>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
          <WalletCards className="text-teal-600" />
          <div className="flex-1">
            <b className="text-sm">HDFC Visa •••• 4820</b>
            <p className="text-xs text-slate-500">Expires 09/28</p>
          </div>
          <span className="status-pill">Default</span>
        </div>
        <button className="secondary-btn mt-4 w-full">
          Add payment method
        </button>
      </>
    ) : panel === "Help & support" ? (
      <>
        <h2 className="section-title mt-6">How can we help?</h2>
        {[
          "Chat with support",
          "Call customer care",
          "Frequently asked questions",
        ].map((x) => (
          <button
            key={x}
            className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-100 p-4 text-sm font-bold"
          >
            {x}
            <ChevronRight size={17} />
          </button>
        ))}
      </>
    ) : null
  return (
    <div className="screen">
      <Header
        title={panel || "Profile"}
        onBack={() => (panel ? router.push("/profile") : go("home"))}
      />
      <main className="flex-1 overflow-y-auto px-5 pb-24">
        {!panel && (
          <>
            <div className="flex items-center gap-4 border-b border-slate-100 py-6">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-xl font-extrabold text-teal-700">
                AS
              </div>
              <div>
                <h2 className="font-extrabold">Aarav Sharma</h2>
                <p className="mt-1 text-xs text-slate-500">+91 98765 21040</p>
              </div>
            </div>
            <h2 className="section-title mt-6">Your account</h2>
            {[
              ["Booking history", CalendarDays],
              ["Saved addresses", MapPin],
              ["Payment methods", WalletCards],
              ["Help & support", Phone],
            ].map(([x, I]) => {
              const C = I as typeof CalendarDays
              return (
                <button
                  onClick={() => router.push(profilePath(x as string))}
                  key={x as string}
                  className="flex w-full items-center gap-3 border-b border-slate-100 py-4 text-sm font-semibold"
                >
                  <C size={18} className="text-slate-400" />
                  <span className="flex-1 text-left">{x as string}</span>
                  <ChevronRight size={17} className="text-slate-300" />
                </button>
              )
            })}
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
        )}
        {detail}
      </main>
      <BottomNav active="profile" />
    </div>
  )
}
