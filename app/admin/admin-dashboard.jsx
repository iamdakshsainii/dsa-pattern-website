'use client'

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, MapPin, Bug, BarChart3, FileText } from "lucide-react"
import AdminStats from "./admin-stats"
import RoadmapManager from "./roadmap-manager"
import NodeManager from "./node-manager"
import BugReports from "./bug-reports"

export default function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState("stats")

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-red-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-sm text-red-100 mt-1">
            Logged in as: {currentUser.email}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="roadmaps" className="gap-2">
              <MapPin className="h-4 w-4" />
              Roadmaps
            </TabsTrigger>
            <TabsTrigger value="nodes" className="gap-2">
              <FileText className="h-4 w-4" />
              Nodes
            </TabsTrigger>
            <TabsTrigger value="bugs" className="gap-2">
              <Bug className="h-4 w-4" />
              Bug Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>

          <TabsContent value="roadmaps">
            <RoadmapManager />
          </TabsContent>

          <TabsContent value="nodes">
            <NodeManager />
          </TabsContent>

          <TabsContent value="bugs">
            <BugReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
