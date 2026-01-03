import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-24 w-full" />
            </Card>
          ))}
        </div>

        {/* Progress Card Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-48 w-full" />
        </Card>

        {/* Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-64 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
