"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Plus, Edit, Trash2, FileJson, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function QuestionManagementClient() {
  const [questions, setQuestions] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
    fetchPatterns();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/questions");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatterns = async () => {
    try {
      const res = await fetch("/api/all-patterns");
      const data = await res.json();
      setPatterns(data.patterns || []);
    } catch (error) {
      console.error("Failed to load patterns:", error);
    }
  };

  const handleDelete = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      fetchQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title?.toLowerCase().includes(search.toLowerCase());
    const matchesPattern =
      selectedPattern === "all" || q.pattern_id === selectedPattern;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      q.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesPattern && matchesDifficulty;
  });

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              Question Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage {questions.length} questions across all patterns
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchQuestions} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/admin/questions/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger>
                <SelectValue placeholder="All Patterns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patterns</SelectItem>
                {patterns.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>

        {/* Questions List */}
        {loading ? (
          <Card className="p-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          </Card>
        ) : filteredQuestions.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <FileJson className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No questions found</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((question) => (
              <Card
                key={question._id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate">
                        {question.title}
                      </h3>
                      <Badge
                        className={getDifficultyColor(question.difficulty)}
                      >
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {patterns.find((p) => p.slug === question.pattern_id)
                          ?.name || question.pattern_id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {question.links?.leetcode && (
                        <span>
                          <a
                            href={question.links.leetcode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            🔗 LeetCode
                          </a>
                        </span>
                      )}
                      {question.order && <span>Order: {question.order}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/questions/${question._id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(question._id)}
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
  );
}
