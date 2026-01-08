'use client';
import { useState } from 'react';
import { Save, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationSettingsForm({ settings, updateSetting, saving }) {
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
        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configure email/SMS notifications (Fallback mode active - no API keys configured)
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Admin Email</label>
            <p className="text-sm text-muted-foreground">Email for admin notifications</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={localSettings['notifications.admin_email']}
              onChange={(e) => handleChange('notifications.admin_email', e.target.value)}
              className="w-64 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('notifications.admin_email')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Notification Frequency</label>
            <p className="text-sm text-muted-foreground">How often to notify admin</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={localSettings['notifications.frequency']}
              onChange={(e) => handleChange('notifications.frequency', e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Digest</option>
            </select>
            <Button onClick={() => handleSave('notifications.frequency')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-medium">Auto-Escalate Mentorship (hours)</label>
            <p className="text-sm text-muted-foreground">Mark requests urgent after X hours</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="168"
              value={localSettings['mentorship.auto_escalate_hours']}
              onChange={(e) => handleChange('mentorship.auto_escalate_hours', parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg"
            />
            <Button onClick={() => handleSave('mentorship.auto_escalate_hours')} disabled={saving} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Fallback Mode Active</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                No email/SMS API keys configured. When users submit requests, you'll see them in the admin panel
                and can manually send responses using provided templates or mailto/sms links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
