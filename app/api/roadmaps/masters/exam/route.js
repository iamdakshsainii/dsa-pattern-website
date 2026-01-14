import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserMasterProgress, updateAcademicInfo } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const masterId = searchParams.get('masterId')

    if (!userId || !masterId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const progress = await getUserMasterProgress(userId, masterId)

    if (!progress || !progress.academicInfo?.examDates?.length) {
      return NextResponse.json({ active: false, nearestExam: null, allExams: [] })
    }

    const now = new Date()
    const upcomingExams = progress.academicInfo.examDates
      .filter(exam => new Date(exam.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    if (upcomingExams.length === 0) {
      return NextResponse.json({ active: false, nearestExam: null, allExams: [] })
    }

    const nearestExam = upcomingExams[0]
    const daysRemaining = Math.ceil((new Date(nearestExam.date) - now) / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      active: daysRemaining <= 14,
      nearestExam: {
        examName: nearestExam.name,
        examDate: nearestExam.date,
        hideProjects: nearestExam.hideProjects
      },
      allExams: upcomingExams
    })
  } catch (error) {
    console.error('Exam GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch exam data' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { masterId, examName, examDate, hideProjects } = body

    if (!masterId || !examName || !examDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const progress = await getUserMasterProgress(user.id, masterId)

    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }

    const examDates = progress.academicInfo?.examDates || []
    examDates.push({
      name: examName,
      date: new Date(examDate),
      hideProjects: hideProjects || false
    })

    const result = await updateAcademicInfo(user.id, masterId, {
      ...progress.academicInfo,
      examDates
    })

    return NextResponse.json({ success: true, examDates })
  } catch (error) {
    console.error('Exam POST error:', error)
    return NextResponse.json({ error: 'Failed to add exam' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const masterId = searchParams.get('masterId')
    const examIndex = parseInt(searchParams.get('index'))

    if (!masterId || isNaN(examIndex)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const progress = await getUserMasterProgress(user.id, masterId)

    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }

    const examDates = progress.academicInfo?.examDates || []
    examDates.splice(examIndex, 1)

    await updateAcademicInfo(user.id, masterId, {
      ...progress.academicInfo,
      examDates
    })

    return NextResponse.json({ success: true, examDates })
  } catch (error) {
    console.error('Exam DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 })
  }
}
