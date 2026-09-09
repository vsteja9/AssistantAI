import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { 
  User, 
  Clock, 
  ShieldCheck, 
  Bell, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Save, 
  Sliders,
  Calendar,
  CheckSquare,
  Mail
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { authState, preferences, googleStatus, updateProfileAndPrefs } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'ai' | 'notifications' | 'google'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    name: authState.user?.name || 'Victoria Sterling',
    role: authState.user?.role || 'Managing Director',
    company: authState.user?.company || 'Sterling-Vanguard Partners',
    email: authState.user?.email || 'v.sterling@svpartners.com',
    timezone: authState.user?.timezone || 'America/New_York (UTC-04:00)'
  });

  const [prefsData, setPrefsData] = useState({
    workingHoursStart: preferences.workingHoursStart || '09:00',
    workingHoursEnd: preferences.workingHoursEnd || '18:00',
    meetingBufferMinutes: preferences.meetingBufferMinutes || 15,
    preferredMeetingDurationMinutes: preferences.preferredMeetingDurationMinutes || 30,
    maxMeetingsPerDay: preferences.maxMeetingsPerDay || 6,
    morningBriefingTime: preferences.morningBriefingTime || '08:30',
    meetingPrepPreference: preferences.meetingPrepPreference || '2 hours before meeting',
    followUpReminderPreference: preferences.followUpReminderPreference || 'Daily 08:45 AM'
  });

  const [notifications, setNotifications] = useState({
    morningBriefing: true,
    meetingPrep: true,
    followUpReminders: true,
    approvalRequests: true,
    overdueTasks: true
  });

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateProfileAndPrefs({
        profile: profileData,
        preferences: prefsData
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulateSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSyncing(false);
    showToast("Google Workspace synchronized (Calendar, Tasks, Gmail)", "success");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Console Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage executive parameters, schedule buffers, AI authority, and Google Workspace.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          isLoading={isSaving}
          onClick={handleSaveAll}
          className="gap-1.5 text-xs h-9 px-4"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-900">
        {[
          { id: 'profile', label: 'Executive Profile', icon: User },
          { id: 'preferences', label: 'Working Preferences', icon: Clock },
          { id: 'ai', label: 'AI Authority & Behavior', icon: ShieldCheck },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'google', label: 'Google Workspace', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive 
                  ? 'bg-slate-900 text-slate-100 border border-slate-800' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Executive Profile */}
      {activeTab === 'profile' && (
        <Card className="p-6 border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-100">Executive Profile</h2>
            <p className="text-xs text-slate-400">Personal and fund credentials configured for ExecutiveOS.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Executive Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Title / Role</label>
              <input
                type="text"
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Company / Organization</label>
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Primary Work Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs text-slate-300 font-medium">Timezone</label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              >
                <option value="America/New_York (UTC-04:00)">Eastern Time (New York, UTC-04:00)</option>
                <option value="America/Chicago (UTC-05:00)">Central Time (Chicago, UTC-05:00)</option>
                <option value="America/Los_Angeles (UTC-07:00)">Pacific Time (San Francisco, UTC-07:00)</option>
                <option value="Europe/London (UTC+01:00)">British Time (London, UTC+01:00)</option>
                <option value="Asia/Singapore (UTC+08:00)">Singapore Time (Singapore, UTC+08:00)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Working Preferences */}
      {activeTab === 'preferences' && (
        <Card className="p-6 border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-100">Working Preferences & Operational Buffers</h2>
            <p className="text-xs text-slate-400">Define schedule boundaries used by AI to detect conflicts and suggest reschedules.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Daily Working Hours</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={prefsData.workingHoursStart}
                  onChange={(e) => setPrefsData({ ...prefsData, workingHoursStart: e.target.value })}
                  className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
                <span className="text-slate-500 text-xs font-mono">to</span>
                <input
                  type="time"
                  value={prefsData.workingHoursEnd}
                  onChange={(e) => setPrefsData({ ...prefsData, workingHoursEnd: e.target.value })}
                  className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Meeting Buffer</label>
              <select
                value={prefsData.meetingBufferMinutes}
                onChange={(e) => setPrefsData({ ...prefsData, meetingBufferMinutes: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes (Standard)</option>
                <option value={30}>30 minutes (Deep prep buffer)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Preferred Meeting Duration</label>
              <select
                value={prefsData.preferredMeetingDurationMinutes}
                onChange={(e) => setPrefsData({ ...prefsData, preferredMeetingDurationMinutes: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Max Meetings Per Day</label>
              <input
                type="number"
                min={1}
                max={12}
                value={prefsData.maxMeetingsPerDay}
                onChange={(e) => setPrefsData({ ...prefsData, maxMeetingsPerDay: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: AI Behavior */}
      {activeTab === 'ai' && (
        <Card className="p-6 border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-100">AI Behavior & Governance</h2>
            <p className="text-xs text-slate-400">Strict execution constraints governing AI assistant operations.</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">Suggest and Ask Approval</span>
              </div>
              <Badge variant="secondary" className="font-mono text-[10px] text-sky-400 border-sky-900 bg-sky-950/40">
                ACTIVE V1 BEHAVIOR
              </Badge>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              In ExecutiveOS V1, the assistant continuously analyzes calendar conflicts, overdue deliverables, and email threads to formulate high-value proposals. <strong>No actions (rescheduling meetings, sending correspondence, altering tasks) are executed autonomously.</strong>
            </p>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Autonomous Action Dispatch:</span>
              <span className="text-rose-400 font-semibold">LOCKED & DISABLED IN V1</span>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <Card className="p-6 border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-100">Notification Triggers</h2>
            <p className="text-xs text-slate-400">Choose which operational milestones trigger priority briefing alerts.</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'morningBriefing', label: 'Morning Executive Briefing', desc: 'Summary of today\'s commitments delivered at 08:30 AM.' },
              { id: 'meetingPrep', label: 'Meeting Preparation Dossier', desc: 'Pre-meeting strategic notes generated 2 hours prior to key discussions.' },
              { id: 'followUpReminders', label: 'Follow-up Reminders', desc: 'Alerts when counterparty email commitments exceed 24 hours.' },
              { id: 'approvalRequests', label: 'Approval Action Requests', desc: 'Prompts whenever the AI drafts a proposed schedule or task update.' },
              { id: 'overdueTasks', label: 'Overdue Milestone Warnings', desc: 'Daily alerts for overdue legal or term sheet items.' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 rounded bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{item.label}</h4>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(notifications as any)[item.id]}
                  onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: Google Workspace Integration */}
      {activeTab === 'google' && (
        <Card className="p-6 border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Google Workspace Connection</h2>
              <p className="text-xs text-slate-400">Enterprise integration status for executive productivity tools.</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              isLoading={isSyncing}
              onClick={handleSimulateSync}
              className="text-xs gap-1.5 h-8"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Simulate Re-sync</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Calendar */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Calendar className="w-4 h-4 text-sky-400" />
                <Badge variant={googleStatus.calendarConnected ? 'success' : 'secondary'} className="text-[9px]">
                  {googleStatus.calendarConnected ? 'Connected' : 'Not connected'}
                </Badge>
              </div>
              <h3 className="text-xs font-semibold text-slate-200">Google Calendar</h3>
              <p className="text-[11px] text-slate-400">
                Bidirectional sync for executive schedule, conflicts, and attendee status.
              </p>
            </div>

            {/* Tasks */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <CheckSquare className="w-4 h-4 text-purple-400" />
                <Badge variant={googleStatus.tasksConnected ? 'success' : 'secondary'} className="text-[9px]">
                  {googleStatus.tasksConnected ? 'Connected' : 'Not connected'}
                </Badge>
              </div>
              <h3 className="text-xs font-semibold text-slate-200">Google Tasks</h3>
              <p className="text-[11px] text-slate-400">
                Task list synchronization and milestone tracking.
              </p>
            </div>

            {/* Gmail */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Mail className="w-4 h-4 text-emerald-400" />
                <Badge variant={googleStatus.gmailConnected ? 'success' : 'secondary'} className="text-[9px]">
                  {googleStatus.gmailConnected ? 'Connected' : 'Not connected'}
                </Badge>
              </div>
              <h3 className="text-xs font-semibold text-slate-200">Gmail API</h3>
              <p className="text-[11px] text-slate-400">
                Read-only analysis for commitments and approved draft generation.
              </p>
            </div>

          </div>

          <div className="p-3 rounded bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Last Synced: Wednesday, September 9, 2026, 08:15:00 UTC</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Operational
            </span>
          </div>
        </Card>
      )}

    </div>
  );
};
