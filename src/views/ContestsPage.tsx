import React, { useState } from 'react';
import { ScreenId, Contest } from '../types';
import { CONTESTS } from '../data/mockData';
import { 
  Trophy, 
  Clock, 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Flame,
  Award,
  Zap
} from 'lucide-react';

interface ContestsPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ContestsPage: React.FC<ContestsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'active' | 'past'>('all');
  const [contestList, setContestList] = useState<Contest[]>(CONTESTS);

  const toggleRegister = (contestId: string) => {
    setContestList((prev) =>
      prev.map((c) => (c.id === contestId ? { ...c, registered: !c.registered } : c))
    );
  };

  const filteredContests = contestList.filter((c) => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Editorial Contest Arena Hero */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F4A6C1] text-[#171717] neo-border-sm text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-900" />
            <span>Competitive Programming Arena</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] dark:text-white tracking-tight">
            Code Fast. Compete Hard. <br />
            <span className="text-[#F4A6C1]">Conquer The Arena.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Participate in weekly algorithmic clashes, climb the global ranking ladder, and solve 4-5 problems under strict competitive time limits.
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-700 dark:text-gray-300 pt-2">
            <span>● Official Rating System</span>
            <span>·</span>
            <span>● Real-time Penalty Clocks</span>
            <span>·</span>
            <span>● College Team Standings</span>
          </div>
        </div>

        {/* Live Active Contest Spotlight Banner */}
        <div className="p-6 rounded-2xl bg-[#FFF0B3] neo-border neo-shadow w-full md:w-80 text-[#171717] space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
              LIVE NOW
            </span>
            <span className="text-xs font-mono font-bold">Ends in 01h 14m</span>
          </div>

          <div>
            <h3 className="text-lg font-extrabold">DP Blitz Championship</h3>
            <p className="text-xs text-gray-800 mt-1">5 Problems · 2,480 Coders Active</p>
          </div>

          <button
            onClick={() => onNavigate('dsa_questions')}
            className="w-full py-2.5 rounded-xl bg-[#171717] text-white neo-border-sm font-bold text-xs neo-btn text-center shadow-[1.5px_1.5px_0px_0px_#171717]"
          >
            Enter Contest Room
          </button>
        </div>

      </div>

      {/* TABS: All · Upcoming · Active · Past */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b-2 border-[#171717] dark:border-[#383838] pb-4">
        
        <div className="flex items-center gap-2">
          {(['all', 'upcoming', 'active', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-[#171717] text-white neo-border-sm shadow-[1.5px_1.5px_0px_0px_#171717] dark:bg-[#F4A6C1] dark:text-[#171717]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282828]'
              }`}
            >
              {tab} Contests
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigate('leaderboard')}
          className="text-xs font-bold text-[#171717] dark:text-white flex items-center gap-1.5 hover:underline"
        >
          <span>View Contest Leaderboards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>

      {/* CONTEST CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContests.map((cnt) => (
          <div
            key={cnt.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-1 rounded-md text-xs font-extrabold neo-border-sm text-[#171717]"
                  style={{ backgroundColor: cnt.themeColor }}
                >
                  #{cnt.number}
                </span>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cnt.status === 'active'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-extrabold'
                    : cnt.status === 'upcoming'
                    ? 'bg-[#D8EEDC] text-emerald-950 font-bold'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {cnt.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#171717] dark:text-white">
                  {cnt.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{cnt.startTime}</span>
                </p>
              </div>

              {/* Contest Metadata Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] neo-border-sm text-center text-xs">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Duration</p>
                  <p className="font-extrabold text-[#171717] dark:text-white mt-0.5">{cnt.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Problems</p>
                  <p className="font-extrabold text-[#171717] dark:text-white mt-0.5">{cnt.problemsCount} Questions</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Prize XP</p>
                  <p className="font-extrabold text-amber-600 mt-0.5">+{cnt.prizeXp} XP</p>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{cnt.participantsCount.toLocaleString()} coders joined</span>
              </span>

              {cnt.status === 'past' ? (
                <button
                  onClick={() => onNavigate('dsa_questions')}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-[#171717] dark:text-white neo-border-sm hover:bg-gray-200"
                >
                  View Archive
                </button>
              ) : (
                <button
                  onClick={() => toggleRegister(cnt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold neo-border-sm neo-btn flex items-center gap-1.5 ${
                    cnt.registered
                      ? 'bg-[#D8EEDC] text-emerald-950'
                      : 'bg-[#F4A6C1] text-[#171717]'
                  }`}
                >
                  {cnt.registered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <span>Register Now</span>
                  )}
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
