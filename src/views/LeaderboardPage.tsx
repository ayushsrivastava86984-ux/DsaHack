import React, { useState } from 'react';
import { ScreenId } from '../types';
import { LEADERBOARD_DATA } from '../data/mockData';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Search, 
  Building2, 
  TrendingUp, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LeaderboardPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'college' | 'weekly' | 'monthly'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  const top3 = [LEADERBOARD_DATA[1], LEADERBOARD_DATA[0], LEADERBOARD_DATA[2]]; // 2nd, 1st, 3rd for podium arrangement

  const filteredList = LEADERBOARD_DATA.filter((user) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.username.toLowerCase().includes(q) ||
      user.college.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF0B3] text-[#171717] neo-border-sm text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-800" />
          <span>Hall of Fame & Ratings</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] dark:text-white tracking-tight">
          Global & Collegiate <br />
          <span className="text-[#F4A6C1]">Leaderboards.</span>
        </h1>

        <p className="text-sm text-gray-700 dark:text-gray-300">
          Rankings computed from verified contest ratings, total algorithmic problems conquered, and streak consistency.
        </p>
      </div>

      {/* TOP-THREE PODIUM (1st, 2nd, 3rd) with Neo-brutalist blocks */}
      <div className="max-w-4xl mx-auto pt-6 pb-2">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end">
          
          {/* 2nd Place (Silver) */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl neo-border bg-[#FFF4E6] flex items-center justify-center font-extrabold text-sm mb-2 shadow-[2px_2px_0px_0px_#171717]">
              {top3[0].name.slice(0, 2)}
            </div>
            <p className="text-xs sm:text-sm font-bold text-center text-[#171717] dark:text-white truncate w-full">
              {top3[0].name}
            </p>
            <p className="text-[10px] text-gray-500 font-mono mb-2">{top3[0].rating} pts</p>

            {/* Podium Block 2 */}
            <div className="w-full h-32 sm:h-40 rounded-t-2xl bg-[#D8EEDC] neo-border flex flex-col items-center justify-center text-[#171717] neo-shadow">
              <span className="text-2xl sm:text-4xl font-extrabold">2</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Silver</span>
            </div>
          </div>

          {/* 1st Place (Gold / Champion) */}
          <div className="flex flex-col items-center -mt-6">
            <div className="relative mb-2">
              <Crown className="w-7 h-7 text-amber-500 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl neo-border bg-[#F4A6C1] flex items-center justify-center font-extrabold text-base shadow-[3px_3px_0px_0px_#171717]">
                {top3[1].name.slice(0, 2)}
              </div>
            </div>
            <p className="text-xs sm:text-base font-extrabold text-center text-[#171717] dark:text-white truncate w-full">
              {top3[1].name}
            </p>
            <p className="text-[11px] text-amber-600 font-mono font-bold mb-2">{top3[1].rating} pts</p>

            {/* Podium Block 1 */}
            <div className="w-full h-44 sm:h-52 rounded-t-2xl bg-[#FFF0B3] neo-border flex flex-col items-center justify-center text-[#171717] neo-shadow-lg">
              <span className="text-3xl sm:text-5xl font-extrabold">1</span>
              <span className="text-xs font-bold uppercase tracking-wider">Champion</span>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl neo-border bg-[#FFF4E6] flex items-center justify-center font-extrabold text-sm mb-2 shadow-[2px_2px_0px_0px_#171717]">
              {top3[2].name.slice(0, 2)}
            </div>
            <p className="text-xs sm:text-sm font-bold text-center text-[#171717] dark:text-white truncate w-full">
              {top3[2].name}
            </p>
            <p className="text-[10px] text-gray-500 font-mono mb-2">{top3[2].rating} pts</p>

            {/* Podium Block 3 */}
            <div className="w-full h-24 sm:h-32 rounded-t-2xl bg-[#F4A6C1] neo-border flex flex-col items-center justify-center text-[#171717] neo-shadow">
              <span className="text-2xl sm:text-4xl font-extrabold">3</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Bronze</span>
            </div>
          </div>

        </div>
      </div>

      {/* FILTER BAR: Global · College · Weekly · Monthly */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-xs font-bold w-full sm:w-auto justify-center">
          {[
            { id: 'global', label: 'Global Ranking' },
            { id: 'college', label: 'College Teams' },
            { id: 'weekly', label: 'This Week' },
            { id: 'monthly', label: 'This Month' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
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
            placeholder="Search student or college..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-xs text-[#171717] dark:text-white focus:outline-none"
          />
        </div>

      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b-2 border-[#171717] dark:border-[#383838] bg-[#FFF4E6] dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">College</th>
                <th className="py-3.5 px-4">Problems Solved</th>
                <th className="py-3.5 px-4">XP Points</th>
                <th className="py-3.5 px-4 text-right">Contest Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredList.map((user) => {
                const isYou = user.name.includes('(You)');

                return (
                  <tr 
                    key={user.rank}
                    className={`transition-colors ${
                      isYou 
                        ? 'bg-[#FFF0B3]/40 dark:bg-amber-950/20 font-bold' 
                        : 'hover:bg-gray-50 dark:hover:bg-[#282828]'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-extrabold">
                      {user.rank <= 3 ? (
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          user.rank === 1 
                            ? 'bg-amber-400 text-black' 
                            : user.rank === 2 
                            ? 'bg-gray-300 text-black' 
                            : 'bg-amber-700 text-white'
                        }`}>
                          {user.rank}
                        </span>
                      ) : (
                        <span className="text-gray-500 font-mono">#{user.rank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#171717] dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#D8EEDC] neo-border-sm flex items-center justify-center font-bold text-[11px] text-[#171717]">
                          {user.name.slice(0, 2)}
                        </span>
                        <div>
                          <p className="leading-none">{user.name}</p>
                          <p className="text-[10px] text-gray-500 font-normal mt-0.5">@{user.username}</p>
                        </div>
                        {isYou && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#F4A6C1] text-[#171717]">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                      {user.college}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-gray-700 dark:text-gray-300">
                      {user.solved} Solved
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600 tabular-nums">
                      {user.xp.toLocaleString()} XP
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-md bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm font-mono font-extrabold text-xs text-[#171717] dark:text-white">
                        {user.rating}
                      </span>
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
