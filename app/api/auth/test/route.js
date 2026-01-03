import { NextResponse } from "next/server"

export async function GET() {
  console.log("TEST API CALLED - THIS SHOULD APPEAR IN TERMINAL")
  return NextResponse.json({ message: "Test successful!" })
}
