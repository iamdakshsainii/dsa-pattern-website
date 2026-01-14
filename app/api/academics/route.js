import { NextResponse } from 'next/server'
import {
  getAcademicYears,
  getAcademicSemesters,
  getAcademicSubjects,
  searchAcademicResources
} from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const semester = searchParams.get('semester')
    const query = searchParams.get('query')

    if (query) {
      const results = await searchAcademicResources(query)
      return NextResponse.json({ results })
    }

    if (year && semester) {
      const subjects = await getAcademicSubjects(parseInt(year), parseInt(semester))
      return NextResponse.json({ subjects })
    }

    if (year) {
      const semesters = await getAcademicSemesters(parseInt(year))
      return NextResponse.json({ semesters })
    }

    const years = await getAcademicYears()
    return NextResponse.json({ years })
  } catch (error) {
    console.error('Academics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch academics' },
      { status: 500 }
    )
  }
}
