import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserMasterProgress, updateAcademicInfo } from '@/lib/db'

const MASTER_ID = '4-year-cs-journey'

export async function GET(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ active: false })
    }

    const progress = await getUserMasterProgress(user.id, MASTER_ID)

    if (!progress?.academicInfo?.examDates || progress.academicInfo.examDates.length === 0) {
      return NextResponse.json({ active: false })
    }

    const now = new Date()
    const exams = progress.academicInfo.examDates
      .map(exam => ({
        ...exam,
        daysRemaining: Math.ceil((new Date(exam.date) - now) / (1000 * 60 * 60 * 24))
      }))
      .filter(exam => exam.daysRemaining > 0 && exam.daysRemaining <= 14)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)

    if (exams.length === 0) {
      return NextResponse.json({ active: false })
    }

    return NextResponse.json({
      active: true,
      nearestExam: {
        examName: exams[0].name,
        examDate: exams[0].date,
        daysRemaining: exams[0].daysRemaining,
        hideProjects: exams[0].hideProjects || false
      },
      allExams: exams
    })
  } catch (error) {
    console.error('Exam API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exam data' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, examName, examDate, hideProjects } = body

    const progress = await getUserMasterProgress(user.id, MASTER_ID)

    if (!progress) {
      return NextResponse.json({ error: 'Master roadmap not started' }, { status: 400 })
    }

    const academicInfo = progress.academicInfo || { college: null, currentSemester: null, examDates: [] }

    if (action === 'add') {
      academicInfo.examDates = [
        ...academicInfo.examDates,
        {
          name: examName,
          date: new Date(examDate),
          hideProjects: hideProjects || false,
          createdAt: new Date()
        }
      ]
    }

    if (action === 'delete') {
      academicInfo.examDates = academicInfo.examDates.filter(e => e.name !== examName)
    }

    const result = await updateAcademicInfo(user.id, MASTER_ID, academicInfo)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Exam POST error:', error)
    return NextResponse.json(
      { error: 'Failed to update exam data' },
      { status: 500 }
    )
  }
}
