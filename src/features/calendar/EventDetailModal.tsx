import React, { useState } from 'react';
import { CalendarEvent } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDateString, formatTimeOnly } from '../../lib/utils';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  FileText, 
  Sparkles, 
  CalendarClock, 
  XCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBrief: (briefIdOrEventId: string) => void;
  onRescheduleRequest: (event: CalendarEvent) => void;
  onCancelRequest: (event: CalendarEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onOpenBrief,
  onRescheduleRequest,
  onCancelRequest
}) => {
  if (!event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Badge 
            variant={event.importance === 'HIGH' ? 'high' : event.importance === 'MEDIUM' ? 'medium' : 'low'}
            className="text-[10px]"
          >
            {event.importance} PRIORITY
          </Badge>
          <Badge variant="outline" className="text-[10px] uppercase font-mono">
            {event.meetingType}
          </Badge>
        </div>
      }
      subtitle={`Scheduled Event • ${event.durationMinutes} minutes`}
    >
      <div className="space-y-6 text-xs text-slate-200">
        
        {/* Title & Timing */}
        <div className="space-y-2 pb-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-slate-100 tracking-tight leading-snug">
            {event.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDateString(event.startTime, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {formatTimeOnly(event.startTime)} – {formatTimeOnly(event.endTime)} ({event.durationMinutes}m)
              </span>
            </div>
          </div>
        </div>

        {/* Location & Google Meet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <p className="text-slate-200 font-medium truncate">{event.location || "Executive Suite"}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
              <Video className="w-3 h-3 text-sky-400" /> Virtual Room
            </span>
            {event.meetUrl ? (
              <a 
                href={event.meetUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium truncate"
              >
                <span>Google Meet Link</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-slate-500">In-person only</span>
            )}
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>Confirmed Participants ({event.participants.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {event.participants.map((p, idx) => (
              <div key={idx} className="p-2.5 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-slate-200 truncate">{p.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{p.role || p.organization || "Participant"}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{p.email}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description / Agenda */}
        {event.description && (
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase">
              <FileText className="w-3 h-3" />
              <span>Agenda & Context</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-normal">{event.description}</p>
          </div>
        )}

        {/* Meeting Preparation Action Banner */}
        <div className="p-3.5 rounded-lg bg-sky-950/30 border border-sky-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-sky-200 text-xs">AI Executive Meeting Brief</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Full background dossier, open commitments, and recommended discussion points.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onOpenBrief(event.briefId || event.id);
            }}
            className="text-xs shrink-0 w-full sm:w-auto"
          >
            Open Meeting Brief
          </Button>
        </div>

        {/* Footer with Modification Safeguards */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[10px] text-amber-400/90 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>V1 Safeguard: Schedule changes generate an Approval Proposal.</span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRescheduleRequest(event)}
              className="gap-1.5 text-xs"
            >
              <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
              <span>Propose Reschedule</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancelRequest(event)}
              className="gap-1.5 text-xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Propose Cancel</span>
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
