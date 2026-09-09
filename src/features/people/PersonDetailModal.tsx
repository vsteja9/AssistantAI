import React from 'react';
import { Person } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDateString } from '../../lib/utils';
import { 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Plus, 
  CalendarPlus,
  User
} from 'lucide-react';

interface PersonDetailModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleMeeting?: (person: Person) => void;
  onCreateTask?: (person: Person) => void;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  person,
  isOpen,
  onClose,
  onScheduleMeeting,
  onCreateTask
}) => {
  if (!person) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-3">
          {person.avatar ? (
            <img 
              src={person.avatar} 
              alt={person.name} 
              className="w-10 h-10 rounded-full object-cover border border-slate-700" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
              {person.name.substring(0, 2)}
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-slate-100">{person.name}</h2>
            <p className="text-xs text-slate-400">{person.role} • {person.organization}</p>
          </div>
        </div>
      }
      subtitle="Executive Contact & Relationship Dossier"
    >
      <div className="space-y-4 text-xs text-slate-200">
        
        {/* Contact Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500" /> Email Address
            </span>
            <a href={`mailto:${person.email}`} className="text-slate-200 hover:text-sky-400 font-mono text-[11px] truncate block">
              {person.email}
            </a>
          </div>

          {person.phone && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" /> Direct Phone
              </span>
              <span className="text-slate-200 font-mono text-[11px]">{person.phone}</span>
            </div>
          )}
        </div>

        {/* Interaction Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded bg-slate-950/80 border border-slate-800 space-y-1 text-center sm:text-left">
            <span className="text-[9px] font-mono uppercase text-slate-500">Last Interaction</span>
            <div className="text-xs font-semibold text-slate-200 font-mono">
              {person.lastInteraction}
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950/80 border border-slate-800 space-y-1 text-center sm:text-left">
            <span className="text-[9px] font-mono uppercase text-slate-500">Next Scheduled Meeting</span>
            <div className="text-xs font-semibold text-sky-300 truncate">
              {person.nextMeetingDate ? formatDateString(person.nextMeetingDate, 'MMM d, h:mm a') : 'None'}
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950/80 border border-slate-800 space-y-1 text-center sm:text-left">
            <span className="text-[9px] font-mono uppercase text-slate-500">Open Follow-ups</span>
            <div>
              {person.openFollowUpsCount > 0 ? (
                <Badge variant="high" className="text-[10px]">
                  {person.openFollowUpsCount} Pending
                </Badge>
              ) : (
                <span className="text-xs text-slate-400 font-mono">0 pending</span>
              )}
            </div>
          </div>
        </div>

        {/* Executive Notes */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
            <FileText className="w-3 h-3 text-slate-500" />
            Executive Strategic Notes
          </span>
          <p className="text-slate-300 leading-relaxed font-normal">
            {person.notes || "No notes recorded."}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>

          <div className="flex items-center gap-2">
            {onCreateTask && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onCreateTask(person);
                }}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </Button>
            )}

            {onScheduleMeeting && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onScheduleMeeting(person);
                }}
                className="gap-1.5 text-xs"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Schedule Sync</span>
              </Button>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
