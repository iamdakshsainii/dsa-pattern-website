import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRoadmap, getRoadmapNodes } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ManageNodesPage({ params }) {
  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    notFound()
  }

  const nodes = await getRoadmapNodes(slug)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{roadmap.title} - Nodes</h1>
          <p className="text-muted-foreground">Manage weeks and subtopics</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/roadmaps/${slug}/nodes/create`}>
            <Button>Add Node</Button>
          </Link>
          <Link href="/admin/roadmaps/import">
            <Button variant="outline">Bulk Import</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {nodes.map((node) => (
          <Card key={node.nodeId}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Week {node.weekNumber}: {node.title}</span>
                <Link href={`/admin/roadmaps/${slug}/nodes/${node.nodeId}/edit`}>
                  <Button size="sm">Edit</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{node.description}</p>
              <p className="text-xs">Subtopics: {node.subtopics?.length || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
