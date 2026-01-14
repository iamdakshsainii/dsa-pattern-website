"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Zap, Clock, CheckCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CardTestButton({
  cardSlug,
  masterId,
  yearNumber,
  currentProgress,
  lastAttempt
}) {
  const router = useRouter();
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (!lastAttempt) return;

    const checkCooldown = () => {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const attemptTime = new Date(lastAttempt.completedAt).getTime();

      if (attemptTime > oneHourAgo) {
        const remaining = Math.ceil((attemptTime - oneHourAgo) / 1000 / 60);
        setCooldownRemaining(remaining);
      } else {
        setCooldownRemaining(0);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastAttempt]);

  const handleClick = () => {
    router.push(`/roadmaps/masters/${masterId}/card-test/${cardSlug}`);
  };

  // If already passed
  if (lastAttempt?.passed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Passed
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Test completed with {lastAttempt.percentage}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // If cooldown active
  if (cooldownRemaining > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled
              className="gap-2 opacity-50 cursor-not-allowed"
            >
              <Clock className="h-4 w-4" />
              Retry in {cooldownRemaining}min
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>1-hour cooldown between attempts</p>
            <p className="text-xs text-muted-foreground mt-1">
              Last attempt: {lastAttempt.percentage}%
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // If failed before (can retry)
  if (lastAttempt && !lastAttempt.passed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={handleClick}
              variant="outline"
              className="gap-2 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Test
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous attempt: {lastAttempt.percentage}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Need 80% to pass
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // First time - never attempted
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            onClick={handleClick}
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Zap className="h-4 w-4" />
            Test Out
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium mb-2">Quick unlock this roadmap!</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• 10 questions from this card's pool</li>
            <li>• Pass with 80% to unlock instantly</li>
            <li>• 20 minute time limit</li>
            <li>• 1-hour cooldown between attempts</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
