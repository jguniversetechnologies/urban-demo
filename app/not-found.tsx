"use client"

import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="screen items-center justify-center px-8 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
        This page is not available
      </h1>
      <button className="primary-btn mt-6 w-full" onClick={() => router.push("/home")}>
        Back to home
      </button>
    </div>
  )
}
