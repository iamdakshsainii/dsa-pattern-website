import { getAcademicSubjects } from '@/lib/db';
import SemesterDetailClient from './semester-detail-client';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { year, semester } = await params;

  return {
    title: `Year ${year} Semester ${semester} Resources`,
  };
}

export default async function SemesterDetailPage({ params, searchParams }) {
  const { year, semester } = await params;
  const { subject } = await searchParams;

  const parsedYear = parseInt(year, 10);
  const parsedSemester = parseInt(semester, 10);

  const subjects = await getAcademicSubjects(parsedYear, parsedSemester);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <Link
          href="/academics"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back to Academics
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Year {parsedYear} • Semester {parsedSemester}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete resources for your semester
          </p>
        </div>

        <SemesterDetailClient
          year={parsedYear}
          semester={parsedSemester}
          subjects={subjects}
          selectedSubjectParam={subject}
        />
      </div>
    </div>
  );
}
