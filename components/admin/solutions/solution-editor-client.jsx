"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Save,
  Upload,
  Eye,
  RefreshCw,
  FileJson,
  CheckCircle,
  AlertCircle,
  Code2,
  Plus,
  Trash2,
  List,
} from "lucide-react";

export default function SolutionEditorClient({ questionId }) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("form");
  const [question, setQuestion] = useState(null);
  const [jsonData, setJsonData] = useState("");

  const [solutionData, setSolutionData] = useState({
    approaches: [],
    resources: null,
    patternTriggers: "",
    hints: [],
    commonMistakes: [],
    followUp: [],
    tags: [],
    companies: [],
    relatedProblems: [],
    complexity: null,
  });

  const [codeEditors, setCodeEditors] = useState({});
  const [stepEditors, setStepEditors] = useState({});

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePreview();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question, solutionData, jsonData, tab, codeEditors, stepEditors]);

  const parseStepsWithIndentation = (stepsArray) => {
    if (!stepsArray || !Array.isArray(stepsArray)) return [];

    const result = [];
    let currentMain = null;

    stepsArray.forEach((step) => {
      const trimmed = step.trim();
      const hasLeadingSpace =
        step.startsWith("  ") || step.startsWith("\t") || step.startsWith(" ");
      const hasBullet =
        trimmed.startsWith("•") ||
        trimmed.startsWith("-") ||
        trimmed.startsWith("*");
      const isIndented = hasLeadingSpace || hasBullet;

      if (isIndented) {
        const cleanStep = trimmed.replace(/^[•\-\*]\s*/, "").trim();
        if (currentMain !== null && cleanStep) {
          result[currentMain].sub.push(cleanStep);
        }
      } else {
        if (trimmed) {
          result.push({ text: trimmed, sub: [] });
          currentMain = result.length - 1;
        }
      }
    });

    return result;
  };

  const convertStepsToFlatArray = (hierarchicalSteps) => {
    const result = [];
    hierarchicalSteps.forEach((step) => {
      result.push(step.text);
      step.sub.forEach((subStep) => {
        result.push(`  • ${subStep}`);
      });
    });
    return result;
  };

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/questions/${questionId}`);
      const data = await res.json();

      if (data.question) {
        setQuestion(data.question);

        const existing = {
          approaches: data.question.approaches || [],
          resources: data.question.resources || null,
          patternTriggers: data.question.patternTriggers || "",
          hints: data.question.hints || [],
          commonMistakes: data.question.commonMistakes || [],
          followUp: data.question.followUp || [],
          tags: data.question.tags || [],
          companies: data.question.companies || [],
          relatedProblems: data.question.relatedProblems || [],
          complexity: data.question.complexity || null,
        };

        setSolutionData(existing);
        setJsonData(JSON.stringify(existing, null, 2));

        const editorsState = {};
        const stepsState = {};
        existing.approaches.forEach((approach, index) => {
          editorsState[index] = {
            python: approach.code?.python || "",
            java: approach.code?.java || "",
            cpp: approach.code?.cpp || "",
            javascript: approach.code?.javascript || "",
          };
          stepsState[index] = parseStepsWithIndentation(approach.steps || []);
        });
        setCodeEditors(editorsState);
        setStepEditors(stepsState);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        setJsonData(content);
        toast({
          title: "File loaded",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error) {
        toast({
          title: "Invalid file",
          description: "Please upload a valid JSON file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handlePreview = () => {
    if (!question || !question.pattern_id || !question.slug) {
      toast({
        title: "Cannot preview",
        description: "Missing pattern or question slug",
        variant: "destructive",
      });
      return;
    }
    const url = `/patterns/${question.pattern_id}/questions/${question.slug}`;
    window.open(url, "_blank");
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      let dataToSubmit = { ...solutionData };

      if (tab === "import" || tab === "code") {
        try {
          dataToSubmit = JSON.parse(jsonData);
        } catch {
          toast({
            title: "Invalid JSON",
            description: "Please check your JSON syntax",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }
      }

      if (tab === "code-editor") {
        const updatedApproaches = dataToSubmit.approaches.map(
          (approach, index) => {
            const updates = {};
            if (codeEditors[index]) {
              updates.code = {
                python: codeEditors[index].python,
                java: codeEditors[index].java,
                cpp: codeEditors[index].cpp,
                javascript: codeEditors[index].javascript,
              };
            }
            if (stepEditors[index]) {
              updates.steps = convertStepsToFlatArray(stepEditors[index]);
            }
            return {
              ...approach,
              ...updates,
            };
          }
        );
        dataToSubmit.approaches = updatedApproaches;
      }

      const oldStatus = getSolutionStatus();

      const res = await fetch("/api/admin/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: questionId,
          ...question,
          ...dataToSubmit,
          updatedAt: new Date(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      await fetchQuestion();

      const newStatus = getSolutionStatus();

      if (oldStatus.completed < newStatus.completed) {
        toast({
          title: "🎉 Progress!",
          description: `Solution is now ${newStatus.percentage}% complete`,
        });
      } else {
        toast({
          title: "Success",
          description: "Solution data saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSolutionStatus = () => {
    const hasApproaches = solutionData.approaches?.length > 0;
    const hasResources = solutionData.resources !== null;
    const hasHints = solutionData.hints?.length > 0;
    const hasMistakes = solutionData.commonMistakes?.length > 0;

    const completed = [
      hasApproaches,
      hasResources,
      hasHints,
      hasMistakes,
    ].filter(Boolean).length;
    const total = 4;

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  };

  const updateCodeEditor = (approachIndex, language, value) => {
    setCodeEditors((prev) => ({
      ...prev,
      [approachIndex]: {
        ...prev[approachIndex],
        [language]: value,
      },
    }));
  };

  const updateMainStep = (approachIndex, stepIndex, value) => {
    setStepEditors((prev) => {
      const steps = [...(prev[approachIndex] || [])];
      steps[stepIndex] = { ...steps[stepIndex], text: value };
      return {
        ...prev,
        [approachIndex]: steps,
      };
    });
  };

  const updateSubStep = (approachIndex, stepIndex, subIndex, value) => {
    setStepEditors((prev) => {
      const steps = [...(prev[approachIndex] || [])];
      const subSteps = [...steps[stepIndex].sub];
      subSteps[subIndex] = value;
      steps[stepIndex] = { ...steps[stepIndex], sub: subSteps };
      return {
        ...prev,
        [approachIndex]: steps,
      };
    });
  };

  const addMainStep = (approachIndex) => {
    setStepEditors((prev) => ({
      ...prev,
      [approachIndex]: [...(prev[approachIndex] || []), { text: "", sub: [] }],
    }));
  };

  const addSubStep = (approachIndex, stepIndex) => {
    setStepEditors((prev) => {
      const steps = [...(prev[approachIndex] || [])];
      steps[stepIndex] = {
        ...steps[stepIndex],
        sub: [...steps[stepIndex].sub, ""],
      };
      return {
        ...prev,
        [approachIndex]: steps,
      };
    });
  };

  const removeMainStep = (approachIndex, stepIndex) => {
    setStepEditors((prev) => {
      const steps = [...(prev[approachIndex] || [])];
      steps.splice(stepIndex, 1);
      return {
        ...prev,
        [approachIndex]: steps,
      };
    });
  };

  const removeSubStep = (approachIndex, stepIndex, subIndex) => {
    setStepEditors((prev) => {
      const steps = [...(prev[approachIndex] || [])];
      const subSteps = [...steps[stepIndex].sub];
      subSteps.splice(subIndex, 1);
      steps[stepIndex] = { ...steps[stepIndex], sub: subSteps };
      return {
        ...prev,
        [approachIndex]: steps,
      };
    });
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-6 lg:p-8 space-y-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Question not found</h2>
          <Button onClick={() => router.push("/admin/questions/solutions")}>
            Back to Solutions
          </Button>
        </div>
      </div>
    );
  }

  const status = getSolutionStatus();

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/questions/solutions")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                Edit Solution
              </h1>
              <p className="text-muted-foreground mt-1">{question.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              View Question Page
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">Solution Completeness</h2>
              <p className="text-sm text-muted-foreground">
                {status.completed} of {status.total} sections completed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {status.percentage}%
                </div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 28 * (1 - status.percentage / 100)
                    }`}
                    className="text-blue-600"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div
              className={`p-3 rounded-lg border-2 transition-colors ${
                solutionData.approaches?.length > 0
                  ? "bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-600"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              {solutionData.approaches?.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              )}
              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Approaches
              </div>
              <div className="text-xs text-muted-foreground">
                {solutionData.approaches?.length || 0} added
              </div>
            </div>
            <div
              className={`p-3 rounded-lg border-2 transition-colors ${
                solutionData.resources
                  ? "bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-600"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              {solutionData.resources ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              )}
              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Resources
              </div>
              <div className="text-xs text-muted-foreground">
                {solutionData.resources ? "Added" : "Not added"}
              </div>
            </div>
            <div
              className={`p-3 rounded-lg border-2 transition-colors ${
                solutionData.hints?.length > 0
                  ? "bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-600"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              {solutionData.hints?.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              )}
              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Hints
              </div>
              <div className="text-xs text-muted-foreground">
                {solutionData.hints?.length || 0} added
              </div>
            </div>
            <div
              className={`p-3 rounded-lg border-2 transition-colors ${
                solutionData.commonMistakes?.length > 0
                  ? "bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-600"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              {solutionData.commonMistakes?.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              )}
              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Mistakes
              </div>
              <div className="text-xs text-muted-foreground">
                {solutionData.commonMistakes?.length || 0} added
              </div>
            </div>
          </div>
        </Card>

        <div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="form">Manual Form</TabsTrigger>
              <TabsTrigger value="import">Import JSON</TabsTrigger>
              <TabsTrigger value="code">Write JSON</TabsTrigger>
              <TabsTrigger value="code-editor">
                <Code2 className="w-4 h-4 mr-2" />
                Code Editor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Basic Fields</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Pattern Triggers</Label>
                    <Textarea
                      value={solutionData.patternTriggers}
                      onChange={(e) =>
                        setSolutionData((prev) => ({
                          ...prev,
                          patternTriggers: e.target.value,
                        }))
                      }
                      placeholder="Explain when to use this pattern..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      value={solutionData.tags?.join(", ") || ""}
                      onChange={(e) =>
                        setSolutionData((prev) => ({
                          ...prev,
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="Array, Two Pointers, Hash Table"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Companies (comma-separated)</Label>
                    <Input
                      value={solutionData.companies?.join(", ") || ""}
                      onChange={(e) =>
                        setSolutionData((prev) => ({
                          ...prev,
                          companies: e.target.value
                            .split(",")
                            .map((c) => c.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="Google, Amazon, Microsoft"
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">
                    Approaches, Resources & More
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use JSON tabs for complex data
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Tip:</strong> For approaches, resources, hints, and
                    other complex fields, use the "Import JSON" or "Write JSON"
                    tabs for better control.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="import" className="space-y-6 mt-6">
              <Card className="p-6">
                <Label className="text-base font-semibold mb-4 block">
                  Upload JSON File
                </Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a JSON file with complete solution data
                  </p>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </Card>

              <Card className="p-6">
                <Label className="text-base font-semibold mb-4 block">
                  Or Paste JSON
                </Label>
                <Textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Paste complete solution JSON here..."
                />
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-6 mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold">JSON Editor</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setJsonData(JSON.stringify(solutionData, null, 2))
                    }
                  >
                    <FileJson className="w-4 h-4 mr-2" />
                    Load Current Data
                  </Button>
                </div>
                <Textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  rows={25}
                  className="font-mono text-sm"
                  placeholder="Write solution JSON here..."
                />
              </Card>
            </TabsContent>

            <TabsContent value="code-editor" className="space-y-6 mt-6">
              {solutionData.approaches?.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      No approaches added yet
                    </p>
                    <p className="text-sm">
                      Add approaches using JSON tabs first, then edit code here
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">
                  {solutionData.approaches.map((approach, approachIndex) => (
                    <Card
                      key={approachIndex}
                      className="p-6 border-2 border-blue-200 dark:border-blue-800"
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-blue-600 mb-1">
                          📘 Approach {approachIndex + 1}: {approach.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Edit algorithm steps and code implementation
                        </p>
                      </div>

                      <Tabs defaultValue="steps" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="steps">
                            <List className="w-4 h-4 mr-2" />
                            Algorithm Steps
                          </TabsTrigger>
                          <TabsTrigger value="code">
                            <Code2 className="w-4 h-4 mr-2" />
                            Code Implementation
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="steps" className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                              <strong>Algorithm Steps:</strong> Define the
                              step-by-step approach. Add sub-steps for nested
                              logic.
                            </p>
                          </div>

                          <div className="space-y-4">
                            {(stepEditors[approachIndex] || []).map(
                              (step, stepIndex) => (
                                <div
                                  key={stepIndex}
                                  className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                                >
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm mt-1">
                                      {stepIndex + 1}
                                    </div>
                                    <Textarea
                                      value={step.text}
                                      onChange={(e) =>
                                        updateMainStep(
                                          approachIndex,
                                          stepIndex,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Main step ${
                                        stepIndex + 1
                                      }...`}
                                      rows={2}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeMainStep(approachIndex, stepIndex)
                                      }
                                      className="mt-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  {step.sub.length > 0 && (
                                    <div className="ml-11 space-y-2 mb-2">
                                      {step.sub.map((subStep, subIndex) => (
                                        <div
                                          key={subIndex}
                                          className="flex items-start gap-2"
                                        >
                                          <span className="text-blue-600 mt-2">
                                            •
                                          </span>
                                          <Textarea
                                            value={subStep}
                                            onChange={(e) =>
                                              updateSubStep(
                                                approachIndex,
                                                stepIndex,
                                                subIndex,
                                                e.target.value
                                              )
                                            }
                                            placeholder={`Sub-step ${
                                              subIndex + 1
                                            }...`}
                                            rows={1}
                                            className="flex-1 text-sm"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              removeSubStep(
                                                approachIndex,
                                                stepIndex,
                                                subIndex
                                              )
                                            }
                                            className="mt-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="ml-11">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        addSubStep(approachIndex, stepIndex)
                                      }
                                      className="text-xs border-dashed"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Sub-step
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addMainStep(approachIndex)}
                            className="w-full mt-4 border-dashed border-2"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Main Step
                          </Button>

                          {(stepEditors[approachIndex]?.length || 0) === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <p className="text-sm">
                                No steps added yet. Click "Add Main Step" to
                                begin.
                              </p>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="code" className="mt-4">
                          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-4">
                            <p className="text-sm text-slate-300">
                              <strong className="text-green-400">
                                Code Implementation:
                              </strong>{" "}
                              Write the actual code for each programming
                              language.
                            </p>
                          </div>

                          <Tabs defaultValue="python" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                              <TabsTrigger value="python">Python</TabsTrigger>
                              <TabsTrigger value="java">Java</TabsTrigger>
                              <TabsTrigger value="cpp">C++</TabsTrigger>
                              <TabsTrigger value="javascript">
                                JavaScript
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="python">
                              <Label className="mb-2 block text-base font-semibold">
                                Python Implementation
                              </Label>
                              <Textarea
                                value={codeEditors[approachIndex]?.python || ""}
                                onChange={(e) =>
                                  updateCodeEditor(
                                    approachIndex,
                                    "python",
                                    e.target.value
                                  )
                                }
                                rows={22}
                                className="font-mono text-sm bg-slate-950 text-green-400 border-slate-700"
                                placeholder="# Write Python code here..."
                              />
                            </TabsContent>

                            <TabsContent value="java">
                              <Label className="mb-2 block text-base font-semibold">
                                Java Implementation
                              </Label>
                              <Textarea
                                value={codeEditors[approachIndex]?.java || ""}
                                onChange={(e) =>
                                  updateCodeEditor(
                                    approachIndex,
                                    "java",
                                    e.target.value
                                  )
                                }
                                rows={22}
                                className="font-mono text-sm bg-slate-950 text-green-400 border-slate-700"
                                placeholder="// Write Java code here..."
                              />
                            </TabsContent>

                            <TabsContent value="cpp">
                              <Label className="mb-2 block text-base font-semibold">
                                C++ Implementation
                              </Label>
                              <Textarea
                                value={codeEditors[approachIndex]?.cpp || ""}
                                onChange={(e) =>
                                  updateCodeEditor(
                                    approachIndex,
                                    "cpp",
                                    e.target.value
                                  )
                                }
                                rows={22}
                                className="font-mono text-sm bg-slate-950 text-green-400 border-slate-700"
                                placeholder="// Write C++ code here..."
                              />
                            </TabsContent>

                            <TabsContent value="javascript">
                              <Label className="mb-2 block text-base font-semibold">
                                JavaScript Implementation
                              </Label>
                              <Textarea
                                value={
                                  codeEditors[approachIndex]?.javascript || ""
                                }
                                onChange={(e) =>
                                  updateCodeEditor(
                                    approachIndex,
                                    "javascript",
                                    e.target.value
                                  )
                                }
                                rows={22}
                                className="font-mono text-sm bg-slate-950 text-green-400 border-slate-700"
                                placeholder="// Write JavaScript code here..."
                              />
                            </TabsContent>
                          </Tabs>
                        </TabsContent>
                      </Tabs>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Card className="p-6 mt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+S</kbd> to
                save •{" "}
                <kbd className="px-2 py-1 bg-gray-100 rounded ml-2">Ctrl+P</kbd>{" "}
                to preview
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/questions/solutions")}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Solution
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
