"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  ArrowRight,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Target,
  Award,
  CheckCircle,
} from "lucide-react";

export default function SmartRoadmapWidget({ userId }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchUserRoadmaps();
  }, [userId]);

  const fetchUserRoadmaps = async () => {
    try {
      const response = await fetch("/api/user/active-roadmaps", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <Card className="p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="mb-4 inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Start Your Learning Journey
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose a roadmap and begin your structured learning path
          </p>
          <Link href="/roadmaps">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              Browse Roadmaps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const totalPages = Math.ceil(roadmaps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoadmaps = roadmaps.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Learning Paths
          </h3>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-500 px-2">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {paginatedRoadmaps.map((roadmap) => {
          const continueUrl = roadmap.currentNodeId
            ? `/roadmaps/${roadmap.roadmapId}/${roadmap.currentNodeId}`
            : `/roadmaps/${roadmap.roadmapId}`;

          console.log("🔍 Debug Continue URL:", {
            roadmapId: roadmap.roadmapId,
            currentNodeId: roadmap.currentNodeId,
            continueUrl: continueUrl,
          });
          return (
            <div
              key={roadmap._id}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl flex-shrink-0">
                  {roadmap.roadmap?.icon || "📚"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {roadmap.roadmap?.title || "Unknown Roadmap"}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Last accessed:{" "}
                    {new Date(roadmap.lastAccessedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-bold border-blue-500 text-blue-600 dark:text-blue-400"
                >
                  {Math.round(roadmap.overallProgress || 0)}%
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {roadmap.completedNodes || 0}/{roadmap.totalNodes || 0}{" "}
                    topics
                  </span>
                </div>
                <Progress
                  value={roadmap.overallProgress || 0}
                  className="h-2"
                />
              </div>

              {roadmap.currentNodeTitle && (
                <div className="mb-3 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Target className="h-3 w-3" />
                    <span>Current: {roadmap.currentNodeTitle}</span>
                  </div>
                </div>
              )}

              {roadmap.quizAttempts && (
                <div className="flex items-center gap-4 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-green-600" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {roadmap.quizAttempts.used || 0} quizzes
                    </span>
                  </div>
                  {roadmap.quizAttempts.status === "mastered" && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mastered
                    </Badge>
                  )}
                </div>
              )}

              <Link href={continueUrl}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {roadmap.currentNodeId
                    ? "Continue Learning"
                    : "Start Roadmap"}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>

      <Link href="/roadmaps">
        <Button
          variant="outline"
          className="w-full mt-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          Browse All Roadmaps
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </Card>
  );
}
