'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, RefreshCw, Eye } from 'lucide-react'
import Link from 'next/link'

export default function PatternCreateClient({ editId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    difficulty: '',
    icon: '',
    color: '#3B82F6'
  })

  useEffect(() => {
    if (editId) {
      fetchPattern(editId)
    }
  }, [editId])

  const fetchPattern = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/patterns/${id}`)
      const data = await res.json()

      if (data.pattern) {
        setFormData({
          name: data.pattern.name || '',
          slug: data.pattern.slug || '',
          description: data.pattern.description || '',
          difficulty: data.pattern.difficulty || '',
          icon: data.pattern.icon || '',
          color: data.pattern.color || '#3B82F6'
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pattern",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.name || !formData.slug) {
        toast({
          title: "Validation Error",
          description: "Name and slug are required",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      const res = await fetch('/api/admin/patterns', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _id: editId
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save')
      }

      toast({
        title: "Success",
        description: `Pattern ${editId ? 'updated' : 'created'} successfully`
      })

      router.push('/admin/patterns')
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && editId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/patterns">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              {editId ? 'Edit Pattern' : 'Create Pattern'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {editId ? 'Update pattern details' : 'Add a new coding pattern'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Form */}
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label>Pattern Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Two Pointers"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="two-pointers"
                  required
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from name (editable)
                </p>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this pattern..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Difficulty Level</Label>
                  <Input
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    placeholder="e.g., Beginner, Intermediate"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Icon Emoji</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="e.g., 🎯"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Color (Hex)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4" />
              <Label className="text-base font-semibold">Preview</Label>
            </div>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                {formData.icon && <span className="text-2xl">{formData.icon}</span>}
                <h3 className="font-semibold text-lg">{formData.name || 'Pattern Name'}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {formData.description || 'No description provided'}
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-muted">
                  Slug: {formData.slug || 'auto-generated'}
                </span>
                {formData.difficulty && (
                  <span className="px-2 py-1 rounded bg-muted">
                    {formData.difficulty}
                  </span>
                )}
                <span
                  className="px-2 py-1 rounded text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  Color Preview
                </span>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <Card className="p-6">
            <div className="flex justify-end gap-3">
              <Link href="/admin/patterns">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editId ? 'Update Pattern' : 'Create Pattern'}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}
