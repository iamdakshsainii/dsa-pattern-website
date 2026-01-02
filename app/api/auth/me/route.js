import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await verifyToken(token.value)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
