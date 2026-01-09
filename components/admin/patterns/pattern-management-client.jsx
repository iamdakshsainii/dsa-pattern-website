'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, RefreshCw, AlertCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'

export default function PatternManagementClient() {
  const [patterns, setPatterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchPatterns()
  }, [])

  const fetchPatterns = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/patterns')
      const data = await res.json()
      setPatterns(data.patterns || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load patterns",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (patternId, questionCount) => {
    if (questionCount > 0) {
      toast({
        title: "Cannot Delete",
        description: `This pattern has ${questionCount} questions. Delete questions first.`,
        variant: "destructive"
      })
      return
    }

    if (!confirm('Are you sure you want to delete this pattern?')) return

    try {
      const res = await fetch('/api/admin/patterns', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patternId })
      })

      if (!res.ok) throw new Error('Delete failed')

      toast({
        title: "Success",
        description: "Pattern deleted successfully"
      })
      fetchPatterns()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pattern",
        variant: "destructive"
      })
    }
  }

  const filteredPatterns = patterns.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Pattern Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage {patterns.length} coding patterns
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchPatterns} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/admin/patterns/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Pattern
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patterns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </Card>

        {/* Results */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredPatterns.length} of {patterns.length} patterns
        </div>

        {/* Patterns List */}
        {loading ? (
          <Card className="p-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading patterns...</p>
            </div>
          </Card>
        ) : filteredPatterns.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No patterns found</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatterns.map((pattern) => (
              <Card key={pattern._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{pattern.name}</h3>
                      <Badge variant="outline">
                        {pattern.questionCount || 0} questions
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pattern.description || 'No description'}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Slug: <code className="bg-muted px-1 py-0.5 rounded">{pattern.slug}</code></p>
                    {pattern.difficulty && <p>Difficulty: {pattern.difficulty}</p>}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Link href={`/admin/patterns/edit/${pattern._id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(pattern._id, pattern.questionCount)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
