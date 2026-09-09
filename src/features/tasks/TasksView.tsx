import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { Task, Priority } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CreateTaskModal } from './CreateTaskModal';
import { useToast } from '../../components/ui/Toast';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  Calendar, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Moon, 
  Trash2, 
  Edit3,
  CalendarClock,
  Sparkles,
  Inbox
} from 'lucide-react';

type TaskTab = 'today' | 'upcoming' | 'overdue' | 'completed';

export const TasksView: React.FC = () => {
  const { dashboardRefreshTrigger, refreshDashboard } = useApp();
  const { showToast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TaskTab>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const todayStr = '2026-09-09';

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      showToast("Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [dashboardRefreshTrigger]);

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      showToast(newStatus === 'COMPLETED' ? "Task marked complete" : "Task reopened", "success");
      refreshDashboard();
    } catch (err) {
      showToast("Failed to update task", "error");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast("Task deleted", "info");
      refreshDashboard();
    } catch (err) {
      showToast("Failed to delete task", "error");
    }
  };

  const handleSnooze = async (task: Task) => {
    try {
      const newDate = '2026-09-10';
      await api.updateTask(task.id, { dueDate: newDate, status: 'SNOOZED' });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, dueDate: newDate, status: 'SNOOZED' } : t));
      showToast("Task snoozed until tomorrow", "info");
      refreshDashboard();
    } catch (err) {
      showToast("Failed to snooze task", "error");
    }
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      if (editingTask) {
        const updated = await api.updateTask(editingTask.id, taskData);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
        showToast("Task updated", "success");
      } else {
        const created = await api.createTask(taskData);
        setTasks(prev => [created, ...prev]);
        showToast("Task created", "success");
      }
      refreshDashboard();
    } catch (err) {
      showToast("Failed to save task", "error");
    }
  };

  // Tab counts
  const overdueCount = tasks.filter(t => t.dueDate < todayStr && t.status !== 'COMPLETED').length;
  const todayCount = tasks.filter(t => t.dueDate === todayStr && t.status !== 'COMPLETED').length;
  const upcomingCount = tasks.filter(t => t.dueDate > todayStr && t.status !== 'COMPLETED').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  // Filter tasks based on activeTab
  const filteredTasks = tasks.filter(t => {
    // Tab filter
    if (activeTab === 'today') {
      if (t.dueDate !== todayStr || t.status === 'COMPLETED') return false;
    } else if (activeTab === 'overdue') {
      if (t.dueDate >= todayStr || t.status === 'COMPLETED') return false;
    } else if (activeTab === 'upcoming') {
      if (t.dueDate <= todayStr || t.status === 'COMPLETED') return false;
    } else if (activeTab === 'completed') {
      if (t.status !== 'COMPLETED') return false;
    }

    // Priority filter
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">Tasks & Commitments</h1>
            {overdueCount > 0 && (
              <Badge variant="high" className="text-[10px]">
                {overdueCount} Overdue
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track high-priority executive follow-ups, term sheet deliverables, and board items.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="gap-1.5 text-xs h-8"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Executive Task</span>
        </Button>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'today'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Today</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-mono text-slate-300">
              {todayCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Upcoming</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-mono text-slate-300">
              {upcomingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overdue'
                ? 'bg-rose-950/80 text-rose-200 border border-rose-800/80'
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Overdue</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950 font-mono text-rose-300">
              {overdueCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Completed</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-mono text-slate-400">
              {completedCount}
            </span>
          </button>
        </div>

        {/* Search & Priority Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 w-36 sm:w-48 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

      </div>

      {/* Task List Section */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 border-slate-800">
            <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-medium text-slate-300">
              {activeTab === 'today' ? "You're clear for today." : "No tasks found."}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              All executive action items in this category are completed or unscheduled.
            </p>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            const isOverdue = task.dueDate < todayStr && !isCompleted;

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 group ${
                  isCompleted 
                    ? 'bg-slate-950/40 border-slate-900 opacity-60' 
                    : isOverdue 
                    ? 'bg-rose-950/10 border-rose-900/40 hover:border-rose-800/60' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="mt-0.5 text-slate-400 hover:text-sky-400 transition-colors shrink-0"
                    aria-label="Toggle complete"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {task.title}
                      </span>

                      <Badge 
                        variant={task.priority === 'HIGH' ? 'high' : task.priority === 'MEDIUM' ? 'medium' : 'low'}
                        className="text-[9px]"
                      >
                        {task.priority}
                      </Badge>

                      <Badge variant="outline" className="text-[9px] font-mono">
                        {task.source}
                      </Badge>

                      {isOverdue && (
                        <Badge variant="destructive" className="text-[9px] font-bold">
                          Overdue ({task.dueDate})
                        </Badge>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  {!isCompleted && (
                    <button
                      onClick={() => handleSnooze(task)}
                      title="Snooze 1 Day"
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsModalOpen(true);
                    }}
                    title="Edit Task"
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete Task"
                    className="p-1.5 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />

    </div>
  );
};
