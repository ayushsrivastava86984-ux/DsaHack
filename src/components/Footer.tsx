import React from 'react';
import { ScreenId } from '../types';
import { Code2, Heart, Shield, Terminal, Zap, BookOpen, Trophy } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#FFF4E6] dark:bg-[#171717] border-t-2 border-[#171717] dark:border-[#383838] transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neo-border overflow-hidden bg-black flex items-center justify-center shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]">
              <img
                src="/assets/aistudio/Neon_DsaHack_Coding_Emblem_586b4f4c.png"
                alt="DsaHack Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#171717] dark:text-white">
              Dsa<span className="text-[#F4A6C1]">Hack</span>
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 max-w-sm leading-relaxed">
            The next-generation competitive programming and Data Structures & Algorithms learning playground. Master logic, conquer tech interviews, and build algorithmic intuition.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-[#171717] dark:text-gray-400">
            <span className="px-2.5 py-1 rounded-md bg-[#FFF0B3] text-[#171717] neo-border-sm">
              Code. Compete. Conquer.
            </span>
            <span className="px-2 py-1 rounded-md bg-[#D8EEDC] text-[#171717] neo-border-sm">
              Java · Python · JS · C++ · C
            </span>
          </div>
        </div>

        {/* Practice Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Practice
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button onClick={() => onNavigate('languages')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Language Hub (5 Languages)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dsa_topics')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                18 DSA Core Topics
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dsa_questions')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Problem Directory
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('daily_challenge')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Daily Challenge Mission
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('problem_detail')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Interactive Workspace
              </button>
            </li>
          </ul>
        </div>

        {/* Compete & Learn */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Compete & AI
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button onClick={() => onNavigate('contests')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Weekly & Biweekly Contests
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('leaderboard')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Global & College Rankings
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('ai_mentor')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                AI DSA Mentor
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('achievements')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Achievement Badges & XP
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('notes')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Personal Gotcha Notebook
              </button>
            </li>
          </ul>
        </div>

        {/* Account & Administration */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Platform & Admin
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Student Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('profile')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Profile & Heatmap
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('settings')} className="hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]">
                Account Settings
              </button>
            </li>

          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-300 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
        <p>© 2026 DsaHack Inc. Engineered for competitive programmers and interview candidates.</p>
        <div className="flex items-center gap-4">
          <span>Single Public Student Registration Policy</span>
          <span>·</span>
          <span>Protected Internal Role RBAC</span>
          <span>·</span>
          <span>WCAG AA Contrast Compliant</span>
        </div>
      </div>
    </footer>
  );
};
