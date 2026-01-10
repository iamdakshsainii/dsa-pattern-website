import { getQuestion, getSolution, getPattern } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Clock,
  Database,
  AlertCircle,
  Lightbulb as HintIcon,
  ArrowRight,
  Building2,
  Hash,
  ExternalLink,
  Youtube,
  FileText,
  BookOpen,
} from "lucide-react";
import SolutionTabs from "@/components/solution-tabs";
import NotesManager from "@/components/notes-manager";
import BackNavigation from "@/components/back-navigation";
import ResourcesSection from "@/components/resources-section";

export default async function QuestionPage({ params }) {
  const { id } = await params;

  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  const solution = await getSolution(id);
  const pattern = await getPattern(question.pattern_id);

  const currentUser = await getCurrentUser();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4 max-w-6xl">
          <BackNavigation
            label={pattern?.name || "Back"}
            href={`/patterns/${pattern?.slug || ""}`}
          />
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-xl font-bold truncate">{question.title}</h1>
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {solution?.resources ? (
          <ResourcesSection resources={solution.resources} />
        ) : (
          question.links && (
            <Card className="p-6 bg-primary/5">
              <h3 className="font-semibold mb-4">Practice Links:</h3>
              <div className="flex flex-wrap gap-3">
                {question.links?.leetcode && (
                  <a
                    href={question.links.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2 bg-background">
                      <ExternalLink className="h-4 w-4 text-orange-500" />
                      Solve on LeetCode
                    </Button>
                  </a>
                )}
                {question.links?.youtube && (
                  <a
                    href={question.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2 bg-background">
                      <Youtube className="h-4 w-4 text-red-500" />
                      Watch Explanation
                    </Button>
                  </a>
                )}
                {question.links?.gfg && (
                  <a
                    href={question.links.gfg}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2 bg-background">
                      <FileText className="h-4 w-4 text-green-600" />
                      Read on GFG
                    </Button>
                  </a>
                )}
                {question.links?.article && (
                  <a
                    href={question.links.article}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2 bg-background">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Read Article
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          )
        )}

        {(solution?.patternTriggers || question.patternTriggers) && (
          <Card className="p-6 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Why This Pattern Works:</h3>
                <p className="text-muted-foreground">
                  {solution?.patternTriggers || question.patternTriggers}
                </p>
              </div>
            </div>
          </Card>
        )}

        {solution && (solution.tags || solution.companies) && (
          <Card className="p-6">
            <div className="space-y-4">
              {solution.tags && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {solution.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {solution.companies && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Asked By</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {solution.companies.map((company, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="font-medium"
                      >
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {solution && solution.approaches && solution.approaches.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Solutions & Approaches</h2>
            <SolutionTabs approaches={solution.approaches} />
          </div>
        ) : (
          <>
            {question.approach && question.approach.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Approach:</h2>
                <ul className="space-y-3">
                  {question.approach.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="font-semibold text-primary">
                        {index + 1}.
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {question.solutions &&
              Object.keys(question.solutions).length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Solution Code:
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(question.solutions).map(([lang, code]) => (
                      <div key={lang}>
                        <h3 className="font-semibold mb-2 capitalize">
                          {lang}
                        </h3>
                        <pre className="bg-muted p-6 rounded-lg overflow-x-auto">
                          <code className="text-sm font-mono">{code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
          </>
        )}

        {question.complexity && (
          <Card className="p-6 bg-muted/30">
            <h2 className="text-2xl font-semibold mb-6">
              Complexity Analysis:
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Time Complexity:</span>
                    <Badge variant="outline" className="font-mono">
                      {question.complexity.time}
                    </Badge>
                  </div>
                  {question.complexity.timeExplanation && (
                    <p className="text-sm text-muted-foreground">
                      {question.complexity.timeExplanation}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Space Complexity:</span>
                    <Badge variant="outline" className="font-mono">
                      {question.complexity.space}
                    </Badge>
                  </div>
                  {question.complexity.spaceExplanation && (
                    <p className="text-sm text-muted-foreground">
                      {question.complexity.spaceExplanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {(solution?.commonMistakes || question.commonMistakes) && (
          <Card className="p-6 border-amber-200 dark:border-amber-900 bg-amber-500/5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Common Mistakes to Avoid:
            </h3>
            <ul className="space-y-2">
              {(solution?.commonMistakes || question.commonMistakes).map(
                (mistake, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex gap-2"
                  >
                    <span className="text-amber-600 dark:text-amber-400">
                      •
                    </span>
                    <span>{mistake}</span>
                  </li>
                )
              )}
            </ul>
          </Card>
        )}

        {solution?.hints && solution.hints.length > 0 && (
          <Card className="p-6 border-blue-200 dark:border-blue-900 bg-blue-500/5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <HintIcon className="h-5 w-5 text-blue-600" />
              Hints:
            </h3>
            <ul className="space-y-2">
              {solution.hints.map((hint, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-blue-600 dark:text-blue-400">
                    {index + 1}.
                  </span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {solution?.followUp && solution.followUp.length > 0 && (
          <Card className="p-6 border-purple-200 dark:border-purple-900 bg-purple-500/5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              Follow-up Questions:
            </h3>
            <ul className="space-y-2">
              {solution.followUp.map((question, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-purple-600 dark:text-purple-400">
                    •
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {solution?.relatedProblems && solution.relatedProblems.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Related Problems:</h3>
            <div className="flex flex-wrap gap-2">
              {solution.relatedProblems.map((problem, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {problem}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        <NotesManager
          questionId={question._id.toString()}
          userId={currentUser?.id || null}
          questionTitle={question.title}
        />
      </main>
    </div>
  );
}
