'use client';
import { useState } from 'react';
import { Save, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SecuritySettingsForm({ settings, updateSetting, saving }) {
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
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configure security and access controls
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Max Login Attempts</label>
            <p className="text-sm text-muted-foreground">Failed attempts before auto-block</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="3"
              max="10"
              value={localSettings['security.max_login_attempts']}
              onChange={(e) => handleChange('security.max_login_attempts', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('security.max_login_attempts')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">Security Active</p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Users will be automatically blocked after exceeding login attempts.
                You can unblock them from the Users management page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
