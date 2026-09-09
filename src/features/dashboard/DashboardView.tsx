import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { 
  DashboardSummary, 
  CalendarEvent, 
  AIInsight, 
  Approval, 
  ExecutiveProfile 
} from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatTimeOnly, formatDateString } from '../../lib/utils';
import { 
  Calendar, 
  Clock, 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Video, 
  ChevronRight, 
  Mail, 
  Plus, 
  Flame,
  FileText,
  CalendarClock
} from 'lucide-react';

interface DashboardData {
  summary: DashboardSummary;
  schedule: CalendarEvent[];
  insights: AIInsight[];
  priorityApprovals: Approval[];
  profile: ExecutiveProfile;
}

export const DashboardView: React.FC = () => {
  const { authState, setActiveTab, setSelectedBriefId, setSelectedEventId, dashboardRefreshTrigger } = useApp();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [dashboardRefreshTrigger]);

  const firstName = (data?.profile?.name || authState.user?.name || "Victoria").split(' ')[0];

  return (
    <div className="space-y-7">
      
      {/* 1. Header: Good morning, {name} & Date */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Good morning, {firstName}
            </h1>
            <Badge variant="outline" className="text-[10px] font-mono border-sky-900/60 text-sky-400 bg-sky-950/20">
              Console Active
            </Badge>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>Wednesday, September 9, 2026</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[11px] text-slate-500">America/New_York</span>
          </p>
        </div>

        {/* Quick Top Bar Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('assistant')}
            className="gap-2 text-xs h-9 bg-slate-900/80 border-slate-800 text-slate-200 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Assistant Command</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('approvals')}
            className="gap-2 text-xs h-9 px-3.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Review Approvals</span>
            {data?.summary && data.summary.pendingApprovalsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-100 font-mono text-[10px]">
                {data.summary.pendingApprovalsCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* 2. Summary Cards (5 high-density cards) */}
      {isLoading || !data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          {/* Meetings Today */}
          <div 
            onClick={() => setActiveTab('calendar')}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Meetings Today</span>
              <Calendar className="w-4 h-4 text-sky-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              {data.summary.totalMeetingsToday}
            </div>
            <span className="text-[10px] font-mono text-slate-500 block truncate">
              Next: 08:30 AM Briefing
            </span>
          </div>

          {/* Pending Approvals */}
          <div 
            onClick={() => setActiveTab('approvals')}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-900/50 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Pending Approvals</span>
              <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-amber-300 tracking-tight">
              {data.summary.pendingApprovalsCount}
            </div>
            <span className="text-[10px] font-mono text-amber-400/70 block truncate">
              Action Required
            </span>
          </div>

          {/* Tasks */}
          <div 
            onClick={() => setActiveTab('tasks')}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Tasks Due Today</span>
              <CheckSquare className="w-4 h-4 text-purple-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              {data.summary.totalTasksToday}
            </div>
            <span className="text-[10px] font-mono text-slate-500 block truncate">
              3 High Priority
            </span>
          </div>

          {/* Overdue Tasks */}
          <div 
            onClick={() => setActiveTab('tasks')}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-rose-900/50 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Overdue Tasks</span>
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-rose-300 tracking-tight">
              {data.summary.overdueTasksCount}
            </div>
            <span className="text-[10px] font-mono text-rose-400/70 block truncate">
              Requires attention
            </span>
          </div>

          {/* Follow-ups */}
          <div 
            onClick={() => setActiveTab('tasks')}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-1.5 group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Pending Follow-ups</span>
              <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              {data.summary.pendingFollowUpsCount}
            </div>
            <span className="text-[10px] font-mono text-slate-500 block truncate">
              Drafts prepared
            </span>
          </div>

        </div>
      )}

      {/* 3. Main Split Grid: Today's Schedule & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Today's Schedule (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200 tracking-tight">Today's Schedule</h2>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {isLoading || !data ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.schedule.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Time Badge */}
                    <div className="flex flex-col items-center justify-center p-1.5 rounded bg-slate-950 border border-slate-800/80 w-16 shrink-0 text-center">
                      <span className="text-xs font-bold text-slate-200">{formatTimeOnly(evt.startTime)}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{evt.durationMinutes}m</span>
                    </div>

                    {/* Title & Participants */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                          {evt.title}
                        </h3>
                        <Badge 
                          variant={evt.importance === 'HIGH' ? 'high' : evt.importance === 'MEDIUM' ? 'medium' : 'low'}
                          className="text-[8px] px-1 py-0"
                        >
                          {evt.importance}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 truncate">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          {evt.participants.map(p => p.name).join(', ')}
                        </span>
                        {evt.meetUrl && (
                          <span className="text-sky-400 text-[10px] font-mono flex items-center gap-1">
                            <Video className="w-3 h-3" /> Meet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {evt.prepRequired && (
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => setSelectedBriefId(evt.briefId || evt.id)}
                        className="h-7 text-xs text-sky-300 border-sky-900/50 bg-sky-950/30 hover:bg-sky-950/60"
                      >
                        <Sparkles className="w-3 h-3 mr-1 text-sky-400" />
                        <span>Brief</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Insights & Recommended Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Insights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-slate-200 tracking-tight">AI Insights & Signals</h2>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-slate-500">
                Deterministic
              </Badge>
            </div>

            {isLoading || !data ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.insights.slice(0, 4).map((insight) => {
                  const isUrgent = insight.severity === 'urgent';
                  const isWarning = insight.severity === 'warning';

                  return (
                    <div
                      key={insight.id}
                      className={`p-3.5 rounded-lg border transition-all space-y-2 ${
                        isUrgent 
                          ? 'bg-rose-950/20 border-rose-900/50' 
                          : isWarning 
                          ? 'bg-amber-950/20 border-amber-900/50' 
                          : 'bg-slate-900/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isUrgent ? 'bg-rose-400' : isWarning ? 'bg-amber-400' : 'bg-sky-400'
                            }`} />
                            <h4 className="text-xs font-semibold text-slate-200">
                              {insight.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal pl-3.5">
                            {insight.description}
                          </p>
                        </div>
                      </div>

                      {insight.actionText && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              if (insight.actionType === 'VIEW_PREP' && insight.targetId) {
                                setSelectedBriefId(insight.targetId);
                              } else if (insight.actionType === 'REVIEW_APPROVAL') {
                                setActiveTab('approvals');
                              } else if (insight.targetRoute === '/tasks') {
                                setActiveTab('tasks');
                              } else {
                                setActiveTab('approvals');
                              }
                            }}
                            className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium font-mono"
                          >
                            <span>{insight.actionText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Actions */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Recommended Executive Actions
            </h2>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedBriefId('brief-1')}
                className="justify-start gap-2 h-9 text-xs bg-slate-900/80 border-slate-800 hover:border-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span className="truncate">Prepare 10:30 AM Brief</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('approvals')}
                className="justify-start gap-2 h-9 text-xs bg-slate-900/80 border-slate-800 hover:border-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">Review 5 Approvals</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('approvals')}
                className="justify-start gap-2 h-9 text-xs bg-slate-900/80 border-slate-800 hover:border-slate-700"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">Approve Follow-up Draft</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('tasks')}
                className="justify-start gap-2 h-9 text-xs bg-slate-900/80 border-slate-800 hover:border-slate-700"
              >
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate">Create Action Item</span>
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Priority Section: Items requiring executive attention */}
      <div className="pt-2 border-t border-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-slate-200">Priority Operational Queue (Action Required)</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Requires sign-off before 12:00 PM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Priority Item 1 */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="high" className="text-[8px]">HIGH RISK</Badge>
                <span className="text-xs font-semibold text-slate-200 truncate">
                  Reschedule ABC Capital Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Resolve 10:30 AM conflict with Marcus Vance legal review
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('approvals')}
              className="text-xs h-8 shrink-0"
            >
              Review
            </Button>
          </div>

          {/* Priority Item 2 */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="text-[8px]">OVERDUE 24H</Badge>
                <span className="text-xs font-semibold text-slate-200 truncate">
                  Send Term Sheet Follow-up Email
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Rajesh Kumar awaiting syndicate allocation response
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('approvals')}
              className="text-xs h-8 shrink-0"
            >
              Authorize
            </Button>
          </div>

        </div>
      </div>

    </div>
  );
};
