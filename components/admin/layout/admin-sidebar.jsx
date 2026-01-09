
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  MapIcon,
  FileQuestion,
  Settings,
  BarChart3,
  LogOut,
  FileText,
  Zap,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Mentorship', href: '/admin/mentorship', icon: MessageSquare },
  { name: 'Roadmaps', href: '/admin/roadmaps', icon: MapIcon },
  { name: 'Quizzes', href: '/admin/quiz-manager', icon: FileQuestion },
  {
    name: 'Analytics',
    href: '/admin/stats',
    icon: BarChart3,
    submenu: [
      { name: 'Overview', href: '/admin/stats' },
      { name: 'User Analytics', href: '/admin/stats/users' },
      { name: 'Quiz Analytics', href: '/admin/stats/quizzes' },
      { name: 'Mentorship Analytics', href: '/admin/stats/mentorship' }
    ]
  },
  { name: 'Activity Logs', href: '/admin/logs', icon: FileText },
  { name: 'Auto-Actions', href: '/admin/auto-actions', icon: Zap },
  { name: 'Settings', href: '/admin/settings', icon: Settings }
];

export default function AdminSidebar({ currentUser }) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState('Analytics');

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-foreground">
          Admin Panel
        </h1>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {currentUser.email}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href);

          if (item.submenu) {
            const isOpen = openSubmenu === item.name;

            return (
              <div key={item.name}>
                <button
                  onClick={() => setOpenSubmenu(isOpen ? null : item.name)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === subitem.href
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link href="/dashboard">
          <button className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
