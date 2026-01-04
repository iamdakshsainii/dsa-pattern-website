
import { NextResponse } from "next/server"
import { getUser, createUser } from "@/lib/db"
import { hashPassword, createToken, isValidEmail, validatePassword } from "@/lib/auth"

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUser(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await createUser({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    })

    const userId = result.insertedId.toString()

    // Create JWT token
    const token = createToken({
      userId,
      email,
      name,
    })

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: userId,
          email,
          name,
        },
        token,
      },
      { status: 201 }
    )

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "An error occurred during signup. Please try again." },
      { status: 500 }
    )
  }
}
