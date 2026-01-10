"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Edit2, Trash2, Plus } from "lucide-react";

export default function InterviewCountdown() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newInterview, setNewInterview] = useState({
    company: "",
    role: "",
    date: "",
    time: "10:00",
  });

  useEffect(() => {
    fetchInterviews();
    const interval = setInterval(() => {
      setInterviews((prev) => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interview-prep/countdown", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
      }
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newInterview.company || !newInterview.date) return;

    try {
      const response = await fetch("/api/interview-prep/countdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newInterview),
      });

      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews);
        setNewInterview({ company: "", role: "", date: "", time: "10:00" });
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Failed to add interview:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const response = await fetch("/api/interview-prep/countdown", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ index }),
      });

      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews);
      }
    } catch (error) {
      console.error("Failed to delete interview:", error);
    }
  };

  const getTimeUntil = (dateString) => {
    const now = new Date();
    const interviewDate = new Date(dateString);
    const diff = interviewDate - now;

    if (diff < 0)
      return {
        text: "Past",
        color: "gray",
        bgColor: "bg-gray-100 dark:bg-gray-800",
      };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let text = "";
    let color = "green";
    let bgColor =
      "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";

    if (days > 7) {
      text = `${days} days`;
      color = "green";
      bgColor =
        "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
    } else if (days > 3) {
      text = `${days} days, ${hours}h`;
      color = "yellow";
      bgColor =
        "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800";
    } else if (days > 0) {
      text = `${days} days, ${hours}h`;
      color = "orange";
      bgColor =
        "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800";
    } else if (hours > 0) {
      text = `${hours}h ${minutes}m`;
      color = "red";
      bgColor =
        "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
    } else {
      text = `${minutes}m`;
      color = "red";
      bgColor =
        "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
    }

    return { text, color, bgColor };
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </Card>
    );
  }

  const upcomingInterviews = interviews
    .filter((i) => new Date(i.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextInterview = upcomingInterviews[0];

  return (
    <Card className="p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
      {nextInterview ? (
        <div
          className={`p-6 rounded-xl ${
            getTimeUntil(nextInterview.date).bgColor
          } border-2`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white dark:bg-gray-800">
                <Calendar
                  className={`h-6 w-6 text-${
                    getTimeUntil(nextInterview.date).color
                  }-600`}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Interview Countdown
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Next: {nextInterview.company}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(interviews.indexOf(nextInterview))}
              className="hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {getTimeUntil(nextInterview.date).text}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {nextInterview.role || "Software Engineer"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(nextInterview.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {upcomingInterviews.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                +{upcomingInterviews.length - 1} more upcoming
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No upcoming interviews scheduled
          </p>
        </div>
      )}

      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Interview
        </Button>
      )}

      {isAdding && (
        <div className="mt-4 p-4 border rounded-lg space-y-3">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={newInterview.company}
              onChange={(e) =>
                setNewInterview({ ...newInterview, company: e.target.value })
              }
              placeholder="e.g., Google"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={newInterview.role}
              onChange={(e) =>
                setNewInterview({ ...newInterview, role: e.target.value })
              }
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={newInterview.date}
                onChange={(e) =>
                  setNewInterview({ ...newInterview, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newInterview.time}
                onChange={(e) =>
                  setNewInterview({ ...newInterview, time: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="flex-1">
              Save
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewInterview({
                  company: "",
                  role: "",
                  date: "",
                  time: "10:00",
                });
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
