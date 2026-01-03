'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
