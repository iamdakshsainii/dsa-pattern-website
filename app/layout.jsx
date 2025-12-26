import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DSA Patterns",
  description: "Master DSA Through Pattern Recognition",
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
    <html lang="en">
      <body className={inter.className}>
        <Navbar currentUser={currentUser} />
        {children}
      </body>
    </html>
  )
}
