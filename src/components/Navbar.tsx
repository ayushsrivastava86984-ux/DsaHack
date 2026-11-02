import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Code2, 
  Menu, 
  X,
  Flame,
  UserPlus,
  LogIn,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; screen: ScreenId }[] = [
    { label: 'Home', screen: 'landing' },
    { label: 'Programming', screen: 'languages' },
    { label: 'DSA Practice', screen: 'dsa_topics' },
    { label: 'Problems', screen: 'dsa_questions' },
    { label: 'Contests', screen: 'contests' },
    { label: 'Leaderboard', screen: 'leaderboard' },
    { label: 'AI Mentor', screen: 'ai_mentor' },
    { label: 'Daily Mission', screen: 'daily_challenge' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF4E6] dark:bg-[#171717] border-b-2 border-[#171717] dark:border-[#383838] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark & Coding Symbol */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl neo-border overflow-hidden bg-black flex items-center justify-center group-hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]">
              <img
                src="/assets/aistudio/Neon_DsaHack_Coding_Emblem_586b4f4c.png"
                alt="DsaHack Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#171717] dark:text-[#FFFFFF] leading-none">
                Dsa<span className="text-[#F4A6C1]">Hack</span>
              </span>
              <span className="text-[10px] font-semibold text-[#171717]/70 dark:text-[#FFFFFF]/70 tracking-wider uppercase mt-0.5">
                Code · Compete · Conquer
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, clean typography) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#171717] dark:text-[#FFFFFF]/90">
          {navLinks.map((link) => {
            const isActive = currentScreen === link.screen;
            return (
              <button
                key={link.screen}
                onClick={() => onNavigate(link.screen)}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive 
                    ? 'text-[#171717] dark:text-[#F4A6C1] font-bold border-b-2 border-[#F4A6C1]' 
                    : 'hover:text-[#F4A6C1] dark:hover:text-[#F4A6C1]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions - Theme Switcher & Simple Sign Up / Sign In */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="w-9 h-9 rounded-lg bg-white dark:bg-[#212121] neo-border-sm flex items-center justify-center text-[#171717] dark:text-[#FFF4E6] hover:bg-gray-100 dark:hover:bg-[#2c2c2c] transition-all shadow-[1.5px_1.5px_0px_0px_#171717] dark:shadow-[1.5px_1.5px_0px_0px_#383838]"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#171717]" />
            ) : (
              <Sun className="w-4 h-4 text-[#FFF0B3]" />
            )}
          </button>

          {/* Simple Auth State: Sign In & Sign Up buttons or user controls when logged in */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin_dashboard')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold neo-border-sm transition-all shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838] ${
                    currentScreen === 'admin_dashboard'
                      ? 'bg-[#F4A6C1] text-[#171717]'
                      : 'bg-[#171717] text-[#F4A6C1] dark:bg-[#2c2c2c] dark:text-[#F4A6C1]'
                  }`}
                  title="Open Internal Admin Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D8EEDC] text-[#171717] neo-border-sm neo-btn text-xs font-bold shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                <span className="tabular-nums">{user.streak}d</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline font-mono">{user.xp} XP</span>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="w-9 h-9 rounded-lg neo-border-sm overflow-hidden bg-[#F4A6C1] flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity shadow-[1.5px_1.5px_0px_0px_#171717] dark:shadow-[1.5px_1.5px_0px_0px_#383838]"
                title="View Profile"
              >
                {user.avatar && user.avatar.startsWith('http') ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-[#171717]">{user.name.slice(0, 2).toUpperCase()}</span>
                )}
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 text-xs font-bold text-[#171717] dark:text-white hover:underline flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              
              <button
                onClick={() => onNavigate('signup')}
                className="px-4 py-1.5 rounded-lg bg-[#F4A6C1] text-[#171717] neo-border-sm neo-btn text-xs font-extrabold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md neo-border-sm bg-white dark:bg-[#212121] text-[#171717] dark:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF4E6] dark:bg-[#171717] border-b-2 border-[#171717] dark:border-[#383838] px-4 pt-2 pb-4 space-y-2 text-sm font-bold">
          {navLinks.map((link) => (
            <button
              key={link.screen}
              onClick={() => {
                onNavigate(link.screen);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-[#F4A6C1]/20 dark:hover:bg-white/10 text-[#171717] dark:text-white"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-300 dark:border-gray-800 flex flex-wrap gap-2">
            {!user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center rounded-lg bg-white dark:bg-[#262626] text-[#171717] dark:text-white neo-border-sm text-xs font-bold"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center rounded-lg bg-[#F4A6C1] text-[#171717] neo-border-sm text-xs font-extrabold"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="w-full space-y-2">
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin_dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center rounded-lg bg-[#171717] text-[#F4A6C1] dark:bg-[#F4A6C1] dark:text-[#171717] neo-border-sm text-xs font-extrabold flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Admin Console</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center rounded-lg bg-[#D8EEDC] text-[#171717] neo-border-sm text-xs font-bold"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
