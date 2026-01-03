'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Target } from 'lucide-react'
import Link from 'next/link'

export default function CompanyTrackerCard({ companies }) {
  if (!companies || companies.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No company progress yet</p>
          <p className="text-xs text-gray-400">
            Start solving problems tagged with companies
          </p>
        </div>
      </Card>
    )
  }

  // Sort by solved count
  const sortedCompanies = [...companies].sort((a, b) => b.solved - a.solved)
  const topCompanies = sortedCompanies.slice(0, 5)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Company Progress</h3>
        </div>
        <Link href="/companies">
          <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
            View All →
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {topCompanies.map((company, index) => {
          const percentage = company.total > 0
            ? Math.round((company.solved / company.total) * 100)
            : 0

          return (
            <div
              key={company.name}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                  <span className="font-semibold">{company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {company.solved}/{company.total}
                  </Badge>
                  <span className={`text-sm font-bold ${
                    percentage === 100 ? 'text-green-600' :
                    percentage >= 50 ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {percentage}%
                  </span>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}
      </div>

      {companies.length > 5 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing top 5 of {companies.length} companies
        </p>
      )}
    </Card>
  )
}
