import React, { useState } from 'react';
import { ScreenId, PersonalNote, Problem, TopicName } from '../types';
import { PERSONAL_NOTES, INITIAL_PROBLEMS } from '../data/mockData';
import { 
  BookOpen, 
  Bookmark, 
  AlertTriangle, 
  Plus, 
  Play, 
  Trash2, 
  Tag, 
  Edit3, 
  CheckCircle2, 
  Search,
  Sparkles
} from 'lucide-react';

interface PersonalNotesPageProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectProblem: (problem: Problem) => void;
}

export const PersonalNotesPage: React.FC<PersonalNotesPageProps> = ({
  onNavigate,
  onSelectProblem,
}) => {
  const [activeTab, setActiveTab] = useState<'gotchas' | 'notes' | 'saved' | 'revision'>('gotchas');
  const [notesList, setNotesList] = useState<PersonalNote[]>(PERSONAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Note Modal
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState<TopicName>('Arrays');
  const [newContent, setNewContent] = useState('');
  const [newIsGotcha, setNewIsGotcha] = useState(true);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newNote: PersonalNote = {
      id: `not-${Date.now()}`,
      problemId: 'prob-1',
      problemTitle: newTitle,
      topic: newTopic,
      content: newContent,
      isGotcha: newIsGotcha,
      lastUpdated: 'Just now',
      tags: [newTopic, newIsGotcha ? 'Gotcha' : 'Concept'],
    };

    setNotesList([newNote, ...notesList]);
    setIsAddingNote(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleDeleteNote = (id: string) => {
    setNotesList((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotes = notesList.filter((n) => {
    if (activeTab === 'gotchas' && !n.isGotcha) return false;
    if (activeTab === 'notes' && n.isGotcha) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        n.problemTitle.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.topic.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 rounded-3xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF0B3] text-[#171717] neo-border-sm text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            <span>Personal Revision Vault</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] dark:text-white tracking-tight">
            Personal Notes & <br />
            <span className="text-[#F4A6C1]">Wrong Answer Notebook.</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
            Track subtle edge case gotchas, algorithmic pitfalls, and conceptual takeaways before real interview loops.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNote(true)}
          className="px-5 py-3 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-xs neo-btn neo-shadow flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Gotcha / Note</span>
        </button>
      </div>

      {/* TABS & SEARCH */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-xs font-bold w-full sm:w-auto justify-center">
          {[
            { id: 'gotchas', label: '⚠️ Gotchas & Pitfalls' },
            { id: 'notes', label: '📝 Theory Notes' },
            { id: 'saved', label: '⭐ Saved Problems' },
            { id: 'revision', label: '🔁 Revision List' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#171717] text-white shadow-sm dark:bg-[#F4A6C1] dark:text-[#171717]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or gotchas..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-xs text-[#171717] dark:text-white focus:outline-none"
          />
        </div>

      </div>

      {/* NOTES LIST */}
      {(activeTab === 'gotchas' || activeTab === 'notes') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-6 rounded-2xl neo-border neo-shadow flex flex-col justify-between space-y-4 ${
                note.isGotcha
                  ? 'bg-[#FFF0B3]/40 dark:bg-[#28261e]'
                  : 'bg-white dark:bg-[#212121]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {note.isGotcha ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white">
                        GOTCHA
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#D8EEDC] text-[#171717]">
                        NOTE
                      </span>
                    )}
                    <span className="text-xs font-bold text-gray-500">{note.topic}</span>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono">{note.lastUpdated}</span>
                </div>

                <h3 className="text-lg font-extrabold text-[#171717] dark:text-white">
                  {note.problemTitle}
                </h3>

                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {note.content}
                </p>

                {/* Tag pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  {note.tags.map((t) => (
                    <span 
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    const prob = INITIAL_PROBLEMS.find((p) => p.title.toLowerCase().includes(note.problemTitle.toLowerCase())) || INITIAL_PROBLEMS[0];
                    onSelectProblem(prob);
                    onNavigate('problem_detail');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#F4A6C1] text-[#171717] neo-border-sm text-xs font-bold neo-btn flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Reattempt Problem</span>
                </button>

                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SAVED & REVISION VIEW */}
      {(activeTab === 'saved' || activeTab === 'revision') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_PROBLEMS.slice(0, 4).map((prob) => (
            <div
              key={prob.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex items-center justify-between"
            >
              <div>
                <span className="text-sm font-bold text-[#171717] dark:text-white">
                  {prob.number}. {prob.title}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="font-semibold text-amber-600">{prob.difficulty}</span>
                  <span>·</span>
                  <span>{prob.topic}</span>
                  <span>·</span>
                  <span>Scheduled for 3-Day Spaced Repetition</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectProblem(prob);
                  onNavigate('problem_detail');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#D8EEDC] text-[#171717] neo-border-sm font-bold text-xs neo-btn"
              >
                Launch
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD NOTE MODAL */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#212121] neo-border rounded-2xl neo-shadow-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
              Record Algorithm Gotcha / Note
            </h3>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Problem Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Trapping Rain Water Two Pointers"
                  required
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">DSA Topic</label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value as TopicName)}
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
                >
                  <option value="Arrays">Arrays</option>
                  <option value="Strings">Strings</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Stacks">Stacks</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Graphs">Graphs</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Gotcha Pitfall / Explanation</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe the subtle gotcha, edge case, or time complexity trap..."
                  rows={4}
                  required
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gotchaCheck"
                  checked={newIsGotcha}
                  onChange={(e) => setNewIsGotcha(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <label htmlFor="gotchaCheck" className="text-gray-700 dark:text-gray-300 font-bold">
                  Mark as High-Priority Gotcha ⚠️
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm font-extrabold text-xs neo-btn"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
