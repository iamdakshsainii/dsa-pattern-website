import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DSA Patterns - Master DSA Through Pattern Recognition",
  description: "Learn Data Structures & Algorithms through proven patterns. Built by students, for students. 100% free forever.",
  keywords: "DSA, Data Structures, Algorithms, LeetCode, Coding Interview, Pattern Recognition, Two Pointers, Sliding Window, Dynamic Programming",
  authors: [{ name: "Daskh Saini" }],
  creator: "Daskh Saini",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "DSA Patterns - Master DSA Through Pattern Recognition",
    description: "Learn Data Structures & Algorithms through proven patterns. 100% free forever.",
    siteName: "DSA Patterns",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Patterns - Master DSA Through Pattern Recognition",
    description: "Learn Data Structures & Algorithms through proven patterns. 100% free forever.",
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) return null

    const user = await verifyToken(token.value)
    return user
  } catch (error) {
    return null
  }
}

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar currentUser={currentUser} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
