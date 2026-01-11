'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, X, Send, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function FeedbackButton({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState('bug')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  if (!currentUser) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/admin/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: title.trim(),
          description: description.trim(),
          page: pathname
        })
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        setTitle('')
        setDescription('')
        setType('bug')
      }, 3000)

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Send feedback"
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-1">
                  We've received your feedback.
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll respond within 24 hours. Check your dashboard for updates.
                </p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Send Feedback</h2>
                    <p className="text-sm text-muted-foreground">
                      Report bugs or suggest improvements
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <Label>Type</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['bug', 'suggestion', 'feedback'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            type === t
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief description of the issue"
                      className="mt-2"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide detailed information..."
                      rows={6}
                      className="mt-2"
                      maxLength={1000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {description.length}/1000 characters
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      <strong>Current page:</strong> {pathname}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
