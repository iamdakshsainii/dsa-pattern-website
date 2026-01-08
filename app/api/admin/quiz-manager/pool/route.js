import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roadmapFilter = searchParams.get('roadmap')
    const difficultyFilter = searchParams.get('difficulty')
    const topicFilter = searchParams.get('topic')
    const sourceFilter = searchParams.get('source')

    const { db } = await connectToDatabase()

    const query = {}
    if (roadmapFilter && roadmapFilter !== 'all') {
      query.roadmapId = roadmapFilter
    }

    if (sourceFilter === 'pool') {
      query.roadmapId = null
    } else if (sourceFilter === 'roadmap') {
      query.roadmapId = { $ne: null }
    }

    const quizSets = await db.collection("quiz_bank")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const roadmaps = await db.collection("roadmaps")
      .find({})
      .project({ _id: 1, slug: 1, title: 1, icon: 1 })
      .toArray()

    const roadmapMap = {}
    roadmaps.forEach(r => {
      roadmapMap[r.slug] = r
    })

    const allQuestions = []

    quizSets.forEach(set => {
      if (set.questions && Array.isArray(set.questions)) {
        set.questions.forEach(q => {
          if (difficultyFilter && difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) {
            return
          }

          if (topicFilter && topicFilter !== 'all' && q.topic !== topicFilter) {
            return
          }

          allQuestions.push({
            ...q,
            setId: set.quizId,
            setName: set.quizName,
            roadmapId: set.roadmapId,
            roadmap: roadmapMap[set.roadmapId] ? {
              slug: roadmapMap[set.roadmapId].slug,
              title: roadmapMap[set.roadmapId].title,
              icon: roadmapMap[set.roadmapId].icon
            } : null
          })
        })
      }
    })

    const groupedBySets = {}
    allQuestions.forEach(q => {
      if (!groupedBySets[q.setId]) {
        groupedBySets[q.setId] = {
          setId: q.setId,
          setName: q.setName,
          roadmapId: q.roadmapId,
          roadmap: q.roadmap,
          questions: []
        }
      }
      groupedBySets[q.setId].questions.push(q)
    })

    const uniqueTopics = [...new Set(allQuestions.map(q => q.topic).filter(Boolean))]

    return NextResponse.json({
      questions: allQuestions,
      sets: Object.values(groupedBySets),
      topics: uniqueTopics,
      totalQuestions: allQuestions.length,
      totalSets: Object.keys(groupedBySets).length
    })
  } catch (error) {
    console.error("Error fetching quiz pool:", error)
    return NextResponse.json({ error: "Failed to fetch quiz pool" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { quizName, questions, roadmapId } = await request.json()

    const { db } = await connectToDatabase()

    const newQuiz = {
      quizId: `pool_${Date.now()}`,
      quizName,
      questions: questions.map(q => ({
        ...q,
        id: q.id || Date.now().toString()
      })),
      roadmapId: roadmapId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection("quiz_bank").insertOne(newQuiz)

    return NextResponse.json({ success: true, quizId: newQuiz.quizId })
  } catch (error) {
    console.error("Error creating pool quiz:", error)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
