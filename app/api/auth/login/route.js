import { NextResponse } from "next/server"
import { getUser } from "@/lib/db"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (email === "test@example.com" && password === "test123") {
      // Create auth token (simple version - in production use JWT)
      const token = Buffer.from(JSON.stringify({ userId: "test-user-id", email })).toString("base64")

      const response = NextResponse.json({
        success: true,
        user: {
          id: "test-user-id",
          email,
          name: "Test User",
        },
      })

      // Set cookie
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return response
    }

    // Find user
    const user = await getUser(email)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create auth token
    const token = Buffer.from(JSON.stringify({ userId: user._id.toString(), email })).toString("base64")

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    })

    // Set cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
