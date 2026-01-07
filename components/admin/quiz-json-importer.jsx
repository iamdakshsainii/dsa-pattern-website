'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileJson } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QuizJsonImporter({ onImport }) {
  const [jsonText, setJsonText] = useState('')
  const { toast } = useToast()

  const exampleJson = {
    quizName: "Example Quiz",
    questions: [
      {
        question: "What is React?",
        options: ["Library", "Framework", "Language", "Tool"],
        correctAnswers: ["Library"],
        type: "single",
        topic: "React Basics",
        difficulty: "easy",
        explanation: "React is a JavaScript library for building UIs",
        resources: [
          {
            type: "youtube",
            title: "React Tutorial",
            url: "https://youtube.com/..."
          }
        ]
      }
    ]
  }

  const validateAndParse = (jsonData) => {
    if (!jsonData.quizName || typeof jsonData.quizName !== 'string') {
      throw new Error('Missing or invalid quizName')
    }

    if (!Array.isArray(jsonData.questions) || jsonData.questions.length === 0) {
      throw new Error('Questions must be a non-empty array')
    }

    jsonData.questions.forEach((q, index) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Question ${index + 1}: Missing question text`)
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Question ${index + 1}: Need at least 2 options`)
      }
      if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
        throw new Error(`Question ${index + 1}: Missing correctAnswers`)
      }
      if (!['single', 'multiple'].includes(q.type)) {
        throw new Error(`Question ${index + 1}: Type must be 'single' or 'multiple'`)
      }
      if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
        throw new Error(`Question ${index + 1}: Difficulty must be 'easy', 'medium', or 'hard'`)
      }
    })

    return jsonData
  }

  const handlePaste = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const validated = validateAndParse(parsed)

      const questionsWithIds = validated.questions.map((q, idx) => ({
        ...q,
        id: `q_${Date.now()}_${idx}`,
        resources: q.resources || []
      }))

      onImport(validated.quizName, questionsWithIds)
      setJsonText('')

      toast({
        title: "Success",
        description: `Imported ${questionsWithIds.length} questions`
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        const validated = validateAndParse(parsed)

        const questionsWithIds = validated.questions.map((q, idx) => ({
          ...q,
          id: `q_${Date.now()}_${idx}`,
          resources: q.resources || []
        }))

        onImport(validated.quizName, questionsWithIds)

        toast({
          title: "Success",
          description: `Imported ${questionsWithIds.length} questions from ${file.name}`
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: error.message,
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Import Questions from JSON</h3>

      <Tabs defaultValue="paste">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paste">
            <FileJson className="h-4 w-4 mr-2" />
            Paste JSON
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="space-y-4">
          <div>
            <Label>JSON Data</Label>
            <Textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={JSON.stringify(exampleJson, null, 2)}
              rows={12}
              className="font-mono text-sm mt-2"
            />
          </div>
          <Button onClick={handlePaste} disabled={!jsonText.trim()}>
            Import Questions
          </Button>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </span>
              <br />
              <span className="text-xs text-muted-foreground">
                JSON files only
              </span>
            </Label>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 p-3 bg-muted rounded text-xs">
        <p className="font-semibold mb-1">Required JSON Structure:</p>
        <pre className="overflow-x-auto">{JSON.stringify(exampleJson, null, 2)}</pre>
      </div>
    </Card>
  )
}
