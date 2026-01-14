'use client'

import { useRouter } from 'next/navigation'
import { GraduationCap, ArrowRight, Star, Zap, Trophy, Target, BookOpen, TrendingUp, CheckCircle, Sparkles, Clock, Users, ArrowLeft } from "lucide-react"

export default function MasterRoadmapCard({ master, userProgress, currentUser }) {
  const router = useRouter()

  const calculateOverallProgress = () => {
    if (!userProgress || !userProgress.yearProgress) return 0
    const total = userProgress.yearProgress.reduce((sum, yp) => sum + yp.completionPercent, 0)
    return Math.round(total / master.years.length)
  }

  const getCurrentYearInfo = () => {
    if (!userProgress) return { year: 1, title: master.years[0].title }
    const currentYear = master.years.find(y => y.yearNumber === userProgress.currentYear)
    return { year: userProgress.currentYear, title: currentYear?.title || master.years[0].title }
  }

  const overallProgress = calculateOverallProgress()
  const currentYearInfo = getCurrentYearInfo()
  const hasStarted = userProgress !== null

  const handleClick = () => {
    if (!currentUser) {
      router.push('/auth/login')
      return
    }
    router.push(`/roadmaps/masters/${master.masterId}`)
  }

  const stats = [
    { icon: BookOpen, label: "Roadmaps", value: "18" },
    { icon: Target, label: "Topics", value: "200+" },
    { icon: Clock, label: "Duration", value: "4 Years" },
    { icon: Users, label: "Students", value: "5K+" }
  ]

  const valueProps = [
    { icon: Target, title: "Structured Learning", desc: "Year-by-year progression", color: "from-blue-500 to-indigo-500" },
    { icon: Zap, title: "Test-Out System", desc: "Skip years you know", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, title: "Career Ready", desc: "Job-focused curriculum", color: "from-pink-500 to-rose-500" }
  ]

  return (
    <div className="max-w-6xl mx-auto mb-12">
      <div className="relative group cursor-pointer" onClick={handleClick}>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700 animate-pulse"></div>

        <div className="relative bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 dark:from-slate-900 dark:via-purple-950/10 dark:to-pink-950/10 rounded-2xl overflow-hidden border border-purple-200/40 dark:border-purple-800/40 shadow-xl hover:shadow-2xl transition-all duration-500">

          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>

          <div className="relative p-6 md:p-8">

            <div className="absolute top-4 right-4 md:top-6 md:right-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-60 animate-pulse"></div>
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
                  <Trophy className="h-3.5 w-3.5 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Premium</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-60 group-hover:opacity-90 transition duration-500 animate-pulse"></div>
                    <div className="relative p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition duration-500">
                      <GraduationCap className="h-7 w-7 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {master.title}
                      </h3>
                      <Sparkles className="h-5 w-5 text-purple-500 animate-pulse shrink-0" />
                    </div>

                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium">
                      Your Journey from <span className="text-purple-600 dark:text-purple-400 font-bold">College Freshman</span> to <span className="text-pink-600 dark:text-pink-400 font-bold">Tech Professional</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-400 hover:scale-105 transition-all duration-300">
                      <stat.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {valueProps.map((prop, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-700 hover:translate-x-1 transition-all duration-300">
                      <div className={`p-1.5 bg-gradient-to-br ${prop.color} rounded-md shadow-lg`}>
                        <prop.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{prop.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{prop.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Your Journey Path</span>
                  <div className="grid grid-cols-2 gap-2">
                    {master.years.map((year, idx) => (
                      <div key={year.yearNumber} className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border border-purple-200/50 dark:border-purple-800/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                        {hasStarted && userProgress?.yearProgress[idx]?.completionPercent === 100 ? (
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        ) : hasStarted && userProgress?.currentYear === year.yearNumber ? (
                          <div className="h-4 w-4 rounded-full border-2 border-purple-500 animate-pulse shrink-0"></div>
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">Year {year.yearNumber}</span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 truncate block">{year.title.split(':')[1]?.trim()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full group/btn relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition duration-300"></div>
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>

                  <div className="relative flex items-center justify-center gap-2 px-6 py-4">
                    <Star className="h-5 w-5 text-white animate-pulse" />
                    <span className="text-lg font-bold text-white">
                      {hasStarted ? 'Continue Journey' : currentUser ? 'Start Journey Now' : 'Login to Start'}
                    </span>
                    <ArrowRight className="h-5 w-5 text-white group-hover/btn:translate-x-2 transition-transform" />
                  </div>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>No card required</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Self-paced</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Industry-recognized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        </div>
      </div>
    </div>
  )
}
