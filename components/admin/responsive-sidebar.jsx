'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Map,
  GraduationCap,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  FileText,
  Zap,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function ResponsiveSidebar({ user, notifications = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: MessageSquare, label: 'Mentorship', href: '/admin/mentorship' },
  { icon: Map, label: 'Roadmaps', href: '/admin/roadmaps' },
  { icon: GraduationCap, label: 'Quizzes', href: '/admin/quiz-manager' },
  { icon: FileText, label: 'Questions', href: '/admin/questions' },
  {
    icon: BarChart3,
    label: 'Analytics',
    href: '/admin/stats',
    submenu: [
      { label: 'Overview', href: '/admin/stats' },
      { label: 'User Analytics', href: '/admin/stats/users' },
      { label: 'Quiz Analytics', href: '/admin/stats/quizzes' },
      { label: 'Mentorship Analytics', href: '/admin/stats/mentorship' }
    ]
  },
  { icon: FileText, label: 'Activity Logs', href: '/admin/logs' },
  { icon: Zap, label: 'Auto-Actions', href: '/admin/auto-actions' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
  { icon: Map, label: 'Patterns', href: '/admin/patterns' },
];

  const unreadCount = notifications.filter(n => !n.read).length;

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notification._id })
      });
    }

    if (notification.type === 'mentorship_request' || notification.type === 'escalation') {
      router.push('/admin/mentorship');
    } else if (notification.type === 'user_blocked' || notification.type === 'user_deleted') {
      router.push('/admin/users');
    }

    router.refresh();
  };

  const handleMarkAllRead = async () => {
    await fetch('/api/admin/notifications', {
      method: 'PATCH'
    });
    router.refresh();
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="font-bold text-lg">Admin Panel</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 border-b flex items-center justify-between">
              <div className="font-semibold text-sm">Notifications</div>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs h-7">
                  Mark all read
                </Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="p-8 text-sm text-muted-foreground text-center">
                No notifications
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.slice(0, 10).map((notif) => (
                  <DropdownMenuItem
                    key={notif._id}
                    className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium">{notif.title}</div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{notif.message}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(notif.createdAt)}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r bg-white dark:bg-gray-900",
        collapsed ? "w-16" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between min-h-[57px]">
            {!collapsed && (
              <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-foreground">
                Admin Panel
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex"
            >
              {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const isItemActive = isActive(item.href);

              if (item.submenu) {
                return (
                  <div key={item.label}>
                    <Button
                      variant={isItemActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        collapsed && "px-2 justify-center"
                      )}
                      onClick={() => setAnalyticsOpen(!analyticsOpen)}
                    >
                      <item.icon className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown className={cn(
                            "w-4 h-4 transition-transform",
                            analyticsOpen && "rotate-180"
                          )} />
                        </>
                      )}
                    </Button>

                    {analyticsOpen && !collapsed && (
                      <div className="ml-9 mt-1 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link key={subitem.href} href={subitem.href} onClick={() => setMobileOpen(false)}>
                            <Button
                              variant={pathname === subitem.href ? "secondary" : "ghost"}
                              className="w-full justify-start text-sm"
                              size="sm"
                            >
                              {subitem.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={isItemActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "px-2 justify-center"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t">
            <div className={cn(
              "flex items-center gap-3",
              collapsed && "justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user?.name || 'Admin'}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
              )}
            </div>

            {!collapsed && (
              <Link href="/dashboard" className="block mt-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LogOut className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </aside>

      <div className={cn(
        "hidden lg:block transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )} />
    </>
  );
}
