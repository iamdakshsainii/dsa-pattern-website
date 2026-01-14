import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import AdminAcademicsClient from './admin-academics-client'

export const metadata = {
  title: 'Manage Academics'
}

export default async function AdminAcademicsPage() {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect('/dashboard')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📚 Manage Academic Resources</h1>
        <p className="text-gray-600 dark:text-gray-400">Add, edit, and organize academic resources by year and semester</p>
      </div>

      <AdminAcademicsClient />
    </div>
  )
}
