"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, CheckCircle, Sparkles, TrendingUp } from "lucide-react"

export default function TechStackClient({
  techStacks,
  currentChoice,
  currentChoiceProgress,
  userId
}) {
  const router = useRouter()
  const [selectedStack, setSelectedStack] = useState(null)
  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelectStack = async (stackSlug) => {
    if (currentChoice && currentChoice !== stackSlug && currentChoiceProgress > 0) {
      setSelectedStack(stackSlug)
      setShowSwitchDialog(true)
      return
    }

    await saveChoice(stackSlug)
  }

  const saveChoice = async (stackSlug) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/roadmaps/masters/tech-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          masterId: "4-year-cs-journey",
          techStackSlug: stackSlug
        })
      })

      if (res.ok) {
        router.push(`/roadmaps/${stackSlug}`)
      } else {
        throw new Error('Failed to save choice')
      }
    } catch (error) {
      console.error('Error saving tech stack choice:', error)
      alert('Failed to save your choice. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmSwitch = async () => {
    setShowSwitchDialog(false)
    await saveChoice(selectedStack)
  }

  const getStackIcon = (slug) => {
    const icons = {
      'web-development': '🌐',
      'machine-learning': '🤖',
      'mobile-development': '📱',
      'devops': '☁️',
      'cybersecurity': '🔒'
    }
    return icons[slug] || '🎯'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/roadmaps/masters/4-year-cs-journey')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journey
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Choose Your Tech Stack
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select ONE specialization to master in Year 3. This will be your primary focus area.
          </p>
        </div>

        {currentChoice && (
          <Card className="mb-8 border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getStackIcon(currentChoice)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">Current Choice</h3>
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {techStacks.find(s => s.slug === currentChoice)?.title || currentChoice}
                    </p>
                    {currentChoiceProgress > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress value={currentChoiceProgress} className="h-2 flex-1" />
                          <span className="text-xs font-medium">{currentChoiceProgress}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => router.push(`/roadmaps/${currentChoice}`)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStacks.map((stack, idx) => {
            const isSelected = currentChoice === stack.slug
            const icon = getStackIcon(stack.slug)

            return (
              <Card
                key={stack.slug}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  isSelected
                    ? 'border-4 border-green-500 shadow-2xl'
                    : 'border-2 border-transparent hover:border-purple-300'
                }`}
                onClick={() => !isSubmitting && handleSelectStack(stack.slug)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-green-600 text-white shadow-lg">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <CardHeader className="text-center pb-4">
                  <div className="relative inline-block mx-auto mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative text-6xl bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl">
                      {icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black">
                    {stack.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-6 min-h-[60px]">
                    {stack.description || `Master ${stack.title} and become an expert in this domain.`}
                  </p>

                  <div className="space-y-2 mb-6">
                    {stack.topics && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>{stack.topics.length || 20}+ Topics</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className={`w-full ${
                      isSelected
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSelected ? 'Go to Roadmap' : 'Select This Stack'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {techStacks.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No tech stacks available yet. Please contact admin.
            </p>
          </Card>
        )}
      </div>

      <AlertDialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch Tech Stack?</AlertDialogTitle>
            <AlertDialogDescription>
              You're currently {currentChoiceProgress}% done with your current tech stack.
              Switching will change your focus but won't delete your progress.
              <br /><br />
              Are you sure you want to switch?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Finish Current</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSwitch}>
              Switch Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
