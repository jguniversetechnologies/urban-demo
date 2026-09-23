import { serviceCatalog } from "@/data/services"

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function categoryPath(category: string) {
  return `/services/${slugify(category)}`
}

export function servicePath(category: string, name: string) {
  return `${categoryPath(category)}/${slugify(name)}`
}

export function categoryFromSlug(slug: string) {
  return Object.keys(serviceCatalog).find((name) => slugify(name) === slug)
}

export function serviceFromSlugs(categorySlug: string, serviceSlug: string) {
  const category = categoryFromSlug(categorySlug)
  if (!category) return null
  const service = serviceCatalog[category]?.find(
    (item) => slugify(item.name) === serviceSlug,
  )
  if (!service) return null
  return { ...service, category }
}

const profilePanels: Record<string, string> = {
  "Booking history": "/profile/history",
  "Saved addresses": "/profile/addresses",
  "Payment methods": "/profile/payments",
  "Help & support": "/profile/help",
}

export function profilePath(panel: string) {
  return profilePanels[panel] ?? "/profile"
}

export function panelFromPath(pathname: string) {
  const match = Object.entries(profilePanels).find(([, href]) => href === pathname)
  return match?.[0] ?? ""
}

const adminPages: Record<string, string> = {
  Dashboard: "/admin",
  Providers: "/admin/providers",
  Services: "/admin/services",
  Bookings: "/admin/bookings",
  Commission: "/admin/commission",
}

export function adminPath(page: string) {
  return adminPages[page] ?? "/admin"
}

export function adminPageFromPath(pathname: string) {
  const match = Object.entries(adminPages).find(([, href]) => href === pathname)
  return match?.[0] ?? "Dashboard"
}
