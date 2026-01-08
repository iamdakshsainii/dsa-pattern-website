'use client';

export default function EngagementHeatmap({ data }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const maxValue = Math.max(...data.flat());

  const getColor = (value) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-700';
    const intensity = value / maxValue;
    if (intensity < 0.25) return 'bg-blue-200 dark:bg-blue-900';
    if (intensity < 0.5) return 'bg-blue-400 dark:bg-blue-700';
    if (intensity < 0.75) return 'bg-blue-600 dark:bg-blue-600';
    return 'bg-blue-800 dark:bg-blue-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">User Engagement Heatmap</h2>
        <p className="text-sm text-muted-foreground">
          When are users most active? (Last 30 days)
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-1">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 mt-6">
              {days.map(day => (
                <div key={day} className="h-4 text-xs text-muted-foreground flex items-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="flex-1">
              {/* Hour Labels */}
              <div className="flex gap-1 mb-1">
                {hours.map(hour => (
                  <div key={hour} className="w-4 text-xs text-center text-muted-foreground">
                    {hour % 6 === 0 ? hour : ''}
                  </div>
                ))}
              </div>

              {/* Grid */}
              {data.map((dayData, dayIndex) => (
                <div key={dayIndex} className="flex gap-1 mb-1">
                  {dayData.map((value, hourIndex) => (
                    <div
                      key={hourIndex}
                      className={`w-4 h-4 rounded-sm ${getColor(value)} transition-colors`}
                      title={`${days[dayIndex]} ${hourIndex}:00 - ${value} users`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded-sm" />
              <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900 rounded-sm" />
              <div className="w-4 h-4 bg-blue-400 dark:bg-blue-700 rounded-sm" />
              <div className="w-4 h-4 bg-blue-600 dark:bg-blue-600 rounded-sm" />
              <div className="w-4 h-4 bg-blue-800 dark:bg-blue-500 rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
