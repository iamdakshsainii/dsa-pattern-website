'use client';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuizSettingsForm({ settings, updateSetting, saving }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async (key) => {
    await updateSetting(key, localSettings[key]);
  };

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Quiz Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Control quiz attempt limits and scoring thresholds
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Base Quiz Attempts</label>
            <p className="text-sm text-muted-foreground">Default attempts per roadmap</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={localSettings['quiz.base_attempts']}
              onChange={(e) => handleChange('quiz.base_attempts', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('quiz.base_attempts')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Max Bonus Attempts</label>
            <p className="text-sm text-muted-foreground">Extra attempts for struggling users</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="10"
              value={localSettings['quiz.max_bonus']}
              onChange={(e) => handleChange('quiz.max_bonus', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('quiz.max_bonus')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Passing Score (%)</label>
            <p className="text-sm text-muted-foreground">Minimum score to pass quiz</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="50"
              max="100"
              value={localSettings['quiz.passing_score']}
              onChange={(e) => handleChange('quiz.passing_score', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('quiz.passing_score')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Certificate Requirement</label>
            <p className="text-sm text-muted-foreground">Passes needed in last 5 attempts</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="5"
              value={localSettings['quiz.certificate_passes']}
              onChange={(e) => handleChange('quiz.certificate_passes', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('quiz.certificate_passes')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Quiz Unlock Progress (%)</label>
            <p className="text-sm text-muted-foreground">Roadmap progress required to unlock quiz</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={localSettings['quiz.unlock_progress']}
              onChange={(e) => handleChange('quiz.unlock_progress', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('quiz.unlock_progress')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
