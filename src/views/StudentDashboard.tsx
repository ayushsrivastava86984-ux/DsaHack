import React from 'react';
import { ScreenId, UserProfile, Problem } from '../types';
import { INITIAL_PROBLEMS, ACHIEVEMENTS, DSA_TOPICS } from '../data/mockData';
import { 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  TrendingUp, 
  Clock, 
  Play, 
  Bookmark, 
  Calendar,
  Sparkles,
  BookOpen,
  Zap,
  BarChart2
} from 'lucide-react';

interface StudentDashboardProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onSelectProblem: (problem: Problem) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onNavigate,
  onSelectProblem,
}) => {
  const dailyProblem = INITIAL_PROBLEMS[0]; // Two Sum
  const continueProblem = INITIAL_PROBLEMS[3]; // Longest Substring

  const weeklyActivity = [
    { day: 'Mon', count: 4, height: '70%' },
    { day: 'Tue', count: 2, height: '40%' },
    { day: 'Wed', count: 6, height: '100%' },
    { day: 'Thu', count: 3, height: '55%' },
    { day: 'Fri', count: 5, height: '85%' },
    { day: 'Sat', count: 4, height: '70%' },
    { day: 'Sun', count: 1, height: '25%', active: true },
  ];

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* TOP AREA: Greeting & Profile Quick Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl neo-border overflow-hidden bg-[#F4A6C1] shrink-0 shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] dark:text-white">
                Hey {user.name.split(' ')[0]}, ready to code today?
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-[#171717]">
                Level {user.level} Coder
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {user.college} · Target: Master DSA Patterns & System Algorithms
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('daily_challenge')}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl bg-[#FFF0B3] text-[#171717] neo-border-sm font-bold text-xs neo-btn flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717] dark:shadow-[1.5px_1.5px_0px_0px_#383838]"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-800" />
            <span>Today's Mission</span>
          </button>

          <button
            onClick={() => onNavigate('ai_mentor')}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm font-bold text-xs neo-btn flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717] dark:shadow-[1.5px_1.5px_0px_0px_#383838]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Mentor</span>
          </button>
        </div>

      </div>

      {/* BENTO GRID: 6 Core Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: Coding Streak & Weekly Activity */}
        <div className="p-6 rounded-2xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Habit & Momentum
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 neo-border-sm flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#171717] dark:text-white tabular-nums">
                {user.streak}
              </span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                Day Streak 🔥
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Max streak record: <strong>{user.maxStreak} days</strong>. Top 5% consistency this month!
            </p>
          </div>

          {/* Weekly activity bars */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-gray-500 mb-2">This Week's Activity</p>
            <div className="flex items-end justify-between h-16 gap-2 px-1">
              {weeklyActivity.map((w) => (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className={`w-full rounded-md transition-all ${
                      w.active 
                        ? 'bg-[#F4A6C1] neo-border-sm' 
                        : 'bg-[#D8EEDC] dark:bg-[#2c3d31]'
                    }`}
                    style={{ height: w.height }}
                    title={`${w.day}: ${w.count} problems solved`}
                  ></div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{w.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: Problems Solved Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Problem Solving Stats
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-[#171717]">
              {user.accuracy}% Accuracy
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#171717] dark:text-white tabular-nums">
                {user.solvedCount}
              </span>
              <span className="text-sm text-gray-500">/ 500+ Solved</span>
            </div>
          </div>

          {/* Easy, Medium, Hard breakdown bars */}
          <div className="space-y-2.5 pt-1">
            
            {/* Easy */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-700 dark:text-emerald-400">Easy</span>
                <span className="tabular-nums text-gray-700 dark:text-gray-300">
                  {user.solvedByDifficulty.easy} / 120
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${(user.solvedByDifficulty.easy / 120) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-700 dark:text-amber-400">Medium</span>
                <span className="tabular-nums text-gray-700 dark:text-gray-300">
                  {user.solvedByDifficulty.medium} / 280
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${(user.solvedByDifficulty.medium / 280) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-700 dark:text-rose-400">Hard</span>
                <span className="tabular-nums text-gray-700 dark:text-gray-300">
                  {user.solvedByDifficulty.hard} / 100
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: `${(user.solvedByDifficulty.hard / 100) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>

          <button
            onClick={() => onNavigate('dsa_questions')}
            className="text-xs font-extrabold text-[#171717] dark:text-white flex items-center justify-between hover:underline pt-1"
          >
            <span>Browse Full Problem Bank</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 3: Today's Daily Challenge */}
        <div className="p-6 rounded-2xl bg-[#D8EEDC] neo-border neo-shadow flex flex-col justify-between space-y-4 text-[#171717]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Daily Mission
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white neo-border-sm">
              +50 XP
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#F4A6C1] neo-border-sm">
                {dailyProblem.difficulty}
              </span>
              <span className="text-xs font-mono font-bold text-gray-700">
                #{dailyProblem.number}
              </span>
            </div>

            <h3 className="text-xl font-extrabold tracking-tight">
              {dailyProblem.title}
            </h3>

            <p className="text-xs text-gray-800 line-clamp-2 leading-relaxed">
              {dailyProblem.description}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onSelectProblem(dailyProblem);
                onNavigate('problem_detail');
              }}
              className="w-full py-2.5 rounded-xl bg-[#171717] text-white neo-border-sm font-bold text-xs neo-btn flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#171717]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Solving Now</span>
            </button>
          </div>
        </div>

        {/* CARD 4: Learning Progress by Topic */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Topic Mastery
            </span>
            <button
              onClick={() => onNavigate('dsa_topics')}
              className="text-xs font-bold text-[#171717] dark:text-white hover:underline"
            >
              All Topics
            </button>
          </div>

          <div className="space-y-3">
            {DSA_TOPICS.slice(0, 4).map((t) => {
              const pct = Math.round((t.solvedCount / t.totalQuestions) * 100);
              return (
                <div key={t.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#171717] dark:text-white">{t.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                      {t.solvedCount}/{t.totalQuestions} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-[#F4A6C1] rounded-full" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-xl bg-[#FFF4E6] dark:bg-[#1a1a1a] text-[11px] font-semibold text-gray-700 dark:text-gray-300">
            💡 Next recommended topic: <strong>Dynamic Programming & Graphs</strong>
          </div>
        </div>

        {/* CARD 5: Continue Learning (Recent Problem) */}
        <div className="p-6 rounded-2xl bg-[#FFF0B3] neo-border neo-shadow flex flex-col justify-between space-y-4 text-[#171717]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Pick Up Where You Left Off
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white neo-border-sm">
              In Progress
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] neo-border-sm">
                {continueProblem.difficulty}
              </span>
              <span className="text-xs font-mono font-bold text-gray-700">
                #{continueProblem.number}
              </span>
            </div>

            <h3 className="text-lg font-bold">
              {continueProblem.title}
            </h3>

            <p className="text-xs text-gray-800 line-clamp-2">
              Sliding Window & Hash table approach. 2 test cases passed previously.
            </p>
          </div>

          <button
            onClick={() => {
              onSelectProblem(continueProblem);
              onNavigate('problem_detail');
            }}
            className="w-full py-2.5 rounded-xl bg-[#171717] text-white neo-border-sm font-bold text-xs neo-btn flex items-center justify-center gap-2"
          >
            <span>Resume Solving</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 6: Achievement Collection & XP Level */}
        <div className="p-6 rounded-2xl bg-[#F4A6C1] neo-border neo-shadow flex flex-col justify-between space-y-4 text-[#171717]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Badges & Progression
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white neo-border-sm">
              Level {user.level}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-extrabold tabular-nums">{user.xp} XP</span>
              <span className="text-xs font-bold text-gray-800">520 XP to Level 13</span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden">
              <div className="h-full bg-[#171717] rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Mini badge collection icons */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {ACHIEVEMENTS.slice(0, 4).map((ach) => (
              <div 
                key={ach.id} 
                className="p-2 rounded-lg bg-white neo-border-sm flex flex-col items-center justify-center text-center"
                title={`${ach.title}: ${ach.description}`}
              >
                <Award className="w-4 h-4 text-amber-600 mb-0.5" />
                <span className="text-[9px] font-bold text-gray-800 truncate w-full">
                  {ach.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('achievements')}
            className="text-xs font-extrabold text-[#171717] flex items-center justify-between hover:underline pt-1"
          >
            <span>View All Collectible Badges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* RECENT SUBMISSIONS & RECOMMENDED PROBLEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Submissions (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-lg font-bold text-[#171717] dark:text-white">Recent Submissions</h3>
            </div>
            <span className="text-xs font-mono text-gray-500">Last 7 Days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5">Problem</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Language</th>
                  <th className="py-2.5">Runtime</th>
                  <th className="py-2.5">Memory</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { title: 'Two Sum', status: 'Accepted', lang: 'Python', time: '48 ms', mem: '17.8 MB', date: '2h ago', id: 'prob-1' },
                  { title: 'Reverse Linked List', status: 'Accepted', lang: 'Java', time: '0 ms', mem: '42.1 MB', date: 'Yesterday', id: 'prob-3' },
                  { title: 'Coin Change', status: 'Wrong Answer', lang: 'C++', time: '12 ms', mem: '14.2 MB', date: '2 days ago', id: 'prob-5' },
                  { title: 'Valid Parentheses', status: 'Accepted', lang: 'JavaScript', time: '52 ms', mem: '48.9 MB', date: '3 days ago', id: 'prob-2' },
                ].map((sub, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#282828] transition-colors">
                    <td className="py-3 font-bold text-[#171717] dark:text-white">{sub.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.status === 'Accepted'
                          ? 'bg-[#D8EEDC] text-emerald-900'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-gray-600 dark:text-gray-400">{sub.lang}</td>
                    <td className="py-3 font-mono tabular-nums text-gray-600 dark:text-gray-400">{sub.time}</td>
                    <td className="py-3 font-mono tabular-nums text-gray-600 dark:text-gray-400">{sub.mem}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          const p = INITIAL_PROBLEMS.find((pr) => pr.id === sub.id) || INITIAL_PROBLEMS[0];
                          onSelectProblem(p);
                          onNavigate('problem_detail');
                        }}
                        className="text-xs font-bold text-[#171717] dark:text-white hover:underline"
                      >
                        Reattempt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Problems (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#171717] dark:text-white">Recommended</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF0B3] text-[#171717]">
              Interview Picks
            </span>
          </div>

          <div className="space-y-3">
            {INITIAL_PROBLEMS.slice(3, 7).map((prob) => (
              <div 
                key={prob.id}
                onClick={() => {
                  onSelectProblem(prob);
                  onNavigate('problem_detail');
                }}
                className="p-3 rounded-xl neo-border-sm bg-[#FFF4E6]/40 dark:bg-[#1a1a1a] hover:bg-[#F4A6C1]/20 dark:hover:bg-[#2c2c2c] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#171717] dark:text-white">{prob.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">{prob.difficulty}</span>
                    <span>·</span>
                    <span>{prob.topic}</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('notes')}
            className="w-full py-2.5 rounded-xl bg-[#D8EEDC] text-[#171717] neo-border-sm font-bold text-xs neo-btn text-center"
          >
            Review Wrong Answer Notebook
          </button>
        </div>

      </div>

    </div>
  );
};
