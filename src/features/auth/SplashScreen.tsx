import { ArrowRight } from "lucide-react"
import { Logo } from "@/components/AppChrome"
import type { Screen } from "@/types/navigation"

export default function SplashScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="screen splash-screen justify-between overflow-hidden px-8 pb-10 pt-12">
      <div className="pointer-events-none absolute -right-16 top-24 h-48 w-48 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -left-20 bottom-24 h-56 w-56 rounded-full bg-teal-300/10" />
      <p className="relative text-[10px] font-bold uppercase tracking-[.22em] text-teal-100">
        Customer app
      </p>
      <div className="relative flex flex-col items-center text-center">
        <Logo light />
        <h1 className="mt-8 text-[32px] font-extrabold leading-tight tracking-tight text-white">
          Home services,
          <br />
          booked in minutes.
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-6 text-teal-50">
          Cleaning, repairs, beauty, AC, pest control, electricians and
          plumbers. Verified professionals at your door.
        </p>
      </div>
      <button
        className="relative flex h-[52px] w-full items-center justify-center gap-2 rounded-[13px] bg-white text-sm font-bold text-teal-800 shadow-lg"
        onClick={() => go("login")}
      >
        Get started <ArrowRight size={18} />
      </button>
    </div>
  )
}
