import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Clock, Calendar, Bell, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, authState } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State initialized with realistic executive values
  const [formData, setFormData] = useState({
    name: authState.user?.name || "Victoria Sterling",
    role: authState.user?.role || "Managing Director",
    company: authState.user?.company || "Sterling-Vanguard Partners",
    timezone: "America/New_York (UTC-04:00)",
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    meetingBufferMinutes: 15,
    morningBriefingTime: "08:30",
    meetingPrepPreference: "2 hours before meeting",
    followUpReminderPreference: "Daily 08:45 AM",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await completeOnboarding(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Subtle backdrop accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-slate-900/30 blur-3xl pointer-events-none rounded-full" />
      
      <div className="w-full max-w-2xl z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
              E
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">ExecutiveOS Initialization</h1>
              <p className="text-xs text-slate-400">Configure your executive operating parameters</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-slate-800 text-slate-400">
            Step 1 of 1
          </Badge>
        </div>

        {/* Configuration Card */}
        <Card className="bg-slate-900/80 border-slate-800 p-6 md:p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  1. Executive Identity
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Executive Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Executive Role</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Company / Fund</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Primary Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                  >
                    <option value="America/New_York (UTC-04:00)">Eastern Time (New York, UTC-04:00)</option>
                    <option value="America/Chicago (UTC-05:00)">Central Time (Chicago, UTC-05:00)</option>
                    <option value="America/Los_Angeles (UTC-07:00)">Pacific Time (San Francisco, UTC-07:00)</option>
                    <option value="Europe/London (UTC+01:00)">British Time (London, UTC+01:00)</option>
                    <option value="Asia/Singapore (UTC+08:00)">Singapore Time (Singapore, UTC+08:00)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Operating Cadence & Schedule */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                <Clock className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  2. Working Cadence & Buffers
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Working Hours</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={formData.workingHoursStart}
                      onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                      className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                    />
                    <span className="text-slate-500 text-xs font-mono">to</span>
                    <input
                      type="time"
                      value={formData.workingHoursEnd}
                      onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                      className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Preferred Meeting Buffer</label>
                  <select
                    value={formData.meetingBufferMinutes}
                    onChange={(e) => setFormData({ ...formData, meetingBufferMinutes: Number(e.target.value) })}
                    className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                  >
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes (Standard)</option>
                    <option value={30}>30 minutes (High buffer)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Morning Briefing Delivery</label>
                  <input
                    type="time"
                    value={formData.morningBriefingTime}
                    onChange={(e) => setFormData({ ...formData, morningBriefingTime: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Meeting Preparation Lead Time</label>
                  <select
                    value={formData.meetingPrepPreference}
                    onChange={(e) => setFormData({ ...formData, meetingPrepPreference: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 transition-colors"
                  >
                    <option value="1 hour before meeting">1 hour before meeting</option>
                    <option value="2 hours before meeting">2 hours before meeting</option>
                    <option value="Morning of meeting (08:00 AM)">Morning of meeting (08:00 AM)</option>
                    <option value="Day prior (EOD)">Day prior (EOD)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: AI Authority Boundary */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    3. AI Authority Level
                  </h2>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px] text-sky-300 border-sky-900/50 bg-sky-950/30">
                  V1 ACTIVE MODE
                </Badge>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Suggest and Ask Approval</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    SUGGEST_AND_APPROVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The AI assistant operates with strict safety bounds. It prepares meeting briefs, detects schedule conflicts, and drafts follow-up emails, but <strong>every write or update requires explicit executive approval</strong> before execution.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span className="text-slate-600">Autonomous execution:</span>
                  <span className="text-rose-400/80">DISABLED IN V1</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500 font-mono">
                Preferences can be adjusted anytime in Settings.
              </span>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="gap-2 px-6 h-10"
              >
                <span>Launch Executive Console</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
};
