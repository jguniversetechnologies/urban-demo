"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CircleDollarSign,
  FileCheck2,
  LayoutDashboard,
  Search,
  Store,
  Users,
  X,
} from "lucide-react"
import { Logo } from "@/components/AppChrome"
import { cities } from "@/data/market"
import { categories } from "@/data/services"
import { adminPageFromPath, adminPath } from "@/lib/paths"
import { useDemo } from "@/state/DemoState"

function AdminLogin({
  onLogin,
  onExit,
}: {
  onLogin: () => void
  onExit: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (
      email.toLowerCase().trim() !== "admin@homify.in" ||
      password !== "admin123"
    ) {
      setError(
        "Email or password is incorrect. Use the demo credentials below.",
      )
      return
    }
    setError("")
    onLogin()
  }
  return (
    <div className="min-h-screen bg-slate-950 p-5 md:grid md:grid-cols-2 md:p-0">
      <div className="hidden flex-col justify-between bg-teal-700 p-14 text-white md:flex">
        <Logo />
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-200">
            Operations command center
          </p>
          <h1 className="mt-5 max-w-lg text-5xl font-extrabold leading-tight tracking-tight">
            Run every service with confidence.
          </h1>
          <p className="mt-5 max-w-md leading-7 text-teal-100">
            Review providers, monitor bookings and keep platform finances under
            control from one secure workspace.
          </p>
        </div>
        <p className="text-xs text-teal-200">Homify Admin · Secure access</p>
      </div>
      <div className="flex min-h-[calc(100vh-40px)] items-center justify-center rounded-3xl bg-white px-6 md:min-h-screen md:rounded-none">
        <form onSubmit={submit} className="w-full max-w-sm" noValidate>
          <div className="md:hidden">
            <Logo />
          </div>
          <p className="eyebrow mt-10 md:mt-0">Admin portal</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your administrator account.
          </p>
          <label className="form-label mt-8">
            Work email
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              className="form-input"
              type="email"
              placeholder="admin@homify.in"
              autoComplete="username"
            />
          </label>
          <label className="form-label">
            Password
            <div className="form-input flex items-center">
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className="min-w-0 flex-1 outline-none"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-bold text-teal-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <div className="mb-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <b>Demo access</b>
            <br />
            admin@homify.in · admin123
          </div>
          <button type="submit" className="primary-btn w-full">
            Sign in securely <ArrowRight size={18} />
          </button>
          <button
            type="button"
            onClick={onExit}
            className="mt-5 w-full text-center text-xs font-bold text-slate-400"
          >
            Return to app demo
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const demo = useDemo()
  const router = useRouter()
  const pathname = usePathname()
  const page = adminPageFromPath(pathname)
  const [notice, setNotice] = useState("")
  const adminCity = demo.adminCity
  const setAdminCity = demo.setAdminCity
  const setPage = (next: string) => router.push(adminPath(next))
  const pages = [
    ["Dashboard", LayoutDashboard],
    ["Providers", Users],
    ["Services", Store],
    ["Bookings", CalendarDays],
    ["Commission", CircleDollarSign],
  ]
  if (!demo.adminAuthenticated)
    return (
      <AdminLogin
        onLogin={demo.authenticateAdmin}
        onExit={() => {
          demo.setRole("customer")
          router.push("/")
        }}
      />
    )
  const providerRows = [
    ["Ravi Kumar", "Cleaning", "Aadhaar + PAN"],
    ["Imran Ali", "AC repair", "Aadhaar + Certificate"],
    ["Nisha Shah", "Beauty", "Aadhaar + PAN"],
  ]
  const bookingRows = [
    ["HM-1284", "Aarav S.", "Deep cleaning", "₹1,299", "In progress"],
    ["HM-1283", "Meera K.", "AC service", "₹799", "Completed"],
    ["HM-1282", "Kabir R.", "Electrician", "₹499", "Accepted"],
    ["HM-1281", "Ananya J.", "Salon at home", "₹1,899", "Requested"],
  ]
  const action = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 2200)
  }
  const pageContent =
    page === "Providers" ? (
      <section className="admin-card mt-7">
        <div className="admin-section-head">
          <div>
            <h2 className="section-title">Pending KYC approvals</h2>
            <p>Verify documents before activating provider accounts.</p>
          </div>
          <span className="status-pill">24 pending</span>
        </div>
        {demo.provider.phone && (
          <div className="admin-list-row">
            <div className="admin-avatar">
              {(demo.provider.name || "P").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <b>{demo.provider.name || "New partner"}</b>
              <p>
                +91 {demo.provider.phone} · {demo.provider.skill || "Skill not set"} · KYC {demo.provider.kyc}
              </p>
              <p>
                {Object.entries(demo.provider.documents).map(([doc, file]) => `${doc}: ${file}`).join(" · ") || "No documents yet"}
              </p>
            </div>
            <button onClick={() => demo.reviewProviderKyc("approved")} className="approve-btn">
              Approve
            </button>
            <button
              onClick={() => demo.reviewProviderKyc("rejected", "Photo on the ID is unclear.")}
              className="reject-btn"
            >
              Reject
            </button>
          </div>
        )}
        {providerRows.map(([name, service, docs]) => (
          <div key={name} className="admin-list-row">
            <div className="admin-avatar">
              {name
                .split(" ")
                .map((x) => x[0])
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <b>{name}</b>
              <p>
                {service} · {docs}
              </p>
            </div>
            <button
              onClick={() => action(`${name} approved`)}
              className="approve-btn"
            >
              Approve
            </button>
            <button
              onClick={() => action(`${name} rejected`)}
              className="reject-btn"
            >
              Reject
            </button>
            <button
              onClick={() => {
                const active = demo.suspended.includes(name)
                demo.toggleSuspend(name)
                action(active ? `${name} restored` : `${name} suspended`)
              }}
              className="reject-btn"
            >
              {demo.suspended.includes(name) ? "Restore" : "Suspend"}
            </button>
          </div>
        ))}
      </section>
    ) : page === "Services" ? (
      <section className="admin-card mt-7">
        <div className="admin-section-head">
          <div>
            <h2 className="section-title">Service catalog</h2>
            <p>Manage category availability and base pricing.</p>
          </div>
          <button
            onClick={() => action("New category form opened")}
            className="primary-btn h-10 px-4"
          >
            Add category
          </button>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto">
          {cities.map((item) => (
            <button
              key={item.city}
              onClick={() => setAdminCity(item.city)}
              className={`chip ${adminCity === item.city ? "selected" : ""}`}
            >
              {item.city}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map(({ label, icon: I, tone }, i) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 p-4"
            >
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}
              >
                <I size={19} />
              </div>
              <b className="mt-4 block text-sm">{label}</b>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>From ₹{[499, 399, 699, 799, 899, 349][i]}</span>
                <button
                  onClick={() => demo.toggleCategory(adminCity, label)}
                  className="font-bold text-teal-700"
                >
                  {demo.categoryLive(adminCity, label) ? "Live" : "Paused"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : page === "Bookings" ? (
      <section className="admin-card mt-7">
        <div className="admin-section-head">
          <div>
            <h2 className="section-title">All bookings</h2>
            <p>Monitor and manage customer orders.</p>
          </div>
          <button className="secondary-btn h-10 px-4">
            <Search size={15} /> Filter
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {demo.booking && (
                <tr>
                  <td className="font-bold">{demo.booking.id}</td>
                  <td>
                    {demo.booking.customerName}
                    {demo.booking.customerPhone ? ` · +91 ${demo.booking.customerPhone}` : ""}
                  </td>
                  <td>{demo.booking.serviceName}</td>
                  <td className="font-bold">₹{demo.orderTotal(demo.booking)}</td>
                  <td>
                    <span className="status-pill">{demo.booking.status.split("_").join(" ")}</span>
                  </td>
                </tr>
              )}
              {bookingRows.map((r) => (
                <tr key={r[0]}>
                  {r.map((cell, i) => (
                    <td
                      key={cell}
                      className={i === 0 || i === 3 ? "font-bold" : ""}
                    >
                      {i === 4 ? (
                        <span className="status-pill">{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    ) : page === "Commission" ? (
      <>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            ["Outstanding dues", "₹64,280"],
            ["Collected this month", "₹2.18L"],
            ["Payouts scheduled", "₹1.42L"],
          ].map(([x, v]) => (
            <div className="admin-card" key={x}>
              <p className="text-xs text-slate-500">{x}</p>
              <b className="mt-2 block text-2xl">{v}</b>
            </div>
          ))}
        </div>
        <section className="admin-card mt-6">
          <h2 className="section-title">Provider dues</h2>
          {[
            ["Ravi Kumar", "₹1,240"],
            ["Imran Ali", "₹2,860"],
            ["Nisha Shah", "₹980"],
          ].map(([n, v]) => (
            <div className="admin-list-row" key={n}>
              <div className="admin-avatar">{n[0]}</div>
              <div className="flex-1">
                <b>{n}</b>
                <p>Weekly commission due</p>
              </div>
              <b>{v}</b>
              <button
                onClick={() => action(`Reminder sent to ${n}`)}
                className="approve-btn"
              >
                Remind
              </button>
            </div>
          ))}
        </section>
      </>
    ) : (
      <>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total bookings", "1,284", "+12.5%", CalendarDays],
            ["Revenue", "₹8.42L", "+8.2%", CircleDollarSign],
            ["Active providers", "326", "+18", Users],
            ["Pending approvals", "24", "Review", FileCheck2],
          ].map(([x, v, t, I]) => {
            const C = I as typeof Users
            return (
              <div key={x as string} className="admin-card">
                <div className="flex justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                    <C size={19} />
                  </span>
                  <span className="text-xs font-bold text-teal-700">
                    {t as string}
                  </span>
                </div>
                <p className="mt-5 text-xs text-slate-500">{x as string}</p>
                <b className="mt-1 block text-2xl">{v as string}</b>
              </div>
            )
          })}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="admin-card">
            <h2 className="section-title">Recent bookings</h2>
            <p className="mt-1 text-xs text-slate-400">
              Latest activity across all services
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRows.map((r) => (
                    <tr key={r[0]}>
                      <td className="font-semibold">{r[1]}</td>
                      <td>{r[2]}</td>
                      <td className="font-semibold">{r[3]}</td>
                      <td>
                        <span className="status-pill">{r[4]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="admin-card">
            <h2 className="section-title">Approval queue</h2>
            <p className="mt-1 text-xs text-slate-400">KYC awaiting review</p>
            {providerRows.map(([n, s]) => (
              <div key={n} className="admin-list-row">
                <div className="admin-avatar">
                  {n
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <b>{n}</b>
                  <p>{s}</p>
                </div>
                <button
                  onClick={() => setPage("Providers")}
                  className="text-xs font-bold text-teal-700"
                >
                  Review
                </button>
              </div>
            ))}
          </section>
        </div>
      </>
    )
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <Logo />
        <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Workspace
        </p>
        {pages.map(([x, I]) => {
          const C = I as typeof Users
          return (
            <button
              key={x as string}
              onClick={() => setPage(x as string)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                page === x
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <C size={18} />
              {x as string}
            </button>
          )
        })}
        <div className="mt-auto space-y-4">
          <button
            onClick={() => {
              demo.signOutAdmin()
              demo.setRole("customer")
              router.push("/")
            }}
            className="flex items-center gap-2 px-3 text-sm font-semibold text-slate-400"
          >
            <ArrowLeft size={16} /> Exit dashboard
          </button>
          <button
            onClick={demo.signOutAdmin}
            className="flex items-center gap-2 px-3 text-sm font-semibold text-rose-500"
          >
            <X size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="p-5 md:ml-64 md:p-9">
        <header className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Operations workspace</p>
            <h1 className="mt-1 text-3xl font-extrabold">{page}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="icon-btn border border-slate-200 bg-white">
              <Bell size={18} />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
              AD
            </div>
          </div>
        </header>
        <div className="mt-6 flex gap-2 overflow-x-auto md:hidden">
          {pages.map(([x]) => (
            <button
              key={x as string}
              onClick={() => setPage(x as string)}
              className={`chip ${page === x ? "selected" : ""}`}
            >
              {x as string}
            </button>
          ))}
        </div>
        {pageContent}
      </main>
      {notice && (
        <div className="admin-toast">
          <Check size={16} />
          {notice}
        </div>
      )}
    </div>
  )
}
