"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import RoadmapTable from "./roadmap-table"
import CreateRoadmapDialog from "./create-roadmap-dialog"

export default function RoadmapListClient() {
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  async function fetchRoadmaps() {
    try {
      const res = await fetch("/api/admin/roadmaps")
      const data = await res.json()
      setRoadmaps(data.roadmaps || [])
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRoadmaps = roadmaps.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                         r.slug.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" ||
                         (filter === "published" && r.published) ||
                         (filter === "draft" && !r.published)
    return matchesSearch && matchesFilter
  })

 return (
  <div className="min-h-screen pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Roadmap Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage all roadmaps and their content</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Roadmap
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="flex-1 sm:flex-initial"
            >
              All
            </Button>
            <Button
              variant={filter === "published" ? "default" : "outline"}
              onClick={() => setFilter("published")}
              className="flex-1 sm:flex-initial"
            >
              Published
            </Button>
            <Button
              variant={filter === "draft" ? "default" : "outline"}
              onClick={() => setFilter("draft")}
              className="flex-1 sm:flex-initial"
            >
              Draft
            </Button>
          </div>
        </div>

        <RoadmapTable
          roadmaps={filteredRoadmaps}
          loading={loading}
          onRefresh={fetchRoadmaps}
        />
      </Card>

      <CreateRoadmapDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchRoadmaps}
      />
    </div>
  </div>
)}
