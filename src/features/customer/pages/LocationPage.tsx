"use client"

import { useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Header } from "@/components/AppChrome"
import { cities } from "@/data/market"
import { useContinue, useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"

export function LocationPage() {
  const demo = useDemo()
  const go = useGo()
  const onDone = useContinue()
  const [city, setCity] = useState(demo.city || "Bengaluru")
  const [area, setArea] = useState(demo.area)
  const areas = cities.find((item) => item.city === city)?.areas ?? []

  const save = (nextCity: string, nextArea: string) => {
    demo.setLocation(nextCity, nextArea)
    onDone()
  }

  return (
    <div className="screen">
      <Header title="Choose location" onBack={() => go("home")} />
      <main className="flex-1 overflow-y-auto px-5 pb-8 pt-6">
        <p className="eyebrow">Where should we send the pro?</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Set your service city
        </h1>
        <button
          className="primary-btn mt-6 w-full"
          onClick={() => save("Bengaluru", "Koramangala")}
        >
          <Navigation size={18} /> Use current location
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Demo location: Koramangala, Bengaluru
        </p>
        <h2 className="section-title mt-8">Or pick a city</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {cities.map((item) => (
            <button
              key={item.city}
              className={`chip ${city === item.city ? "selected" : ""}`}
              onClick={() => {
                setCity(item.city)
                setArea("")
              }}
            >
              {item.city}
            </button>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          {areas.map((item) => (
            <button
              key={item}
              onClick={() => setArea(item)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold ${
                area === item
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-slate-200 text-slate-700"
              }`}
            >
              <MapPin size={16} className="text-teal-600" />
              {item}
            </button>
          ))}
        </div>
        <button
          className="primary-btn mt-6 w-full disabled:opacity-40"
          disabled={!area}
          onClick={() => save(city, area)}
        >
          Continue
        </button>
      </main>
    </div>
  )
}
