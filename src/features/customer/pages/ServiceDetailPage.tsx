"use client"

import { useEffect } from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react"
import { formatRupees, packagesFor, platformFee } from "@/data/market"
import { categoryIncludes, serviceImage } from "@/data/services"
import { serviceFromSlugs, categoryPath } from "@/lib/paths"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"

export function Detail() {
  const params = useParams<{ category: string; service: string }>()
  const match = serviceFromSlugs(params.category, params.service)
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()

  useEffect(() => {
    if (!match) return
    demo.setActiveCategory(match.category)
    demo.setSelection(match)
    demo.setPackageChoice(packagesFor(match)[0])
  }, [match?.category, match?.name])

  if (!match) notFound()
  const { category, ...service } = match
  const options = packagesFor(service)
  const included = categoryIncludes[category] ?? categoryIncludes.Cleaning
  const selected =
    options.find((item) => item.id === demo.packageChoice?.id) ?? options[0]
  const total = selected.price + platformFee
  const available = !demo.city || demo.categoryLive(demo.city, category)

  return (
    <div className="screen">
      <div className="relative h-56 shrink-0">
        <img
          src={serviceImage}
          alt="Professional home cleaning service"
          className="h-full w-full object-cover"
        />
        <button
          onClick={() => {
            demo.setActiveCategory(category)
            router.push(categoryPath(category))
          }}
          className="absolute left-4 top-4 icon-btn bg-white shadow-md"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800">
          <Star
            size={12}
            className="mr-1 inline fill-amber-400 text-amber-400"
          />{" "}
          {service.rating} · 2.4k bookings
        </div>
      </div>
      <main className="flex-1 overflow-y-auto px-6 pb-28 pt-6">
        <p className="eyebrow">{category}</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          {service.name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {service.description} Delivered by a trained, background-verified
          professional.
        </p>
        <div className="my-6 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 py-4 text-center">
          <div>
            <Clock3 size={18} className="mx-auto text-teal-600" />
            <b className="mt-2 block text-xs">{service.time}</b>
          </div>
          <div>
            <ShieldCheck size={18} className="mx-auto text-teal-600" />
            <b className="mt-2 block text-xs">30-day cover</b>
          </div>
          <div>
            <Sparkles size={18} className="mx-auto text-teal-600" />
            <b className="mt-2 block text-xs">Quality assured</b>
          </div>
        </div>
        <h2 className="section-title">Choose a package</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => demo.setPackageChoice(option)}
              className={`rounded-2xl border px-2 py-3 text-center ${
                selected.id === option.id
                  ? "border-teal-600 bg-teal-50"
                  : "border-slate-200"
              }`}
            >
              <b className="block text-sm">{option.label}</b>
              <small className="mt-1 block text-[10px] text-slate-500">
                {option.detail}
              </small>
              <b className="mt-2 block text-xs">{formatRupees(option.price)}</b>
            </button>
          ))}
        </div>
        <h2 className="section-title mt-7">Price breakdown</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p className="flex justify-between">
            <span>{selected.label}</span>
            <b>{formatRupees(selected.price)}</b>
          </p>
          <p className="flex justify-between">
            <span>Visit fee</span>
            <b>{formatRupees(platformFee)}</b>
          </p>
          <p className="flex justify-between border-t border-slate-100 pt-2 text-slate-900">
            <span>Total</span>
            <b>{formatRupees(total)}</b>
          </p>
        </div>
        {!available && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            This category is paused in {demo.city}.
          </p>
        )}
        <h2 className="section-title mt-7">What's included</h2>
        {included.map((x) => (
          <p
            key={x}
            className="mt-3 flex items-center gap-3 text-sm text-slate-600"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-teal-50 text-teal-700">
              <Check size={12} />
            </span>
            {x}
          </p>
        ))}
      </main>
      <div className="sticky-bar">
        <div>
          <p className="text-xs text-slate-400">Total</p>
          <p className="text-xl font-extrabold">{formatRupees(total)}</p>
        </div>
        <button
          className="primary-btn w-44 disabled:opacity-40"
          disabled={!available}
          onClick={() => go("booking")}
        >
          Book now <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
