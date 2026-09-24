"use client"

import { useRouter } from "next/navigation"
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  LayoutDashboard,
  MapPin,
  UserRound,
  Wrench,
} from "lucide-react"
import { Logo } from "@/components/AppChrome"
import { formatRupees, materialExtras } from "@/data/market"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"
import { useProviderState } from "@/features/provider/ProviderState"
import type { Screen } from "@/types/navigation"

export default function ProviderPanel({ screen }: { screen: Screen }) {
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()
  const {
    startCode,
    setStartCode,
    startError,
    setStartError,
  } = useProviderState()
  const provider = demo.provider
  const suspended = provider.name !== "" && demo.suspended.includes(provider.name)
  const live = demo.booking
  const online = provider.online
  const canWork = provider.kyc === "approved" && provider.trainingDone && !provider.onLeave && !suspended
  const setOnline = (next: boolean) => demo.setProviderOnline(next)
  const tabs = [
    ["provider", LayoutDashboard, "Home"],
    ["requests", Bell, "Requests"],
    ["active", Wrench, "Active"],
    ["earnings", CircleDollarSign, "Earnings"],
    ["kyc", FileCheck2, "KYC"],
  ] as const
  const content =
    screen === "requests" ? (
      <>
        <h1 className="text-2xl font-extrabold">Job requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          {live?.status === "requested" && canWork ? "1 new request near you" : "No new requests"}
        </p>
        {provider.kyc !== "approved" && (
          <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
            Complete KYC and wait for admin approval before jobs arrive.
          </p>
        )}
        {provider.kyc === "approved" && !online && (
          <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-600">
            Go online to receive the customer's request.
          </p>
        )}
        {canWork && online && live?.status === "requested" && (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <b className="text-sm">{live.serviceName}</b>
              <b className="text-sm text-teal-700">
                {formatRupees(demo.orderTotal(live))}
              </b>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {live.customerName} · {live.customerPhone ? `+91 ${live.customerPhone}` : "Customer"} · {live.address} · {live.time}
            </p>
            {live.notes && <p className="mt-2 text-xs text-slate-600">Note: {live.notes}</p>}
            <div className="mt-4 flex gap-2">
              <button
                onClick={demo.declineJob}
                className="secondary-btn h-10 flex-1 text-xs"
              >
                Reject
              </button>
              <button
                disabled={suspended}
                onClick={() => {
                  demo.acceptJob()
                  go("active")
                }}
                className="primary-btn h-10 flex-1 text-xs disabled:opacity-40"
              >
                Accept
              </button>
            </div>
          </div>
        )}
        {(!canWork || !online || live?.status !== "requested") && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <BadgeCheck className="mx-auto text-teal-600" />
            <b className="mt-3 block text-sm">You're all caught up</b>
            <p className="mt-1 text-xs text-slate-500">
              A customer request shows here after you are approved and online.
            </p>
          </div>
        )}
      </>
    ) : screen === "active" && live && live.status !== "requested" ? (
      <>
        <p className="eyebrow">Current job</p>
        <h1 className="mt-2 text-2xl font-extrabold">{live.serviceName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {live.packageLabel} · {formatRupees(demo.orderTotal(live))}
        </p>
        <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
          <p className="text-xs text-slate-400">Customer</p>
          <h3 className="mt-1 font-bold">{live.customerName}</h3>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-300">
            <MapPin size={14} />
            {live.address}
          </p>
          {live.notes && <p className="mt-2 text-xs text-slate-300">Note: {live.notes}</p>}
          <a className="mt-3 inline-block text-xs font-bold text-teal-200" href={`tel:+91${live.customerPhone || ""}`}>
            Call customer
          </a>
        </div>
        {live.status === "accepted" && (
          <button
            onClick={() => demo.setJobStatus("on_the_way")}
            className="primary-btn mt-6 w-full"
          >
            I&apos;m on the way
          </button>
        )}
        {live.status === "on_the_way" && (
          <div className="mt-6">
            <label className="form-label">
              Customer start code
              <input
                value={startCode}
                onChange={(event) => {
                  setStartCode(event.target.value.replace(/\D/g, "").slice(0, 4))
                  setStartError("")
                }}
                className="form-input tracking-[.4em]"
                placeholder="7291"
                inputMode="numeric"
              />
            </label>
            <p className="mb-3 text-xs text-slate-500">
              Demo code from the customer tracking screen: 7291
            </p>
            {startError && <p className="error-message">{startError}</p>}
            <button
              className="primary-btn w-full"
              onClick={() => {
                if (!demo.verifyStartOtp(startCode)) {
                  setStartError("That code does not match. Use 7291.")
                }
              }}
            >
              Start service
            </button>
          </div>
        )}
        {live.status === "started" && (
          <>
            <h2 className="section-title mt-6">Add materials</h2>
            <div className="mt-3 space-y-2">
              {materialExtras.map((extra) => {
                const added = live.extras.some((item) => item.id === extra.id)
                return (
                  <button
                    key={extra.id}
                    onClick={() => demo.toggleExtra(extra)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm ${
                      added
                        ? "border-teal-600 bg-teal-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <span>{extra.name}</span>
                    <b>{formatRupees(extra.price)}</b>
                  </button>
                )
              })}
            </div>
            <h2 className="section-title mt-6">Proof of work</h2>
            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm">
              <span>{live.proofPhotos?.length ? live.proofPhotos.join(", ") : "Add before and after photos"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) demo.addProofPhoto(file.name)
                }}
              />
            </label>
            <button
              onClick={() => demo.setJobStatus("completed")}
              className="primary-btn mt-5 w-full"
            >
              Mark completed
            </button>
          </>
        )}
        {live.status === "completed" && (
          <div className="mt-6 rounded-2xl bg-teal-50 p-5 text-center text-teal-800">
            <BadgeCheck className="mx-auto" />
            <b className="mt-2 block">Job completed</b>
            <p className="mt-1 text-xs">
              Invoice {live.id} · {formatRupees(demo.orderTotal(live))} · {live.paymentStatus}
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button key={score} className="text-lg" onClick={() => demo.rateCustomer(score)}>
                  {score <= (provider.customerScore || 0) ? "★" : "☆"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs">Rate this customer</p>
          </div>
        )}
      </>
    ) : screen === "active" ? (
      <>
        <p className="eyebrow">Current job</p>
        <h1 className="mt-2 text-2xl font-extrabold">No active job</h1>
        <p className="mt-2 text-sm text-slate-500">
          Accept a customer request and the visit will show here.
        </p>
      </>
    ) : screen === "earnings" ? (
      <>
        <h1 className="text-2xl font-extrabold">Earnings</h1>
        <div className="mt-6 rounded-3xl bg-teal-700 p-6 text-white">
          <p className="text-xs text-teal-100">Total earnings this month</p>
          <p className="mt-2 text-4xl font-extrabold">₹{provider.earned.toLocaleString("en-IN")}</p>
          <div className="mt-5 border-t border-white/15 pt-4 text-xs">
            Pending payout · {formatRupees(provider.earned)} · bank {provider.accountNo || "not added"}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="stat-card">
            <small>Platform fee kept</small>
            <b>₹49 / visit</b>
          </div>
          <div className="stat-card">
            <small>Jobs done</small>
            <b>{demo.history.length}</b>
          </div>
        </div>
        <h2 className="section-title mt-7">Completed visits</h2>
        {demo.history.length === 0 && <p className="mt-3 text-sm text-slate-500">Finished jobs show here.</p>}
        {demo.history.map((item) => (
          <div key={item.id} className="flex justify-between border-b border-slate-100 py-4 text-sm">
            <span className="text-slate-500">{item.name}<br />{item.when}</span>
            <b>{item.price}</b>
          </div>
        ))}
      </>
    ) : screen === "kyc" ? (
      <>
        <h1 className="text-2xl font-extrabold">Verification</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Complete your KYC to start accepting jobs.
        </p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-teal-600 transition-all"
            style={{ width: `${(Object.keys(provider.documents).length / 3) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-bold text-teal-700">
          {Object.keys(provider.documents).length} of 3 documents uploaded
        </p>
        {provider.kyc === "pending" && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
            Waiting for admin to check these documents.
          </p>
        )}
        {provider.kyc === "rejected" && (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {provider.kycNote || "Admin asked you to upload the documents again."}
          </p>
        )}
        {provider.kyc === "approved" && (
          <p className="mt-3 rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">
            Approved. You can go online and take jobs.
          </p>
        )}
        {["Government ID", "Address proof", "Professional certificate"].map(
          (x) => {
            const uploaded = provider.documents[x]
            return (
              <label
                key={x}
                className={`mt-4 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-4 text-left ${
                  uploaded
                    ? "border-teal-300 bg-teal-50/50"
                    : "border-slate-300"
                }`}
              >
                <FileCheck2
                  size={20}
                  className={uploaded ? "text-teal-600" : "text-slate-400"}
                />
                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{x}</b>
                  <small
                    className={uploaded ? "text-teal-600" : "text-slate-400"}
                  >
                    {uploaded || "PDF, JPG or PNG · Max 5 MB"}
                  </small>
                </span>
                <span className="text-xs font-bold text-teal-700">
                  {uploaded ? "Replace" : "Upload"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) demo.setProviderDocument(x, file.name)
                  }}
                />
              </label>
            )
          },
        )}
        <h2 className="section-title mt-7">Bank account</h2>
        <input value={provider.bankName} onChange={(event) => demo.setProviderBank({ bankName: event.target.value })} className="form-input" placeholder="Account holder" />
        <input value={provider.ifsc} onChange={(event) => demo.setProviderBank({ ifsc: event.target.value.toUpperCase() })} className="form-input" placeholder="IFSC" />
        <input value={provider.accountNo} onChange={(event) => demo.setProviderBank({ accountNo: event.target.value })} className="form-input" placeholder="Account number" />
        <input value={provider.emergency} onChange={(event) => demo.setProviderBank({ emergency: event.target.value })} className="form-input" placeholder="Emergency contact" />
        <h2 className="section-title mt-7">Training</h2>
        <p className="mt-2 text-xs text-slate-500">Safety, service steps, and how to speak with the customer.</p>
        <button
          className="secondary-btn mt-3 h-10 w-full text-xs"
          onClick={demo.completeTraining}
        >
          {provider.trainingDone ? "Training complete" : "Mark training complete"}
        </button>
        {Object.keys(provider.documents).length === 3 && provider.kyc !== "approved" && (
          <button className="primary-btn mt-6 w-full" onClick={demo.submitProviderKyc}>
            Submit for verification
          </button>
        )}
      </>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Good morning,</p>
            <h1 className="mt-1 text-2xl font-extrabold">{provider.name || "Partner"}</h1>
            {provider.kyc !== "approved" && (
              <p className="mt-1 text-xs font-bold text-amber-700">
                KYC {provider.kyc === "pending" ? "waiting for admin" : "not finished"}
              </p>
            )}
            {suspended && (
              <p className="mt-1 text-xs font-bold text-rose-600">
                Account suspended by admin
              </p>
            )}
          </div>
          <button
            onClick={() => setOnline(!online)}
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              online
                ? "bg-teal-100 text-teal-800"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            <span
              className={`mr-2 inline-block h-2 w-2 rounded-full ${
                online ? "bg-teal-500" : "bg-slate-400"
              }`}
            />
            {online ? "Online" : "Offline"}
          </button>
        </div>
        <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-xs text-slate-400">Today's earnings</p>
          <p className="mt-2 text-3xl font-extrabold">₹{(1850 + provider.earned).toLocaleString("en-IN")}</p>
          <div className="mt-5 flex gap-6 text-xs text-slate-300">
            <span>
              <b className="block text-lg text-white">4</b>Jobs done
            </span>
            <span>
              <b className="block text-lg text-white">4.9</b>Rating
            </span>
          </div>
        </div>
        <button
          onClick={() => go("requests")}
          className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left"
        >
          <Bell size={21} className="text-amber-700" />
          <span className="flex-1">
            <b className="block text-sm">
              {canWork && online && live?.status === "requested" ? "1 new job request" : "No new job requests"}
            </b>
            <small className="text-slate-500">
              {canWork
                ? online
                  ? "The customer's booking shows up here"
                  : "Go online to receive the request"
                : provider.kyc !== "approved"
                  ? "Finish KYC before you can go online"
                  : !provider.trainingDone
                    ? "Finish training before you can go online"
                    : "Leave is on, so new jobs are paused"}
            </small>
          </span>
          <ChevronRight size={18} />
        </button>
        <div className="mt-4 flex gap-2">
          <button className="secondary-btn h-10 flex-1 text-xs" onClick={() => demo.setProviderLeave(!provider.onLeave)}>
            {provider.onLeave ? "End leave" : "Mark leave"}
          </button>
          <button className="secondary-btn h-10 flex-1 text-xs" onClick={() => demo.raiseSos("Need help on a visit")}>
            SOS
          </button>
        </div>
        {provider.sosNote && <p className="mt-2 text-xs font-semibold text-rose-600">SOS sent: {provider.sosNote}</p>}
        <h2 className="section-title mt-7">Today&apos;s schedule</h2>
        {live ? (
          <div className="mt-4 rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-bold text-teal-700">{live.time}</p>
            <b className="mt-1 block text-sm">{live.serviceName}</b>
            <p className="mt-1 text-xs capitalize text-slate-500">
              {live.customerName} · {live.status.split("_").join(" ")}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No visit booked yet.</p>
        )}
      </>
    )
  return (
    <div className="screen">
      <header className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Logo compact />
        <button onClick={() => router.push("/provider/profile")} className="icon-btn" aria-label="Profile">
          <UserRound size={18} />
        </button>
      </header>
      <main className="flex-1 overflow-y-auto bg-slate-50/60 px-5 pb-28 pt-6">
        {content}
      </main>
      <nav className="bottom-nav">
        {tabs.map(([s, I, l]) => (
          <button
            key={s}
            onClick={() => go(s)}
            className={screen === s ? "active" : ""}
          >
            <I size={19} />
            <span>{l}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
