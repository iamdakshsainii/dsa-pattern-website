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
  ChevronDown,
  Edit,
  FileText,
  ClipboardCheck,
  MessageCircle,
  Layers,
  MapPin,
  Shield,
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
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">DSA Patterns</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}

          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  More
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="cursor-pointer flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Resume Manager
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/interview-prep" className="cursor-pointer flex items-center">
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="cursor-pointer flex items-center">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmarks
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/notes" className="cursor-pointer flex items-center">
                    <StickyNote className="h-4 w-4 mr-2" />
                    Saved Notes
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/community" className="cursor-pointer flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Join Community
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0">
                    <ProfileAvatar
                      src={profileData?.profile?.avatar}
                      name={currentUser.name}
                      size="sm"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          src={profileData?.profile?.avatar}
                          name={currentUser.name}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                      </div>
                      {profileData?.completionPercentage !== undefined && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Profile Completion</span>
                            <span className="font-medium">{profileData.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${profileData.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit" className="cursor-pointer flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin(currentUser) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-red-600" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 hover:bg-accent rounded-lg"
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
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-3">
            {currentUser && (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <ProfileAvatar
                    src={profileData?.profile?.avatar}
                    name={currentUser.name}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{currentUser.name}</p>
                    <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                    {profileData?.completionPercentage !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        Profile: {profileData.completionPercentage}% complete
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-t my-2" />
              </>
            )}

            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
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
                <div className="border-t my-2" />

                <Link
                  href="/profile"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/profile"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>

                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  href="/resume"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/resume"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  Resume Manager
                </Link>

                <Link
                  href="/interview-prep"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/interview-prep"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <ClipboardCheck className="h-5 w-5" />
                  Interview Prep
                </Link>

                <Link
                  href="/bookmarks"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/bookmarks"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Bookmark className="h-5 w-5" />
                  Bookmarks
                </Link>

                <Link
                  href="/notes"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/notes"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <StickyNote className="h-5 w-5" />
                  Saved Notes
                </Link>

                <Link
                  href="/community"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/community"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                  Join Community
                </Link>
              </>
            )}

            <div className="border-t my-2" />

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 w-full"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
