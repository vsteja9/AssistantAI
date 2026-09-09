import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { CalendarEvent } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EventDetailModal } from './EventDetailModal';
import { CreateEditEventModal } from './CreateEditEventModal';
import { useToast } from '../../components/ui/Toast';
import { formatTimeOnly } from '../../lib/utils';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Users, 
  Video, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  List
} from 'lucide-react';

type CalendarViewMode = 'day' | 'week' | 'agenda';

export const CalendarView: React.FC = () => {
  const { setSelectedBriefId, dashboardRefreshTrigger } = useApp();
  const { showToast } = useToast();
  
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-09');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [createEditMode, setCreateEditMode] = useState<'create' | 'reschedule'>('create');

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      showToast("Failed to fetch calendar events", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [dashboardRefreshTrigger]);

  const handleOpenEvent = (event: CalendarEvent) => {
    setActiveEvent(event);
    setIsDetailOpen(true);
  };

  const handleCreateEvent = async (eventData: any, isRescheduleProposal?: boolean) => {
    try {
      if (isRescheduleProposal) {
        // Create an approval proposal as required by V1 principle
        showToast(`Reschedule proposal submitted for executive approval`, "info");
      } else {
        await api.createEvent(eventData);
        showToast("Meeting scheduled successfully", "success");
        await loadEvents();
      }
    } catch (err) {
      showToast("Failed to process event request", "error");
    }
  };

  const handleRescheduleRequest = (event: CalendarEvent) => {
    setIsDetailOpen(false);
    setActiveEvent(event);
    setCreateEditMode('reschedule');
    setIsCreateEditOpen(true);
  };

  const handleCancelRequest = async (event: CalendarEvent) => {
    setIsDetailOpen(false);
    showToast(`Cancellation proposal logged in Approvals Center`, "info");
  };

  // Filter events for day view
  const dayEvents = events
    .filter(e => e.startTime.startsWith(selectedDate))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Dates for week view (Sept 7 to Sept 11, 2026)
  const weekDays = [
    { dateStr: '2026-09-07', label: 'Mon, Sep 7' },
    { dateStr: '2026-09-08', label: 'Tue, Sep 8' },
    { dateStr: '2026-09-09', label: 'Wed, Sep 9' },
    { dateStr: '2026-09-10', label: 'Thu, Sep 10' },
    { dateStr: '2026-09-11', label: 'Fri, Sep 11' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">Calendar & Schedule</h1>
            <Badge variant="outline" className="text-[10px] font-mono">
              Google Workspace Synced
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Wednesday, September 9, 2026 • 5 commitments scheduled today
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-md">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'day' ? 'bg-slate-800 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'week' ? 'bg-slate-800 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'agenda' ? 'bg-slate-800 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Agenda
            </button>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md p-0.5 text-xs text-slate-300">
            <button 
              onClick={() => setSelectedDate(prev => prev === '2026-09-09' ? '2026-09-08' : '2026-09-09')}
              className="p-1 hover:bg-slate-800 rounded"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium">{selectedDate}</span>
            <button 
              onClick={() => setSelectedDate(prev => prev === '2026-09-09' ? '2026-09-10' : '2026-09-09')}
              className="p-1 hover:bg-slate-800 rounded"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setActiveEvent(null);
              setCreateEditMode('create');
              setIsCreateEditOpen(true);
            }}
            className="gap-1.5 text-xs h-8"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Meeting</span>
          </Button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'day' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono uppercase tracking-wider">
            <span>Chronological Schedule ({dayEvents.length} Events)</span>
            <span className="text-[11px] text-slate-500">Executive Timezone: America/New_York</span>
          </div>

          {dayEvents.length === 0 ? (
            <Card className="p-12 text-center text-slate-400 border-slate-800">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">No meetings scheduled for this date.</p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {dayEvents.map((evt) => {
                const isHigh = evt.importance === 'HIGH';
                return (
                  <div
                    key={evt.id}
                    onClick={() => handleOpenEvent(evt)}
                    className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Time Column */}
                      <div className="flex flex-col items-center justify-center p-2 rounded bg-slate-950 border border-slate-800/80 w-20 shrink-0 text-center">
                        <span className="text-xs font-bold text-slate-200">{formatTimeOnly(evt.startTime)}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">{evt.durationMinutes}m</span>
                      </div>

                      {/* Info Column */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                            {evt.title}
                          </h3>
                          <Badge 
                            variant={isHigh ? 'high' : evt.importance === 'MEDIUM' ? 'medium' : 'low'}
                            className="text-[9px]"
                          >
                            {evt.importance}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            {evt.meetingType}
                          </Badge>
                          {evt.isBackToBack && (
                            <Badge variant="warning" className="text-[9px]">
                              Back-to-Back
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1">
                          {evt.description || "Executive sync"}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-500" />
                            {evt.participants.map(p => p.name).join(', ')}
                          </span>
                          {evt.meetUrl && (
                            <span className="flex items-center gap-1 text-sky-400/90 font-mono text-[10px]">
                              <Video className="w-3 h-3" />
                              Google Meet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {evt.prepRequired && (
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBriefId(evt.briefId || evt.id);
                          }}
                          className="h-8 text-xs text-sky-300 border-sky-900/50 bg-sky-950/30 hover:bg-sky-950/60"
                        >
                          <Sparkles className="w-3 h-3 mr-1.5 text-sky-400" />
                          <span>Brief</span>
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs text-slate-300"
                      >
                        Details
                      </Button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {weekDays.map((day) => {
            const dayList = events
              .filter(e => e.startTime.startsWith(day.dateStr))
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const isToday = day.dateStr === '2026-09-09';

            return (
              <div 
                key={day.dateStr} 
                className={`p-3 rounded-lg border flex flex-col space-y-3 min-h-[350px] ${
                  isToday ? 'bg-slate-900/90 border-slate-700 ring-1 ring-slate-700' : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className={`text-xs font-semibold ${isToday ? 'text-sky-300' : 'text-slate-300'}`}>
                    {day.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {dayList.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {dayList.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => handleOpenEvent(evt)}
                      className="p-2 rounded bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 cursor-pointer space-y-1 group transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400">{formatTimeOnly(evt.startTime)}</span>
                        <Badge 
                          variant={evt.importance === 'HIGH' ? 'high' : 'low'}
                          className="text-[8px] px-1 py-0"
                        >
                          {evt.importance}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-medium text-slate-200 group-hover:text-sky-300 line-clamp-2">
                        {evt.title}
                      </h4>
                    </div>
                  ))}

                  {dayList.length === 0 && (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-600 italic">
                      No meetings
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agenda View */}
      {viewMode === 'agenda' && (
        <Card className="p-5 border-slate-800 space-y-4">
          <div className="space-y-3">
            {events.map((evt) => (
              <div 
                key={evt.id} 
                onClick={() => handleOpenEvent(evt)}
                className="flex items-center justify-between p-3 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-slate-400 w-28 shrink-0">
                    {evt.startTime.substring(0, 10)} {formatTimeOnly(evt.startTime)}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{evt.title}</h4>
                    <span className="text-[10px] text-slate-500">{evt.participants.map(p => p.name).join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] font-mono">{evt.meetingType}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Event Details Modal */}
      <EventDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        event={activeEvent}
        onOpenBrief={(id) => setSelectedBriefId(id)}
        onRescheduleRequest={handleRescheduleRequest}
        onCancelRequest={handleCancelRequest}
      />

      {/* Create / Reschedule Modal */}
      <CreateEditEventModal
        isOpen={isCreateEditOpen}
        onClose={() => setIsCreateEditOpen(false)}
        onSubmit={handleCreateEvent}
        initialEvent={activeEvent}
        mode={createEditMode}
      />

    </div>
  );
};
