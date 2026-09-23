"use client"

import { useState } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import { ChevronRight, Search, Star } from "lucide-react"
import { BottomNav, Header } from "@/components/AppChrome"
import { categories, serviceCatalog } from "@/data/services"
import { categoryFromSlug, categoryPath, servicePath } from "@/lib/paths"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"

export function ServiceList() {
  const params = useParams<{ category: string }>()
  const resolved = categoryFromSlug(params.category)
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  if (!resolved) notFound()
  const category = resolved
  const setCategory = (next: string) => {
    demo.setActiveCategory(next)
    router.push(categoryPath(next))
  }
  const selectService = (item: (typeof serviceCatalog)["Cleaning"][number]) => {
    demo.setActiveCategory(category)
    demo.setSelection({ ...item, category })
    router.push(servicePath(category, item.name))
  }
  const CategoryIcon = categories.find((item) => item.label === category)?.icon
  const list = (serviceCatalog[category] || serviceCatalog.Cleaning).filter(
    (item) => item.name.toLowerCase().includes(query.trim().toLowerCase()),
  )
  return (
    <div className="screen">
      <Header
        title={`${category} services`}
        onBack={() => go("home")}
        action={
          <button
            className="icon-btn"
            aria-label="Search services"
            onClick={() => setSearching((open) => !open)}
          >
            <Search size={19} />
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto px-5 pb-28">
        {searching && (
          <label className="mt-4 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 px-4 text-slate-400">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              placeholder={`Search ${category.toLowerCase()}`}
              aria-label={`Search ${category} services`}
              autoFocus
            />
          </label>
        )}
        <div className="mt-5 rounded-2xl bg-teal-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Top-rated near you
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Background-verified experts, at your door.
          </p>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {Object.keys(serviceCatalog)
            .filter(
              (name) => !demo.city || demo.categoryLive(demo.city, name),
            )
            .map((x) => (
            <button
              onClick={() => setCategory(x)}
              className={`chip ${category === x ? "selected" : ""}`}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {list.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              No services match "{query.trim()}".
            </p>
          )}
          {list.map((item, i) => (
            <button
              key={item.name}
              onClick={() => selectService(item)}
              className="service-card"
            >
              <div
                className={`grid h-20 w-20 shrink-0 place-items-center rounded-xl ${
                  i === 0
                    ? "bg-sky-50 text-sky-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {CategoryIcon ? <CategoryIcon size={28} /> : null}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {item.rating} · {item.time}
                </p>
                <p className="mt-3 text-sm font-extrabold text-slate-900">
                  {item.price}
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          ))}
        </div>
      </main>
      <BottomNav active="services" />
    </div>
  )
}
