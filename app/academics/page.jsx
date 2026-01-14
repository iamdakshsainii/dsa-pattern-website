import { getAcademicYears } from '@/lib/db'
import AcademicsClient from './academics-client'

export const metadata = {
  title: 'Academic Resources'
}

export default async function AcademicsPage() {
  const years = await getAcademicYears()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AcademicsClient initialYears={years} />
    </div>
  )
}
