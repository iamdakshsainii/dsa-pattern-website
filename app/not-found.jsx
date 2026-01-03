import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full">
              Go Home
            </Button>
          </Link>
          <Link href="/patterns" className="block">
            <Button variant="outline" className="w-full">
              Browse Patterns
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
