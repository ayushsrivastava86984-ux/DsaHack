import React, { useState } from 'react';
import { ScreenId, TopicName, Problem, Difficulty } from '../types';
import { DSA_TOPICS } from '../data/mockData';
import { 
  Search, 
  Bookmark, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  ArrowLeft, 
  Building2, 
  Loader2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Hash
} from 'lucide-react';

interface DsaQuestionListingPageProps {
  selectedTopic: TopicName | 'All';
  onSelectTopic: (topic: TopicName | 'All') => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectProblem: (problem: Problem) => void;
  bookmarkedIds: string[];
  solvedIds: string[];
  onToggleBookmark: (id: string) => void;
  problems?: Problem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const DsaQuestionListingPage: React.FC<DsaQuestionListingPageProps> = ({
  selectedTopic,
  onSelectTopic,
  onNavigate,
  onSelectProblem,
  bookmarkedIds,
  solvedIds,
  onToggleBookmark,
  problems = [],
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved' | 'bookmarked'>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const companies = ['All', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber'];

  const handleRefresh = async () => {
    if (onRetry) {
      setIsRefreshing(true);
      await onRetry();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const filteredProblems = problems.filter((p) => {
    // Only published problems visible to students
    if (p.isPublished === false) return false;

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

    // Search query: match title, topic, problemId, or company
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = 
        p.title.toLowerCase().includes(q) || 
        p.topic.toLowerCase().includes(q) ||
        (p.problemId && p.problemId.toLowerCase().includes(q)) ||
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
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Top Breadcrumb & Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('dsa_topics')}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#171717] dark:text-white transition-colors shrink-0"
            title="Back to Topics"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] dark:text-white">
                {selectedTopic === 'All' ? 'All DSA Practice Problems' : `${selectedTopic} Track`}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-emerald-950 font-mono">
                {filteredProblems.length} {filteredProblems.length === 1 ? 'Question' : 'Questions'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Live curriculum sourced directly from Supabase database.
            </p>
          </div>
        </div>

        {/* Topic Selector & Refresh */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
          <button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="px-3 py-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-[#282828] transition-colors shadow-[1.5px_1.5px_0px_0px_#171717] disabled:opacity-50"
            title="Refresh questions from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isRefreshing ? 'animate-spin text-[#F4A6C1]' : ''}`} />
            <span className="hidden xs:inline">Sync Questions</span>
          </button>

          <select
            value={selectedTopic}
            onChange={(e) => onSelectTopic(e.target.value as any)}
            className="px-3 py-2 rounded-xl neo-border-sm bg-[#FFF4E6] dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white focus:outline-none"
          >
            <option value="All">All Topics</option>
            {DSA_TOPICS.map((t) => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-3 sm:space-y-4">
        
        {/* Row 1: Search + Difficulty + Status */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, problem ID, topic..."
              className="w-full pl-10 pr-4 py-2 rounded-xl neo-border-sm bg-[#FFF4E6]/40 dark:bg-[#1a1a1a] text-xs font-medium text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-start">
            {/* Difficulty Segmented Controls */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-xs font-bold">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors text-[11px] sm:text-xs ${
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
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-xs font-bold">
              {[
                { id: 'all', label: 'All' },
                { id: 'solved', label: 'Solved' },
                { id: 'unsolved', label: 'Unsolved' },
                { id: 'bookmarked', label: 'Saved' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors text-[11px] sm:text-xs ${
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

        </div>

        {/* Row 2: Company Interview Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 dark:border-gray-800 pb-1">
          <div className="flex items-center gap-1 text-xs font-bold text-gray-500 shrink-0">
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Company:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
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

      {/* ERROR ALERT */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 neo-border border-rose-600 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 neo-shadow">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Failed to load problems from Supabase database</p>
              <p className="text-[11px] opacity-80 mt-0.5">{error}</p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#171717] neo-border-sm text-xs font-bold text-[#171717] dark:text-white flex items-center gap-1.5 hover:bg-gray-50 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTAINER: Responsive Mobile Cards (< md) & Full Desktop Table (>= md) */}
      <div className="rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow overflow-hidden">
        {isLoading ? (
          <div className="py-20 px-4 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#171717] dark:text-white" />
            <p className="text-sm font-bold text-[#171717] dark:text-white">
              Fetching published questions from Supabase...
            </p>
            <p className="text-xs text-gray-500">
              Querying <span className="font-mono">public.problems</span> where <span className="font-mono">is_published = true</span>
            </p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <p className="text-base font-extrabold text-[#171717] dark:text-white">
              No questions found
            </p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery || difficultyFilter !== 'All' || selectedCompany !== 'All' || selectedTopic !== 'All' || statusFilter !== 'all'
                ? 'No questions match your current search and filter criteria. Try resetting filters.'
                : 'There are currently no published questions in the Supabase database. Add and publish questions via the Supabase Table Editor.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {(searchQuery || difficultyFilter !== 'All' || selectedCompany !== 'All' || selectedTopic !== 'All' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDifficultyFilter('All');
                    setSelectedCompany('All');
                    onSelectTopic('All');
                    setStatusFilter('all');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF0B3] text-[#171717] text-xs font-bold neo-border-sm"
                >
                  Reset All Filters
                </button>
              )}
              {onRetry && (
                <button
                  onClick={handleRefresh}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1a1a] text-xs font-bold neo-border-sm flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Supabase Again</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* MOBILE CARD VIEW (screens < md) */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProblems.map((p) => {
                const isSolved = solvedIds.includes(p.id);
                const isBookmarked = bookmarkedIds.includes(p.id);

                return (
                  <div key={p.id} className="p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {p.problemId && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm text-gray-700 dark:text-gray-300">
                              ID: {p.problemId}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            p.difficulty === 'Easy'
                              ? 'bg-[#D8EEDC] text-emerald-950'
                              : p.difficulty === 'Medium'
                              ? 'bg-[#FFF0B3] text-amber-950'
                              : 'bg-[#F4A6C1] text-rose-950'
                          }`}>
                            {p.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {p.topic}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onSelectProblem(p);
                            onNavigate('problem_detail');
                          }}
                          className="text-left font-extrabold text-sm text-[#171717] dark:text-white hover:text-[#e05688] transition-colors block pt-1"
                        >
                          {p.number}. {p.title}
                        </button>
                      </div>

                      <button
                        onClick={() => onToggleBookmark(p.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-amber-500 transition-colors shrink-0"
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                        aria-label="Bookmark problem"
                      >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {isSolved ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Solved</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono">Acceptance: {p.acceptance}</span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          onSelectProblem(p);
                          onNavigate('problem_detail');
                        }}
                        className="min-h-[38px] px-4 py-2 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm neo-btn text-xs font-extrabold flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717]"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Solve Problem</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (screens >= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-[#171717] dark:border-[#383838] bg-[#FFF4E6] dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">Status</th>
                    <th className="py-3.5 px-4 w-28">Problem ID</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Topic</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4">Acceptance</th>
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

                        <td className="py-3.5 px-4 font-mono font-bold text-gray-500 dark:text-gray-400 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                            {p.problemId || `#${p.number}`}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#171717] dark:text-white">
                          <button
                            onClick={() => {
                              onSelectProblem(p);
                              onNavigate('problem_detail');
                            }}
                            className="flex items-center gap-2 text-left hover:text-[#e05688] transition-colors group"
                          >
                            <span className="group-hover:underline">
                              {p.number}. {p.title}
                            </span>
                            {p.isDaily && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#FFF0B3] text-[#171717]">
                                Daily
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm text-[11px] font-bold text-[#171717] dark:text-white">
                            {p.topic}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold">
                          <span className={
                            p.difficulty === 'Easy'
                              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                              : p.difficulty === 'Medium'
                              ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                              : 'text-rose-600 dark:text-rose-400 font-extrabold'
                          }>
                            {p.difficulty}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400 tabular-nums">
                          {p.acceptance}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => onToggleBookmark(p.id)}
                            className="text-gray-400 hover:text-amber-500 transition-colors p-1"
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                            aria-label="Bookmark problem"
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
          </>
        )}
      </div>

    </div>
  );
};
