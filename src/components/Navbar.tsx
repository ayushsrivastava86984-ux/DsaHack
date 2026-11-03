import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  X,
  Flame,
  UserPlus,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  Trophy,
  BookOpen
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

  const handleMobileNav = (screen: ScreenId) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF4E6] dark:bg-[#171717] border-b-2 border-[#171717] dark:border-[#383838] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Brand Wordmark & Coding Symbol */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleMobileNav('landing')}
            className="flex items-center gap-2 sm:gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl neo-border overflow-hidden bg-black flex items-center justify-center group-hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838] shrink-0">
              <img
                src="/logo.png"
                alt="DsaHack Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#171717] dark:text-[#FFFFFF] leading-none">
                Dsa<span className="text-[#F4A6C1]">Hack</span>
              </span>
              <span className="hidden sm:inline text-[9px] sm:text-[10px] font-semibold text-[#171717]/70 dark:text-[#FFFFFF]/70 tracking-wider uppercase mt-0.5">
                Code · Compete · Conquer
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Desktop */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-semibold text-[#171717] dark:text-[#FFFFFF]/90">
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

        {/* Zone 3: Actions - Theme Switcher & Auth State */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white dark:bg-[#212121] neo-border-sm flex items-center justify-center text-[#171717] dark:text-[#FFF4E6] hover:bg-gray-100 dark:hover:bg-[#2c2c2c] transition-all shadow-[1.5px_1.5px_0px_0px_#171717] dark:shadow-[1.5px_1.5px_0px_0px_#383838]"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#171717]" />
            ) : (
              <Sun className="w-4 h-4 text-[#FFF0B3]" />
            )}
          </button>

          {/* User Controls or Login/Signup */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-[#D8EEDC] text-[#171717] neo-border-sm neo-btn text-xs font-bold shadow-[1.5px_1.5px_0px_0px_#171717]"
                title="Your Streak & XP"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500 shrink-0" />
                <span className="tabular-nums font-mono">{user.streak}d</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline font-mono">{user.xp} XP</span>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg neo-border-sm overflow-hidden bg-[#F4A6C1] flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity shadow-[1.5px_1.5px_0px_0px_#171717] shrink-0"
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
                className="hidden sm:flex p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#171717] dark:text-white hover:underline flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Log In</span>
              </button>
              
              <button
                onClick={() => onNavigate('signup')}
                className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#F4A6C1] text-[#171717] neo-border-sm neo-btn text-xs font-extrabold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg neo-border-sm bg-white dark:bg-[#212121] text-[#171717] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF4E6] dark:bg-[#1a1a1a] border-b-2 border-[#171717] dark:border-[#383838] px-4 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          
          {/* User mini-card if logged in */}
          {user && (
            <div className="p-3 rounded-xl bg-white dark:bg-[#242424] neo-border-sm flex items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#171717]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg neo-border-sm overflow-hidden bg-[#F4A6C1] flex items-center justify-center font-bold text-sm shrink-0">
                  {user.avatar && user.avatar.startsWith('http') ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#171717] dark:text-white leading-tight">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-[#D8EEDC] text-emerald-950 px-2 py-1 rounded-md neo-border-sm">
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                <span>{user.streak}d</span>
                <span>·</span>
                <span>{user.xp} XP</span>
              </div>
            </div>
          )}

          {/* Quick Learning Links Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {navLinks.map((link) => {
              const isActive = currentScreen === link.screen;
              return (
                <button
                  key={link.screen}
                  onClick={() => handleMobileNav(link.screen)}
                  className={`py-2.5 px-3 rounded-xl text-left transition-all neo-border-sm flex items-center justify-between ${
                    isActive
                      ? 'bg-[#F4A6C1] text-[#171717] font-extrabold shadow-[1.5px_1.5px_0px_0px_#171717]'
                      : 'bg-white dark:bg-[#262626] text-[#171717] dark:text-white hover:bg-[#FFF0B3]'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Account and Auth Controls */}
          <div className="pt-3 border-t border-gray-300 dark:border-gray-800 space-y-2">
            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMobileNav('login')}
                  className="flex-1 py-2.5 text-center rounded-xl bg-white dark:bg-[#262626] text-[#171717] dark:text-white neo-border-sm text-xs font-bold"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleMobileNav('signup')}
                  className="flex-1 py-2.5 text-center rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm text-xs font-extrabold shadow-[2px_2px_0px_0px_#171717]"
                >
                  Create Free Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleMobileNav('dashboard')}
                  className="py-2 rounded-xl bg-[#D8EEDC] text-[#171717] neo-border-sm text-xs font-bold text-center flex items-center justify-center gap-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleMobileNav('profile')}
                  className="py-2 rounded-xl bg-[#FFF0B3] text-[#171717] neo-border-sm text-xs font-bold text-center flex items-center justify-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 neo-border-sm text-xs font-bold text-center flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
