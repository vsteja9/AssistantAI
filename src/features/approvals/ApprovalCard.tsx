import React, { useState } from 'react';
import { Approval } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDateString } from '../../lib/utils';
import { 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Check, 
  X, 
  AlertTriangle, 
  CalendarClock, 
  Mail, 
  CheckSquare, 
  CalendarX, 
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  approval,
  onApprove,
  onReject
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(approval.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(approval.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTypeIcon = () => {
    switch (approval.type) {
      case 'RESCHEDULE_MEETING':
        return <CalendarClock className="w-4 h-4 text-amber-400" />;
      case 'CANCEL_MEETING':
        return <CalendarX className="w-4 h-4 text-rose-400" />;
      case 'CREATE_MEETING':
        return <PlusCircle className="w-4 h-4 text-sky-400" />;
      case 'SEND_EMAIL':
        return <Mail className="w-4 h-4 text-emerald-400" />;
      case 'CREATE_TASK':
        return <CheckSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const isPending = approval.status === 'PENDING';

  return (
    <Card className="bg-slate-900/90 border-slate-800 p-5 space-y-4 shadow-lg backdrop-blur-sm">
      
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
            {getTypeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">{approval.title}</h3>
              <Badge 
                variant={
                  approval.riskLevel === 'HIGH' ? 'high' : 
                  approval.riskLevel === 'MEDIUM' ? 'medium' : 'low'
                }
                className="text-[9px]"
              >
                {approval.riskLevel} RISK
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              {approval.type.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Requested: {formatDateString(approval.requestedTime, 'h:mm a')}</span>
          {approval.status !== 'PENDING' && (
            <Badge 
              variant={approval.status === 'APPROVED' ? 'success' : 'destructive'} 
              className="text-[9px] font-bold"
            >
              {approval.status}
            </Badge>
          )}
        </div>
      </div>

      {/* AI Reasoning Section */}
      <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          AI Objective & Rationale
        </span>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {approval.reason}
        </p>
      </div>

      {/* Visual State Comparison Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        
        {/* Current State */}
        <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Current State
            </span>
            <span className="text-[9px] font-mono text-slate-500">Unchanged</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {Object.entries(approval.currentState).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{key}:</span>
                <span className="text-slate-300 font-medium break-words">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Proposed State */}
        <div className="p-3.5 rounded-lg bg-sky-950/20 border border-sky-900/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-semibold">
              Proposed State (Upon Approval)
            </span>
            <span className="text-[9px] font-mono text-sky-400 font-semibold">Target Change</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {Object.entries(approval.proposedState).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[10px] font-mono text-sky-400/80 uppercase">{key}:</span>
                <span className="text-sky-100 font-medium break-words">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      {isPending && (
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono">
            Requires explicit MD sign-off before API dispatch.
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              isLoading={isProcessing}
              onClick={handleReject}
              className="text-xs text-rose-300 border-rose-900/60 hover:bg-rose-950/40 gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject Proposal</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              isLoading={isProcessing}
              onClick={handleApprove}
              className="text-xs gap-1.5 px-4"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve & Execute</span>
            </Button>
          </div>
        </div>
      )}

    </Card>
  );
};
