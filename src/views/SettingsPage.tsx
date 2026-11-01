import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  LogOut, 
  CheckCircle2, 
  Code2
} from 'lucide-react';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  onNavigate,
  onLogout,
}) => {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [contestAlerts, setContestAlerts] = useState(true);
  const [editorFontSize, setEditorFontSize] = useState('13px');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Editorial Header */}
      <div className="space-y-2 border-b-2 border-[#171717] dark:border-[#383838] pb-6">
        <h1 className="text-3xl font-extrabold text-[#171717] dark:text-white tracking-tight">
          Account & Platform Settings
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your developer credentials, editor appearance, notifications, and security.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#D8EEDC] neo-border-sm text-xs font-bold text-[#171717] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. Personal Information Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-6">
        <h2 className="text-base font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-[#F4A6C1]" />
          <span>Personal Information</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider text-[11px]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider text-[11px]">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm font-extrabold text-xs neo-btn"
            >
              Update Information
            </button>
          </div>
        </form>
      </div>

      {/* 2. Theme & Workspace Appearance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-6">
        <h2 className="text-base font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-[#FFF0B3]" />
          <span>Appearance & Editor Preferences</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">
              Color Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl neo-border-sm text-center font-bold flex items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'bg-[#FFF4E6] text-[#171717] neo-shadow'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light (Cream/White)</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl neo-border-sm text-center font-bold flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-[#171717] text-white neo-shadow'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Dark (#171717)</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">
              Default Code Editor Font Size
            </label>
            <select
              value={editorFontSize}
              onChange={(e) => setEditorFontSize(e.target.value)}
              className="p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white"
            >
              <option value="12px">12px - Compact</option>
              <option value="13px">13px - Balanced Default</option>
              <option value="15px">15px - Large</option>
              <option value="16px">16px - High Legibility</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
        <h2 className="text-base font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Notification & Streak Alerts</span>
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dailyReminders}
              onChange={(e) => setDailyReminders(e.target.checked)}
              className="w-4 h-4 rounded text-[#F4A6C1]"
            />
            <span className="font-bold text-[#171717] dark:text-white">
              Daily Mission Reminder (Send notification before streak resets)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={contestAlerts}
              onChange={(e) => setContestAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#F4A6C1]"
            />
            <span className="font-bold text-[#171717] dark:text-white">
              Weekly Contest Schedule & Live Start Alert
            </span>
          </label>
        </div>
      </div>

      {/* 4. Session & Logout */}
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 neo-border neo-shadow flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-rose-900 dark:text-rose-300">
            End Active Session
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
            Logs out this device and saves all progress to local state.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs neo-border-sm neo-btn flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );
};
