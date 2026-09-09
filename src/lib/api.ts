import { 
  mockExecutiveProfile, 
  mockPreferences, 
  mockGoogleStatus, 
  mockPeople, 
  mockEvents, 
  mockTasks, 
  mockApprovals, 
  mockMeetingBriefs, 
  mockAIInsights, 
  initialAssistantMessages 
} from '../mocks/data';
import { 
  CalendarEvent, 
  Task, 
  Approval, 
  Person, 
  MeetingBrief, 
  ExecutiveProfile, 
  ExecutivePreferences, 
  GoogleWorkspaceStatus, 
  DashboardSummary, 
  AIInsight, 
  AssistantMessage,
  AuthState
} from '../types';

// In-Memory state holder for simulation
class MockDatabase {
  profile: ExecutiveProfile = { ...mockExecutiveProfile };
  preferences: ExecutivePreferences = { ...mockPreferences };
  googleStatus: GoogleWorkspaceStatus = { ...mockGoogleStatus };
  people: Person[] = [...mockPeople];
  events: CalendarEvent[] = [...mockEvents];
  tasks: Task[] = [...mockTasks];
  approvals: Approval[] = [...mockApprovals];
  meetingBriefs: Record<string, MeetingBrief> = { ...mockMeetingBriefs };
  insights: AIInsight[] = [...mockAIInsights];
  assistantMessages: AssistantMessage[] = [...initialAssistantMessages];
  authState: AuthState = {
    status: 'authenticated',
    isOnboarded: true,
    user: { ...mockExecutiveProfile }
  };

  reset() {
    this.profile = { ...mockExecutiveProfile };
    this.preferences = { ...mockPreferences };
    this.googleStatus = { ...mockGoogleStatus };
    this.people = [...mockPeople];
    this.events = [...mockEvents];
    this.tasks = [...mockTasks];
    this.approvals = [...mockApprovals];
    this.meetingBriefs = { ...mockMeetingBriefs };
    this.insights = [...mockAIInsights];
    this.assistantMessages = [...initialAssistantMessages];
    this.authState = {
      status: 'authenticated',
      isOnboarded: true,
      user: { ...mockExecutiveProfile }
    };
  }
}

const db = new MockDatabase();

