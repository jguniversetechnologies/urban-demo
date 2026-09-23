import { useEffect, useState } from "react"
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  LayoutDashboard,
  MapPin,
  Phone,
  UserRound,
  Wrench,
} from "lucide-react"
import { Logo } from "@/components/AppChrome"
import { formatRupees, materialExtras } from "@/data/market"
import { useDemo } from "@/state/DemoState"
import type { Screen } from "@/types/navigation"

function Countdown({
  seconds,
  onExpire,
}: {
  seconds: number
  onExpire: () => void
}) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (left <= 0) {
      onExpire()
      return
    }
    const timer = window.setTimeout(() => setLeft((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [left, onExpire])
  const mins = Math.floor(Math.max(left, 0) / 60)
  const secs = String(Math.max(left, 0) % 60).padStart(2, "0")
  return (
    <span className="text-[11px] font-bold text-amber-700">
      Accept within {mins}:{secs}
    </span>
  )
}

export default function ProviderPanel({
  screen,
  go,
}: {
  screen: Screen
  go: (s: Screen) => void
}) {
  const demo = useDemo()
  const [online, setOnline] = useState(true)
  const [startCode, setStartCode] = useState("")
  const [startError, setStartError] = useState("")
  const suspended = demo.suspended.includes("Ravi Kumar")
  const live = demo.booking
  const [pendingJobs, setPendingJobs] = useState([
    {
      name: "Home deep cleaning",
      amount: "₹1,299",
      distance: "1.2 km",
      time: "10:00 AM",
    },
    {
      name: "Kitchen cleaning",
      amount: "₹699",
      distance: "2.2 km",
      time: "11:00 AM",
    },
    {
      name: "Bathroom cleaning",
      amount: "₹449",
      distance: "3.2 km",
      time: "12:00 PM",
    },
  ])
  const [jobStatus, setJobStatus] =
    useState<"accepted" | "way" | "started" | "completed">("accepted")
  const [documents, setDocuments] = useState<Record<string, string>>({
    "Government ID": "aadhaar-card.pdf",
  })
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
          {pendingJobs.length + (live?.status === "requested" ? 1 : 0)} new
          requests near you
        </p>
        {live?.status === "requested" && (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <b className="text-sm">{live.serviceName}</b>
              <b className="text-sm text-teal-700">
                {formatRupees(demo.orderTotal(live))}
              </b>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {live.customerName} · {live.address} · {live.time}
            </p>
            <div className="mt-2">
              <Countdown seconds={120} onExpire={demo.declineJob} />
            </div>
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
        {pendingJobs.length === 0 && live?.status !== "requested" ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <BadgeCheck className="mx-auto text-teal-600" />
            <b className="mt-3 block text-sm">You're all caught up</b>
            <p className="mt-1 text-xs text-slate-500">
              New nearby requests will appear here.
            </p>
          </div>
        ) : (
          pendingJobs.map((job) => (
            <div
              key={job.name}
              className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <b className="text-sm">{job.name}</b>
                <b className="text-sm text-teal-700">{job.amount}</b>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={12} /> {job.distance} away · Today, {job.time}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    setPendingJobs((current) =>
                      current.filter((item) => item.name !== job.name),
                    )
                  }
                  className="secondary-btn h-10 flex-1 text-xs"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setPendingJobs((current) =>
                      current.filter((item) => item.name !== job.name),
                    )
                    setJobStatus("accepted")
                    go("active")
                  }}
                  className="primary-btn h-10 flex-1 text-xs"
                >
                  Accept
                </button>
              </div>
            </div>
          ))
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
              {formatRupees(demo.orderTotal(live))} added to today&apos;s jobs
            </p>
          </div>
        )}
      </>
    ) : screen === "active" ? (
      <>
        <p className="eyebrow">Current job</p>
        <h1 className="mt-2 text-2xl font-extrabold">Home deep cleaning</h1>
        <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
          <p className="text-xs text-slate-400">Customer</p>
          <h3 className="mt-1 font-bold">Aarav Sharma</h3>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-300">
            <MapPin size={14} />
            12, 4th Cross, Koramangala
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold">
              <Phone size={13} className="mr-1 inline" /> Call
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold">
              <MapPin size={13} className="mr-1 inline" /> Navigate
            </button>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          {[
            ["accepted", "Accepted"],
            ["way", "On way"],
            ["started", "Started"],
            ["completed", "Done"],
          ].map(([key, label], i) => (
            <div key={key} className="flex flex-1 flex-col items-center">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                  ["accepted", "way", "started", "completed"].indexOf(
                    jobStatus,
                  ) >= i
                    ? "bg-teal-600 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {i + 1}
              </span>
              <small className="mt-2 text-[9px] font-bold text-slate-500">
                {label}
              </small>
            </div>
          ))}
        </div>
        {jobStatus === "accepted" && (
          <button
            onClick={() => setJobStatus("way")}
            className="primary-btn mt-7 w-full"
          >
            I'm on the way
          </button>
        )}
        {jobStatus === "way" && (
          <button
            onClick={() => setJobStatus("started")}
            className="primary-btn mt-7 w-full"
          >
            Start service
          </button>
        )}
        {jobStatus === "started" && (
          <button
            onClick={() => setJobStatus("completed")}
            className="primary-btn mt-7 w-full"
          >
            Mark completed
          </button>
        )}
        {jobStatus === "completed" && (
          <div className="mt-7 rounded-2xl bg-teal-50 p-5 text-center text-teal-800">
            <BadgeCheck className="mx-auto" />
            <b className="mt-2 block">Job completed successfully</b>
            <p className="mt-1 text-xs">₹1,299 added to your earnings</p>
          </div>
        )}
      </>
    ) : screen === "earnings" ? (
      <>
        <h1 className="text-2xl font-extrabold">Earnings</h1>
        <div className="mt-6 rounded-3xl bg-teal-700 p-6 text-white">
          <p className="text-xs text-teal-100">Total earnings this month</p>
          <p className="mt-2 text-4xl font-extrabold">₹24,850</p>
          <div className="mt-5 border-t border-white/15 pt-4 text-xs">
            Next payout · Friday, 24 May
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="stat-card">
            <small>Platform dues</small>
            <b>₹1,240</b>
          </div>
          <div className="stat-card">
            <small>Jobs done</small>
            <b>38</b>
          </div>
        </div>
        <h2 className="section-title mt-7">Payout history</h2>
        {["17 May", "10 May", "03 May"].map((x, i) => (
          <div
            key={x}
            className="flex justify-between border-b border-slate-100 py-4 text-sm"
          >
            <span className="text-slate-500">{x}</span>
            <b>₹{[5820, 4960, 6310][i]}</b>
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
            style={{ width: `${(Object.keys(documents).length / 3) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-bold text-teal-700">
          {Object.keys(documents).length} of 3 documents uploaded
        </p>
        {["Government ID", "Address proof", "Professional certificate"].map(
          (x) => {
            const uploaded = documents[x]
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
                    if (file)
                      setDocuments((current) => ({
                        ...current,
                        [x]: file.name,
                      }))
                  }}
                />
              </label>
            )
          },
        )}
        {Object.keys(documents).length === 3 && (
          <button className="primary-btn mt-6 w-full">
            Submit for verification
          </button>
        )}
      </>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Good morning,</p>
            <h1 className="mt-1 text-2xl font-extrabold">Ravi Kumar</h1>
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
          <p className="mt-2 text-3xl font-extrabold">₹1,850</p>
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
              {pendingJobs.length + (live?.status === "requested" ? 1 : 0)} new
              job requests
            </b>
            <small className="text-slate-500">
              {online
                ? "Review before they expire"
                : "Go online to receive more requests"}
            </small>
          </span>
          <ChevronRight size={18} />
        </button>
        <h2 className="section-title mt-7">Today's schedule</h2>
        <div className="mt-4 rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-bold text-teal-700">10:00 AM</p>
          <b className="mt-1 block text-sm">Home deep cleaning</b>
          <p className="mt-1 text-xs text-slate-500">
            Aarav Sharma · Koramangala
          </p>
        </div>
      </>
    )
  return (
    <div className="screen">
      <header className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Logo compact />
        <button onClick={() => go("login")} className="icon-btn">
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
