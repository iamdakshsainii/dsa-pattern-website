'use client';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuizSettingsForm from '@/components/admin/settings/quiz-settings-form';
import NotificationSettingsForm from '@/components/admin/settings/notification-settings-form';
import SecuritySettingsForm from '@/components/admin/settings/security-settings-form';

export default function SettingsPageClient() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('quiz');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (err) {
      console.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'quiz', name: 'Quiz Configuration' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'security', name: 'Security' }
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform behavior</p>
      </div>

      <div className="border-b">
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'quiz' && (
        <QuizSettingsForm settings={settings} updateSetting={updateSetting} saving={saving} />
      )}
      {activeTab === 'notifications' && (
        <NotificationSettingsForm settings={settings} updateSetting={updateSetting} saving={saving} />
      )}
      {activeTab === 'security' && (
        <SecuritySettingsForm settings={settings} updateSetting={updateSetting} saving={saving} />
      )}
    </div>
  );
}
