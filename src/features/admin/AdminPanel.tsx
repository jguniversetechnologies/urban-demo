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
  const [bookingFilter, setBookingFilter] = useState("all")
  const [categoryName, setCategoryName] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [couponOff, setCouponOff] = useState("100")
  const [reminded, setReminded] = useState<string[]>([])
  const adminCity = demo.adminCity
  const setAdminCity = demo.setAdminCity
  const setPage = (next: string) => router.push(adminPath(next))
  const pages = [
    ["Dashboard", LayoutDashboard],
    ["Providers", Users],
    ["Services", Store],
    ["Bookings", CalendarDays],
    ["Customers", Users],
    ["Payments", CircleDollarSign],
    ["Support", Bell],
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
  const action = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 2200)
  }
  const pendingCount =
    demo.roster.filter((partner) => partner.review === "pending").length +
    (demo.provider.phone && demo.provider.kyc === "pending" ? 1 : 0)
  const liveBookings = [
    ...(demo.booking
      ? [
          {
            id: demo.booking.id,
            customer: `${demo.booking.customerName}${demo.booking.customerPhone ? ` · +91 ${demo.booking.customerPhone}` : ""}`,
            service: demo.booking.serviceName,
            amount: `₹${demo.orderTotal(demo.booking)}`,
            status: demo.booking.status.split("_").join(" "),
          },
        ]
      : []),
    ...demo.history
      .filter((item) => item.id !== demo.booking?.id)
      .map((item) => ({
        id: item.id,
        customer: demo.customerName || "Customer",
        service: item.name,
        amount: item.price,
        status: "completed",
      })),
  ].filter((item) => bookingFilter === "all" || item.status === bookingFilter)
  const reviewPartner = (name: string, review: "approved" | "rejected") => {
    demo.reviewRoster(name, review)
    action(review === "approved" ? `${name} approved` : `${name} rejected`)
  }
  const pageContent =
    page === "Providers" ? (
      <section className="admin-card mt-7">
        <div className="admin-section-head">
          <div>
            <h2 className="section-title">Pending KYC approvals</h2>
            <p>Verify documents before activating provider accounts.</p>
          </div>
          <span className="status-pill">{pendingCount} pending</span>
        </div>
        {demo.provider.phone && (
          <div className="admin-list-row">
            <div className="admin-person">
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
            </div>
            <div className="admin-actions">
              <button
                onClick={() => {
                  demo.reviewProviderKyc("approved")
                  action(`${demo.provider.name || "Partner"} approved`)
                }}
                className="approve-btn"
              >
                {demo.provider.kyc === "approved" ? "Approved" : "Approve"}
              </button>
              <button
                onClick={() => {
                  demo.reviewProviderKyc("rejected", "Photo on the ID is unclear.")
                  action(`${demo.provider.name || "Partner"} rejected`)
                }}
                className="reject-btn"
              >
                {demo.provider.kyc === "rejected" ? "Rejected" : "Reject"}
              </button>
              <button
                onClick={() => {
                  const active = demo.suspended.includes(demo.provider.name)
                  demo.toggleSuspend(demo.provider.name)
                  action(active ? `${demo.provider.name} restored` : `${demo.provider.name} suspended`)
                }}
                className="reject-btn"
              >
                {demo.suspended.includes(demo.provider.name) ? "Restore" : "Suspend"}
              </button>
            </div>
          </div>
        )}
        {demo.roster.map((partner) => (
          <div key={partner.name} className="admin-list-row">
            <div className="admin-person">
              <div className="admin-avatar">
                {partner.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <b>{partner.name}</b>
                <p>
                  {partner.service} · {partner.docs} · {partner.review}
                  {demo.suspended.includes(partner.name) ? " · suspended" : ""}
                </p>
              </div>
            </div>
            <div className="admin-actions">
              <button
                onClick={() => reviewPartner(partner.name, "approved")}
                className="approve-btn"
              >
                {partner.review === "approved" ? "Approved" : "Approve"}
              </button>
              <button
                onClick={() => reviewPartner(partner.name, "rejected")}
                className="reject-btn"
              >
                {partner.review === "rejected" ? "Rejected" : "Reject"}
              </button>
              <button
                onClick={() => {
                  const active = demo.suspended.includes(partner.name)
                  demo.toggleSuspend(partner.name)
                  action(active ? `${partner.name} restored` : `${partner.name} suspended`)
                }}
                className="reject-btn"
              >
                {demo.suspended.includes(partner.name) ? "Restore" : "Suspend"}
              </button>
            </div>
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
          <form
            className="admin-actions"
            onSubmit={(event) => {
              event.preventDefault()
              const name = categoryName.trim()
              if (!name) return
              demo.addCategory(name)
              setCategoryName("")
              action(`${name} added`)
            }}
          >
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              className="form-input mt-0 h-10 min-w-0 flex-1"
              placeholder="Category name"
            />
            <button type="submit" className="primary-btn h-10 px-4">
              Add category
            </button>
          </form>
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
          {demo.extraCategories.map((label) => (
            <div key={label} className="rounded-2xl border border-slate-100 p-4">
              <b className="block text-sm">{label}</b>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Custom</span>
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
        <h3 className="section-title mt-8">Coupons</h3>
        <form
          className="admin-actions mt-3"
          onSubmit={(event) => {
            event.preventDefault()
            demo.createCoupon(couponCode, Number(couponOff), `${couponCode.toUpperCase()} offer`)
            setCouponCode("")
            action("Coupon is active for customers")
          }}
        >
          <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} className="form-input mt-0 h-10 min-w-0 flex-1" placeholder="CODE" />
          <input value={couponOff} onChange={(event) => setCouponOff(event.target.value.replace(/\D/g, ""))} className="form-input mt-0 h-10 w-24" placeholder="100" />
          <button className="primary-btn h-10 px-4" type="submit">Add coupon</button>
        </form>
        <p className="mt-1 text-xs text-slate-400">
          Only active coupons appear in the customer payment list.
        </p>
        {demo.coupons.map((coupon) => (
          <div className="admin-list-row" key={coupon.code}>
            <div className="min-w-0 flex-1">
              <b>{coupon.code}</b>
              <p>
                {coupon.label} · ₹{coupon.off} off
              </p>
            </div>
            <button
              onClick={() => {
                demo.toggleCoupon(coupon.code)
                action(coupon.active ? `${coupon.code} paused` : `${coupon.code} is active`)
              }}
              className={coupon.active ? "approve-btn" : "reject-btn"}
            >
              {coupon.active ? "Active" : "Paused"}
            </button>
          </div>
        ))}
      </section>
    ) : page === "Bookings" ? (
      <section className="admin-card mt-7">
        <div className="admin-section-head">
          <div>
            <h2 className="section-title">All bookings</h2>
            <p>Monitor and manage customer orders.</p>
          </div>
          <div className="admin-actions">
            {["all", "requested", "accepted", "on the way", "started", "completed"].map((item) => (
              <button
                key={item}
                onClick={() => setBookingFilter(item)}
                className={`chip ${bookingFilter === item ? "selected" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 space-y-3 md:hidden">
          {liveBookings.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <b className="text-sm">{item.id}</b>
                <span className="status-pill">{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.customer}</p>
              <p className="mt-1 text-sm text-slate-500">{item.service}</p>
              <b className="mt-2 block text-sm">{item.amount}</b>
            </div>
          ))}
          {liveBookings.length === 0 && (
            <p className="text-sm text-slate-500">No bookings for this filter.</p>
          )}
        </div>
        <div className="mt-5 hidden overflow-x-auto md:block">
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
              {liveBookings.map((item) => (
                <tr key={item.id}>
                  <td className="font-bold">{item.id}</td>
                  <td>{item.customer}</td>
                  <td>{item.service}</td>
                  <td className="font-bold">{item.amount}</td>
                  <td>
                    <span className="status-pill">{item.status}</span>
                  </td>
                </tr>
              ))}
              {liveBookings.length === 0 && (
                <tr>
                  <td colSpan={5}>No bookings for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    ) : page === "Customers" ? (
      <section className="admin-card mt-7">
        <h2 className="section-title">Customers</h2>
        {demo.customerPhone ? (
          <div className="admin-list-row">
            <div className="admin-person">
              <div className="admin-avatar">{(demo.customerName || "C").slice(0, 2).toUpperCase()}</div>
              <div>
                <b>{demo.customerName || "Customer"}</b>
                <p>+91 {demo.customerPhone} · {demo.city || "No city"} · wallet ₹{demo.wallet}</p>
                <p>{demo.history.length} past visits · rating {demo.customerRating ?? "—"}</p>
              </div>
            </div>
            <button className="reject-btn" onClick={() => demo.blockCustomer(demo.customerPhone)}>
              {demo.blockedPhones.includes(demo.customerPhone) ? "Unblock" : "Block"}
            </button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">A customer appears here after they sign in.</p>
        )}
      </section>
    ) : page === "Payments" ? (
      <section className="admin-card mt-7">
        <h2 className="section-title">Payments</h2>
        {!demo.booking && demo.history.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">Payments show up when a customer books.</p>
        )}
        {demo.booking && (
          <div className="admin-list-row">
            <div className="min-w-0 flex-1">
              <b>{demo.booking.id}</b>
              <p>{demo.booking.serviceName} · {demo.booking.payment} · {demo.booking.paymentStatus}</p>
            </div>
            <b>₹{demo.orderTotal(demo.booking)}</b>
          </div>
        )}
        {demo.history.map((item) => (
          <div className="admin-list-row" key={item.id}>
            <div className="min-w-0 flex-1">
              <b>{item.id}</b>
              <p>{item.name} · {item.when}</p>
            </div>
            <b>{item.price}</b>
          </div>
        ))}
      </section>
    ) : page === "Support" ? (
      <section className="admin-card mt-7">
        <h2 className="section-title">Support tickets</h2>
        {demo.tickets.length === 0 && <p className="mt-4 text-sm text-slate-500">No open requests.</p>}
        {demo.tickets.map((ticket) => (
          <div className="admin-list-row" key={ticket.id}>
            <div className="min-w-0 flex-1">
              <b>{ticket.topic}</b>
              <p>{ticket.from} · {ticket.detail} {ticket.photo ? `· ${ticket.photo}` : ""}</p>
            </div>
            <button className="approve-btn" onClick={() => demo.setTicketStatus(ticket.id, ticket.status === "open" ? "resolved" : "open")}>
              {ticket.status}
            </button>
          </div>
        ))}
        {demo.audit.length > 0 && (
          <>
            <h3 className="section-title mt-6">Recent admin actions</h3>
            {demo.audit.map((line) => (
              <p key={line} className="mt-2 text-xs text-slate-500">{line}</p>
            ))}
          </>
        )}
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
              <div className="admin-person">
                <div className="admin-avatar">{n[0]}</div>
                <div className="min-w-0 flex-1">
                  <b>{n}</b>
                  <p>Weekly commission due · {v}</p>
                </div>
              </div>
              <div className="admin-actions">
                <button
                  onClick={() => {
                    setReminded((current) =>
                      current.includes(n) ? current : [...current, n],
                    )
                    action(`Reminder sent to ${n}`)
                  }}
                  className="approve-btn"
                >
                  {reminded.includes(n) ? "Sent" : "Remind"}
                </button>
              </div>
            </div>
          ))}
        </section>
      </>
    ) : (
      <>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total bookings", String(liveBookings.length || (bookingFilter === "all" ? 0 : liveBookings.length)), "Live", CalendarDays],
            ["Pending approvals", String(pendingCount), "Review", FileCheck2],
            ["Active providers", String(demo.roster.filter((partner) => partner.review === "approved").length + (demo.provider.kyc === "approved" ? 1 : 0)), "Approved", Users],
            ["Active coupons", String(demo.coupons.filter((coupon) => coupon.active).length), "Offers", CircleDollarSign],
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
            <div className="mt-5 space-y-3 md:hidden">
              {liveBookings.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <b className="text-sm">{item.customer}</b>
                    <span className="status-pill">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item.service}</p>
                  <b className="mt-2 block text-sm">{item.amount}</b>
                </div>
              ))}
              {liveBookings.length === 0 && (
                <p className="text-sm text-slate-500">No live bookings yet.</p>
              )}
            </div>
            <div className="mt-5 hidden overflow-x-auto md:block">
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
                  {liveBookings.map((item) => (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.customer}</td>
                      <td>{item.service}</td>
                      <td className="font-semibold">{item.amount}</td>
                      <td>
                        <span className="status-pill">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                  {liveBookings.length === 0 && (
                    <tr>
                      <td colSpan={4}>No live bookings yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <section className="admin-card">
            <h2 className="section-title">Approval queue</h2>
            <p className="mt-1 text-xs text-slate-400">KYC awaiting review</p>
            {demo.provider.phone && demo.provider.kyc === "pending" && (
              <div className="admin-list-row">
                <div className="admin-person">
                  <div className="admin-avatar">
                    {(demo.provider.name || "P").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <b>{demo.provider.name || "New partner"}</b>
                    <p>{demo.provider.skill || "Skill not set"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPage("Providers")}
                  className="text-xs font-bold text-teal-700"
                >
                  Review
                </button>
              </div>
            )}
            {demo.roster
              .filter((partner) => partner.review === "pending")
              .map((partner) => (
                <div key={partner.name} className="admin-list-row">
                  <div className="admin-person">
                    <div className="admin-avatar">
                      {partner.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <b>{partner.name}</b>
                      <p>{partner.service}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPage("Providers")}
                    className="text-xs font-bold text-teal-700"
                  >
                    Review
                  </button>
                </div>
              ))}
            {pendingCount === 0 && (
              <p className="mt-4 text-sm text-slate-500">No partners waiting for review.</p>
            )}
          </section>
        </div>
      </>
    )
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
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
      <main className="admin-main">
        <header className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Operations workspace</p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{page}</h1>
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
