"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type PendingJob = {
  name: string
  amount: string
  distance: string
  time: string
}

type ProviderValue = {
  online: boolean
  setOnline: (online: boolean) => void
  startCode: string
  setStartCode: (code: string) => void
  startError: string
  setStartError: (error: string) => void
  pendingJobs: PendingJob[]
  rejectJob: (name: string) => void
  jobStatus: "accepted" | "way" | "started" | "completed"
  setJobStatus: (status: "accepted" | "way" | "started" | "completed") => void
  documents: Record<string, string>
  setDocument: (name: string, fileName: string) => void
}

const STORAGE_KEY = "homify-provider"

const initialJobs: PendingJob[] = [
  {
    name: "Home deep cleaning",
    amount: "₹1,299",
    distance: "1.2 km",
    time: "10:00 AM",
  },
  {
    name: "Kitchen cleaning",
    amount: "₹699",
    distance: "2.2 km",
    time: "11:00 AM",
  },
  {
    name: "Bathroom cleaning",
    amount: "₹449",
    distance: "3.2 km",
    time: "12:00 PM",
  },
]

type Persisted = {
  online: boolean
  pendingJobs: PendingJob[]
  jobStatus: ProviderValue["jobStatus"]
  documents: Record<string, string>
}

const initialPersisted: Persisted = {
  online: true,
  pendingJobs: initialJobs,
  jobStatus: "accepted",
  documents: { "Government ID": "aadhaar-card.pdf" },
}

const ProviderContext = createContext<ProviderValue | null>(null)

export function ProviderStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(initialPersisted)
  const [startCode, setStartCode] = useState("")
  const [startError, setStartError] = useState("")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>
        setData({ ...initialPersisted, ...parsed })
      }
    } catch {
      /* keep defaults */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data, ready])

  const value = useMemo<ProviderValue>(
    () => ({
      online: data.online,
      setOnline: (online) => setData((current) => ({ ...current, online })),
      startCode,
      setStartCode,
      startError,
      setStartError,
      pendingJobs: data.pendingJobs,
      rejectJob: (name) =>
        setData((current) => ({
          ...current,
          pendingJobs: current.pendingJobs.filter((item) => item.name !== name),
        })),
      jobStatus: data.jobStatus,
      setJobStatus: (jobStatus) => setData((current) => ({ ...current, jobStatus })),
      documents: data.documents,
      setDocument: (name, fileName) =>
        setData((current) => ({
          ...current,
          documents: { ...current.documents, [name]: fileName },
        })),
    }),
    [data, startCode, startError],
  )

  return (
    <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>
  )
}

export function useProviderState() {
  const value = useContext(ProviderContext)
  if (!value) throw new Error("useProviderState must be used inside ProviderStateProvider")
  return value
}
