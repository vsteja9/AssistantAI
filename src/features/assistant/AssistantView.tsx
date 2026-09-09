import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { AssistantMessage } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { formatDateString } from '../../lib/utils';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Mail, 
  Calendar, 
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

export const AssistantView: React.FC = () => {
  const { setSelectedBriefId, setActiveTab, refreshDashboard } = useApp();
  const { showToast } = useToast();
  
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What do I have today?",
    "Which meetings need preparation?",
    "What follow-ups are overdue?",
    "Prepare me for my 10:30 meeting.",
    "When am I free tomorrow?",
    "Remind me to call Rajesh tomorrow.",
    "What tasks are due today?"
  ];

  const loadMessages = async () => {
    try {
      const msgs = await api.getAssistantMessages();
      setMessages(msgs);
    } catch (err) {
      showToast("Failed to load message history", "error");
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    setInputText('');
    setIsTyping(true);

    // Optimistic user message append
    const tempUserMsg: AssistantMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const { replyMessage } = await api.sendAssistantMessage(text);
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, replyMessage]);
      refreshDashboard();
    } catch (err) {
      showToast("Assistant communication failed", "error");
    } finally {
      setIsTyping(false);
    }
  };

  const handleCreateTaskFromProposal = async (details: Record<string, any>) => {
    try {
      await api.createTask({
        title: details.title,
        dueDate: details.dueDate || '2026-09-10',
        dueTime: details.dueTime || '09:00',
        priority: details.priority || 'HIGH',
        status: 'PENDING',
        source: 'ASSISTANT'
      });
      showToast("Task added from AI proposal", "success");
      refreshDashboard();
    } catch (err) {
      showToast("Failed to create task", "error");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span>Executive Command Assistant</span>
              <Badge variant="outline" className="text-[10px] font-mono border-sky-900 text-sky-400">
                SUGGEST & APPROVE
              </Badge>
            </h1>
            <p className="text-[11px] text-slate-400">
              Query schedules, request meeting briefs, and trigger action proposals.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Private Enclave • Latency ~150ms</span>
        </div>
      </div>

      {/* Suggested Command Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Suggestions:</span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isTyping}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-lg p-4 space-y-3 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                }`}
              >
                {/* Text with simple markdown formatting */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Inline Action Card */}
                {msg.actionCard && (
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 mt-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-sky-400 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {msg.actionCard.title}
                      </span>
                      <Badge variant="outline" className="text-[9px] font-mono">
                        {msg.actionCard.type}
                      </Badge>
                    </div>

                    <div className="text-[11px] space-y-1 text-slate-300">
                      {Object.entries(msg.actionCard.details).map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span className="text-slate-500 font-mono capitalize">{k}:</span>
                          <span className="text-slate-200 font-medium">{String(v)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Card Button */}
                    <div className="pt-2 flex justify-end">
                      {msg.actionCard.type === 'PREPARE_MEETING' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedBriefId(msg.actionCard?.details.briefId || 'brief-1')}
                          className="text-[11px] h-7 gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Meeting Brief</span>
                        </Button>
                      )}

                      {msg.actionCard.type === 'EMAIL_DRAFT_PROPOSAL' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveTab('approvals')}
                          className="text-[11px] h-7 gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Review in Approvals</span>
                        </Button>
                      )}

                      {msg.actionCard.type === 'TASK_PROPOSAL' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCreateTaskFromProposal(msg.actionCard?.details || {})}
                          className="text-[11px] h-7 gap-1"
                        >
                          <CheckSquare className="w-3 h-3" />
                          <span>Add Task to Queue</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Follow-up Prompt Buttons */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedPrompts.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(p)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-[9px] font-mono text-slate-500 text-right">
                  {formatDateString(msg.timestamp, 'h:mm a')}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-mono text-[11px]">Executive assistant formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="shrink-0 flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2 backdrop-blur-md"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask your Executive Assistant (e.g. 'What do I have today?', 'Prepare me for my 10:30 meeting')..."
          disabled={isTyping}
          className="flex-1 bg-transparent px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim() || isTyping}
          className="h-8 px-3 gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3 h-3" />
        </Button>
      </form>

    </div>
  );
};
