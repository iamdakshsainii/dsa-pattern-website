
'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function MockInterviewTimer({ totalSeconds, onComplete }) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const getColor = () => {
    const percentRemaining = (remaining / totalSeconds) * 100;
    if (percentRemaining > 50) return 'text-green-600';
    if (percentRemaining > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-5 w-5 ${getColor()}`} />
      <span className={`text-2xl font-bold ${getColor()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
