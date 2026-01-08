'use client';
import { Users, TrendingUp, FileQuestion, Target } from 'lucide-react';

export default function OverviewStatsCards({ stats }) {
  const cards = [
    { title: 'Total Users', value: stats.totalUsers, change: stats.userGrowthRate, changeText: 'vs last week', icon: Users, color: 'blue' },
    { title: 'Active Learners', value: stats.activeUsers, subtitle: 'Last 7 days', icon: TrendingUp, color: 'green' },
    { title: 'Total Quizzes', value: stats.totalQuizzes, subtitle: 'Attempts', icon: FileQuestion, color: 'purple' },
    { title: 'Avg Quiz Score', value: `${stats.avgQuizScore}%`, subtitle: 'Platform average', icon: Target, color: 'orange' }
  ];
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
      green: 'bg-green-50 text-green-600 dark:bg-green-900/20',
      purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
      orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20'
    };
    return colors[color] || colors.blue;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
              <card.icon className="h-6 w-6" />
            </div>
            {card.change !== undefined && (
              <div className={`text-sm font-medium ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.change >= 0 ? '+' : ''}{card.change}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
            <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
            {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
            {card.changeText && <p className="text-xs text-muted-foreground mt-1">{card.changeText}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}


