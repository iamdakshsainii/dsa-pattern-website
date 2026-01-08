"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Database, BookOpen } from "lucide-react"

export default function CreateQuizDialog({ open, onOpenChange, onSuccess }) {
  const router = useRouter()

  function handleCreatePool() {
    router.push('/admin/quiz-manager/pool/create')
    onOpenChange(false)
  }

  function handleCreateRoadmap() {
    router.push('/admin/roadmaps')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Quiz Set</DialogTitle>
          <DialogDescription>
            Choose where to create your quiz set
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={handleCreatePool}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Pool Only</h3>
                <p className="text-sm text-muted-foreground">
                  Create standalone quiz set in pool
                </p>
              </div>
              <Button className="w-full" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create in Pool
              </Button>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={handleCreateRoadmap}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">For Roadmap</h3>
                <p className="text-sm text-muted-foreground">
                  Create quiz set in specific roadmap
                </p>
              </div>
              <Button className="w-full" size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Go to Roadmaps
              </Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
