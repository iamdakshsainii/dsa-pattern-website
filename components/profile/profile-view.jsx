"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AvatarUploadDialog from "./avatar-upload-dialog";
import {
  Edit, MapPin, Calendar, Linkedin, Github, ExternalLink,
  Camera, Eye, Code, Globe, Share2, Check, Trophy, Flame, Target, Award
} from "lucide-react";

export default function ProfileView({
  user,
  profile,
  stats,
  certificates,
  quizStats,
  streak,
  isOwnProfile = false
}) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAvatarUpload = (url) => {
    setAvatarUrl(url);
    window.location.reload();
  };

  const handleShare = async () => {
    if (!user.username) {
      alert("Set a username in profile edit to share your profile");
      return;
    }

    const url = `${window.location.origin}/u/${user.username}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name}'s Profile`,
          text: `Check out ${user.name}'s coding profile!`,
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex justify-end gap-3">
          {isOwnProfile && (
            <>
              <Link href="/profile/edit">
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              {user.username && (
                <Link href={`/u/${user.username}`}>
                  <Button variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View Public Profile
                  </Button>
                </Link>
              )}
            </>
          )}
          <Button onClick={handleShare} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share Profile"}
          </Button>
        </div>

        <Card className="relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90"></div>
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                  {avatarUrl || profile?.avatar ? (
                    <img src={avatarUrl || profile.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-600">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => setUploadDialogOpen(true)}
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-gray-700" />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-xl text-white/90 mb-4">@{user.username || "username-not-set"}</p>

                <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-white/90">
                  {profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt || user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold text-white mb-1">{stats.completedCount || 0}</div>
                  <div className="text-sm text-white/80">Problems Solved</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                    <Flame className="h-6 w-6 text-orange-300" />
                    {streak?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-white/80">Day Streak</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold text-white mb-1">{quizStats?.avgScore || 0}%</div>
                  <div className="text-sm text-white/80">Avg Quiz Score</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold text-white mb-1">{certificates?.length || 0}</div>
                  <div className="text-sm text-white/80">Certificates</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {profile?.bio && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profile.bio}</p>
              </Card>
            )}

            {profile?.skills && profile.skills.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {certificates && certificates.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Certificates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="text-4xl mb-2">{cert.roadmapIcon || "🎓"}</div>
                      <h3 className="font-semibold mb-1 line-clamp-2">{cert.roadmapTitle}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {stats?.patternStats && Object.keys(stats.patternStats).length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Pattern Breakdown
                </h2>
                <div className="space-y-3">
                  {Object.entries(stats.patternStats).map(([pattern, data]) => (
                    <div key={pattern}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{pattern}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {data.completed}/{data.total}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {stats && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Problems</span>
                    <span className="font-semibold">{stats.totalQuestions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="font-semibold text-green-600">{stats.completedCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                    <span className="font-semibold text-blue-600">{stats.inProgressCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                    <span className="font-semibold">{Math.round(stats.completionRate || 0)}%</span>
                  </div>
                </div>
              </Card>
            )}

            {quizStats && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Quiz Performance
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quizzes Taken</span>
                    <span className="font-semibold">{quizStats.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Passed</span>
                    <span className="font-semibold text-green-600">{quizStats.passed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                    <span className="font-semibold">{quizStats.avgScore || 0}%</span>
                  </div>
                </div>
              </Card>
            )}

            {(profile?.github || profile?.linkedin || profile?.leetcode || profile?.codeforces || profile?.website) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Social Links</h2>
                <div className="space-y-3">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Github className="h-5 w-5" />
                      <span className="flex-1">GitHub</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      <Linkedin className="h-5 w-5" />
                      <span className="flex-1">LinkedIn</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.leetcode && (
                    <a href={profile.leetcode} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Code className="h-5 w-5" />
                      <span className="flex-1">LeetCode</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.codeforces && (
                    <a href={profile.codeforces} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Code className="h-5 w-5" />
                      <span className="flex-1">Codeforces</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                      <Globe className="h-5 w-5" />
                      <span className="flex-1">Website</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </Card>
            )}

            {profile?.college && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                <p className="font-medium">{profile.college}</p>
                {profile.graduationYear && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Class of {profile.graduationYear}
                  </p>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <AvatarUploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUpload={handleAvatarUpload}
        />
      )}
    </div>
  );
}
