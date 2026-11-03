import React, { useState } from 'react';
import { ScreenId, Problem } from '../types';
import { DSA_TOPICS } from '../data/mockData';
import { matchesTopic } from '../services/problemsService';
import { 
  Layers, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Grid, 
  GitBranch, 
  Cpu, 
  Share2, 
  Binary, 
  FileText 
} from 'lucide-react';

interface DsaTopicSelectionPageProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectTopic: (topic: string) => void;
  problems?: Problem[];
  solvedIds?: string[];
}

export const DsaTopicSelectionPage: React.FC<DsaTopicSelectionPageProps> = ({
  onNavigate,
  onSelectTopic,
  problems = [],
  solvedIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'high_yield' | 'core'>('all');

  // STRICT SEPARATION: Only consider DSA Practice problems for topic counts
  const dsaProblems = problems.filter((p) => p.contentType !== 'language');

  const getTopicQuestionCount = (topicName: string, fallbackCount: number) => {
    if (!dsaProblems || dsaProblems.length === 0) return fallbackCount;
    const dbCount = dsaProblems.filter((p) => matchesTopic(p.topics || [p.topic], topicName)).length;
    return dbCount > 0 ? dbCount : fallbackCount;
  };

  const getTopicSolvedCount = (topicName: string, fallbackSolved: number) => {
    if (!dsaProblems || dsaProblems.length === 0) return fallbackSolved;
    const matching = dsaProblems.filter((p) => matchesTopic(p.topics || [p.topic], topicName));
    if (matching.length === 0) return fallbackSolved;
    return matching.filter((p) => solvedIds.includes(p.id)).length;
  };

  const filteredTopics = DSA_TOPICS.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filterMode === 'high_yield') {
      return ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Binary Search'].includes(t.name);
    }
    return true;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-[#171717] dark:border-[#383838]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF0B3] text-[#171717] neo-border-sm text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>Structured Interview Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] dark:text-white tracking-tight">
            Master the Art of <br />
            <span className="text-[#F4A6C1]">Problem Solving.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            18 specialized topic tracks designed to take you from foundational logic to advanced graph and dynamic programming mastery.
          </p>
        </div>

        {/* Search & Topic Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 18 topics..."
              className="pl-10 pr-4 py-2 rounded-xl neo-border-sm bg-white dark:bg-[#212121] text-xs font-medium text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4A6C1] w-full sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#212121] neo-border-sm text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              All (18)
            </button>
            <button
              onClick={() => setFilterMode('high_yield')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'high_yield'
                  ? 'bg-[#F4A6C1] text-[#171717] shadow-sm font-extrabold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              High-Yield FAANG
            </button>
          </div>
        </div>
      </div>

      {/* 18 Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic, idx) => {
          const totalQuestions = getTopicQuestionCount(topic.name, topic.totalQuestions);
          const solvedCount = getTopicSolvedCount(topic.name, topic.solvedCount);
          const completionPct = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
          const bgAccents = ['#FFF4E6', '#D8EEDC', '#FFF0B3', '#F4A6C1', '#ffffff'];
          const cardBg = bgAccents[idx % bgAccents.length];

          return (
            <div
              key={topic.name}
              onClick={() => {
                onSelectTopic(topic.name);
                onNavigate('dsa_questions');
              }}
              className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-6 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
            >
              <div className="space-y-4">
                
                {/* Topic Header & Number Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl neo-border-sm flex items-center justify-center font-extrabold text-sm text-[#171717] shadow-[1.5px_1.5px_0px_0px_#171717]"
                      style={{ backgroundColor: cardBg }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[#171717] dark:text-white group-hover:text-[#F4A6C1] transition-colors">
                        {topic.name}
                      </h3>
                      <p className="text-[11px] font-mono text-gray-500">
                        {totalQuestions} Questions Available
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-400 group-hover:text-[#171717] dark:group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed min-h-[32px]">
                  {topic.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">Solved</span>
                    <span className="text-[#171717] dark:text-white tabular-nums">
                      {solvedCount} / {totalQuestions} ({completionPct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-[#171717] dark:bg-[#F4A6C1] rounded-full"
                      style={{ width: `${completionPct}%` }}
                    ></div>
                  </div>

                  {/* Difficulty Distribution Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
                    <span className="text-emerald-600 font-semibold">{topic.difficultySplit.easy} Easy</span>
                    <span className="text-amber-600 font-semibold">{topic.difficultySplit.medium} Med</span>
                    <span className="text-rose-600 font-semibold">{topic.difficultySplit.hard} Hard</span>
                  </div>
                </div>

              </div>

              {/* Bottom Card Action */}
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#171717] dark:text-white">
                <span className="text-gray-500 text-[11px]">View Problem Roster</span>
                <span className="px-2.5 py-1 rounded-md bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm group-hover:bg-[#F4A6C1] group-hover:text-[#171717] transition-colors">
                  Explore Track →
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
