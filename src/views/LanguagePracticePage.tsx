import React, { useState } from 'react';
import { ScreenId, Language, Problem } from '../types';
import { PROGRAMMING_LANGUAGES, INITIAL_PROBLEMS } from '../data/mockData';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  Play, 
  Code2, 
  Sparkles,
  Layers,
  ChevronRight
import { resolveLanguage } from '../services/problemsService';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  Play, 
  Code2, 
  Sparkles,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';

interface LanguagePracticePageProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectProblem: (problem: Problem) => void;
  bookmarkedIds: string[];
  solvedIds: string[];
  onToggleBookmark: (id: string) => void;
  problems?: Problem[];
  onOpenAddQuestion?: () => void;
}

export const LanguagePracticePage: React.FC<LanguagePracticePageProps> = ({
  language,
  onSelectLanguage,
  onNavigate,
  onSelectProblem,
  bookmarkedIds,
  solvedIds,
  onToggleBookmark,
  problems = [],
  onOpenAddQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [levelCategory, setLevelCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved' | 'bookmarked'>('all');

  const currentLang = PROGRAMMING_LANGUAGES.find((l) => l.id === language) || PROGRAMMING_LANGUAGES[1];

  const beginnerTopics = ['Variables', 'Data Types', 'Loops', 'Conditionals', 'Basic Functions'];
  const intermediateTopics = ['Arrays', 'Strings', 'Stacks', 'Recursion', 'Sorting', 'OOP'];
  const advancedTopics = ['Dynamic Programming', 'Graphs', 'Memory Management', 'Pointers', 'STL'];

  // STRICT SEPARATION: Only include questions classified as 'language' for THIS specific language.
  // NEVER include DSA Practice problems in the language practice section!
  const languageProblems = problems.filter((p) => {
    // Only published problems visible to students
    if (p.isPublished === false) return false;

    // Must be explicitly a language question
    if (p.contentType !== 'language') return false;

    // Must match the current language
    const matchesCurrentLang =
      p.language === language ||
      p.languageTags.includes(language) ||
      (p.topics && p.topics.some((t) => resolveLanguage(t) === language)) ||
      resolveLanguage(p.topic) === language;

    return matchesCurrentLang;
  });

  // Filter problems based on search, difficulty, status
  const filteredProblems = languageProblems.filter((p) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) {
      return false;
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Breadcrumb & Language Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('languages')}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#171717] dark:text-white transition-colors"
            title="Switch Language"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-3.5 h-3.5 rounded-full neo-border-sm"
                style={{ backgroundColor: currentLang.color }}
              ></span>
              <h1 className="text-2xl font-extrabold text-[#171717] dark:text-white">
                {currentLang.name} Practice Hub
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D8EEDC] text-[#171717]">
                {currentLang.badge}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Curated programming challenges with native {currentLang.name} starter templates and test harnesses.
            </p>
          </div>
        </div>

        {/* Actions & Quick Language Tab Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenAddQuestion && (
            <button
              onClick={onOpenAddQuestion}
              className="px-3 py-2 rounded-xl neo-border-sm bg-[#F4A6C1] text-xs font-black text-[#171717] flex items-center gap-1.5 hover:bg-[#ee8fae] transition-colors shadow-[1.5px_1.5px_0px_0px_#171717]"
              title={`Add a new ${currentLang.name} question`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm overflow-x-auto">
            {PROGRAMMING_LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => onSelectLanguage(l.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  l.id === language
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* TOPIC CURRICULUM LEVEL TABS: Beginner · Intermediate · Advanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Beginner */}
        <div 
          onClick={() => setLevelCategory(levelCategory === 'beginner' ? 'all' : 'beginner')}
          className={`p-4 rounded-xl neo-border-sm transition-all cursor-pointer ${
            levelCategory === 'beginner'
              ? 'bg-[#D8EEDC] neo-shadow text-[#171717]'
              : 'bg-white dark:bg-[#212121] hover:bg-gray-50 dark:hover:bg-[#282828]'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Beginner Tier
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#1a1a1a] neo-border-sm">
              Level 1-4
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#171717] dark:text-white">
            Syntax, Loops & Basic Logic
          </h4>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            {beginnerTopics.join(' · ')}
          </p>
        </div>

        {/* Intermediate */}
        <div 
          onClick={() => setLevelCategory(levelCategory === 'intermediate' ? 'all' : 'intermediate')}
          className={`p-4 rounded-xl neo-border-sm transition-all cursor-pointer ${
            levelCategory === 'intermediate'
              ? 'bg-[#FFF0B3] neo-shadow text-[#171717]'
              : 'bg-white dark:bg-[#212121] hover:bg-gray-50 dark:hover:bg-[#282828]'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Intermediate Tier
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#1a1a1a] neo-border-sm">
              Level 5-10
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#171717] dark:text-white">
            Arrays, Strings, Recursion & OOP
          </h4>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            {intermediateTopics.join(' · ')}
          </p>
        </div>

        {/* Advanced */}
        <div 
          onClick={() => setLevelCategory(levelCategory === 'advanced' ? 'all' : 'advanced')}
          className={`p-4 rounded-xl neo-border-sm transition-all cursor-pointer ${
            levelCategory === 'advanced'
              ? 'bg-[#F4A6C1] neo-shadow text-[#171717]'
              : 'bg-white dark:bg-[#212121] hover:bg-gray-50 dark:hover:bg-[#282828]'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-400">
              Advanced Tier
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#1a1a1a] neo-border-sm">
              Level 11+
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#171717] dark:text-white">
            DP, Graphs, Pointers & STL
          </h4>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            {advancedTopics.join(' · ')}
          </p>
        </div>

      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentLang.name} problems or tags...`}
              className="w-full pl-10 pr-4 py-2 rounded-xl neo-border-sm bg-[#FFF4E6]/40 dark:bg-[#1a1a1a] text-xs font-medium text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
            />
          </div>

          {/* Difficulty Segmented Tabs */}
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

          {/* Status Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-xs font-bold w-full sm:w-auto justify-center">
            {[
              { id: 'all', label: 'All' },
              { id: 'solved', label: 'Solved' },
              { id: 'unsolved', label: 'Unsolved' },
              { id: 'bookmarked', label: 'Bookmarked' },
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
      </div>

      {/* QUESTION TABLE */}
      <div className="rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow overflow-hidden">
        <div className="p-4 bg-[#FFF4E6] dark:bg-[#1a1a1a] border-b-2 border-[#171717] dark:border-[#383838] flex items-center justify-between text-xs font-bold">
          <span className="text-[#171717] dark:text-white">
            Available Problems ({filteredProblems.length})
          </span>
          <span className="text-gray-500 font-normal">
            Ready in {currentLang.name}
          </span>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm flex items-center justify-center shadow-[2px_2px_0px_0px_#171717]">
              <Code2 className="w-7 h-7 text-[#171717] dark:text-[#F4A6C1]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-[#171717] dark:text-white">
                No {currentLang.name} Practice Questions Found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                {searchQuery || difficultyFilter !== 'All' || statusFilter !== 'all'
                  ? `No ${currentLang.name} questions match your search or filter settings.`
                  : `DSA problems are strictly kept separate and not shown here. Add a new ${currentLang.name} practice question using the button below or directly via Supabase.`}
              </p>
            </div>
            {onOpenAddQuestion && (
              <div className="pt-2">
                <button
                  onClick={onOpenAddQuestion}
                  className="px-4 py-2.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm neo-btn text-xs font-black inline-flex items-center gap-2 shadow-[2px_2px_0px_0px_#171717]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add {currentLang.name} Question</span>
                </button>
              </div>
            )}
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
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
                    aria-label="Bookmark Problem"
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] font-mono text-gray-500">
                    {isSolved ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span>Acceptance: {p.acceptance}</span>
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
                    <span>Practice in {currentLang.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP TABLE VIEW (screens >= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-transparent">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Acceptance</th>
                <th className="py-3 px-4 text-center">Save</th>
                <th className="py-3 px-4 text-right">Action</th>
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
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
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
