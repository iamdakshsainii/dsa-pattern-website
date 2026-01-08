'use client';

import { Brain, TrendingDown, Clock, Target, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SmartInsightsPanel({ insights }) {
  const [expandedInsight, setExpandedInsight] = useState(null);

  const getInsightByType = (type) => insights?.find(i => i.type === type);

  const cards = [
    {
      type: 'struggling_users',
      icon: TrendingDown,
      title: 'Struggling Users',
      description: 'Avg quiz score < 40%',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      type: 'stuck_users',
      icon: Clock,
      title: 'Stuck Users',
      description: 'No progress 7+ days',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      type: 'ready_for_quiz',
      icon: Target,
      title: 'Ready for Quiz',
      description: 'Completed lessons',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const handleEmailAll = (users) => {
    const emails = users.map(u => u.email).join(',');
    window.location.href = `mailto:${emails}`;
  };

  const activeInsights = insights?.filter(i => i.users?.length > 0) || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-purple-600" />
        <div>
          <h3 className="text-lg font-semibold">Smart Insights</h3>
          <p className="text-sm text-muted-foreground">AI-powered user analysis</p>
        </div>
      </div>

      {/* Summary Cards - Always Show */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => {
          const insight = getInsightByType(card.type);
          const count = insight?.users?.length || 0;

          return (
            <div key={card.type} className={`${card.bgColor} rounded-lg p-4 border`}>
              <div className="flex items-start justify-between mb-3">
                <card.icon className={`h-5 w-5 ${card.color}`} />
                <div className={`text-2xl font-bold ${card.color}`}>{count}</div>
              </div>
              <div className="text-sm font-medium mb-1">{card.title}</div>
              <div className="text-xs text-muted-foreground">{card.description}</div>
            </div>
          );
        })}
      </div>

      {/* Expandable User Lists - Only if data exists */}
      {activeInsights.length > 0 ? (
        <div className="space-y-4">
          {activeInsights.map((insight, idx) => {
            const card = cards.find(c => c.type === insight.type);
            if (!card) return null;

            const Icon = card.icon;
            const isExpanded = expandedInsight === idx;

            return (
              <div key={idx} className={`${card.bgColor} rounded-lg border`}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${card.color}`} />
                      <div>
                        <h4 className="font-semibold">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedInsight(isExpanded ? null : idx)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isExpanded ? 'Hide' : 'View'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{insight.users.length} Users</span>
                        <Button
                          onClick={() => handleEmailAll(insight.users)}
                          size="sm"
                          className="gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email All
                        </Button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {insight.users.map((user, i) => (
                          <div key={i} className="bg-white dark:bg-gray-700 rounded p-3 text-sm">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground">{user.email}</div>
                            {user.avgScore && <div className="text-xs mt-1">Avg Score: {user.avgScore}%</div>}
                            {user.attempts && <div className="text-xs">Attempts: {user.attempts}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground py-4">
          <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>All users are performing well</p>
          <p className="text-xs">System is monitoring continuously</p>
        </div>
      )}
    </div>
  );
}
