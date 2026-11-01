import React, { useState } from 'react';
import { ScreenId, TopicName, Problem, Difficulty } from '../types';
import { INITIAL_PROBLEMS, DSA_TOPICS } from '../data/mockData';
import { 
  Search, 
  Bookmark, 
  CheckCircle2, 
  Play, 
  Filter, 
  Sparkles, 
  ArrowLeft,
  Tag,
  Building2,
  ChevronDown
} from 'lucide-react';

interface DsaQuestionListingPageProps {
  selectedTopic: TopicName | 'All';
  onSelectTopic: (topic: TopicName | 'All') => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectProblem: (problem: Problem) => void;
  bookmarkedIds: string[];
  solvedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const DsaQuestionListingPage: React.FC<DsaQuestionListingPageProps> = ({
  selectedTopic,
  onSelectTopic,
  onNavigate,
  onSelectProblem,
  bookmarkedIds,
  solvedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved' | 'bookmarked'>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');

  const companies = ['All', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber'];

  const filteredProblems = INITIAL_PROBLEMS.filter((p) => {
    // Topic filter
    if (selectedTopic !== 'All' && p.topic !== selectedTopic) {
      return false;
    }

    // Company tag filter
    if (selectedCompany !== 'All' && !p.companyTags.includes(selectedCompany)) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = 
        p.title.toLowerCase().includes(q) || 
        p.topic.toLowerCase().includes(q) ||
        p.companyTags.some(c => c.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Status filter
    const isSolved = solvedIds.includes(p.id);
    const isBookmarked = bookmarkedIds.includes(p.id);

    if (statusFilter === 'solved' && !isSolved) return false;
    if (statusFilter === 'unsolved' && isSolved) return false;
    if (statusFilter === 'bookmarked' && !isBookmarked) return false;

    return true;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dsa_topics')}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#171717] dark:text-white transition-colors"
            title="Back to Topics"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#171717] dark:text-white">
                {selectedTopic === 'All' ? 'All DSA Practice Problems' : `${selectedTopic} Track`}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-[#171717]">
                {filteredProblems.length} Problems
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Curated for tech interviews at top engineering teams.
            </p>
          </div>
        </div>

        {/* Topic Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Filter Topic:</span>
          <select
            value={selectedTopic}
            onChange={(e) => onSelectTopic(e.target.value as any)}
            className="px-3 py-2 rounded-xl neo-border-sm bg-[#FFF4E6] dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white focus:outline-none"
          >
            <option value="All">All 18 Topics</option>
            {DSA_TOPICS.map((t) => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FILTER CONTROLS & COMPANY PILLS */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
        
        {/* Row 1: Search + Difficulty + Status */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, number, or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl neo-border-sm bg-[#FFF4E6]/40 dark:bg-[#1a1a1a] text-xs font-medium text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
            />
          </div>

          {/* Difficulty Segmented Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-xs font-bold w-full sm:w-auto justify-center">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-xs font-bold w-full sm:w-auto justify-center">
            {[
              { id: 'all', label: 'All' },
              { id: 'solved', label: 'Solved' },
              { id: 'unsolved', label: 'Unsolved' },
              { id: 'bookmarked', label: 'Saved' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === st.id
                    ? 'bg-[#F4A6C1] text-[#171717] shadow-sm font-extrabold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

        </div>

        {/* Row 2: Company Interview Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 shrink-0">
            <Building2 className="w-3.5 h-3.5" />
            <span>Target Company:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {companies.map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedCompany(comp)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCompany === comp
                    ? 'bg-[#FFF0B3] text-[#171717] neo-border-sm shadow-[1.5px_1.5px_0px_0px_#171717]'
                    : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* QUESTION TABLE */}
      <div className="rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2 border-[#171717] dark:border-[#383838] bg-[#FFF4E6] dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Problem Name</th>
                <th className="py-3.5 px-4">Topic</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Acceptance</th>
                <th className="py-3.5 px-4">Companies</th>
                <th className="py-3.5 px-4 text-center">Bookmark</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProblems.map((p) => {
                const isSolved = solvedIds.includes(p.id);
                const isBookmarked = bookmarkedIds.includes(p.id);

                return (
                  <tr 
                    key={p.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#282828] transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-400 inline-block"></span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#171717] dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{p.number}. {p.title}</span>
                        {p.isDaily && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#FFF0B3] text-[#171717]">
                            Daily
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm text-[11px] font-bold text-[#171717] dark:text-white">
                        {p.topic}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      <span className={
                        p.difficulty === 'Easy'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : p.difficulty === 'Medium'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }>
                        {p.difficulty}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400 tabular-nums">
                      {p.acceptance}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {p.companyTags.slice(0, 3).map((comp) => (
                          <span key={comp} className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleBookmark(p.id)}
                        className="text-gray-400 hover:text-amber-500 transition-colors p-1"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectProblem(p);
                          onNavigate('problem_detail');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#F4A6C1] text-[#171717] neo-border-sm neo-btn text-xs font-extrabold inline-flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Solve</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
