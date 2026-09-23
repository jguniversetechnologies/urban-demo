import { Gift } from "lucide-react"
import { Header } from "@/components/AppChrome"
import { rewardOffers } from "@/data/market"
import { useDemo } from "@/state/DemoState"
import type { Screen } from "@/types/navigation"

export function RewardsPage({ go }: { go: (s: Screen) => void }) {
  const { rewardPoints } = useDemo()
  return (
    <div className="screen">
      <Header title="Rewards" onBack={() => go("home")} />
      <main className="flex-1 overflow-y-auto px-5 pb-8 pt-6">
        <div className="rounded-3xl bg-teal-700 p-6 text-white">
          <p className="text-xs text-teal-100">Reward points</p>
          <p className="mt-2 text-4xl font-extrabold">{rewardPoints}</p>
          <p className="mt-3 text-xs leading-5 text-teal-50">
            Points are for offers only. Wallet pay comes in a later release.
          </p>
        </div>
        <h2 className="section-title mt-7">Offers for you</h2>
        <div className="mt-4 space-y-3">
          {rewardOffers.map((offer) => (
            <div
              key={offer.title}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <Gift size={18} />
              </span>
              <div>
                <b className="text-sm">{offer.title}</b>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {offer.detail}
                </p>
                <p className="mt-2 text-[11px] font-bold text-teal-700">
                  {offer.points} points
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
