import React, { useState } from 'react';
import { ScreenId, UserProfile, Problem } from '../types';
import { INITIAL_PROBLEMS, ACHIEVEMENTS } from '../data/mockData';
import { 
  User, 
  Flame, 
  Award, 
  Calendar, 
  Bookmark, 
  CheckCircle2, 
  Edit3, 
  Code2, 
  Clock, 
  Sparkles,
  Trophy,
  ExternalLink
} from 'lucide-react';

interface StudentProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectProblem: (problem: Problem) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  user,
  onUpdateUser,
  onNavigate,
  onSelectProblem,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [college, setCollege] = useState(user.college || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, username, bio, college });
    setIsEditing(false);
  };

  // Generate 52 weeks activity heatmap matrix
  const weeks = Array.from({ length: 48 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const active = (w * 7 + d) % 4 === 0 || (w > 40 && (w * 7 + d) % 2 === 0);
      const intensity = active ? ((w + d) % 3) + 1 : 0;
      return intensity;
    })
  );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* PROFILE HEADER CARD */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl neo-border overflow-hidden bg-[#F4A6C1] shadow-[3px_3px_0px_0px_#171717]">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#D8EEDC] text-[#171717] neo-border-sm text-[10px] font-extrabold">
              Lvl {user.level}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] dark:text-white">
                {user.name}
              </h1>
              <span className="text-xs font-mono text-gray-500">@{user.username}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FFF0B3] text-[#171717]">
                Student
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed">
              {user.bio}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-1 flex-wrap">
              <span>{user.college}</span>
              <span>·</span>
              <span>Member since {user.joinedDate}</span>
              <span>·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                Contest Rating: {user.rating}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 rounded-xl bg-[#FFF4E6] dark:bg-[#2a2a2a] text-[#171717] dark:text-white neo-border-sm text-xs font-bold neo-btn flex items-center gap-2 shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>

      </div>

      {/* STATS BENTO ROW: 4 Core Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow text-[#171717] dark:text-white">
          <p className="text-[11px] font-bold text-gray-500 uppercase">Solved Count</p>
          <p className="text-3xl font-extrabold tabular-nums mt-1">{user.solvedCount}</p>
          <p className="text-[11px] text-gray-500 mt-1">Easy: {user.solvedByDifficulty.easy} · Med: {user.solvedByDifficulty.medium} · Hard: {user.solvedByDifficulty.hard}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#D8EEDC] neo-border neo-shadow text-[#171717]">
          <p className="text-[11px] font-bold text-emerald-900 uppercase">Active Streak</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold tabular-nums">{user.streak}</span>
            <span className="text-xs font-bold text-orange-800">Days 🔥</span>
          </div>
          <p className="text-[11px] text-gray-700 mt-1">All-time record: {user.maxStreak} days</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFF0B3] neo-border neo-shadow text-[#171717]">
          <p className="text-[11px] font-bold text-amber-900 uppercase">Total XP Points</p>
          <p className="text-3xl font-extrabold tabular-nums mt-1">{user.xp.toLocaleString()}</p>
          <p className="text-[11px] text-gray-700 mt-1">Level {user.level} · Master Rank</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#F4A6C1] neo-border neo-shadow text-[#171717]">
          <p className="text-[11px] font-bold text-rose-950 uppercase">Submission Accuracy</p>
          <p className="text-3xl font-extrabold tabular-nums mt-1">{user.accuracy}%</p>
          <p className="text-[11px] text-gray-800 mt-1">From {user.totalSubmissions} submissions</p>
        </div>

      </div>

      {/* ACTIVITY HEATMAP (GitHub-style 52 Weeks Grid) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F4A6C1]" />
            <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
              Annual Coding Activity Heatmap
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-500">238 Solves in 2026</span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[700px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((level, dIdx) => {
                  const colors = [
                    'bg-gray-100 dark:bg-[#1a1a1a]',
                    'bg-[#D8EEDC]/60',
                    'bg-[#D8EEDC]',
                    'bg-[#F4A6C1]',
                  ];
                  return (
                    <div
                      key={dIdx}
                      className={`w-3 h-3 rounded-sm ${colors[level]} transition-colors`}
                      title={`Activity Level ${level}`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500 font-bold">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-[#1a1a1a]"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#D8EEDC]/60"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#D8EEDC]"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#F4A6C1]"></div>
          <span>More</span>
        </div>
      </div>

      {/* BADGES & SAVED PROBLEMS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Unlocked Badges (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
              Unlocked Badges ({ACHIEVEMENTS.filter(a => a.unlocked).length})
            </h3>
            <button
              onClick={() => onNavigate('achievements')}
              className="text-xs font-bold text-[#171717] dark:text-white hover:underline"
            >
              All Badges
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.slice(0, 4).map((badge) => (
              <div 
                key={badge.id}
                className="p-3.5 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FFF0B3] neo-border-sm flex items-center justify-center font-bold shrink-0">
                  <Award className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#171717] dark:text-white">{badge.title}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarked Problems (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
              Bookmarked Problems ({user.bookmarkedProblemIds.length})
            </h3>
            <button
              onClick={() => onNavigate('notes')}
              className="text-xs font-bold text-[#171717] dark:text-white hover:underline"
            >
              Open Notebook
            </button>
          </div>

          <div className="space-y-2.5">
            {INITIAL_PROBLEMS.slice(0, 3).map((prob) => (
              <div 
                key={prob.id}
                onClick={() => {
                  onSelectProblem(prob);
                  onNavigate('problem_detail');
                }}
                className="p-3 rounded-xl neo-border-sm bg-gray-50 dark:bg-[#1a1a1a] hover:bg-[#F4A6C1]/20 cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-[#171717] dark:text-white">{prob.number}. {prob.title}</span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                    <span className="font-semibold text-amber-600">{prob.difficulty}</span>
                    <span>·</span>
                    <span>{prob.topic}</span>
                  </div>
                </div>
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#212121] neo-border rounded-2xl neo-shadow-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
              Edit Student Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm font-extrabold text-xs neo-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
