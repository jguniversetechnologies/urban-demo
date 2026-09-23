"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  ClipboardList,
  Headphones,
  Info,
  MapPin,
  Settings,
  ShieldCheck,
  Smartphone,
  Star,
  Wallet,
} from "lucide-react"
import { Header } from "@/components/AppChrome"
import { useDemo } from "@/state/DemoState"

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits ? `+91 ${digits}` : "Number not saved"
}

export default function ProviderProfile({ section = "" }: { section?: string }) {
  const demo = useDemo()
  const router = useRouter()
  const provider = demo.provider
  const incomplete = provider.kyc !== "approved"
  const [help, setHelp] = useState("")
  const [name, setName] = useState(provider.name)
  const [city, setCity] = useState(provider.city || "Bengaluru")
  const [skill, setSkill] = useState(provider.skill || "Cleaning")
  const kycLabel =
    provider.kyc === "approved"
      ? "Approved"
      : provider.kyc === "pending"
        ? "Waiting for admin"
        : provider.kyc === "rejected"
          ? "Needs a change"
          : "Not started"

  const cards = [
    ["My jobs", ClipboardList, "/provider/requests"],
    ["Native devices", Smartphone, "/provider/profile/devices"],
    ["Help & support", Headphones, "/provider/profile/help"],
  ] as const

  const rows = [
    ["KYC", ShieldCheck, "/provider/kyc"],
    ["Earnings", Wallet, "/provider/earnings"],
    ["My rating", Star, "/provider/profile/rating"],
    ["Service area", MapPin, "/provider/profile/area"],
    ["Settings", Settings, "/provider/profile/settings"],
    ["About Homify", Info, "/provider/profile/about"],
  ] as const

  const back = () => router.push(section ? "/provider/profile" : "/provider")

  return (
    <div className="screen bg-white">
      {section ? (
        <Header title={section} onBack={back} />
      ) : (
        <header className="flex h-16 shrink-0 items-center px-4">
          <button className="icon-btn" onClick={back} aria-label="Go back">
            <ChevronRight className="rotate-180" size={20} />
          </button>
        </header>
      )}
      <main className="flex-1 overflow-y-auto pb-8">
        {!section && (
          <>
            <div className="flex items-center justify-between px-5">
              {incomplete ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] text-white">!</span>
                  Incomplete profile
                </span>
              ) : (
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800">
                  KYC approved
                </span>
              )}
              {incomplete && (
                <button
                  onClick={() => router.push("/provider/profile/area")}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                  Complete
                </button>
              )}
            </div>
            <h1 className="mt-4 px-5 text-[32px] font-extrabold tracking-tight">
              {provider.kyc === "approved" ? "Verified Partner" : "Partner"}
            </h1>
            <p className="mt-1 px-5 text-sm text-slate-500">{formatPhone(provider.phone)}</p>
            <p className="mt-1 px-5 text-xs font-bold text-teal-700">{kycLabel}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 px-5">
              {cards.map(([label, Icon, href]) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 p-3 text-left"
                >
                  <Icon size={22} strokeWidth={1.75} />
                  <span className="text-sm font-semibold leading-5">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 border-t border-slate-100 bg-slate-50/60 px-5">
              {rows.map(([label, Icon, href]) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex w-full items-center gap-3 border-b border-slate-100 py-4 text-sm font-semibold"
                >
                  <Icon size={18} />
                  <span className="flex-1 text-left">{label}</span>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
            </div>
          </>
        )}
        {section === "Native devices" && (
          <div className="px-5">
            <h2 className="section-title mt-6">Native devices</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Job alerts for this login use the token below.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <b className="text-sm">This phone</b>
              <p className="mt-1 text-xs text-slate-500">{formatPhone(provider.phone)}</p>
              <p className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-[11px]">
                {provider.token || "Sign in to create a token"}
              </p>
            </div>
          </div>
        )}
        {section === "Help & support" && (
          <div className="px-5">
            {["How do I get jobs?", "What is the start code?", "When do I get paid?"].map((item) => (
              <button
                key={item}
                onClick={() => setHelp(help === item ? "" : item)}
                className="mt-3 w-full rounded-2xl border border-slate-100 p-4 text-left text-sm font-bold"
              >
                <span className="flex items-center justify-between">
                  {item}
                  <ChevronRight size={16} />
                </span>
                {help === item && (
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    {item.startsWith("How")
                      ? "Finish KYC, wait for admin approval, then go online. The customer's request appears here."
                      : item.startsWith("What")
                        ? "Ask the customer for 7291 before you start the visit."
                        : "Demo earnings update when you mark the job completed."}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
        {section === "My rating" && (
          <p className="px-5 pt-6 text-sm text-slate-500">
            Customers rate you after the visit. Your demo rating stays 4.9 until real reviews are on.
          </p>
        )}
        {section === "Service area" && (
          <div className="px-5">
            <label className="form-label mt-6">
              Your name
              <input value={name} onChange={(event) => setName(event.target.value)} className="form-input" />
            </label>
            <label className="form-label">
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} className="form-input" />
            </label>
            <label className="form-label">
              Skill
              <input value={skill} onChange={(event) => setSkill(event.target.value)} className="form-input" placeholder="Cleaning" />
            </label>
            <button
              className="primary-btn w-full"
              onClick={() => {
                demo.setProviderProfile({
                  name: name.trim() || provider.name,
                  city: city.trim(),
                  skill: skill.trim(),
                })
                router.push("/provider/kyc")
              }}
            >
              Save and add KYC
            </button>
          </div>
        )}
        {section === "Settings" && (
          <div className="px-5">
            <p className="mt-6 text-sm text-slate-500">
              Signed in as {formatPhone(provider.phone)}. Alerts use token {provider.token.slice(0, 12) || "pending"}.
            </p>
            <button
              onClick={() => {
                demo.signOutProvider()
                demo.setRole("customer")
                router.push("/login")
              }}
              className="mt-8 text-sm font-bold text-rose-600"
            >
              Sign out
            </button>
          </div>
        )}
        {section === "About" && (
          <p className="px-5 pt-6 text-sm leading-6 text-slate-500">
            Homify partners take nearby jobs after admin approves their documents.
          </p>
        )}
      </main>
    </div>
  )
}
