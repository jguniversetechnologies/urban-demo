"use client"

import { useState } from "react"
import AdminPanel from "@/features/admin/AdminPanel"
import AuthFlow from "@/features/auth/AuthFlow"
import SplashScreen from "@/features/auth/SplashScreen"
import {
  Booking,
  Detail,
  HomeScreen,
  LocationPage,
  Profile,
  Rating,
  RewardsPage,
  ServiceList,
  Tracking,
} from "@/features/customer"
import ProviderPanel from "@/features/provider/ProviderPanel"
import { findService, serviceCatalog } from "@/data/services"
import { DemoProvider, useDemo } from "@/state/DemoState"
import type { Mode, Screen, ServiceItem } from "@/types/navigation"

function AppShell() {
  const demo = useDemo()
  const [mode, setMode] = useState<Mode>("customer")
  const [screen, setScreen] = useState<Screen>("splash")
  const [pending, setPending] = useState<Screen | null>(null)
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [category, setCategory] = useState("Cleaning")
  const [selectedService, setSelectedService] = useState<ServiceItem>(
    serviceCatalog.Cleaning[0],
  )

  const switchMode = (nextMode: Mode) => {
    if (nextMode === mode) return
    setMode(nextMode)
    setPending(null)
    setScreen("login")
  }

  const openAfterEntry = () => {
    if (!demo.city) {
      setScreen("location")
      return
    }
    if (pending) {
      const next = pending
      setPending(null)
      setScreen(next)
      return
    }
    setScreen("home")
  }

  const finishAuth = (phone: string) => {
    if (mode === "provider") {
      setScreen("provider")
      return
    }
    demo.signInCustomer(phone)
    openAfterEntry()
  }

  const skip = () => {
    setPending(null)
    if (!demo.city) {
      setScreen("location")
      return
    }
    setScreen("home")
  }

  const guard = (next: Screen) => {
    const locked = next === "tracking" || next === "profile" || next === "booking"
    if (mode === "customer" && locked && !demo.customerAuthed) {
      setPending(next)
      setScreen("login")
      return
    }
    setScreen(next)
  }

  const openService = (nextCategory: string) => {
    setCategory(nextCategory)
    setScreen("services")
  }

  const openDetail = (service: ServiceItem, nextCategory = category) => {
    setCategory(nextCategory)
    setSelectedService(service)
    setScreen("detail")
  }

  const startBooking = () => {
    if (!demo.customerAuthed) {
      setPending("booking")
      setScreen("login")
      return
    }
    if (!demo.city) {
      setPending("booking")
      setScreen("location")
      return
    }
    setScreen("booking")
  }

  const bookAgain = (name: string) => {
    const match = findService(name)
    if (!match) {
      setScreen("services")
      return
    }
    openDetail(match, match.category)
  }

  if (mode === "admin") {
    return (
      <AdminPanel
        setMode={switchMode}
        authenticated={adminAuthenticated}
        onAuthenticate={() => setAdminAuthenticated(true)}
        onSignOut={() => setAdminAuthenticated(false)}
      />
    )
  }

  const renderScreen = () => {
    if (screen === "splash" && mode === "customer") {
      return <SplashScreen go={setScreen} />
    }

    if (screen === "login" || screen === "otp" || screen === "signup") {
      return (
        <AuthFlow
          screen={screen}
          mode={mode}
          go={setScreen}
          onVerified={finishAuth}
          onSkip={skip}
        />
      )
    }

    if (mode === "provider") {
      return <ProviderPanel screen={screen} go={setScreen} />
    }

    switch (screen) {
      case "location":
        return <LocationPage go={guard} onDone={openAfterEntry} />
      case "rewards":
        return <RewardsPage go={guard} />
      case "home":
        return (
          <HomeScreen
            go={guard}
            openService={openService}
            openDetail={openDetail}
          />
        )
      case "services":
        return (
          <ServiceList
            go={guard}
            category={category}
            setCategory={setCategory}
            selectService={openDetail}
          />
        )
      case "detail":
        return (
          <Detail
            go={guard}
            service={selectedService}
            category={category}
            onBook={startBooking}
          />
        )
      case "booking":
      case "payment":
      case "confirmed":
        return (
          <Booking
            screen={screen}
            go={guard}
            service={selectedService}
            category={category}
          />
        )
      case "tracking":
        return <Tracking go={guard} />
      case "rating":
        return <Rating go={guard} />
      default:
        return <Profile go={guard} onBookAgain={bookAgain} />
    }
  }

  return (
    <div className="app-stage">
      <div className="prototype-switcher" aria-label="Demo role selector">
        <button
          onClick={() => switchMode("customer")}
          className={mode === "customer" ? "active" : ""}
        >
          Customer
        </button>
        <button
          onClick={() => switchMode("provider")}
          className={mode === "provider" ? "active" : ""}
        >
          Provider
        </button>
        <button onClick={() => switchMode("admin")}>Admin</button>
      </div>
      <div className="phone-shell">{renderScreen()}</div>
    </div>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <AppShell />
    </DemoProvider>
  )
}
