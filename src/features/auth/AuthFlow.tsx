"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Phone } from "lucide-react"
import { Header, Logo } from "@/components/AppChrome"
import { serviceImage } from "@/data/services"
import { useContinue, useGo } from "@/navigation/useGo"
import { useDemo } from "@/state/DemoState"
import type { Screen } from "@/types/navigation"

export default function AuthFlow({ screen }: { screen: Screen }) {
  const demo = useDemo()
  const go = useGo()
  const router = useRouter()
  const continueAfterAuth = useContinue()
  const mode = demo.role === "provider" ? "provider" : "customer"
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(45)
  const [otpExpired, setOtpExpired] = useState(false)
  const phone = demo.authDraft.phone
  const name = demo.authDraft.name
  const email = demo.authDraft.email
  const cleanPhone = phone.replace(/\D/g, "")
  const setPhone = (value: string) => demo.patchAuthDraft({ phone: value })
  const setName = (value: string) => demo.patchAuthDraft({ name: value })
  const setEmail = (value: string) => demo.patchAuthDraft({ email: value })
  const finishAuth = (verifiedPhone: string) => {
    if (mode === "provider") {
      demo.signInProvider(verifiedPhone)
      router.push("/provider/profile")
      return
    }
    demo.signInCustomer(verifiedPhone)
    if (!demo.city) {
      router.push("/location")
      return
    }
    continueAfterAuth()
  }
  const skip = () => {
    demo.setPendingPath(null)
    router.push(demo.city ? "/home" : "/location")
  }
  const continueLogin = () => {
    if (cleanPhone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.")
      return
    }
    setError("")
    go("otp")
  }
  useEffect(() => {
    if (screen !== "otp") return
    setSecondsLeft(45)
    setOtpExpired(false)
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setOtpExpired(true)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [screen])
  const verifyOtp = () => {
    if (otpExpired) {
      setError("This code has expired. Resend it and try again.")
      return
    }
    if (otp !== "4826") {
      setError("That code is not valid. Use 4826.")
      return
    }
    setError("")
    finishAuth(cleanPhone)
  }
  const createAccount = () => {
    if (name.trim().length < 2) {
      setError("Please enter your full name.")
      return
    }
    if (cleanPhone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.")
      return
    }
    setError("")
    go("otp")
  }
  if (screen === "otp")
    return (
      <div className="auth-card">
        <Header title="Verify your number" onBack={() => go("login")} />
        <div className="flex flex-1 flex-col px-7 pt-10">
          <div className="mb-8 grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <Phone size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Enter verification code
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            We sent a 4-digit code to{" "}
            <b className="text-slate-700">+91 {cleanPhone || "98765 21040"}</b>
          </p>
          <label className="form-label mt-8">
            Verification code
            <input
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                setError("")
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="otp-input"
              placeholder="• • • •"
              aria-invalid={!!error}
            />
          </label>
          <p className="mt-1 rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-800">
            <b>Demo code:</b> 4826
          </p>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <button className="primary-btn mt-6" onClick={verifyOtp}>
            Verify & continue
          </button>
          <p className="mt-5 text-center text-sm text-slate-500">
            Didn&apos;t receive it?{" "}
            {secondsLeft > 0 ? (
              <span className="font-bold text-slate-400">
                Resend in 00:{String(secondsLeft).padStart(2, "0")}
              </span>
            ) : (
              <button
                className="font-bold text-teal-700"
                onClick={() => {
                  setOtp("")
                  setError("")
                  setOtpExpired(false)
                  setSecondsLeft(45)
                }}
              >
                Resend code
              </button>
            )}
          </p>
        </div>
      </div>
    )
  if (screen === "signup")
    return (
      <div className="auth-card">
        <Header title="Create account" onBack={() => go("login")} />
        <div className="flex flex-1 flex-col px-7 pt-8">
          <p className="eyebrow">Join Homify</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            Let's get to know you
          </h2>
          <label className="form-label mt-8">
            Full name
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              className="form-input"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="form-label">
            Phone number
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                setError("")
              }}
              className="form-input"
              placeholder="98765 43210"
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
          <label className="form-label">
            Email address
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              className="form-input"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
          </label>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <button className="primary-btn mt-4" onClick={createAccount}>
            Create account <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  return (
    <div className="auth-card overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={serviceImage}
          alt="Home care professional cleaning a modern home"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />
        <div className="absolute bottom-5 left-6">
          <Logo />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-7 py-7">
        <p className="eyebrow">
          {mode === "provider" ? "Partner app" : "Welcome back"}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          {mode === "provider"
            ? "Sign in to take jobs."
            : "Your home deserves the best."}
        </h2>
        <label className="form-label mt-6">
          Phone number
          <div className="form-input flex items-center gap-3">
            <span className="border-r border-slate-200 pr-3 font-semibold">
              +91
            </span>
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                setError("")
              }}
              className="min-w-0 flex-1 outline-none"
              placeholder="Enter 10-digit mobile number"
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
        </label>
        {error && (
          <p className="error-message -mt-2" role="alert">
            {error}
          </p>
        )}
        <button className="primary-btn mt-2" onClick={continueLogin}>
          Continue <ArrowRight size={18} />
        </button>
        {mode === "customer" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-slate-400 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
              or
            </div>
            <button className="secondary-btn" onClick={() => go("signup")}>
              Create a new account
            </button>
            <button
              onClick={skip}
              className="mt-4 text-sm font-bold text-teal-700"
            >
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  )
}
