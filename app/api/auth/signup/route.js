import { NextResponse } from "next/server"
import { createUser, getUser } from "@/lib/db"

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Check if user exists
    const existingUser = await getUser(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // In production, hash password with bcrypt
    // For now, storing plain text (NOT SECURE - just for demo)
    const result = await createUser({
      name,
      email,
      password, // Should be hashed in production!
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        email,
        name,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
