import React, { useState, useEffect } from 'react';
import { CalendarEvent, MeetingType, Priority } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Plus, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';

interface CreateEditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any, isRescheduleProposal?: boolean) => Promise<void>;
  initialEvent?: CalendarEvent | null;
  mode?: 'create' | 'reschedule';
}

export const CreateEditEventModal: React.FC<CreateEditEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEvent,
  mode = 'create'
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-09');
  const [startTime, setStartTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingType, setMeetingType] = useState<MeetingType>('STRATEGY');
  const [importance, setImportance] = useState<Priority>('HIGH');
  const [location, setLocation] = useState('Executive Suite / Google Meet');
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDate(initialEvent.startTime.substring(0, 10));
      setStartTime(initialEvent.startTime.substring(11, 16));
      setDurationMinutes(initialEvent.durationMinutes);
      setMeetingType(initialEvent.meetingType);
      setImportance(initialEvent.importance);
      setLocation(initialEvent.location || 'Executive Suite');
      setDescription(initialEvent.description || '');
      setReason(mode === 'reschedule' ? 'Executive schedule conflict optimization and preparation buffer allocation.' : '');
    } else {
      setTitle('');
      setDate('2026-09-09');
      setStartTime('11:00');
      setDurationMinutes(45);
      setMeetingType('STRATEGY');
      setImportance('HIGH');
      setLocation('Executive Suite / Google Meet');
      setDescription('');
      setReason('');
    }
  }, [initialEvent, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const startDateTime = `${date}T${startTime}:00`;
      // Calculate end time
      const [hours, mins] = startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + mins + durationMinutes;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMins = totalMinutes % 60;
      const endDateTime = `${date}T${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}:00`;

      if (mode === 'reschedule' && initialEvent) {
        // Reschedule creates an approval proposal in V1
        await onSubmit({
          eventId: initialEvent.id,
          title,
          currentStart: initialEvent.startTime,
          proposedStart: startDateTime,
          proposedEnd: endDateTime,
          durationMinutes,
          reason: reason || "Proposed reschedule for operational buffer.",
        }, true);
      } else {
        // Create event proposal
        await onSubmit({
          title,
          startTime: startDateTime,
          endTime: endDateTime,
          durationMinutes,
          location,
          meetUrl: location.includes('Meet') ? `https://meet.google.com/svp-${Math.random().toString(36).substring(2, 6)}` : undefined,
          participants: participantName ? [
            { name: participantName, email: participantEmail || 'colleague@partner.com', role: 'Executive' }
          ] : [
            { name: 'Victoria Sterling', email: 'v.sterling@svpartners.com', role: 'Managing Director' }
          ],
          description,
          meetingType,
          importance,
          status: 'CONFIRMED'
        }, false);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-slate-100">
            {mode === 'reschedule' ? 'Propose Event Reschedule' : 'Schedule Executive Meeting'}
          </span>
          <Badge variant="outline" className="text-[10px] font-mono">
            {mode === 'reschedule' ? 'APPROVAL GATED' : 'NEW PROPOSAL'}
          </Badge>
        </div>
      }
      subtitle={
        mode === 'reschedule' 
          ? 'Calendar modifications generate an AI Approval Proposal in V1 before execution.'
          : 'Create a calendar event for executive scheduling.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {mode === 'reschedule' && (
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Executive Approval Safeguard</span>
            </div>
            <p className="text-[10px] text-amber-300/80 leading-relaxed">
              Submitting this reschedule request will register an approval proposal in the <strong>Approvals Center</strong>. The calendar will update upon your approval.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium">Meeting Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. ABC Capital Syndicate Alignment"
            className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Start Time</label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Duration</label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            >
              <option value={15}>15 mins</option>
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={60}>60 mins</option>
              <option value={90}>90 mins</option>
            </select>
          </div>
        </div>

        {mode === 'reschedule' ? (
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Reason for Rescheduling</label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this change is necessary..."
              className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 resize-none"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Meeting Type</label>
                <select
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                  className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                >
                  <option value="STRATEGY">Strategy</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="BOARD">Board</option>
                  <option value="CLIENT">Client</option>
                  <option value="1ON1">1-on-1</option>
                  <option value="INTERNAL">Internal</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Priority</label>
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value as Priority)}
                  className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Location / Video Link</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Room name or Google Meet"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Primary Participant Name</label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Participant Email</label>
                <input
                  type="email"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  placeholder="mvance@vancelegal.com"
                  className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Meeting Purpose / Agenda</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level discussion objectives..."
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 resize-none"
              />
            </div>
          </>
        )}

        <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            {mode === 'reschedule' ? 'Submit Reschedule Proposal' : 'Create Meeting'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