// Helper latency simulation
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Auth & Onboarding
  async getAuthState(): Promise<AuthState> {
    await delay();
    return db.authState;
  },

  async loginWithGoogle(): Promise<AuthState> {
    await delay(300);
    db.authState = {
      status: 'authenticated',
      isOnboarded: db.authState.isOnboarded,
      user: db.profile
    };
    return db.authState;
  },

  async logout(): Promise<AuthState> {
    await delay(150);
    db.authState = {
      status: 'unauthenticated',
      isOnboarded: db.authState.isOnboarded,
      user: null
    };
    return db.authState;
  },

  async submitOnboarding(data: {
    name: string;
    role: string;
    company: string;
    timezone: string;
    workingHoursStart: string;
    workingHoursEnd: string;
    meetingBufferMinutes: number;
    morningBriefingTime: string;
    meetingPrepPreference: string;
    followUpReminderPreference: string;
  }): Promise<{ profile: ExecutiveProfile; preferences: ExecutivePreferences }> {
    await delay(300);
    db.profile = {
      ...db.profile,
      name: data.name,
      role: data.role,
      company: data.company,
      timezone: data.timezone
    };
    db.preferences = {
      ...db.preferences,
      workingHoursStart: data.workingHoursStart,
      workingHoursEnd: data.workingHoursEnd,
      meetingBufferMinutes: data.meetingBufferMinutes,
      morningBriefingTime: data.morningBriefingTime,
      meetingPrepPreference: data.meetingPrepPreference,
      followUpReminderPreference: data.followUpReminderPreference,
      aiAuthority: 'SUGGEST_AND_APPROVE'
    };
    db.authState.isOnboarded = true;
    db.authState.user = db.profile;
    return { profile: db.profile, preferences: db.preferences };
  },

  // Dashboard
  async getDashboard(): Promise<{
    summary: DashboardSummary;
    schedule: CalendarEvent[];
    insights: AIInsight[];
    priorityApprovals: Approval[];
    profile: ExecutiveProfile;
  }> {
    await delay();
    const todayStr = "2026-09-09";
    const todayEvents = db.events.filter(e => e.startTime.startsWith(todayStr));
    const pendingApprovals = db.approvals.filter(a => a.status === 'PENDING');
    const todayTasks = db.tasks.filter(t => t.dueDate === todayStr);
    const overdueTasks = db.tasks.filter(t => t.dueDate < todayStr && t.status !== 'COMPLETED');
    const pendingFollowUps = db.tasks.filter(t => t.source === 'EMAIL' && t.status !== 'COMPLETED');

    const summary: DashboardSummary = {
      totalMeetingsToday: todayEvents.length,
      pendingApprovalsCount: pendingApprovals.length,
      totalTasksToday: todayTasks.length,
      overdueTasksCount: overdueTasks.length,
      pendingFollowUpsCount: pendingFollowUps.length
    };

    return {
      summary,
      schedule: todayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      insights: db.insights,
      priorityApprovals: pendingApprovals.slice(0, 3),
      profile: db.profile
    };
  },

  // Calendar
  async getEvents(): Promise<CalendarEvent[]> {
    await delay();
    return db.events;
  },

  async getEventById(id: string): Promise<CalendarEvent | null> {
    await delay();
    return db.events.find(e => e.id === id) || null;
  },

  async createEvent(eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    await delay(200);
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    db.events.push(newEvent);
    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    await delay(200);
    const index = db.events.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Event not found");
    db.events[index] = { ...db.events[index], ...updates };
    return db.events[index];
  },

  async deleteEvent(id: string): Promise<void> {
    await delay(200);
    db.events = db.events.filter(e => e.id !== id);
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    await delay();
    return db.tasks;
  },

  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    await delay(200);
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.tasks.unshift(newTask);
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay(200);
    const index = db.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Task not found");
    db.tasks[index] = { ...db.tasks[index], ...updates };
    return db.tasks[index];
  },

  async deleteTask(id: string): Promise<void> {
    await delay(200);
    db.tasks = db.tasks.filter(t => t.id !== id);
  },

  // Approvals
  async getApprovals(): Promise<Approval[]> {
    await delay();
    return db.approvals;
  },

  async approveAction(id: string): Promise<Approval> {
    await delay(300);
    const approval = db.approvals.find(a => a.id === id);
    if (!approval) throw new Error("Approval not found");
    
    approval.status = 'APPROVED';

    // Execute state changes in mock database
    if (approval.type === 'RESCHEDULE_MEETING' && approval.targetEntityId) {
      const event = db.events.find(e => e.id === approval.targetEntityId);
      if (event) {
        event.startTime = "2026-09-10T11:00:00";
        event.endTime = "2026-09-10T12:00:00";
      }
    } else if (approval.type === 'SEND_EMAIL' && approval.targetEntityId) {
      const task = db.tasks.find(t => t.id === approval.targetEntityId);
      if (task) {
        task.status = 'COMPLETED';
      }
    } else if (approval.type === 'CREATE_TASK') {
      db.tasks.unshift({
        id: `t-${Date.now()}`,
        title: approval.proposedState.taskTitle || "Reviewed LP Agreement Clause 4.2 Revisions",
        dueDate: "2026-09-09",
        priority: "HIGH",
        status: "PENDING",
        source: "ASSISTANT",
        createdAt: new Date().toISOString()
      });
    } else if (approval.type === 'CANCEL_MEETING') {
      const target = db.events.find(e => e.title.includes("Product Roadmap"));
      if (target) {
        target.status = 'CANCELLED';
      }
    }

    return approval;
  },

  async rejectAction(id: string): Promise<Approval> {
    await delay(200);
    const approval = db.approvals.find(a => a.id === id);
    if (!approval) throw new Error("Approval not found");
    approval.status = 'REJECTED';
    return approval;
  },

  // Meeting Briefs
  async getMeetingBrief(eventIdOrBriefId: string): Promise<MeetingBrief | null> {
    await delay();
    // Try finding by briefId directly
    if (db.meetingBriefs[eventIdOrBriefId]) {
      return db.meetingBriefs[eventIdOrBriefId];
    }
    // Or find by eventId
    const brief = Object.values(db.meetingBriefs).find(b => b.eventId === eventIdOrBriefId);
    if (brief) return brief;

    // Fallback generate mock brief if requested
    const event = db.events.find(e => e.id === eventIdOrBriefId);
    if (event) {
      return {
        id: `brief-${event.id}`,
        eventId: event.id,
        title: event.title,
        organization: event.participants[0]?.organization || "Executive Partner",
        participants: event.participants.map(p => ({ name: p.name, role: p.role || "Executive", email: p.email })),
        meetingPurpose: event.description || "Executive alignment session.",
        previousInteractions: "Recent correspondence logged on Google Workspace.",
        openCommitments: ["Review follow-up action items post meeting"],
        outstandingFollowUps: [],
        recommendedDiscussion: [
          "1. Review primary objectives and timeline.",
          "2. Address key risks and capital requirements.",
          "3. Confirm next steps and ownership."
        ],
        aiRecommendations: [
          "Ensure meeting stays within allocated time buffer.",
          "Capture key decisions in Executive Assistant post-meeting brief."
        ]
      };
    }
    return null;
  },

  // People
  async getPeople(): Promise<Person[]> {
    await delay();
    return db.people;
  },

  async getPersonById(id: string): Promise<Person | null> {
    await delay();
    return db.people.find(p => p.id === id) || null;
  },

  // Assistant Chat
  async getAssistantMessages(): Promise<AssistantMessage[]> {
    await delay();
    return db.assistantMessages;
  },

  async sendAssistantMessage(userText: string): Promise<{ userMessage: AssistantMessage; replyMessage: AssistantMessage }> {
    await delay(100);
    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    db.assistantMessages.push(userMsg);

    // AI logic simulator
    await delay(400); // Simulate network & assistant response generation
    const lower = userText.toLowerCase();
    let replyText = "";
    let suggestedPrompts: string[] = [];
    let actionCard: any = undefined;
    let approvalId: string | undefined = undefined;

    if (lower.includes("what do i have today") || lower.includes("today's schedule")) {
      const todayEvts = db.events.filter(e => e.startTime.startsWith("2026-09-09"));
      replyText = `You have ${todayEvts.length} scheduled meetings today:\n\n` +
        todayEvts.map(e => `• **${e.startTime.substring(11, 16)}** — ${e.title} (${e.durationMinutes}m)`).join("\n") +
        `\n\nNote: You have a back-to-back schedule between 10:30 AM and 12:15 PM. I have proposed a reschedule option in Approvals.`;
      suggestedPrompts = ["Which meetings need preparation?", "Review pending approvals", "What tasks are due today?"];
    } else if (lower.includes("tomorrow") || lower.includes("free tomorrow")) {
      replyText = "Tomorrow (Thursday, September 10), you have 2 main meetings:\n\n• **09:30 AM** — Fund IV Capital Call & Finance Sync\n• **02:30 PM** — Global Sovereign Fund (Catherine Dupont LP Sync)\n\nYou have significant focus windows available from 10:15 AM to 02:30 PM and after 03:30 PM.";
      suggestedPrompts = ["Prepare me for Catherine Dupont meeting", "What follow-ups are overdue?"];
    } else if (lower.includes("preparation") || lower.includes("prep")) {
      replyText = "The following meetings require preparation today:\n\n1. **ABC Capital Co-Investment (10:30 AM)** — Term sheet response pending.\n2. **LP Agreement Legal Review (11:30 AM)** — Side-letter clause 4.2 redline.\n3. **AeroDynamics Q3 Review (02:00 PM)** — VP Engineering compensation approval.\n\nWould you like me to open the Meeting Brief for ABC Capital?";
      suggestedPrompts = ["Prepare me for my 10:30 meeting.", "Open AeroDynamics Brief"];
    } else if (lower.includes("follow-up") || lower.includes("overdue")) {
      const overdue = db.tasks.filter(t => t.dueDate < "2026-09-09" && t.status !== 'COMPLETED');
      replyText = `You have ${overdue.length} overdue follow-up items:\n\n` +
        overdue.map(t => `• **${t.title}** (Due ${t.dueDate})`).join("\n") +
        `\n\nI have already drafted a follow-up email to Rajesh Kumar regarding the ABC Capital term sheet.`;
      approvalId = "app-2";
      actionCard = {
        type: 'EMAIL_DRAFT_PROPOSAL',
        title: 'Draft Email to Rajesh Kumar',
        details: {
          recipient: 'Rajesh Kumar <rkumar@abccapital.com>',
          subject: 'Follow-up: SV Partners / ABC Capital Series B Co-Investment Term Sheet',
          status: 'Awaiting Approval'
        },
        approvalId: 'app-2'
      };
      suggestedPrompts = ["Approve sending email", "Show pending approvals"];
    } else if (lower.includes("tasks") || lower.includes("due today")) {
      const todayT = db.tasks.filter(t => t.dueDate === "2026-09-09");
      replyText = `You have ${todayT.length} tasks scheduled for today:\n\n` +
        todayT.map(t => `• [${t.priority}] **${t.title}** (${t.dueTime || 'EOD'})`).join("\n");
      suggestedPrompts = ["Show overdue tasks", "What do I have tomorrow?"];
    } else if (lower.includes("prepare me for my 10:30") || lower.includes("abc capital")) {
      replyText = "Here is your briefing for the 10:30 AM ABC Capital meeting:\n\n• **Goal**: Finalize 12% co-lead syndicate allocation and board observer rights.\n• **Context**: Proposal dispatched August 18; follow-up overdue by 1 day.\n• **AI Insight**: Offer Board Observer seat if equity allocation drops below 10%.";
      actionCard = {
        type: 'PREPARE_MEETING',
        title: 'ABC Capital Meeting Brief',
        details: {
          eventId: 'evt-2',
          briefId: 'brief-1',
          organization: 'ABC Capital',
          keyParticipants: 'Rajesh Kumar, Arun Sharma'
        }
      };
      suggestedPrompts = ["Open full Brief modal", "Reschedule this meeting"];
    } else if (lower.includes("remind me to call rajesh") || lower.includes("remind me")) {
      replyText = "I have drafted a reminder task for tomorrow:\n\n**Task**: Call Rajesh Kumar regarding Series B term sheet feedback.\n**Due Date**: September 10, 2026 at 09:00 AM.\n\nShall I add this to your task list?";
      actionCard = {
        type: 'TASK_PROPOSAL',
        title: 'Create Task Proposal',
        details: {
          title: 'Call Rajesh Kumar regarding Series B feedback',
          dueDate: '2026-09-10',
          dueTime: '09:00',
          priority: 'HIGH'
        }
      };
      suggestedPrompts = ["Yes, create task", "Cancel task proposal"];
    } else if (lower.includes("move my 4 pm") || lower.includes("move meeting")) {
      replyText = "I have prepared an approval request to move your 4:00 PM 'SV Partners — Talent & Operations Update' to tomorrow at 4:00 PM.";
      approvalId = "app-1";
      suggestedPrompts = ["Review approval", "What else is pending?"];
    } else {
      replyText = `Understood. I have logged your command: "${userText}". How else can I assist your workflow today, Victoria?`;
      suggestedPrompts = ["What do I have today?", "Which meetings need preparation?", "Show pending approvals"];
    }

    const replyMsg: AssistantMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toISOString(),
      suggestedPrompts,
      actionCard,
      approvalId
    };

    db.assistantMessages.push(replyMsg);
    return { userMessage: userMsg, replyMessage: replyMsg };
  },

  // Settings
  async getSettings(): Promise<{ profile: ExecutiveProfile; preferences: ExecutivePreferences; googleStatus: GoogleWorkspaceStatus }> {
    await delay();
    return {
      profile: db.profile,
      preferences: db.preferences,
      googleStatus: db.googleStatus
    };
  },

  async updateSettings(updates: {
    profile?: Partial<ExecutiveProfile>;
    preferences?: Partial<ExecutivePreferences>;
  }): Promise<{ profile: ExecutiveProfile; preferences: ExecutivePreferences }> {
    await delay(200);
    if (updates.profile) {
      db.profile = { ...db.profile, ...updates.profile };
      if (db.authState.user) db.authState.user = db.profile;
    }
    if (updates.preferences) {
      db.preferences = { ...db.preferences, ...updates.preferences };
    }
    return { profile: db.profile, preferences: db.preferences };
  }
};
