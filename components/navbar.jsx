"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  LogOut,
  User,
  Home,
  Grid3x3,
  BookOpen,
  LayoutDashboard,
  Bookmark,
  StickyNote,
  Edit,
  FileText,
  ClipboardCheck,
  MessageCircle,
  Layers,
  MapPin,
  Shield,
  BarChart3,
  ChevronDown,
} from "lucide-react"
import { useState, useEffect } from "react"
import ProfileAvatar from "./profile/profile-avatar"
import { isAdmin } from "@/lib/admin"

export default function Navbar({ currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (currentUser) {
      fetchProfile()
    }
  }, [currentUser])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include',
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Patterns", href: "/patterns", icon: Grid3x3 },
    { name: "Sheets", href: "/sheets", icon: BookOpen },
    { name: "Roadmaps", href: "/roadmaps", icon: MapPin },
  ]

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DSA Patterns
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex items-center gap-2 text-sm font-medium transition-all duration-200 group py-1"
              >
                <Icon className={`h-4 w-4 transition-all duration-200 ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'
                }`} />
                <span className={active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}>
                  {item.name}
                </span>
                <div className={`
                  absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full
                  transition-all duration-300
                  ${active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'}
                `} />
              </Link>
            )
          })}

          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center gap-2 text-sm font-medium transition-all duration-200 group py-1">
                  <Layers className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">More</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:rotate-180 transition-all duration-300" />
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                    <div className="mr-3 p-1.5 rounded-md bg-blue-50 dark:bg-blue-950">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Resume Manager</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/interview-prep" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                    <div className="mr-3 p-1.5 rounded-md bg-purple-50 dark:bg-purple-950">
                      <ClipboardCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                    <div className="mr-3 p-1.5 rounded-md bg-yellow-50 dark:bg-yellow-950">
                      <Bookmark className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span>Bookmarks</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/notes" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                    <div className="mr-3 p-1.5 rounded-md bg-green-50 dark:bg-green-950">
                      <StickyNote className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Saved Notes</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/community" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                    <div className="mr-3 p-1.5 rounded-md bg-pink-50 dark:bg-pink-950">
                      <MessageCircle className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <span>Join Community</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "hover:bg-accent"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                    <div className="relative h-10 w-10 rounded-full ring-2 ring-border group-hover:ring-primary transition-all duration-200">
                      <ProfileAvatar
                        src={profileData?.profile?.avatar}
                        name={currentUser.name}
                        size="sm"
                      />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-3">
                  <DropdownMenuLabel className="pb-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40" />
                          <div className="relative">
                            <ProfileAvatar
                              src={profileData?.profile?.avatar}
                              name={currentUser.name}
                              size="md"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-base">{currentUser.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                        </div>
                      </div>
                      {profileData?.completionPercentage !== undefined && (
                        <div className="mt-1">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-muted-foreground font-medium">Profile Completion</span>
                            <span className="font-semibold text-primary">{profileData.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${profileData.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                      <div className="mr-3 p-1.5 rounded-md bg-blue-50 dark:bg-blue-950">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">View Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                      <div className="mr-3 p-1.5 rounded-md bg-purple-50 dark:bg-purple-950">
                        <Edit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium">Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/profile/activities" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-accent transition-colors">
                      <div className="mr-3 p-1.5 rounded-md bg-green-50 dark:bg-green-950">
                        <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">Activity</span>
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin(currentUser) && (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer flex items-center py-3 px-3 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                          <div className="mr-3 p-1.5 rounded-md bg-red-50 dark:bg-red-950">
                            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <span className="font-medium text-red-600">Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer py-3 px-3 rounded-md hover:bg-red-50 dark:hover:bg-red-950 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 transition-colors"
                  >
                    <div className="mr-3 p-1.5 rounded-md bg-red-50 dark:bg-red-950">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container px-4 py-6 space-y-2">
            {currentUser && (
              <>
                <div className="relative overflow-hidden flex items-center gap-3 p-4 rounded-xl mb-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -mr-12 -mt-12 blur-2xl" />
                  <div className="relative">
                    <ProfileAvatar
                      src={profileData?.profile?.avatar}
                      name={currentUser.name}
                      size="lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0 relative">
                    <p className="font-semibold truncate">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{currentUser.email}</p>
                    {profileData?.completionPercentage !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Profile: {profileData.completionPercentage}% complete
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}

            {currentUser && (
              <>
                <div className="border-t my-4" />

                <Link
                  href="/profile"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/profile"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>

                <Link
                  href="/profile/activities"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/profile/activities"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  Activity
                </Link>

                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/dashboard"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  href="/resume"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/resume"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  Resume Manager
                </Link>

                <Link
                  href="/interview-prep"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/interview-prep"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <ClipboardCheck className="h-5 w-5" />
                  Interview Prep
                </Link>

                <Link
                  href="/bookmarks"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/bookmarks"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <Bookmark className="h-5 w-5" />
                  Bookmarks
                </Link>

                <Link
                  href="/notes"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/notes"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <StickyNote className="h-5 w-5" />
                  Saved Notes
                </Link>

                <Link
                  href="/community"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/community"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                  Join Community
                </Link>
              </>
            )}

            <div className="border-t my-4" />

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 w-full transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
