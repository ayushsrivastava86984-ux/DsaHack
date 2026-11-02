import React, { useState, useEffect } from 'react';
import { ScreenId, Problem, UserProfile } from '../types';
import { INITIAL_PROBLEMS } from '../data/mockData';
import { 
  Flame, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Play, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

interface DailyChallengePageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onSelectProblem: (problem: Problem) => void;
  isDailySolved: boolean;
  onSolveDaily: () => void;
}

export const DailyChallengePage: React.FC<DailyChallengePageProps> = ({
  user,
  onNavigate,
  onSelectProblem,
  isDailySolved,
  onSolveDaily,
}) => {
  const dailyProblem = INITIAL_PROBLEMS[0]; // Two Sum

  // Simulated live countdown timer to midnight
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 31 days calendar history
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const isCompleted = dayNum <= 14;
    const isToday = dayNum === 15;
    const isFuture = dayNum > 15;
    return { dayNum, isCompleted, isToday, isFuture };
  });

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-10">
      
      {/* Editorial Mission Hero */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        
        {/* Main Mission Card (8 Cols) */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 rounded-3xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow-lg flex flex-col justify-between space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#FFF0B3] text-[#171717] neo-border-sm text-xs font-extrabold uppercase tracking-wider">
                Today's Daily Mission
              </span>

              {/* Countdown */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#171717] neo-border-sm text-xs font-mono font-bold text-[#171717] dark:text-white">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span className="tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-gray-500 font-sans">remaining</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#D8EEDC] text-emerald-950 neo-border-sm">
                {dailyProblem.difficulty}
              </span>
              <span className="text-xs font-mono font-bold text-gray-500">
                Problem #{dailyProblem.number}
              </span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {dailyProblem.topic}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] dark:text-white tracking-tight">
              {dailyProblem.title}
            </h1>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
              {dailyProblem.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                onSelectProblem(dailyProblem);
                onNavigate('problem_detail');
              }}
              className="px-6 py-3.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-sm neo-btn neo-shadow flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isDailySolved ? 'Review Solved Solution' : 'Solve Mission (+50 XP)'}</span>
            </button>

            {isDailySolved ? (
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mission Completed for Today! Streak preserved.</span>
              </div>
            ) : (
              <button
                onClick={onSolveDaily}
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#2a2a2a] text-[#171717] dark:text-white neo-border-sm text-xs font-bold neo-btn"
              >
                Simulate Direct Completion
              </button>
            )}
          </div>

        </div>

        {/* Streak & Freeze Status Box (4 Cols) */}
        <div className="w-full lg:w-80 p-6 rounded-3xl bg-[#D8EEDC] neo-border neo-shadow flex flex-col justify-between space-y-6 text-[#171717]">
          
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white neo-border-sm flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 text-orange-600 fill-orange-500 animate-bounce" />
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-4xl font-extrabold tabular-nums">{user.streak}</span>
              <span className="text-sm font-bold text-orange-800">Days Unbroken 🔥</span>
            </div>

            <p className="text-xs text-gray-800 leading-relaxed">
              Solve today's mission before midnight to advance your streak to <strong>{user.streak + 1} days</strong>!
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white neo-border-sm space-y-1.5 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span>Streak Freeze Available</span>
              <span className="px-1.5 py-0.5 rounded bg-[#FFF0B3] text-[10px]">1 Active</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Protects your streak automatically if you miss a single day.
            </p>
          </div>

        </div>

      </div>

      {/* MONTHLY CALENDAR GRID HEATMAP */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
              November 2026 Daily Mission Tracker
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Consistency matrix. Color green represents completed daily challenges.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#D8EEDC] neo-border-sm inline-block"></span>
              <span className="text-gray-700 dark:text-gray-300">Conquered</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#F4A6C1] neo-border-sm inline-block"></span>
              <span className="text-gray-700 dark:text-gray-300">Today</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800 border inline-block"></span>
              <span className="text-gray-700 dark:text-gray-300">Upcoming</span>
            </span>
          </div>
        </div>

        {/* 30 Days Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2.5">
          {calendarDays.map((d) => (
            <div
              key={d.dayNum}
              className={`p-3 rounded-xl neo-border-sm text-center flex flex-col justify-between h-20 transition-all ${
                d.isToday
                  ? 'bg-[#F4A6C1] neo-shadow text-[#171717] font-extrabold'
                  : d.isCompleted
                  ? 'bg-[#D8EEDC] text-[#171717] font-bold'
                  : 'bg-gray-50 dark:bg-[#1a1a1a] text-gray-400'
              }`}
            >
              <div className="text-xs text-left">Day {d.dayNum}</div>
              <div className="flex justify-center">
                {d.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-800" />}
                {d.isToday && <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />}
              </div>
              <div className="text-[10px] font-mono">
                {d.isCompleted ? '+50 XP' : d.isToday ? 'LIVE' : 'Nov ' + d.dayNum}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
