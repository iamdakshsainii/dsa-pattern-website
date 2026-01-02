// app/auth/signup/page.jsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength: 33, label: "Weak", color: "bg-red-500" }
    if (strength <= 4) return { strength: 66, label: "Good", color: "bg-yellow-500" }
    return { strength: 100, label: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(data.error || "Signup failed. Please try again.")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Start Your Journey
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create an account to track your progress
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="[email protected]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.label === "Strong" ? "text-green-600" :
                      passwordStrength.label === "Good" ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Password must contain:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    {password.length >= 6 ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={password.length >= 6 ? "text-green-600" : "text-gray-500"}>
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {/[A-Za-z]/.test(password) ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={/[A-Za-z]/.test(password) ? "text-green-600" : "text-gray-500"}>
                      One letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {/[0-9]/.test(password) ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={/[0-9]/.test(password) ? "text-green-600" : "text-gray-500"}>
                      One number
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
