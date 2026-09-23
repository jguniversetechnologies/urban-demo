"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react"
import { BottomNav } from "@/components/AppChrome"
import { categories, findService, searchServices } from "@/data/services"
import { categoryPath, servicePath } from "@/lib/paths"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"
import type { ServiceItem } from "@/types/navigation"

const popularNames = [
  "Essential home cleaning",
  "AC general service",
  "Leakage repair",
]

export function HomeScreen() {
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()
  const openService = (category: string) => {
    demo.setActiveCategory(category)
    router.push(categoryPath(category))
  }
  const openDetail = (service: ServiceItem, category: string) => {
    demo.setActiveCategory(category)
    demo.setSelection({ ...service, category })
    router.push(servicePath(category, service.name))
  }
  const [query, setQuery] = useState("")
  const results = searchServices(query).filter((item) =>
    demo.city ? demo.categoryLive(demo.city, item.category) : true,
  )
  const visibleCategories = categories.filter(
    (item) =>
      item.label !== "View all" &&
      (!demo.city || demo.categoryLive(demo.city, item.label)),
  )
  const place = demo.area ? `${demo.area}, ${demo.city}` : "Set your location"
  const firstName = demo.customerName.split(" ")[0]
  const popular = popularNames
    .map((name) => findService(name))
    .filter((item) => item && (!demo.city || demo.categoryLive(demo.city, item.category)))
  const again = demo.history[0]

  return (
    <div className="screen home-screen">
      <header className="bg-white px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-400">
              {firstName ? `Hello, ${firstName}` : "Hello"}
            </p>
            <button className="mt-1 text-left" onClick={() => go("location")}>
              <span className="flex items-center gap-1 text-[15px] font-extrabold text-slate-900">
                <MapPin size={15} className="text-teal-600" />
                {place}
                <ChevronRight size={14} className="text-slate-400" />
              </span>
            </button>
          </div>
          <button
            className="relative grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700"
            aria-label="Notifications"
            onClick={() => router.push("/profile/alerts")}
          >
            <Bell size={18} />
            {demo.notices.some((item) => item.audience === "customer") && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </button>
        </div>
        <label className="mt-4 flex h-12 items-center gap-3 rounded-2xl bg-slate-100 px-4 text-slate-400">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Search cleaning, AC, plumber..."
            aria-label="Search for a service"
          />
        </label>
      </header>
      <main className="flex-1 overflow-y-auto px-5 pb-28 pt-4">
        {!demo.customerAuthed && (
          <button
            onClick={() => go("login")}
            className="mb-4 flex w-full items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-left text-xs font-bold text-amber-900"
          >
            Log in to book and track your visit.
            <ChevronRight size={16} />
          </button>
        )}
        {query.trim().length >= 2 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            {results.length === 0 ? (
              <p className="px-4 py-4 text-sm text-slate-500">
                No matching services in {demo.city || "your city"}
              </p>
            ) : (
              results.slice(0, 8).map((item) => (
                <button
                  key={`${item.category}-${item.name}`}
                  onClick={() => openDetail(item, item.category)}
                  className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0"
                >
                  <span>
                    <b className="block text-sm text-slate-900">{item.name}</b>
                    <small className="text-slate-500">
                      {item.category} · {item.price}
                    </small>
                  </span>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))
            )}
          </div>
        ) : (
          <>
            {demo.booking && (
              <button
                onClick={() => go("tracking")}
                className="mb-4 w-full rounded-2xl bg-slate-900 p-4 text-left text-white"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  Live booking
                </p>
                <b className="mt-1 block text-base">{demo.booking.serviceName}</b>
                <p className="mt-1 text-xs capitalize text-slate-300">
                  {demo.booking.status.split("_").join(" ")} · {demo.booking.time}
                </p>
                <span className="mt-3 inline-block text-xs font-bold text-teal-200">
                  Track visit
                </span>
              </button>
            )}
            {demo.coupons.some((coupon) => coupon.active) && (
              <button
                onClick={() => openService("Cleaning")}
                className="mb-5 w-full rounded-2xl bg-teal-700 px-4 py-4 text-left text-white"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-100">
                  Active coupons
                </p>
                <b className="mt-1 block text-lg">
                  {demo.coupons
                    .filter((coupon) => coupon.active)
                    .map((coupon) => coupon.code)
                    .join(" · ")}
                </b>
                <p className="mt-1 text-xs text-teal-50">
                  Choose one from the list at payment.
                </p>
              </button>
            )}
            <div className="flex items-center justify-between">
              <h2 className="section-title">Services</h2>
              <button
                className="text-xs font-bold text-teal-700"
                onClick={() => openService("Cleaning")}
              >
                View all
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-4">
              {visibleCategories.map(({ label, icon: Icon, tone }) => (
                <button
                  key={label}
                  onClick={() => openService(label)}
                  className="flex flex-col items-center gap-2 text-center text-[11px] font-semibold leading-4 text-slate-700"
                >
                  <span className={`grid h-[52px] w-[52px] place-items-center rounded-2xl ${tone}`}>
                    <Icon size={22} />
                  </span>
                  {label}
                </button>
              ))}
            </div>
            {again && (
              <>
                <h2 className="section-title mt-7">Book again</h2>
                <button
                  onClick={() => {
                    const match = findService(again.name)
                    if (match) openDetail(match, match.category)
                  }}
                  className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left shadow-sm"
                >
                  <span>
                    <b className="block text-sm">{again.name}</b>
                    <small className="text-slate-500">{again.when}</small>
                  </span>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              </>
            )}
            <h2 className="section-title mt-7">
              Popular in {demo.area || demo.city || "your city"}
            </h2>
            <div className="mt-3 space-y-2">
              {popular.map((match) =>
                match ? (
                  <button
                    key={match.name}
                    onClick={() => openDetail(match, match.category)}
                    className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left shadow-sm"
                  >
                    <span>
                      <b className="block text-sm">{match.name}</b>
                      <small className="text-slate-500">
                        {match.rating} · {match.price}
                      </small>
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ) : null,
              )}
            </div>
            <div className="mt-5 flex gap-2">
              {[
                [BadgeCheck, "Verified partners"],
                [ShieldCheck, "30-day cover"],
              ].map(([Icon, label]) => {
                const C = Icon as typeof BadgeCheck
                return (
                  <div
                    key={label as string}
                    className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 py-3 text-[11px] font-semibold text-slate-600"
                  >
                    <C size={16} className="text-teal-600" />
                    {label as string}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
      <BottomNav active="home" />
    </div>
  )
}
