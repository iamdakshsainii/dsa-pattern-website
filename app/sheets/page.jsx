import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink } from "lucide-react"

export default function SheetsPage() {
  const sheets = [
    {
      name: "Blind 75",
      description: "75 must-do LeetCode problems curated by a Facebook engineer",
      count: 75,
      difficulty: "Mixed",
      color: "bg-blue-500",
      url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions",
    },
    {
      name: "NeetCode 150",
      description: "Extended version with 150 essential coding interview problems",
      count: 150,
      difficulty: "Mixed",
      color: "bg-purple-500",
      url: "https://neetcode.io/practice",
    },
    {
      name: "Striver A2Z DSA",
      description: "Complete DSA sheet covering all topics from basics to advanced",
      count: 450,
      difficulty: "All Levels",
      color: "bg-green-500",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
    },
    {
      name: "Grind 169",
      description: "169 questions covering all patterns for tech interviews",
      count: 169,
      difficulty: "Mixed",
      color: "bg-orange-500",
      url: "https://www.techinterviewhandbook.org/grind75",
    },
    {
      name: "LeetCode Top 100",
      description: "Most liked and frequently asked interview questions",
      count: 100,
      difficulty: "Mixed",
      color: "bg-yellow-500",
      url: "https://leetcode.com/studyplan/top-100-liked/",
    },
    {
      name: "AlgoExpert 160",
      description: "Hand-picked questions from AlgoExpert platform",
      count: 160,
      difficulty: "All Levels",
      color: "bg-red-500",
      url: "https://www.algoexpert.io/product",
    },
    {
      name: "Love Babbar 450",
      description: "Comprehensive DSA sheet with 450 questions",
      count: 450,
      difficulty: "All Levels",
      color: "bg-pink-500",
      url: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Curated Problem Sheets</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <p className="text-muted-foreground mb-8">
          Explore {sheets.length} carefully curated problem sheets from top engineers and educators
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheets.map((sheet, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-1 h-12 ${sheet.color} rounded-full`}></div>
                <Badge variant="secondary">{sheet.count} problems</Badge>
              </div>

              <h3 className="font-semibold text-xl mb-2">{sheet.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{sheet.description}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge variant="outline">{sheet.difficulty}</Badge>
                <a href={sheet.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View Sheet
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
