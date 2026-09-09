import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, ExecutiveProfile, ExecutivePreferences, GoogleWorkspaceStatus } from '../types';
import { api } from '../lib/api';
import { useToast } from '../components/ui/Toast';

export type TabType = 'dashboard' | 'assistant' | 'calendar' | 'tasks' | 'approvals' | 'people' | 'settings';

interface AppContextType {
  authState: AuthState;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedPersonId: string | null;
  setSelectedPersonId: (id: string | null) => void;
  selectedBriefId: string | null;
  setSelectedBriefId: (id: string | null) => void;
  googleStatus: GoogleWorkspaceStatus;
  preferences: ExecutivePreferences;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (onboardingData: any) => Promise<void>;
  updateProfileAndPrefs: (data: { profile?: Partial<ExecutiveProfile>; preferences?: Partial<ExecutivePreferences> }) => Promise<void>;
  refreshDashboard: () => void;
  dashboardRefreshTrigger: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    isOnboarded: false,
    user: null,
  });
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  const [googleStatus, setGoogleStatus] = useState<GoogleWorkspaceStatus>({
    calendarConnected: true,
    tasksConnected: true,
    gmailConnected: true,
    lastSyncedAt: new Date().toISOString(),
  });

  const [preferences, setPreferences] = useState<ExecutivePreferences>({
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    meetingBufferMinutes: 15,
    preferredMeetingDurationMinutes: 30,
    maxMeetingsPerDay: 6,
    morningBriefingTime: '08:30',
    meetingPrepPreference: '2 hours before meeting',
    followUpReminderPreference: 'Daily 08:45 AM',
    aiAuthority: 'SUGGEST_AND_APPROVE',
  });

  useEffect(() => {
    // Load initial states
    const loadState = async () => {
      try {
        const state = await api.getAuthState();
        const settings = await api.getSettings();
        
        setAuthState(state);
        setPreferences(settings.preferences);
        setGoogleStatus(settings.googleStatus);
      } catch (err) {
        console.error("Failed to load initial context state:", err);
      }
    };
    loadState();
  }, []);

  const login = async () => {
    setAuthState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const state = await api.loginWithGoogle();
      // Check if user is already onboarded (mock)
      const cachedOnboarded = localStorage.getItem('executive_onboarded') === 'true';
      const updatedState = {
        ...state,
        isOnboarded: cachedOnboarded,
      };
      setAuthState(updatedState);
      if (cachedOnboarded) {
        showToast("Welcome back, Victoria Sterling", "success");
      } else {
        showToast("Authenticated. Please complete your onboarding.", "info");
      }
    } catch (err) {
      setAuthState((prev) => ({ ...prev, status: 'unauthenticated' }));
      showToast("Authentication failed", "error");
    }
  };

  const logout = async () => {
    setAuthState({ status: 'loading', isOnboarded: false, user: null });
    try {
      await api.logout();
      setAuthState({ status: 'unauthenticated', isOnboarded: false, user: null });
      showToast("Logged out successfully", "info");
    } catch (err) {
      showToast("Failed to logout cleanly", "error");
    }
  };

  const completeOnboarding = async (onboardingData: any) => {
    try {
      const { profile, preferences: newPrefs } = await api.submitOnboarding(onboardingData);
      setAuthState({
        status: 'authenticated',
        isOnboarded: true,
        user: profile,
      });
      setPreferences(newPrefs);
      localStorage.setItem('executive_onboarded', 'true');
      showToast("Onboarding completed successfully", "success");
    } catch (err) {
      showToast("Failed to complete onboarding", "error");
    }
  };

  const updateProfileAndPrefs = async (data: { profile?: Partial<ExecutiveProfile>; preferences?: Partial<ExecutivePreferences> }) => {
    try {
      const { profile, preferences: newPrefs } = await api.updateSettings(data);
      if (data.profile) {
        setAuthState((prev) => ({
          ...prev,
          user: profile,
        }));
      }
      setPreferences(newPrefs);
      setDashboardRefreshTrigger(t => t + 1);
      showToast("Settings updated successfully", "success");
    } catch (err) {
      showToast("Failed to save settings", "error");
    }
  };

  const refreshDashboard = () => {
    setDashboardRefreshTrigger(t => t + 1);
  };

  return (
    <AppContext.Provider
      value={{
        authState,
        activeTab,
        setActiveTab,
        selectedEventId,
        setSelectedEventId,
        selectedPersonId,
        setSelectedPersonId,
        selectedBriefId,
        setSelectedBriefId,
        googleStatus,
        preferences,
        login,
        logout,
        completeOnboarding,
        updateProfileAndPrefs,
        refreshDashboard,
        dashboardRefreshTrigger,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
