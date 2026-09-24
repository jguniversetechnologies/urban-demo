"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Header } from "@/components/AppChrome"
import { useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"

export function Rating() {
  const go = useGo()
  const demo = useDemo()
  const [rated, setRated] = useState(5)
  const [note, setNote] = useState("")
  const [chip, setChip] = useState("")
  const [sent, setSent] = useState(false)
  const chips = ["On time", "Polite", "Missed a spot", "Brought the right tools"]
  const partner = demo.provider.name || "your partner"
  if (sent) {
    return (
      <div className="screen items-center justify-center px-8 text-center">
        <h1 className="text-2xl font-extrabold">Thank you</h1>
        <p className="mt-3 text-sm text-slate-500">
          Your {rated}-star review is saved on your profile.
        </p>
        <button className="primary-btn mt-8 w-full" onClick={() => go("home")}>
          Back to home
        </button>
      </div>
    )
  }
  return (
    <div className="screen">
      <Header title="Rate your service" onBack={() => go("tracking")} />
      <main className="flex flex-1 flex-col items-center px-7 pt-10 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-100 text-xl font-extrabold text-teal-700">
          RK
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">How did {partner} do?</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your feedback helps us serve you better.
        </p>
        <div className="mt-8 flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button onClick={() => setRated(n)} key={n}>
              <Star
                size={32}
                className={
                  n <= rated
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                }
              />
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {chips.map((item) => (
            <button
              key={item}
              className={`chip ${chip === item ? "selected" : ""}`}
              onClick={() => setChip(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="mt-6 h-28 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-teal-600"
          placeholder="Tell us what you loved..."
        />
        <button className="primary-btn mt-6 w-full" onClick={() => {
          demo.saveReview(rated, [chip, note].filter(Boolean).join(". "))
          setSent(true)
        }}>
          Submit review
        </button>
      </main>
    </div>
  )
}
