import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { Person } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PersonDetailModal } from './PersonDetailModal';
import { useToast } from '../../components/ui/Toast';
import { formatDateString } from '../../lib/utils';
import { 
  Users, 
  Search, 
  Building2, 
  Calendar, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  Mail,
  UserCheck
} from 'lucide-react';

export const PeopleView: React.FC = () => {
  const { setActiveTab } = useApp();
  const { showToast } = useToast();
  
  const [people, setPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadPeople = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPeople();
      setPeople(data);
    } catch (err) {
      showToast("Failed to load people directory", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const handleOpenPerson = (person: Person) => {
    setSelectedPerson(person);
    setIsDetailOpen(true);
  };

  const handleScheduleMeeting = (person: Person) => {
    setActiveTab('calendar');
    showToast(`Redirecting to Calendar to schedule meeting with ${person.name}`, "info");
  };

  const handleCreateTask = (person: Person) => {
    setActiveTab('tasks');
    showToast(`Redirecting to Tasks to log action item for ${person.name}`, "info");
  };

  const filteredPeople = people.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.organization.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">Executive Directory</h1>
            <Badge variant="outline" className="text-[10px] font-mono">
              {people.length} Stakeholders
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Managing Director relationship dossier, interaction history, and pending follow-ups.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, fund, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredPeople.map((person) => (
          <div
            key={person.id}
            onClick={() => handleOpenPerson(person)}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-sm"
          >
            
            {/* Top Row: Avatar, Identity & Follow-ups */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {person.avatar ? (
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-800 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs shrink-0">
                    {person.name.substring(0, 2)}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                    {person.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {person.role}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <Building2 className="w-3 h-3 text-slate-600" />
                    {person.organization}
                  </span>
                </div>
              </div>

              {person.openFollowUpsCount > 0 ? (
                <Badge variant="high" className="text-[9px] shrink-0">
                  {person.openFollowUpsCount} Follow-ups
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[9px] shrink-0 font-mono text-slate-500">
                  Clear
                </Badge>
              )}
            </div>

            {/* Middle: Notes snippet */}
            <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-950/60 p-2 rounded border border-slate-800/60">
              {person.notes}
            </p>

            {/* Bottom Row: Last & Next Interaction */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
              <span>Last: {person.lastInteraction}</span>
              {person.nextMeetingDate ? (
                <span className="text-sky-400 font-medium">
                  Next: {formatDateString(person.nextMeetingDate, 'MMM d, h:mm a')}
                </span>
              ) : (
                <span className="text-slate-600">No meeting scheduled</span>
              )}
            </div>

          </div>
        ))}

        {filteredPeople.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">
            No contacts matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* Person Detail Modal */}
      <PersonDetailModal
        person={selectedPerson}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onScheduleMeeting={handleScheduleMeeting}
        onCreateTask={handleCreateTask}
      />

    </div>
  );
};
