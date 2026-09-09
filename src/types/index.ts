export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Severity = 'info' | 'warning' | 'urgent';

export type MeetingType = 'INVESTOR' | 'BOARD' | 'CLIENT' | 'STRATEGY' | '1ON1' | 'INTERNAL' | 'OTHER';
export type MeetingStatus = 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';

export interface Participant {
  id?: string;
  name: string;
  email: string;
  role?: string;
  organization?: string;
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // ISO String or "YYYY-MM-DDTHH:mm:ss"
  endTime: string;
  durationMinutes: number;
  location?: string;
  meetUrl?: string;
  participants: Participant[];
  description?: string;
  meetingType: MeetingType;
  importance: Priority;
  status: MeetingStatus;
  isBackToBack?: boolean;
  prepRequired?: boolean;
  briefId?: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SNOOZED';
export type TaskSource = 'EMAIL' | 'ASSISTANT' | 'CALENDAR' | 'MANUAL';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD or ISO string
  dueTime?: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  source: TaskSource;
  personId?: string;
  snoozedUntil?: string;
  createdAt: string;
}

export type ApprovalType = 
  | 'CREATE_MEETING' 
  | 'RESCHEDULE_MEETING' 
  | 'CANCEL_MEETING' 
  | 'CREATE_TASK' 
  | 'SEND_EMAIL';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Approval {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  title: string;
  reason: string;
  riskLevel: RiskLevel;
  requestedTime: string; // ISO string
  currentState: Record<string, any>;
  proposedState: Record<string, any>;
  targetEntityId?: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone?: string;
  avatar?: string;
  lastInteraction: string; // e.g. "2026-09-02"
  nextMeetingDate?: string;
  openFollowUpsCount: number;
  notes: string;
}

export interface MeetingBrief {
  id: string;
  eventId: string;
  title: string;
  organization: string;
  participants: { name: string; role: string; email?: string }[];
  meetingPurpose: string;
  previousInteractions: string;
  openCommitments: string[];
  outstandingFollowUps: string[];
  recommendedDiscussion: string[];
  aiRecommendations: string[];
}

export type AIAuthority = 'SUGGEST_AND_APPROVE';

export interface ExecutiveProfile {
  name: string;
  role: string;
  company: string;
  email: string;
  timezone: string;
  avatarUrl?: string;
}

export interface ExecutivePreferences {
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string; // "18:00"
  meetingBufferMinutes: number; // e.g. 15
  preferredMeetingDurationMinutes: number; // 30
  maxMeetingsPerDay: number; // 6
  morningBriefingTime: string; // "08:30"
  meetingPrepPreference: string; // "2 hours before meeting"
  followUpReminderPreference: string; // "Daily 09:00 AM"
  aiAuthority: AIAuthority;
}

export interface DashboardSummary {
  totalMeetingsToday: number;
  pendingApprovalsCount: number;
  totalTasksToday: number;
  overdueTasksCount: number;
  pendingFollowUpsCount: number;
}

export type AIInsightType = 
  | 'PREP_REQUIRED' 
  | 'OVERDUE_FOLLOWUP' 
  | 'BACK_TO_BACK' 
  | 'FREE_TIME_WINDOW' 
  | 'IMPORTANT_COMMITMENT'
  | 'HIGH_LOAD';

export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  description: string;
  severity: Severity;
  actionText?: string;
  actionType?: 'VIEW_PREP' | 'REVIEW_APPROVAL' | 'VIEW_TASK' | 'NAVIGATE';
  targetId?: string;
  targetRoute?: string;
}

export interface AssistantActionCard {
  type: 'PREPARE_MEETING' | 'RESCHEDULE_PROPOSAL' | 'TASK_PROPOSAL' | 'EMAIL_DRAFT_PROPOSAL';
  title: string;
  details: Record<string, any>;
  approvalId?: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  actionCard?: AssistantActionCard;
  approvalId?: string;
  isThinking?: boolean;
}

export interface GoogleWorkspaceStatus {
  calendarConnected: boolean;
  tasksConnected: boolean;
  gmailConnected: boolean;
  lastSyncedAt?: string;
}

export interface AuthState {
  status: 'authenticated' | 'unauthenticated' | 'loading';
  isOnboarded: boolean;
  user: ExecutiveProfile | null;
}
