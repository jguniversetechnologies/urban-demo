import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Providers } from "@/components/Providers"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Homify",
  description:
    "Connects customers with local home service providers for cleaning, repairs, and beauty treatments.",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
