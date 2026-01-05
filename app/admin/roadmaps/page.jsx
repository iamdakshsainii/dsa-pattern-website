import Link from "next/link"
import { getAllRoadmapsAdmin } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

export default async function AdminRoadmapsPage() {
  const roadmaps = await getAllRoadmapsAdmin()

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Roadmaps</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage learning roadmaps
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/roadmaps/import">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Import JSON
            </Button>
          </Link>
          <Link href="/admin/roadmaps/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Roadmap
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {roadmaps.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No roadmaps yet</p>
            <Link href="/admin/roadmaps/create">
              <Button>Create Your First Roadmap</Button>
            </Link>
          </Card>
        ) : (
          roadmaps.map((roadmap) => (
            <Card key={roadmap._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-4xl">{roadmap.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{roadmap.title}</h3>
                      <Badge variant={roadmap.published ? "default" : "secondary"}>
                        {roadmap.published ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{roadmap.category}</Badge>
                      <Badge variant="outline">{roadmap.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {roadmap.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Slug: {roadmap.slug} • {roadmap.estimatedWeeks} weeks
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/roadmaps/${roadmap.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/roadmaps/${roadmap.slug}/nodes`}>
                    <Button variant="outline" size="sm">
                      Manage Nodes
                    </Button>
                  </Link>
                  <Link href={`/admin/roadmaps/${roadmap.slug}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
