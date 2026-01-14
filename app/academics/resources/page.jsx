import { getAcademicSubjects } from '@/lib/db'
import SemesterDetailClient from './resources-client'
import Link from 'next/link'

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  const year = params.year || '1'
  const semester = params.semester || '1'
  return {
    title: `Year ${year} Semester ${semester} Resources`
  }
}

export default async function ResourcesPage({ searchParams }) {
  const params = await searchParams
  const year = parseInt(params.year || '1')
  const semester = parseInt(params.semester || '1')
  const selectedSubject = params.subject

  const subjects = await getAcademicSubjects(year, semester)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/academics" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
          ← Back to Academics
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Year {year} • Semester {semester}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Complete resources for your semester</p>
        </div>

        <SemesterDetailClient
          year={year}
          semester={semester}
          subjects={subjects}
          selectedSubjectParam={selectedSubject}
        />
      </div>
    </div>
  )
}
