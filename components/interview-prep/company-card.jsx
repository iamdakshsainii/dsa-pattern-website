'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Clock, Target } from 'lucide-react';
import { DIFFICULTY_COLORS } from '@/data/company-interview-data';

export default function CompanyCard({ company }) {
  return (
    <Card className={`p-5 bg-gradient-to-br ${company.color} text-white hover:shadow-xl transition-all group`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{company.emoji}</span>
          <div>
            <h3 className="text-xl font-bold">{company.name}</h3>
            <Badge className={`mt-1 ${DIFFICULTY_COLORS[company.difficulty]} border-0`}>
              {company.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm opacity-90">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <span>{company.rounds} rounds</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{company.avgDuration} process</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold mb-2 opacity-90">Key Focus:</p>
        <div className="flex flex-wrap gap-1">
          {company.focus.map((area, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-white/20 text-white border-0">
              {area}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-xs mb-4 opacity-80 line-clamp-2">{company.tips}</p>

      <div className="flex gap-2">
        <a href={company.glassdoor} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs bg-white/90 hover:bg-white text-gray-900">
            <ExternalLink className="h-3 w-3 mr-1" />
            Reviews
          </Button>
        </a>
        <a href={company.levelsFyi} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs bg-white/90 hover:bg-white text-gray-900">
            <TrendingUp className="h-3 w-3 mr-1" />
            Salary
          </Button>
        </a>
      </div>
    </Card>
  );
}
