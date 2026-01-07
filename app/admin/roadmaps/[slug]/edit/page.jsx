import { notFound } from "next/navigation"
import { getRoadmap } from "@/lib/db"
import RoadmapForm from "@/components/admin/roadmap-form"

export default async function EditRoadmapPage({ params }) {
  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <RoadmapForm roadmap={roadmap} />
    </div>
  )
}
