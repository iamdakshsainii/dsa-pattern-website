import { NextResponse } from "next/server"

export async function GET() {
  // Log at the very start
  console.log("========================================")
  console.log("STATS API - START")
  console.log("========================================")

  try {
    // Import getCurrentUser
    console.log("Step 1: Importing getCurrentUser...")
    const { getCurrentUser } = await import("@/lib/auth")
    console.log("✓ getCurrentUser imported")

    // Get current user
    console.log("Step 2: Getting current user...")
    const currentUser = await getCurrentUser()
    console.log("Current user result:", JSON.stringify(currentUser))

    if (!currentUser) {
      console.log("✗ No user - returning 401")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = currentUser.id
    console.log("✓ User ID:", userId)

    // Return dummy data for now
    console.log("Step 3: Returning dummy data...")
    const response = {
      stats: {
        totalQuestions: 100,
        completedCount: 10,
        solved: 10,
        bookmarks: 5
      },
      streak: {
        currentStreak: 3,
        longestStreak: 7
      },
      patternBreakdown: [
        { patternName: "Two Pointers", completed: 2, total: 10, percentage: 20 },
        { patternName: "Sliding Window", completed: 3, total: 8, percentage: 37 }
      ],
      recentActivity: [],
      heatmap: {}
    }

    console.log("✓ Returning response")
    console.log("========================================")
    return NextResponse.json(response)

  } catch (error) {
    console.error("========================================")
    console.error("FATAL ERROR IN STATS API")
    console.error("Error name:", error.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.error("========================================")

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
