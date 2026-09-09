import React from 'react';
import { useApp } from './context/AppContext';
import { LoginScreen } from './features/auth/LoginScreen';
import { OnboardingScreen } from './features/onboarding/OnboardingScreen';
import { AppShell } from './components/AppShell';
import { DashboardView } from './features/dashboard/DashboardView';
import { AssistantView } from './features/assistant/AssistantView';
import { CalendarView } from './features/calendar/CalendarView';
import { TasksView } from './features/tasks/TasksView';
import { ApprovalsView } from './features/approvals/ApprovalsView';
import { PeopleView } from './features/people/PeopleView';
import { SettingsView } from './features/settings/SettingsView';
import { MeetingBriefModal } from './features/meeting-prep/MeetingBriefModal';

export const App: React.FC = () => {
  const { authState, activeTab, selectedBriefId, setSelectedBriefId } = useApp();

  // 1. Loading State
  if (authState.status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-slate-100">
        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-950 font-bold text-base shadow-lg animate-pulse">
          E
        </div>
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">ExecutiveOS Console</span>
          <p className="text-[10px] text-slate-600 font-mono">Initializing secure environment...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State -> Login
  if (authState.status === 'unauthenticated') {
    return <LoginScreen />;
  }

  // 3. Authenticated but Needs Onboarding -> Onboarding
  if (!authState.isOnboarded) {
    return <OnboardingScreen />;
  }

  // 4. Authenticated & Onboarded -> Main Executive Operating Console
  return (
    <>
      <AppShell>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'assistant' && <AssistantView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'approvals' && <ApprovalsView />}
        {activeTab === 'people' && <PeopleView />}
        {activeTab === 'settings' && <SettingsView />}
      </AppShell>

      {/* Global Meeting Brief Modal */}
      <MeetingBriefModal
        briefIdOrEventId={selectedBriefId}
        isOpen={Boolean(selectedBriefId)}
        onClose={() => setSelectedBriefId(null)}
      />
    </>
  );
};

export default App;
