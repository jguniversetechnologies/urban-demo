export type Mode = "customer" | "provider" | "admin"

export type Screen =
  | "splash"
  | "location"
  | "rewards"
  | "login"
  | "otp"
  | "signup"
  | "home"
  | "services"
  | "detail"
  | "booking"
  | "payment"
  | "confirmed"
  | "tracking"
  | "rating"
  | "profile"
  | "provider"
  | "requests"
  | "active"
  | "earnings"
  | "kyc"

export type ServiceItem = {
  name: string
  rating: string
  time: string
  price: string
  description: string
}
