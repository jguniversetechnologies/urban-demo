"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Banknote, Check, MapPin, WalletCards } from "lucide-react"
import { Header } from "@/components/AppChrome"
import { formatRupees, platformFee } from "@/data/market"
import { categoryPath } from "@/lib/paths"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"
import type { Screen } from "@/types/navigation"

function upcomingDays() {
  return Array.from({ length: 4 }, (_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() + index)
    return {
      id: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
      day: String(date.getDate()),
      label: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
    }
  })
}

export function Booking({ screen }: { screen: Screen }) {
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()
  const service = demo.selection
  const category = service?.category ?? demo.activeCategory
  const [days] = useState(upcomingDays)
  const dateId = demo.schedule.dateId || days[0].id
  const selectedDay = days.find((day) => day.id === dateId) ?? days[0]
  const time = demo.schedule.time
  const address = demo.schedule.address
  const payment = demo.schedule.payment
  const [couponError, setCouponError] = useState("")
  const [gateway, setGateway] = useState<"idle" | "open" | "failed">("idle")
  const activeCoupon = demo.coupons.find(
    (item) => item.active && item.code === demo.couponCode,
  )
  const discount = activeCoupon?.off ?? 0
  const basePrice = demo.packageChoice?.price ?? 0
  const packageLabel = demo.packageChoice?.label ?? "Standard"
  const walletUsed = demo.schedule.useWallet ? Math.min(100, demo.wallet, Math.max(0, basePrice + platformFee - discount)) : 0
  const previewTotal = Math.max(0, basePrice + platformFee - discount - walletUsed)
  const served = !demo.city || demo.areaServed(demo.city)
  const blocked = demo.blockedPhones.includes(demo.customerPhone)
  const total = formatRupees(
    demo.booking && screen === "confirmed"
      ? demo.orderTotal(demo.booking)
      : previewTotal,
  )
  useEffect(() => {
    if (!demo.ready) return
    if (screen === "confirmed") {
      if (!demo.booking) router.replace("/home")
      return
    }
    if (!service) router.replace(categoryPath(category || "Cleaning"))
  }, [category, demo.booking, demo.ready, router, screen, service])
  const confirmBooking = () => {
    if (!service) return
    demo.placeBooking({
      serviceName: service.name,
      category,
      packageLabel,
      basePrice,
      dateLabel: selectedDay.label,
      time,
      address: `${address}${demo.area ? `, ${demo.area}` : ""}`,
      payment: payment === "cash" ? "cash" : "online",
      notes: demo.schedule.notes,
      visitType: demo.schedule.visitType,
      paymentStatus: payment === "cash" ? "cash" : "paid",
      walletUsed,
    })
    go("confirmed")
  }
  if (!demo.ready) return null
  if (screen === "confirmed" && !demo.booking) return null
  if (screen !== "confirmed" && !service) return null
  if (screen === "confirmed")
    return (
      <div className="screen items-center justify-center px-8 text-center">
        <div className="relative grid h-24 w-24 place-items-center rounded-full bg-teal-50 text-teal-700">
          <Check size={42} strokeWidth={2.5} />
          <span className="absolute inset-2 rounded-full border border-teal-200" />
        </div>
        <p className="eyebrow mt-8">Booking confirmed</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          You're all set!
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your professional will arrive on
          <br />
          <b className="text-slate-800">
            {demo.booking?.dateLabel ?? selectedDay.label} at{" "}
            {demo.booking?.time ?? time}
          </b>
        </p>
          <div className="mt-8 w-full rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Booking ID</span>
            <b>#{demo.booking?.id || "—"}</b>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-slate-500">Receipt</span>
            <b className="capitalize">{demo.booking?.paymentStatus || "paid"}</b>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-slate-500">Amount</span>
            <b>{total}</b>
          </div>
        </div>
        <button
          className="primary-btn mt-8 w-full"
          onClick={() => go("tracking")}
        >
          Track booking
        </button>
        <button
          className="mt-4 text-sm font-bold text-slate-500"
          onClick={() => go("home")}
        >
          Back to home
        </button>
      </div>
    )
  if (screen === "payment")
    return (
      <div className="screen">
        <Header title="Payment" onBack={() => go("booking")} />
        <main className="flex-1 px-5 pt-6">
          <div className="rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-xs text-slate-400">Total payable</p>
            <p className="mt-1 text-3xl font-extrabold">{total}</p>
            <p className="mt-3 text-xs text-slate-300">
              {service?.name} · {selectedDay.label}, {time}
            </p>
          </div>
          <h2 className="section-title mt-7">Coupon</h2>
          <p className="mt-1 text-xs text-slate-500">Pick an active offer.</p>
          <select
            className="form-input"
            value={activeCoupon ? activeCoupon.code : ""}
            onChange={(event) => {
              const code = event.target.value
              if (!code) {
                demo.clearCoupon()
                setCouponError("")
                return
              }
              if (!demo.applyCoupon(code)) {
                setCouponError("That code is not active.")
                return
              }
              setCouponError("")
            }}
          >
            <option value="">No coupon</option>
            {demo.coupons
              .filter((item) => item.active)
              .map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} · {item.label}
                </option>
              ))}
          </select>
          {activeCoupon && (
            <p className="mt-2 text-xs font-bold text-teal-700">
              {activeCoupon.code} applied · {activeCoupon.label}
            </p>
          )}
          {couponError && <p className="error-message">{couponError}</p>}
          <button
            className={`mt-4 w-full rounded-2xl border px-4 py-3 text-left text-sm ${demo.schedule.useWallet ? "border-teal-600 bg-teal-50" : "border-slate-200"}`}
            onClick={() => demo.patchSchedule({ useWallet: !demo.schedule.useWallet })}
          >
            <b>Use wallet credits</b>
            <p className="mt-1 text-xs text-slate-500">Balance ₹{demo.wallet}. Up to ₹100 applies on this visit.</p>
          </button>
          <h2 className="section-title mt-7">Choose payment method</h2>
          <div className="mt-4 space-y-3">
            {[
              [
                WalletCards,
                "Pay online",
                "UPI, cards or net banking",
                "online",
              ],
              [
                Banknote,
                "Pay after service",
                "Cash or UPI to professional",
                "cash",
              ],
            ].map(([I, t, d, key]) => {
              const C = I as typeof WalletCards
              const selected = payment === key
              return (
                <button
                  onClick={() =>
                    demo.patchSchedule({
                      payment: key === "cash" ? "cash" : "online",
                    })
                  }
                  key={t as string}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left ${
                    selected
                      ? "border-teal-600 bg-teal-50/50"
                      : "border-slate-200"
                  }`}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-teal-700">
                    <C size={21} />
                  </span>
                  <span className="flex-1">
                    <b className="block text-sm">{t as string}</b>
                    <small className="text-slate-500">{d as string}</small>
                  </span>
                  <span
                    className={`h-5 w-5 rounded-full border-2 ${
                      selected
                        ? "border-[6px] border-teal-600"
                        : "border-slate-300"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </main>
        {gateway === "open" && (
          <div className="mx-5 mb-4 rounded-2xl border border-slate-200 p-4">
            <b className="text-sm">Razorpay</b>
            <p className="mt-1 text-xs text-slate-500">UPI, card, or net banking for {total}.</p>
            <div className="mt-3 flex gap-2">
              <button className="primary-btn h-10 flex-1 text-xs" onClick={confirmBooking}>
                Payment success
              </button>
              <button
                className="secondary-btn h-10 flex-1 text-xs"
                onClick={() => setGateway("failed")}
              >
                Payment failed
              </button>
            </div>
          </div>
        )}
        {gateway === "failed" && (
          <p className="mx-5 mb-3 text-xs font-semibold text-rose-600">
            Payment failed. You can try again. The booking was not created.
          </p>
        )}
        <div className="sticky-bar">
          <p className="font-extrabold">{total}</p>
          <button
            className="primary-btn w-48 disabled:opacity-40"
            disabled={!served || blocked}
            onClick={() => {
              if (payment === "online") {
                setGateway("open")
                return
              }
              confirmBooking()
            }}
          >
            {payment === "online" ? "Confirm & pay" : "Confirm booking"}
          </button>
        </div>
      </div>
    )
  return (
    <div className="screen">
      <Header title="Schedule service" onBack={() => go("detail")} />
      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-6">
        <h2 className="section-title">Choose a date</h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {days.map((day) => (
            <button
              onClick={() => demo.patchSchedule({ dateId: day.id })}
              className={`rounded-xl border py-3 ${
                dateId === day.id
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200"
              }`}
              key={day.id}
            >
              <span className="block text-[10px] uppercase opacity-70">
                {day.weekday}
              </span>
              <b className="mt-1 block">{day.day}</b>
            </button>
          ))}
        </div>
        <h2 className="section-title mt-7">Available times</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            "9:00 AM",
            "10:00 AM",
            "11:30 AM",
            "2:00 PM",
            "3:30 PM",
            "5:00 PM",
          ].map((t) => {
            const unavailable = t === "2:00 PM"
            return (
            <button
              disabled={unavailable}
              onClick={() => demo.patchSchedule({ time: t })}
              className={`rounded-xl border px-2 py-3 text-xs font-bold disabled:opacity-40 ${
                time === t
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "border-slate-200 text-slate-600"
              }`}
              key={t}
            >
              {unavailable ? `${t} full` : t}
            </button>
            )
          })}
        </div>
        <h2 className="section-title mt-7">Visit type</h2>
        <div className="mt-3 flex gap-2">
          {(["once", "weekly"] as const).map((item) => (
            <button
              key={item}
              className={`chip ${demo.schedule.visitType === item ? "selected" : ""}`}
              onClick={() => demo.patchSchedule({ visitType: item })}
            >
              {item === "once" ? "One time" : "Every week"}
            </button>
          ))}
        </div>
        <label className="form-label mt-6">
          Notes for the partner
          <textarea
            value={demo.schedule.notes}
            onChange={(event) => demo.patchSchedule({ notes: event.target.value })}
            className="form-input h-20 py-3"
            placeholder="Gate code, pets, or what to focus on"
          />
        </label>
        <h2 className="section-title mt-7">Service address</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {demo.addresses.map((item) => {
            const label = item.label
            const line = item.line
            return (
            <button
              onClick={() => demo.patchSchedule({ address: label })}
              key={label}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${
                address === label
                  ? "border-teal-600 bg-teal-50/40"
                  : "border-slate-200"
              }`}
            >
              <MapPin className="text-teal-600" size={19} />
              <span>
                <b className="block text-sm">{label}</b>
                <small className="text-slate-500">{line}</small>
              </span>
            </button>
            )
          })}
        </div>
        {demo.provider.onLeave && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
            The partner is on leave, so new slots stay closed until they return.
          </p>
        )}
        {blocked && (
          <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            This number is blocked. Contact Homify support.
          </p>
        )}
        {!served && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
            Bookings are open in Rasayani. Change location to continue.
          </p>
        )}
      </main>
      <div className="sticky-bar">
        <div>
          <p className="text-xs text-slate-400">Total</p>
          <p className="font-extrabold">{total}</p>
        </div>
        <button
          className="primary-btn w-48 disabled:opacity-40"
          disabled={!served || blocked || demo.provider.onLeave}
          onClick={() => go("payment")}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
