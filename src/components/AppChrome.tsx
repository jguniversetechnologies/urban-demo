import type { ReactNode } from "react"
import { ArrowLeft, CalendarDays, Home, Store, UserRound } from "lucide-react"
import type { Screen } from "@/types/navigation"

export function Logo({
  compact = false,
  light = false,
}: {
  compact?: boolean
  light?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${
          compact ? "h-9 w-9" : "h-11 w-11"
        } grid place-items-center rounded-2xl shadow-lg shadow-teal-700/15 ${
          light ? "bg-white text-teal-700" : "bg-teal-600 text-white"
        }`}
      >
        <Home size={compact ? 19 : 22} strokeWidth={2.4} />
      </div>
      <div>
        <div
          className={`${
            compact ? "text-lg" : "text-xl"
          } font-extrabold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Homi<span className={light ? "text-teal-100" : "text-teal-600"}>fy</span>
        </div>
        {!compact && (
          <div
            className={`text-[9px] font-bold uppercase tracking-[.2em] ${
              light ? "text-teal-100" : "text-slate-400"
            }`}
          >
            Life, sorted.
          </div>
        )}
      </div>
    </div>
  )
}

export function Header({
  title,
  onBack,
  action,
}: {
  title: string
  onBack?: () => void
  action?: ReactNode
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5">
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
      ) : (
        <Logo compact />
      )}
      <h1 className={`font-bold text-slate-900 ${onBack ? "" : "sr-only"}`}>
        {title}
      </h1>
      {action || <div className="w-10" />}
    </header>
  )
}

export function BottomNav({
  active,
  go,
}: {
  active: string
  go: (s: Screen) => void
}) {
  const items = [
    ["home", Home, "Home"],
    ["services", Store, "Services"],
    ["tracking", CalendarDays, "Bookings"],
    ["profile", UserRound, "Profile"],
  ] as const
  return (
    <nav className="bottom-nav">
      {items.map(([screen, Icon, label]) => (
        <button
          key={screen}
          className={active === screen ? "active" : ""}
          onClick={() => go(screen)}
        >
          <Icon size={20} strokeWidth={active === screen ? 2.5 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
