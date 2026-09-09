import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  CheckSquare, 
  CheckSquare2, 
  Users, 
  Settings as SettingsIcon, 
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { useApp, TabType } from '../context/AppContext';
import { cn } from '../lib/utils';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTab, setActiveTab, authState, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { id: 'dashboard' as TabType, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant' as TabType, name: 'AI Assistant', icon: MessageSquare },
    { id: 'calendar' as TabType, name: 'Calendar', icon: Calendar },
    { id: 'tasks' as TabType, name: 'Tasks', icon: CheckSquare },
    { id: 'approvals' as TabType, name: 'Approvals', icon: ShieldCheck, badgeCount: true },
    { id: 'people' as TabType, name: 'People', icon: Users },
    { id: 'settings' as TabType, name: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between px-5 h-14 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-950 font-bold text-xs tracking-wider">
            E
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-200">ExecutiveOS</span>
          <span className="text-[9px] uppercase bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono font-medium">V1.0</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-slate-100 p-1.5 rounded bg-slate-900/60 border border-slate-800/80"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop & Mobile Sidebar Navigation */}
      <nav 
        className={cn(
          "w-64 border-r border-slate-900 bg-slate-950/90 md:bg-slate-950 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30 transform md:transform-none md:sticky md:top-0 h-screen transition-transform duration-200 ease-in-out",
          mobileMenuOpen ? "translate-x-0 pt-14 md:pt-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col flex-1 py-6 px-4 space-y-7 overflow-y-auto">
          
          {/* Brand Identity */}
          <div className="hidden md:flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-950 font-bold text-sm tracking-widest shadow-sm">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-100 leading-none">ExecutiveOS</span>
              <span className="text-[9px] uppercase font-mono text-slate-500 font-semibold tracking-wider mt-0.5">Private Console</span>
            </div>
          </div>

          {/* Nav List */}
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 h-10 rounded text-sm font-medium transition-colors select-none group",
                    isActive 
                      ? "bg-slate-900 text-slate-100 border border-slate-800/80 shadow-inner" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-slate-100" : "text-slate-400 group-hover:text-slate-200")} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-900/60 space-y-3.5 bg-slate-900/10">
          <div className="flex items-center gap-3 px-1.5">
            {authState.user?.avatarUrl ? (
              <img 
                src={authState.user.avatarUrl} 
                alt="Victoria Sterling" 
                className="w-9 h-9 rounded-full object-cover border border-slate-800"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300 uppercase">
                {authState.user?.name?.substring(0, 2) || "VS"}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate leading-tight">{authState.user?.name || "Victoria Sterling"}</span>
              <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{authState.user?.role || "Managing Director"}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 h-9 rounded text-xs font-medium text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-950/50 transition-all select-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Console</span>
          </button>
        </div>
      </nav>

      {/* Screen Backdrop for Mobile Navigation */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 md:hidden"
        />
      )}

      {/* App Main Work Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-8">
          {children}
        </div>
      </main>

    </div>
  );
};
