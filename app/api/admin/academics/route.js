import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import {
  getAcademicSubjects,
  createAcademicSubject,
  updateAcademicSubject,
  deleteAcademicSubject,
  addAcademicResource,
  deleteAcademicResource,
  getAcademicsAnalytics
} from '@/lib/db'

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const semester = searchParams.get('semester')
    const analytics = searchParams.get('analytics')

    if (analytics) {
      const stats = await getAcademicsAnalytics()
      return NextResponse.json(stats)
    }

    if (year && semester) {
      const subjects = await getAcademicSubjects(parseInt(year), parseInt(semester))
      return NextResponse.json({ subjects })
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  } catch (error) {
    console.error('Admin academics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch academics' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, year, semester, subject, data, resourceIndex, resource } = body

    if (action === 'create') {
      const result = await createAcademicSubject(data)
      return NextResponse.json(result)
    }

    if (action === 'update') {
      const result = await updateAcademicSubject(year, semester, subject, data)
      return NextResponse.json(result)
    }

    if (action === 'delete') {
      const result = await deleteAcademicSubject(year, semester, subject)
      return NextResponse.json(result)
    }

    if (action === 'addResource') {
      const result = await addAcademicResource(year, semester, subject, resource)
      return NextResponse.json(result)
    }

    if (action === 'deleteResource') {
      const result = await deleteAcademicResource(year, semester, subject, resourceIndex)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Admin academics POST error:', error)
    return NextResponse.json(
      { error: 'Failed to update academics' },
      { status: 500 }
    )
  }
}
