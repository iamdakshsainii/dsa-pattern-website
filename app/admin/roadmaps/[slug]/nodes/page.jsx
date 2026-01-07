import { notFound } from "next/navigation"
import { getRoadmap, getAllRoadmapNodesAdmin } from "@/lib/db"
import NodesPageClient from "./nodes-page-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ManageNodesPage({ params }) {
  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    notFound()
  }

  const nodes = await getAllRoadmapNodesAdmin(slug)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Link href={`/admin/roadmaps/${slug}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>
      <NodesPageClient roadmap={roadmap} initialNodes={nodes} />
    </div>
  )
}
