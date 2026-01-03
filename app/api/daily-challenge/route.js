import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPatterns, getQuestionsByPattern } from "@/lib/db"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all patterns
    const patterns = await getPatterns()
    if (!patterns || patterns.length === 0) {
      return NextResponse.json({ error: "No patterns found" }, { status: 404 })
    }

    // Get all questions from all patterns
    let allQuestions = []
    for (const pattern of patterns) {
      const questions = await getQuestionsByPattern(pattern.slug)
      allQuestions.push(...questions.map(q => ({ ...q, pattern: pattern.slug })))
    }

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: "No questions found" }, { status: 404 })
    }

    // Use current date as seed for deterministic daily selection
    const today = new Date()
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Select question based on seed (same question for all users on the same day)
    const questionIndex = seed % allQuestions.length
    const challenge = allQuestions[questionIndex]

    return NextResponse.json({
      success: true,
      challenge,
      date: dateString
    })
  } catch (error) {
    console.error("Daily challenge error:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    )
  }
}
