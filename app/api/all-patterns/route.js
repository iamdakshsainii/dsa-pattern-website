import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    // Get all patterns
    const patternsCollection = db.collection("patterns")
    const allPatterns = await patternsCollection.find({}).sort({ order: 1 }).toArray()

    // Get all questions
    const questionsCollection = db.collection("questions")
    const allQuestions = await questionsCollection.find({}).toArray()

    // Get user progress
    const progressCollection = db.collection("progress")
    const userProgress = await progressCollection.find({ userId: user.id }).toArray()

    console.log('Patterns found:', allPatterns.length)
    console.log('Questions found:', allQuestions.length)
    console.log('User progress items:', userProgress.length)

    // Calculate progress for each pattern
    const patternsWithProgress = allPatterns.map(pattern => {
      // Count questions for this pattern (try both pattern_id and pattern fields)
      const patternQuestions = allQuestions.filter(q =>
        q.pattern_id === pattern.slug || q.pattern === pattern.slug
      )

      const total = patternQuestions.length

      // Count completed questions for this pattern
      const completed = userProgress.filter(p => {
        if (!p.completed) return false

        // Check if this progress item matches any question in this pattern
        const matchingQuestion = patternQuestions.find(q =>
          q._id.toString() === p.questionId ||
          q._id.toString() === p.problemId
        )

        return !!matchingQuestion
      }).length

      // Ensure solved never exceeds total
      const solved = Math.min(completed, total)
      const percentage = total > 0 ? (solved / total) * 100 : 0

      return {
        slug: pattern.slug,
        name: pattern.name,
        total,
        solved,
        percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal
      }
    })

    // Filter out patterns with no questions
    const patternsWithQuestions = patternsWithProgress.filter(p => p.total > 0)

    console.log('Patterns with progress:', patternsWithQuestions)

    return NextResponse.json({
      success: true,
      patterns: patternsWithQuestions
    })
  } catch (error) {
    console.error("All patterns API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch patterns", details: error.message },
      { status: 500 }
    )
  }
}
