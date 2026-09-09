import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { Approval, ApprovalType } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ApprovalCard } from './ApprovalCard';
import { useToast } from '../../components/ui/Toast';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Inbox,
  AlertCircle,
  History
} from 'lucide-react';

export const ApprovalsView: React.FC = () => {
  const { dashboardRefreshTrigger, refreshDashboard } = useApp();
  const { showToast } = useToast();
  
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const loadApprovals = async () => {
    setIsLoading(true);
    try {
      const data = await api.getApprovals();
      setApprovals(data);
    } catch (err) {
      showToast("Failed to load approvals", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, [dashboardRefreshTrigger]);

  const handleApprove = async (id: string) => {
    try {
      await api.approveAction(id);
      showToast("Proposal approved and executed", "success");
      await loadApprovals();
      refreshDashboard();
    } catch (err) {
      showToast("Failed to approve action", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectAction(id);
      showToast("Proposal rejected", "info");
      await loadApprovals();
      refreshDashboard();
    } catch (err) {
      showToast("Failed to reject action", "error");
    }
  };

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const historyApprovals = approvals.filter(a => a.status !== 'PENDING');

  const displayedApprovals = (activeTab === 'pending' ? pendingApprovals : historyApprovals)
    .filter(a => typeFilter === 'ALL' || a.type === typeFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">Executive Approval Center</h1>
            <Badge variant="outline" className="text-[10px] font-mono border-sky-900/50 text-sky-400">
              V1 Safety Protocol
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review, audit, and authorize all autonomous AI proposals before execution.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Pending Sign-off:</span>
            <span className="font-bold text-slate-100">{pendingApprovals.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
        
        {/* Active Tab */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-mono text-slate-300">
              {pendingApprovals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-mono text-slate-400">
              {historyApprovals.length}
            </span>
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Filter:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
          >
            <option value="ALL">All Action Types</option>
            <option value="RESCHEDULE_MEETING">Reschedule Meeting</option>
            <option value="SEND_EMAIL">Send Email</option>
            <option value="CREATE_TASK">Create Task</option>
            <option value="CANCEL_MEETING">Cancel Meeting</option>
            <option value="CREATE_MEETING">Create Meeting</option>
          </select>
        </div>

      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {displayedApprovals.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 border-slate-800 space-y-2">
            <Inbox className="w-9 h-9 mx-auto mb-2 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-200">
              {activeTab === 'pending' ? "No pending approvals." : "No approval history recorded."}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'pending' 
                ? "You're completely up to date. The AI assistant will propose new actions when operational conflicts arise."
                : "Approved and rejected action logs will appear here for auditability."}
            </p>
          </Card>
        ) : (
          displayedApprovals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>

    </div>
  );
};
