import React, { useState, useEffect } from 'react';
import { Task, Priority, TaskSource } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => Promise<void>;
  initialTask?: Task | null;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-09-09');
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState<Priority>('HIGH');
  const [source, setSource] = useState<TaskSource>('MANUAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate);
      setDueTime(initialTask.dueTime || '17:00');
      setPriority(initialTask.priority);
      setSource(initialTask.source);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('2026-09-09');
      setDueTime('17:00');
      setPriority('HIGH');
      setSource('MANUAL');
    }
  }, [initialTask, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        dueDate,
        dueTime,
        priority,
        status: 'PENDING',
        source
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <span className="text-base font-semibold text-slate-100">
          {initialTask ? 'Edit Executive Task' : 'Create Executive Task'}
        </span>
      }
      subtitle="Track priority commitments, follow-ups, and delegations."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium">Task Action / Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Confirm term sheet closing date with Rajesh Kumar"
            className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Due Time</label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            >
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as TaskSource)}
              className="w-full h-9 px-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            >
              <option value="MANUAL">Manual Entry</option>
              <option value="EMAIL">Email Correspondence</option>
              <option value="ASSISTANT">AI Assistant</option>
              <option value="CALENDAR">Calendar Sync</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium">Context & Notes</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key deliverables, dependencies, or references..."
            className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-600 resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            {initialTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
