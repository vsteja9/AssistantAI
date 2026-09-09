import { 
  CalendarEvent, 
  Task, 
  Approval, 
  Person, 
  MeetingBrief, 
  ExecutiveProfile, 
  ExecutivePreferences, 
  GoogleWorkspaceStatus, 
  AIInsight,
  AssistantMessage
} from '../types';

export const mockExecutiveProfile: ExecutiveProfile = {
  name: "Victoria Sterling",
  role: "Managing Director",
  company: "Sterling-Vanguard Partners",
  email: "v.sterling@svpartners.com",
  timezone: "America/New_York (UTC-04:00)",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop"
};

export const mockPreferences: ExecutivePreferences = {
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  meetingBufferMinutes: 15,
  preferredMeetingDurationMinutes: 30,
  maxMeetingsPerDay: 6,
  morningBriefingTime: "08:30",
  meetingPrepPreference: "2 hours before meeting",
  followUpReminderPreference: "Daily 08:45 AM",
  aiAuthority: "SUGGEST_AND_APPROVE"
};

export const mockGoogleStatus: GoogleWorkspaceStatus = {
  calendarConnected: true,
  tasksConnected: true,
  gmailConnected: true,
  lastSyncedAt: "2026-09-09T08:15:00Z"
};

export const mockPeople: Person[] = [
  {
    id: "p1",
    name: "Rajesh Kumar",
    role: "General Partner",
    organization: "ABC Capital",
    email: "rkumar@abccapital.com",
    phone: "+1 (555) 234-8901",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-09-02",
    nextMeetingDate: "2026-09-09T10:30:00",
    openFollowUpsCount: 2,
    notes: "Interested in co-leading Series B round. Interested in expanding investment timeline to Q4."
  },
  {
    id: "p2",
    name: "Elena Rostova",
    role: "Chief Executive Officer",
    organization: "AeroDynamics Tech",
    email: "elena@aerodynamicstech.io",
    phone: "+1 (555) 890-1234",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-09-07",
    nextMeetingDate: "2026-09-09T14:00:00",
    openFollowUpsCount: 1,
    notes: "Q3 ARR target surpassed by 18%. Requesting approval for VP Engineering hire."
  },
  {
    id: "p3",
    name: "Marcus Vance",
    role: "Senior Partner",
    organization: "Vance & Associates Law",
    email: "mvance@vancelegal.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-09-04",
    nextMeetingDate: "2026-09-09T11:30:00",
    openFollowUpsCount: 1,
    notes: "Finalizing LP agreement amendments for Fund IV."
  },
  {
    id: "p4",
    name: "Arun Sharma",
    role: "VP of Investments",
    organization: "ABC Capital",
    email: "asharma@abccapital.com",
    phone: "+1 (555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-09-05",
    nextMeetingDate: "2026-09-09T10:30:00",
    openFollowUpsCount: 0,
    notes: "Leading financial due diligence on Project Nexus."
  },
  {
    id: "p5",
    name: "Sophia Chen",
    role: "Head of Talent & Operations",
    organization: "Sterling-Vanguard Partners",
    email: "s.chen@svpartners.com",
    phone: "+1 (555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-09-08",
    nextMeetingDate: "2026-09-09T16:00:00",
    openFollowUpsCount: 1,
    notes: "Presenting executive search updates for portfolio companies."
  },
  {
    id: "p6",
    name: "David Miller",
    role: "Chief Financial Officer",
    organization: "Sterling-Vanguard Partners",
    email: "d.miller@svpartners.com",
    phone: "+1 (555) 210-9876",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-09-08",
    nextMeetingDate: "2026-09-10T09:30:00",
    openFollowUpsCount: 2,
    notes: "Preparing Fund IV capital call schedules and Q3 audit materials."
  },
  {
    id: "p7",
    name: "Catherine Dupont",
    role: "Investment Committee Chair",
    organization: "Global Sovereign Fund",
    email: "cdupont@sovereignfund.org",
    phone: "+33 1 42 68 55 00",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-08-30",
    nextMeetingDate: "2026-09-10T14:30:00",
    openFollowUpsCount: 1,
    notes: "Evaluating $50M commitment to SV Fund IV."
  },
  {
    id: "p8",
    name: "Jonathan Thorne",
    role: "Founder & CTO",
    organization: "QuantumScale AI",
    email: "thorne@quantumscale.ai",
    phone: "+1 (555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-09-01",
    nextMeetingDate: "2026-09-11T11:00:00",
    openFollowUpsCount: 0,
    notes: "Series A valuation negotiation. IP portfolio review completed."
  },
  {
    id: "p9",
    name: "Amara Diallo",
    role: "Managing Director",
    organization: "Horizon Growth Equity",
    email: "amara@horizongrowth.com",
    phone: "+1 (555) 432-1098",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-08-28",
    openFollowUpsCount: 0,
    notes: "Co-investor in BioHealth Dynamics."
  },
  {
    id: "p10",
    name: "Robert Sterling",
    role: "Board Member",
    organization: "Sterling Advisory",
    email: "rsterling@sterlingadvisory.com",
    phone: "+1 (555) 999-8877",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=256&auto=format&fit=crop",
    lastInteraction: "2026-08-25",
    openFollowUpsCount: 1,
    notes: "Quarterly governance review & compensation committee alignment."
  }
];

