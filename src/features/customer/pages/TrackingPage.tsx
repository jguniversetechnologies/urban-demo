"use client"

import { useState } from "react"
import { Check, Phone, Star } from "lucide-react"
import { BottomNav, Header } from "@/components/AppChrome"
import { formatRupees } from "@/data/market"
import { useGo } from "@/navigation/useGo"
import { useDemo, type JobStatus } from "@/state/DemoState"

const steps: { status: JobStatus; label: string }[] = [
  { status: "requested", label: "Requested" },
  { status: "accepted", label: "Accepted" },
  { status: "on_the_way", label: "On the way" },
  { status: "started", label: "In progress" },
  { status: "completed", label: "Completed" },
]

export function Tracking() {
  const go = useGo()
  const demo = useDemo()
  const booking = demo.booking
  const [reason, setReason] = useState("")
  const [nextTime, setNextTime] = useState("11:30 AM")
  const current = steps.findIndex((step) => step.status === booking?.status)
  const partner = demo.provider.name || "Your partner"

  return (
    <div className="screen">
      <Header
        title="Track booking"
        onBack={() => go("home")}
        action={
          <a className="icon-btn" aria-label="Call professional" href={`tel:+91${demo.provider.phone || "18002024455"}`}>
            <Phone size={18} />
          </a>
        }
      />
      <main className="flex-1 overflow-y-auto px-5 pb-28 pt-6">
        {!booking ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">
            <b className="block text-sm">No active booking</b>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Book a service and the status will update here when a partner
              accepts.
            </p>
            <button className="primary-btn mt-5 w-full" onClick={() => go("home")}>
              Browse services
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    {current >= 1 ? "Professional" : "Finding a professional"}
                  </p>
                  <h3 className="mt-1 font-bold">
                    {current >= 1 ? partner : "Waiting for acceptance"}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-amber-300">
                    <Star size={11} fill="currentColor" /> {booking.serviceName}
                  </p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-teal-600 font-bold">
                  {partner.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-300">
                {booking.dateLabel} · {booking.time} ·{" "}
                {formatRupees(demo.orderTotal(booking))}
              </p>
            </div>
            {booking.notes && (
              <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                Note: {booking.notes}
                {booking.visitType === "weekly" ? " · Repeats every week" : ""}
              </p>
            )}
            {booking.status === "on_the_way" && (
              <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-xs font-semibold text-teal-800">
                {partner} is about 25 minutes away. Verified partner.
              </p>
            )}
            {(booking.status === "requested" || booking.status === "accepted") && (
              <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                <b className="text-sm">Change this visit</b>
                <div className="mt-3 flex gap-2">
                  {["11:30 AM", "3:30 PM", "5:00 PM"].map((slot) => (
                    <button
                      key={slot}
                      className={`chip ${nextTime === slot ? "selected" : ""}`}
                      onClick={() => setNextTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  className="secondary-btn mt-3 h-10 w-full text-xs"
                  onClick={() => demo.rescheduleBooking(booking.dateLabel, nextTime)}
                >
                  Reschedule to {nextTime}
                </button>
                <input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="form-input"
                  placeholder="Reason to cancel"
                />
                <button
                  className="mt-2 text-xs font-bold text-rose-600"
                  onClick={() => demo.cancelBooking(reason || "Plans changed")}
                >
                  Cancel booking
                </button>
                <p className="mt-2 text-[11px] leading-4 text-slate-400">
                  Free cancel before the partner starts. A paid visit returns ₹100 as wallet credit.
                </p>
              </div>
            )}
            {(booking.status === "accepted" || booking.status === "on_the_way") && (
              <div className="mt-4 rounded-2xl bg-teal-50 p-4 text-center">
                <p className="text-xs font-bold text-teal-800">
                  Share this code to start the job
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-[.3em] text-teal-900">
                  {booking.startOtp}
                </p>
              </div>
            )}
            <h2 className="section-title mt-7">Booking status</h2>
            <div className="mt-5">
              {steps.map((step, index) => {
                const done = index <= current
                return (
                  <div className="flex min-h-16 gap-4" key={step.status}>
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full ${
                          done
                            ? "bg-teal-600 text-white"
                            : "border-2 border-slate-200 text-slate-300"
                        }`}
                      >
                        {done ? (
                          <Check size={14} />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                      </span>
                      {index < steps.length - 1 && (
                        <span
                          className={`w-0.5 flex-1 ${
                            index < current ? "bg-teal-600" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    <b
                      className={`text-sm ${
                        done ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </b>
                  </div>
                )
              })}
            </div>
            {booking.extras.length > 0 && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <b>Added on the visit</b>
                {booking.extras.map((extra) => (
                  <p key={extra.id} className="mt-2 flex justify-between text-slate-600">
                    <span>{extra.name}</span>
                    <span>{formatRupees(extra.price)}</span>
                  </p>
                ))}
              </div>
            )}
            {booking.status === "completed" && (
              <>
                <p className="mt-4 text-xs text-slate-500">30-day service cover applies to this visit.</p>
                <button
                  onClick={() => go("rating")}
                  className="primary-btn mt-5 w-full"
                >
                  Rate this visit
                </button>
                <button
                  className="secondary-btn mt-3 h-10 w-full text-xs"
                  onClick={() => demo.raiseTicket("customer", "Warranty revisit", booking.serviceName)}
                >
                  Ask for a warranty revisit
                </button>
              </>
            )}
          </>
        )}
      </main>
      <BottomNav active="tracking" />
    </div>
  )
}
