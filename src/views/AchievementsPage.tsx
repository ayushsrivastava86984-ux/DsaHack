import React from 'react';
import { ScreenId, UserProfile } from '../types';
import { ACHIEVEMENTS } from '../data/mockData';
import { 
  Award, 
  Flame, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Target, 
  Crown,
  Star
} from 'lucide-react';

interface AchievementsPageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ user, onNavigate }) => {
  const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'streak', label: 'Streaks' },
    { id: 'solved', label: 'Problem Milestones' },
    { id: 'topic', label: 'Topic Mastery' },
    { id: 'special', label: 'Special Feats' },
  ];

  const [activeCategory, setActiveCategory] = React.useState('all');

  const filteredBadges = ACHIEVEMENTS.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const unlockedCount = ACHIEVEMENTS.filter((b) => b.unlocked).length;

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-10">
      
      {/* Editorial Header */}
      <div className="p-4 sm:p-8 md:p-12 rounded-3xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF0B3] text-[#171717] neo-border-sm text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-amber-800" />
            <span>Gamification & Trophy Room</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#171717] dark:text-white tracking-tight">
            Level {user.level} · <br />
            <span className="text-[#F4A6C1]">Binary Alchemist</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Conquer algorithmic challenges to unlock collectible neo-brutalist badges, earn XP bonuses, and reach the Grandmaster tier.
          </p>

          {/* XP Progress Bar */}
          <div className="space-y-2 pt-2 max-w-md">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-500">Progression to Level {user.level + 1}</span>
              <span className="font-mono text-[#171717] dark:text-white tabular-nums">
                {user.xp} / 4,000 XP
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white dark:bg-[#171717] neo-border-sm overflow-hidden p-0.5">
              <div 
                className="h-full bg-[#F4A6C1] rounded-full" 
                style={{ width: `${(user.xp / 4000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Big Trophy Tile */}
        <div className="w-full md:w-64 p-6 rounded-2xl bg-[#D8EEDC] neo-border neo-shadow text-[#171717] text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white neo-border-sm flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-amber-600 fill-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-extrabold tabular-nums">{unlockedCount} / {ACHIEVEMENTS.length}</p>
            <p className="text-xs font-bold text-gray-700">Collectible Badges Earned</p>
          </div>
        </div>

      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-[#171717] dark:border-[#383838]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-[#171717] text-white neo-border-sm shadow-[1.5px_1.5px_0px_0px_#171717] dark:bg-[#F4A6C1] dark:text-[#171717]'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282828]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* BADGE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredBadges.map((badge) => {
          const pct = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-2xl neo-border neo-shadow flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 ${
                badge.unlocked
                  ? 'bg-white dark:bg-[#212121]'
                  : 'bg-gray-50/70 dark:bg-[#1a1a1a]/60 opacity-70'
              }`}
            >
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl neo-border-sm flex items-center justify-center font-bold ${
                    badge.unlocked ? 'bg-[#FFF0B3]' : 'bg-gray-200 dark:bg-gray-800'
                  }`}>
                    {badge.unlocked ? (
                      <Award className="w-6 h-6 text-amber-700" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D8EEDC] text-[#171717]">
                    +{badge.rewardXp} XP
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-500">{badge.unlocked ? 'Conquered' : 'Progress'}</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300 tabular-nums">
                      {badge.progress} / {badge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-[#F4A6C1] rounded-full" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>

              </div>

              <div className="text-[10px] text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center font-bold">
                {badge.unlocked ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked {badge.dateUnlocked}</span>
                  </span>
                ) : (
                  <span>Locked</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
