import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { MeetingBrief } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { 
  Building2, 
  Users, 
  Target, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  ListOrdered, 
  Sparkles, 
  Copy, 
  PlusCircle,
  Clock
} from 'lucide-react';

interface MeetingBriefModalProps {
  briefIdOrEventId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateTask?: (initialTitle: string) => void;
}

export const MeetingBriefModal: React.FC<MeetingBriefModalProps> = ({
  briefIdOrEventId,
  isOpen,
  onClose,
  onOpenCreateTask
}) => {
  const { showToast } = useToast();
  const [brief, setBrief] = useState<MeetingBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!briefIdOrEventId || !isOpen) {
      setBrief(null);
      return;
    }

    const loadBrief = async () => {
      setIsLoading(true);
      try {
        const data = await api.getMeetingBrief(briefIdOrEventId);
        setBrief(data);
      } catch (err) {
        showToast("Failed to load meeting briefing", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadBrief();
  }, [briefIdOrEventId, isOpen]);

  const handleCopyNotes = () => {
    if (!brief) return;
    const notesText = `EXECUTIVE MEETING BRIEF: ${brief.title}
Organization: ${brief.organization}
Participants: ${brief.participants.map(p => `${p.name} (${p.role})`).join(', ')}

PURPOSE:
${brief.meetingPurpose}

PREVIOUS CONTEXT:
${brief.previousInteractions}

RECOMMENDED DISCUSSION POINTS:
${brief.recommendedDiscussion.join('\n')}

AI STRATEGIC INSIGHTS:
${brief.aiRecommendations.join('\n')}`;

    navigator.clipboard.writeText(notesText);
    showToast("Meeting brief copied to clipboard", "success");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-100">Executive Meeting Brief</span>
            <span className="ml-2 text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              AI Prepared
            </span>
          </div>
        </div>
      }
      subtitle={brief ? `${brief.organization} • Confidential` : 'Loading briefing materials...'}
    >
      {isLoading ? (
        <div className="space-y-4 py-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : brief ? (
        <div className="space-y-6 text-slate-200 text-xs">
          
          {/* Header Banner */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-100">{brief.title}</h3>
              <Badge variant="outline" className="text-[10px] font-mono w-fit">
                <Building2 className="w-3 h-3 mr-1 text-slate-400" />
                {brief.organization}
              </Badge>
            </div>

            {/* Participants */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>Participants</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {brief.participants.map((p, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    <span className="font-semibold text-slate-200">{p.name}</span>
                    <span className="text-slate-500 font-normal">({p.role})</span>
                    {p.email && <span className="text-slate-600 text-[10px]">• {p.email}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid: Purpose & Historical Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Purpose */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-sky-400" />
                <span>Meeting Purpose</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                {brief.meetingPurpose}
              </p>
            </div>

            {/* Previous Context */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Previous Interactions</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                {brief.previousInteractions}
              </p>
            </div>

          </div>

          {/* Commitments & Follow-ups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Commitments */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Commitments</span>
              </div>
              {brief.openCommitments.length > 0 ? (
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {brief.openCommitments.map((item, idx) => (
                    <li key={idx} className="leading-normal">{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-500 italic">None logged.</span>
              )}
            </div>

            {/* Outstanding Follow-ups */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Outstanding Follow-ups</span>
              </div>
              {brief.outstandingFollowUps.length > 0 ? (
                <ul className="space-y-1.5 list-disc list-inside text-rose-300/90">
                  {brief.outstandingFollowUps.map((item, idx) => (
                    <li key={idx} className="leading-normal">{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-500 italic">No overdue items.</span>
              )}
            </div>
          </div>

          {/* Recommended Discussion Agenda */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
              <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
              <span>Recommended Discussion Agenda</span>
            </div>
            <div className="space-y-2">
              {brief.recommendedDiscussion.map((point, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80 text-slate-200">
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* AI Strategic Recommendations */}
          <div className="p-4 rounded-lg bg-sky-950/20 border border-sky-900/40 space-y-2.5">
            <div className="flex items-center gap-2 text-sky-300 font-semibold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>AI Strategic Guidance</span>
            </div>
            <div className="space-y-2">
              {brief.aiRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-slate-200 bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyNotes}
              className="gap-2 text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Briefing Notes</span>
            </Button>

            <div className="flex items-center gap-2">
              {onOpenCreateTask && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenCreateTask(`Follow-up: ${brief.title}`);
                  }}
                  className="gap-2 text-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Action Item</span>
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="px-4 text-xs"
              >
                Close
              </Button>
            </div>
          </div>

        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 space-y-3">
          <p className="text-xs">No briefing document found for this event.</p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Dismiss
          </Button>
        </div>
      )}
    </Modal>
  );
};