export const mockEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Morning Executive Briefing & AI Strategy",
    startTime: "2026-09-09T08:30:00",
    endTime: "2026-09-09T09:00:00",
    durationMinutes: 30,
    location: "Executive Suite 400 / Google Meet",
    meetUrl: "https://meet.google.com/svp-brief-mon",
    participants: [
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Daily automated operational overview, high-priority approvals review, and day preview.",
    meetingType: "INTERNAL",
    importance: "HIGH",
    status: "CONFIRMED",
    isBackToBack: false,
    prepRequired: false
  },
  {
    id: "evt-2",
    title: "ABC Capital — Series B Co-Investment Strategy",
    startTime: "2026-09-09T10:30:00",
    endTime: "2026-09-09T11:30:00",
    durationMinutes: 60,
    location: "Conference Room A / Google Meet",
    meetUrl: "https://meet.google.com/abc-series-b",
    participants: [
      { name: "Rajesh Kumar", email: "rkumar@abccapital.com", role: "General Partner", organization: "ABC Capital" },
      { name: "Arun Sharma", email: "asharma@abccapital.com", role: "VP Investments", organization: "ABC Capital" },
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Review term sheet proposal sent on August 18. Align on investment timeline, syndicate allocation, and board seat rights.",
    meetingType: "INVESTOR",
    importance: "HIGH",
    status: "CONFIRMED",
    isBackToBack: false,
    prepRequired: true,
    briefId: "brief-1"
  },
  {
    id: "evt-3",
    title: "LP Agreement Legal Review w/ Marcus Vance",
    startTime: "2026-09-09T11:30:00",
    endTime: "2026-09-09T12:15:00",
    durationMinutes: 45,
    location: "Google Meet",
    meetUrl: "https://meet.google.com/vance-lp-review",
    participants: [
      { name: "Marcus Vance", email: "mvance@vancelegal.com", role: "Senior Partner", organization: "Vance Legal" },
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Review clause 4.2 side-letter revisions for Sovereign Fund commitment.",
    meetingType: "STRATEGY",
    importance: "HIGH",
    status: "CONFIRMED",
    isBackToBack: true,
    prepRequired: true,
    briefId: "brief-2"
  },
  {
    id: "evt-4",
    title: "AeroDynamics Tech — Q3 Performance & Exec Hiring",
    startTime: "2026-09-09T14:00:00",
    endTime: "2026-09-09T15:00:00",
    durationMinutes: 60,
    location: "Boardroom 2 / Hybrid",
    meetUrl: "https://meet.google.com/aerodynamics-q3",
    participants: [
      { name: "Elena Rostova", email: "elena@aerodynamicstech.io", role: "CEO", organization: "AeroDynamics" },
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Quarterly review of revenue milestone beat (+18% ARR) and VP Engineering compensation package approval.",
    meetingType: "BOARD",
    importance: "HIGH",
    status: "CONFIRMED",
    isBackToBack: false,
    prepRequired: true,
    briefId: "brief-3"
  },
  {
    id: "evt-5",
    title: "SV Partners — Talent & Operations Update",
    startTime: "2026-09-09T16:00:00",
    endTime: "2026-09-09T16:45:00",
    durationMinutes: 45,
    location: "Victoria's Office",
    meetUrl: "https://meet.google.com/sv-talent-ops",
    participants: [
      { name: "Sophia Chen", email: "s.chen@svpartners.com", role: "Head of Talent", organization: "SV Partners" },
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Review key hires across portfolio companies and SV internal partner hiring pipeline.",
    meetingType: "1ON1",
    importance: "MEDIUM",
    status: "CONFIRMED",
    isBackToBack: false,
    prepRequired: false
  },
  {
    id: "evt-6",
    title: "Fund IV Capital Call & Finance Sync",
    startTime: "2026-09-10T09:30:00",
    endTime: "2026-09-10T10:15:00",
    durationMinutes: 45,
    location: "Finance Suite",
    meetUrl: "https://meet.google.com/sv-finance-q3",
    participants: [
      { name: "David Miller", email: "d.miller@svpartners.com", role: "CFO", organization: "SV Partners" },
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Approve $25M capital call notice schedule for Q4 deals.",
    meetingType: "INTERNAL",
    importance: "HIGH",
    status: "CONFIRMED",
    isBackToBack: false,
    prepRequired: true,
    briefId: "brief-4"
  },
  {
    id: "evt-7",
    title: "Global Sovereign Fund — Catherine Dupont LP Sync",
    startTime: "2026-09-10T14:30:00",
    endTime: "2026-09-10T15:30:00",
    durationMinutes: 60,
    location: "Google Meet / Paris HQ",
    meetUrl: "https://meet.google.com/sovereign-lp-sync",
    participants: [
      { name: "Catherine Dupont", email: "cdupont@sovereignfund.org", role: "IC Chair", organization: "Global Sovereign Fund" },
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Final alignment call on $50M anchor allocation in SV Fund IV.",
    meetingType: "INVESTOR",
    importance: "HIGH",
    status: "CONFIRMED",
    isBackToBack: false,
    prepRequired: true,
    briefId: "brief-5"
  },
  {
    id: "evt-8",
    title: "QuantumScale AI — Series A Valuation Review",
    startTime: "2026-09-11T11:00:00",
    endTime: "2026-09-11T12:00:00",
    durationMinutes: 60,
    location: "Google Meet",
    meetUrl: "https://meet.google.com/quantumscale-review",
    participants: [
      { name: "Jonathan Thorne", email: "thorne@quantumscale.ai", role: "Founder & CTO", organization: "QuantumScale AI" },
      { name: "Victoria Sterling", email: "v.sterling@svpartners.com", role: "Managing Director" }
    ],
    description: "Discuss lead investor valuation targets and IP defense strategy.",
    meetingType: "CLIENT",
    importance: "MEDIUM",
    status: "CONFIRMED",
    isBackToBack: false,
    prepRequired: false
  }
];

export const mockTasks: Task[] = [
  {
    id: "t-1",
    title: "Send follow-up email to Rajesh Kumar regarding ABC Capital term sheet",
    description: "Confirm whether ABC Capital accepts the 12% co-lead equity split and board observer seat.",
    dueDate: "2026-09-08",
    dueTime: "17:00",
    priority: "HIGH",
    status: "PENDING", // Overdue
    source: "EMAIL",
    personId: "p1",
    createdAt: "2026-09-07T14:20:00Z"
  },
  {
    id: "t-2",
    title: "Review & Sign Fund IV LP Side-Letter Revisions",
    description: "Marcus Vance sent updated draft with sovereign fund ESG compliance requirements.",
    dueDate: "2026-09-09",
    dueTime: "12:30",
    priority: "HIGH",
    status: "PENDING",
    source: "CALENDAR",
    personId: "p3",
    createdAt: "2026-09-08T09:00:00Z"
  },
  {
    id: "t-3",
    title: "Approve compensation package for AeroDynamics VP Engineering candidate",
    description: "Elena Rostova submitted $380k base + 1.2% equity package proposal.",
    dueDate: "2026-09-09",
    dueTime: "15:30",
    priority: "HIGH",
    status: "PENDING",
    source: "ASSISTANT",
    personId: "p2",
    createdAt: "2026-09-08T18:00:00Z"
  },
  {
    id: "t-4",
    title: "Confirm Q4 Capital Call Schedule with David Miller",
    description: "Cross-check liquidity buffers prior to publishing drawdown notices.",
    dueDate: "2026-09-09",
    dueTime: "18:00",
    priority: "MEDIUM",
    status: "PENDING",
    source: "MANUAL",
    personId: "p6",
    createdAt: "2026-09-09T08:00:00Z"
  },
  {
    id: "t-5",
    title: "Prepare talking points for Catherine Dupont (Global Sovereign Fund)",
    description: "Highlight co-investment rights and Q2 portfolio growth figures.",
    dueDate: "2026-09-10",
    dueTime: "11:00",
    priority: "HIGH",
    status: "PENDING",
    source: "ASSISTANT",
    personId: "p7",
    createdAt: "2026-09-09T07:30:00Z"
  },
  {
    id: "t-6",
    title: "Review QuantumScale AI Due Diligence Vault",
    description: "Check technical patent audit report prepared by third-party counsel.",
    dueDate: "2026-09-10",
    dueTime: "16:00",
    priority: "MEDIUM",
    status: "PENDING",
    source: "MANUAL",
    personId: "p8",
    createdAt: "2026-09-08T11:00:00Z"
  },
  {
    id: "t-7",
    title: "Overdue: Send Q3 Portfolio Report to Advisory Board",
    description: "Advisory board requested updated valuation metrics for Q3.",
    dueDate: "2026-09-07",
    dueTime: "17:00",
    priority: "HIGH",
    status: "PENDING", // Overdue
    source: "EMAIL",
    personId: "p10",
    createdAt: "2026-09-05T10:00:00Z"
  },
  {
    id: "t-8",
    title: "Schedule quarterly 1-on-1s with SV Partners Principals",
    description: "Sophia Chen requested date slots for October talent reviews.",
    dueDate: "2026-09-12",
    dueTime: "17:00",
    priority: "LOW",
    status: "PENDING",
    source: "ASSISTANT",
    personId: "p5",
    createdAt: "2026-09-09T08:00:00Z"
  },
  {
    id: "t-9",
    title: "Approve SV Partners Q3 Press Release on AI Fund",
    description: "Draft ready for review from PR communications team.",
    dueDate: "2026-09-08",
    dueTime: "16:00",
    priority: "MEDIUM",
    status: "COMPLETED",
    source: "MANUAL",
    createdAt: "2026-09-07T12:00:00Z"
  },
  {
    id: "t-10",
    title: "Send intro email connecting Amara Diallo with AeroDynamics CEO",
    description: "Facilitate growth strategy knowledge transfer between portfolio leaders.",
    dueDate: "2026-09-06",
    dueTime: "12:00",
    priority: "LOW",
    status: "COMPLETED",
    source: "EMAIL",
    personId: "p9",
    createdAt: "2026-09-05T14:00:00Z"
  }
];

export const mockApprovals: Approval[] = [
  {
    id: "app-1",
    type: "RESCHEDULE_MEETING",
    status: "PENDING",
    title: "Reschedule ABC Capital Co-Investment Sync",
    reason: "Back-to-back schedule detected between 10:30 AM and 12:15 PM. Rescheduling creates a 30-minute preparation window before Marcus Vance legal review.",
    riskLevel: "MEDIUM",
    requestedTime: "2026-09-09T08:32:00Z",
    currentState: {
      eventTitle: "ABC Capital — Series B Co-Investment Strategy",
      time: "Today, 10:30 AM - 11:30 AM",
      location: "Conference Room A"
    },
    proposedState: {
      eventTitle: "ABC Capital — Series B Co-Investment Strategy",
      time: "Tomorrow, 11:00 AM - 12:00 PM",
      location: "Conference Room A / Hybrid"
    },
    targetEntityId: "evt-2"
  },
  {
    id: "app-2",
    type: "SEND_EMAIL",
    status: "PENDING",
    title: "Send Overdue Term Sheet Follow-up to Rajesh Kumar",
    reason: "Follow-up email is 24 hours overdue. Automated draft ready based on last meeting action items.",
    riskLevel: "LOW",
    requestedTime: "2026-09-09T08:35:00Z",
    currentState: {
      recipient: "Rajesh Kumar <rkumar@abccapital.com>",
      subject: "Pending - SV Partners / ABC Capital Co-Investment Alignment",
      status: "Draft Ready"
    },
    proposedState: {
      recipient: "Rajesh Kumar <rkumar@abccapital.com>",
      subject: "Follow-up: SV Partners / ABC Capital Series B Co-Investment Term Sheet",
      body: "Hi Rajesh, Following up on our proposed term sheet. We are eager to confirm the co-lead allocation before our IC meeting this Thursday. Let me know if 10:30 AM today or tomorrow works best to finalize. Best, Victoria"
    },
    targetEntityId: "t-1"
  },
  {
    id: "app-3",
    type: "CREATE_TASK",
    status: "PENDING",
    title: "Create Task: Review Sovereign Fund Side-Letter Clause 4.2",
    reason: "Flagged high-priority legal commitment during morning document sync with Vance & Associates.",
    riskLevel: "LOW",
    requestedTime: "2026-09-09T08:40:00Z",
    currentState: {
      taskCount: "3 active high priority"
    },
    proposedState: {
      taskTitle: "Review LP Agreement Clause 4.2 Revisions",
      dueDate: "Today, 12:30 PM",
      priority: "HIGH",
      assignee: "Victoria Sterling"
    }
  },
  {
    id: "app-4",
    type: "CANCEL_MEETING",
    status: "PENDING",
    title: "Cancel Low-Priority Internal Alignment w/ Product Lead",
    reason: "Conflict detected with unexpected Sovereign Fund LP prep call.",
    riskLevel: "LOW",
    requestedTime: "2026-09-09T08:42:00Z",
    currentState: {
      meeting: "Product Roadmap Monthly Check-in",
      time: "Tomorrow, 14:30 PM"
    },
    proposedState: {
      status: "CANCELLED",
      note: "Polite cancellation note will be dispatched to host with rescheduling link."
    }
  },
  {
    id: "app-5",
    type: "CREATE_MEETING",
    status: "PENDING",
    title: "Schedule Emergency Advisory Board Sync on Market Volatility",
    reason: "Market shift impact review requested by Advisory Board Chair Robert Sterling.",
    riskLevel: "HIGH",
    requestedTime: "2026-09-09T08:45:00Z",
    currentState: {
      timeSlot: "Unscheduled"
    },
    proposedState: {
      meetingTitle: "Advisory Board Emergency Briefing — Tech Sector Valuations",
      time: "Friday, Sept 11, 16:00 - 16:30 PM",
      attendees: ["Robert Sterling", "Victoria Sterling", "David Miller"]
    }
  }
];

export const mockMeetingBriefs: Record<string, MeetingBrief> = {
  "brief-1": {
    id: "brief-1",
    eventId: "evt-2",
    title: "ABC Capital — Series B Co-Investment Strategy",
    organization: "ABC Capital",
    participants: [
      { name: "Rajesh Kumar", role: "General Partner", email: "rkumar@abccapital.com" },
      { name: "Arun Sharma", role: "VP Investments", email: "asharma@abccapital.com" }
    ],
    meetingPurpose: "Finalize co-lead participation rights, syndicate ownership target (12%), and board seat governance for Project Nexus.",
    previousInteractions: "Initial term sheet dispatched August 18. Follow-up dinner held September 2 in New York. ABC Capital expressed enthusiasm but questioned anti-dilution provisions.",
    openCommitments: [
      "Victoria to confirm SV Fund IV check size ($15M)",
      "Rajesh to provide IC vote timeline from ABC Capital board"
    ],
    outstandingFollowUps: [
      "Follow-up email on term sheet clause 8 (overdue by 1 day)"
    ],
    recommendedDiscussion: [
      "1. Clarify co-lead governance and voting rights on major capital expenditures.",
      "2. Agree on final investment closing target date (October 15).",
      "3. Address ABC Capital's anti-dilution clause concerns with compromise language."
    ],
    aiRecommendations: [
      "Offer ABC Capital a Board Observer position if co-lead equity threshold falls below 10%.",
      "Ensure agreement is reached before Thursday's SV Investment Committee meeting."
    ]
  },
  "brief-2": {
    id: "brief-2",
    eventId: "evt-3",
    title: "LP Agreement Legal Review w/ Marcus Vance",
    organization: "Vance & Associates Law",
    participants: [
      { name: "Marcus Vance", role: "Senior Partner", email: "mvance@vancelegal.com" }
    ],
    meetingPurpose: "Review legal revisions to SV Fund IV LP Agreement side-letter requested by Catherine Dupont (Global Sovereign Fund).",
    previousInteractions: "Draft side-letter received September 4. Legal team redlined clause 4.2 regarding ESG reporting frequency and co-investment fee waivers.",
    openCommitments: [
      "Marcus to provide final redline document before meeting"
    ],
    outstandingFollowUps: [
      "Confirm tax structure for European LP entity"
    ],
    recommendedDiscussion: [
      "1. Clause 4.2 ESG quarterly reporting scope and compliance overhead.",
      "2. Management fee discount request (50 bps reduction for commitments > $40M).",
      "3. Timeline to send final execution copy to Catherine Dupont by Friday."
    ],
    aiRecommendations: [
      "Accept 25 bps management fee concession instead of 50 bps to preserve fund economics.",
      "Lock in $50M commitment ahead of Q4 first close."
    ]
  },
  "brief-3": {
    id: "brief-3",
    eventId: "evt-4",
    title: "AeroDynamics Tech — Q3 Performance & Exec Hiring",
    organization: "AeroDynamics Tech",
    participants: [
      { name: "Elena Rostova", role: "CEO", email: "elena@aerodynamicstech.io" }
    ],
    meetingPurpose: "Review Q3 financial performance surge (+18% ARR beat) and approve compensation package for incoming VP of Engineering.",
    previousInteractions: "Board meeting on August 15 approved expansion budget. Elena emailed compensation proposal on September 7.",
    openCommitments: [
      "Victoria to review VP Engineering candidate reference checks",
      "Elena to share updated Q4 pipeline projections"
    ],
    outstandingFollowUps: [
      "Sign off on $380k + 1.2% equity package"
    ],
    recommendedDiscussion: [
      "1. Celebrate Q3 ARR milestone and discuss enterprise sales expansion in EMEA.",
      "2. Evaluate VP Engineering compensation vs market benchmark.",
      "3. Set Q4 hiring targets for DevOps and Solutions Architecture teams."
    ],
    aiRecommendations: [
      "Approve compensation package with a 4-year vesting schedule and 1-year cliff.",
      "Suggest introducing Elena to Amara Diallo for EMEA go-to-market insights."
    ]
  },
  "brief-4": {
    id: "brief-4",
    eventId: "evt-6",
    title: "Fund IV Capital Call & Finance Sync",
    organization: "Sterling-Vanguard Partners",
    participants: [
      { name: "David Miller", role: "CFO", email: "d.miller@svpartners.com" }
    ],
    meetingPurpose: "Approve $25M capital drawdown notice for Q4 initial portfolio investments.",
    previousInteractions: "Q2 audit completed successfully. Capital call schedule discussed Sept 8.",
    openCommitments: [
      "David to send LP cash flow models"
    ],
    outstandingFollowUps: [
      "Sign capital call notices"
    ],
    recommendedDiscussion: [
      "1. Review drawdown timeline (Notice date: Sept 15, Due date: Oct 1).",
      "2. Verify LP default protection safeguards.",
      "3. Reserve management for follow-on capital."
    ],
    aiRecommendations: [
      "Ensure capital call aligns with Global Sovereign Fund's onboarding date."
    ]
  },
  "brief-5": {
    id: "brief-5",
    eventId: "evt-7",
    title: "Global Sovereign Fund — Catherine Dupont LP Sync",
    organization: "Global Sovereign Fund",
    participants: [
      { name: "Catherine Dupont", role: "IC Chair", email: "cdupont@sovereignfund.org" }
    ],
    meetingPurpose: "Finalize $50M anchor LP commitment to SV Fund IV.",
    previousInteractions: "Due diligence passed with zero flags in August. Side-letter redline in progress with Marcus Vance.",
    openCommitments: [
      "Victoria to share side-letter revisions post legal review"
    ],
    outstandingFollowUps: [
      "Send final execution documents"
    ],
    recommendedDiscussion: [
      "1. Walk through finalized side-letter ESG clauses.",
      "2. Confirm IC voting date in Paris (Sept 18).",
      "3. Discuss Advisory Board seat appointment."
    ],
    aiRecommendations: [
      "Confirm Marcus Vance's redline before call to offer immediate clarity on Clause 4.2."
    ]
  }
};

export const mockAIInsights: AIInsight[] = [
  {
    id: "ins-1",
    type: "BACK_TO_BACK",
    title: "Back-to-back meetings detected",
    description: "You have 2 consecutive high-importance meetings without a break between 10:30 AM and 12:15 PM.",
    severity: "warning",
    actionText: "Review Reschedule Approval",
    actionType: "REVIEW_APPROVAL",
    targetId: "app-1",
    targetRoute: "/approvals"
  },
  {
    id: "ins-2",
    type: "OVERDUE_FOLLOWUP",
    title: "Follow-up email is overdue",
    description: "Term sheet follow-up to Rajesh Kumar (ABC Capital) was due yesterday at 5:00 PM.",
    severity: "urgent",
    actionText: "Approve AI Draft Email",
    actionType: "REVIEW_APPROVAL",
    targetId: "app-2",
    targetRoute: "/approvals"
  },
  {
    id: "ins-3",
    type: "PREP_REQUIRED",
    title: "Meeting requires preparation",
    description: "AeroDynamics Tech Q3 review at 2:00 PM requires VP Engineering compensation package sign-off.",
    severity: "info",
    actionText: "View Meeting Brief",
    actionType: "VIEW_PREP",
    targetId: "evt-4",
    targetRoute: "/calendar"
  },
  {
    id: "ins-4",
    type: "FREE_TIME_WINDOW",
    title: "Large free-time window available",
    description: "You have a clear 90-minute focus window from 12:15 PM to 1:45 PM today.",
    severity: "info",
    actionText: "View Tasks",
    actionType: "NAVIGATE",
    targetRoute: "/tasks"
  },
  {
    id: "ins-5",
    type: "IMPORTANT_COMMITMENT",
    title: "Important commitment approaching",
    description: "$50M Sovereign Fund anchor commitment sync scheduled for tomorrow at 2:30 PM.",
    severity: "info",
    actionText: "View Brief",
    actionType: "VIEW_PREP",
    targetId: "evt-7",
    targetRoute: "/calendar"
  }
];

export const initialAssistantMessages: AssistantMessage[] = [
  {
    id: "msg-1",
    sender: "assistant",
    text: "Good morning, Victoria. I've prepared your executive summary for Wednesday, September 9, 2026.\n\nYou have 5 meetings today, 2 pending high-priority approvals, and 1 overdue follow-up with Rajesh Kumar (ABC Capital).\n\nHow would you like to proceed?",
    timestamp: "2026-09-09T08:30:00Z",
    suggestedPrompts: [
      "What do I have today?",
      "Which meetings need preparation?",
      "What follow-ups are overdue?",
      "Prepare me for my 10:30 meeting.",
      "When am I free tomorrow?"
    ]
  }
];
