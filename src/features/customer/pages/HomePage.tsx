import { useState } from "react"
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  Gift,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react"
import { BottomNav } from "@/components/AppChrome"
import { promoBanners } from "@/data/market"
import { categories, searchServices } from "@/data/services"
import { useDemo } from "@/state/DemoState"
import type { Screen, ServiceItem } from "@/types/navigation"

export function HomeScreen({
  go,
  openService,
  openDetail,
}: {
  go: (s: Screen) => void
  openService: (category: string) => void
  openDetail: (service: ServiceItem, category: string) => void
}) {
  const demo = useDemo()
  const [query, setQuery] = useState("")
  const results = searchServices(query).filter((item) =>
    demo.city ? demo.categoryLive(demo.city, item.category) : true,
  )
  const visibleCategories = categories.filter(
    (item) =>
      item.label === "View all" ||
      !demo.city ||
      demo.categoryLive(demo.city, item.label),
  )
  const place = demo.area ? `${demo.area}, ${demo.city}` : "Set your location"

  return (
    <div className="screen home-screen">
      <header className="bg-white px-5 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <button className="text-left" onClick={() => go("location")}>
            <p className="text-[11px] font-semibold text-slate-400">
              Service location
            </p>
            <span className="mt-1 flex items-center gap-1 text-sm font-extrabold text-slate-900">
              <MapPin size={15} className="text-teal-600" />
              {place}
              <ChevronRight size={14} className="text-slate-400" />
            </span>
          </button>
          <button
            className="relative grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
        <label className="mt-4 flex h-12 items-center gap-3 rounded-2xl bg-slate-100 px-4 text-slate-400">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Search for a service"
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
            Browsing as guest. Log in to book.
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
              results.slice(0, 6).map((item) => (
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
            <div className="flex gap-3 overflow-x-auto pb-1">
              {promoBanners.map((banner) => (
                <button
                  key={banner.id}
                  onClick={() => openService(banner.category)}
                  className={`${banner.className} w-64 shrink-0 rounded-2xl p-4 text-left text-white`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                    {banner.eyebrow}
                  </p>
                  <b className="mt-2 block text-lg leading-tight">
                    {banner.title}
                  </b>
                  <p className="mt-1 text-xs text-white/80">{banner.subtitle}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => go("rewards")}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-amber-100 bg-white px-4 py-3 text-left"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <Gift size={18} />
              </span>
              <span className="flex-1">
                <b className="block text-sm">
                  {demo.rewardPoints} reward points
                </b>
                <small className="text-slate-500">
                  Offers waiting in {demo.city || "your city"}
                </small>
              </span>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
            <div className="mt-6 flex items-center justify-between">
              <h2 className="section-title">Services</h2>
              <button
                className="text-xs font-bold text-teal-700"
                onClick={() => openService("Cleaning")}
              >
                View all
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {visibleCategories.map(({ label, icon: Icon, tone }) => (
                <button
                  key={label}
                  onClick={() =>
                    openService(label === "View all" ? "Cleaning" : label)
                  }
                  className="flex flex-col items-center gap-2 text-center text-[11px] font-semibold text-slate-600"
                >
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl shadow-sm ${tone}`}
                  >
                    <Icon size={22} />
                  </span>
                  {label}
                </button>
              ))}
            </div>
            <h2 className="section-title mt-7">
              Popular in {demo.area || "your area"}
            </h2>
            <div className="mt-3 space-y-2">
              {["Essential home cleaning", "AC general service", "Leakage repair"].map(
                (name) => {
                  const match = results.length
                    ? null
                    : searchServices(name)[0]
                  if (!match) return null
                  return (
                    <button
                      key={name}
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
                  )
                },
              )}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {[
                [BadgeCheck, "Verified pros"],
                [ShieldCheck, "30-day cover"],
              ].map(([Icon, label]) => {
                const C = Icon as typeof BadgeCheck
                return (
                  <div
                    key={label as string}
                    className="rounded-2xl bg-white p-3 text-[11px] font-semibold text-slate-600"
                  >
                    <C size={16} className="mb-2 text-teal-600" />
                    {label as string}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
      <BottomNav active="home" go={go} />
    </div>
  )
}
