import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';
import { 
  Code2, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'forgot_password';
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess: (user: UserProfile) => void;
  redirectNotice?: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onNavigate,
  onLoginSuccess,
  redirectNotice,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password' | 'reset_password' | 'verify_email'>(
    initialMode
  );

  // Synchronize mode whenever initialMode prop changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('DSA-849201');
  const [verificationCode, setVerificationCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    // Authenticate user profile with their own credentials
    const usernamePart = email.split('@')[0];
    const studentUser: UserProfile = {
      ...INITIAL_USER,
      name: usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1),
      username: usernamePart,
      email: email,
      role: 'student',
    };

    setStatusMessage('Authentication successful! Loading dashboard...');
    setTimeout(() => {
      onLoginSuccess(studentUser);
      onNavigate('dashboard');
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage('All signup fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // In accordance with Section 5 rule:
    // Every public registration creates exclusively a Student account.
    const newStudent: UserProfile = {
      ...INITIAL_USER,
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: fullName,
      username: fullName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 90 + 10),
      email: email,
      role: 'student', // ALWAYS Student! No admin creation here.
      streak: 1,
      xp: 50,
      solvedCount: 0,
      solvedByDifficulty: { easy: 0, medium: 0, hard: 0 },
      solvedProblemIds: [],
    };

    setMode('verify_email');
    setStatusMessage(`Verification link sent to ${email}. Check your inbox!`);
  };

  const handleVerifyEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Email verified successfully! Welcome to DsaHack.');
    setTimeout(() => {
      onLoginSuccess({
        ...INITIAL_USER,
        name: fullName || 'New Coder',
        email: email || 'student@dsahack.dev',
        role: 'student',
      });
      onNavigate('dashboard');
    }, 600);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your account email.');
      return;
    }
    setMode('reset_password');
    setStatusMessage(`Password reset token sent to ${email}.`);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }
    setStatusMessage('Password updated! You can now sign in.');
    setMode('login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch">
      <div className="w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border-y-2 lg:border-2 border-[#171717] dark:border-[#383838] lg:rounded-3xl overflow-hidden bg-white dark:bg-[#212121] neo-shadow-lg lg:my-10">
        
        {/* LEFT SIDE: DsaHack Branding & Illustration */}
        <div className="lg:col-span-5 bg-[#FFF4E6] dark:bg-[#1a1a1a] p-8 sm:p-12 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-[#171717] dark:border-[#383838] relative overflow-hidden">
          
          <div className="space-y-4 relative z-10">
            <button 
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl neo-border overflow-hidden bg-black flex items-center justify-center shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]">
                <img
                  src="/assets/aistudio/Neon_DsaHack_Coding_Emblem_586b4f4c.png"
                  alt="DsaHack Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-extrabold text-[#171717] dark:text-white">
                Dsa<span className="text-[#F4A6C1]">Hack</span>
              </span>
            </div>

            <div className="inline-block px-2.5 py-1 rounded-md bg-[#FFF0B3] text-[#171717] neo-border-sm text-[11px] font-bold">
              Code. Compete. Conquer.
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-sm">
              Master Data Structures & Algorithms, practice real interview questions, and conquer the coding leaderboard.
            </p>
          </div>

          {/* 3D Illustration */}
          <div className="my-6 relative rounded-2xl neo-border overflow-hidden bg-white dark:bg-[#242424] aspect-4/3 shadow-[3px_3px_0px_0px_#171717] dark:shadow-[3px_3px_0px_0px_#383838]">
            <img 
              src="/images/dsa_auth_illustration_1793517789177.jpg" 
              alt="DsaHack Coder Workspace"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Motivational Bottom Quote */}
          <div className="p-3.5 rounded-xl bg-[#D8EEDC] neo-border-sm text-[#171717] text-xs font-semibold relative z-10">
            <p className="italic">
              "Consistency outperforms natural talent. Solve one problem today, build intuition forever."
            </p>
          </div>

        </div>

        {/* RIGHT SIDE: Authentication Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-[#212121]">
          
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header Switcher */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D8EEDC] text-[#171717]">
                  Student Portal
                </span>
                <span className="text-xs text-gray-500">
                  {mode === 'login' && 'Sign in to continue your streak'}
                  {mode === 'signup' && 'Create your student account'}
                  {mode === 'forgot_password' && 'Password recovery'}
                  {mode === 'reset_password' && 'Create a new password'}
                  {mode === 'verify_email' && 'Verify your student email'}
                </span>
              </div>

              <h2 className="text-3xl font-extrabold text-[#171717] dark:text-white">
                {mode === 'login' && 'Welcome Back, Coder'}
                {mode === 'signup' && 'Join DsaHack Today'}
                {mode === 'forgot_password' && 'Forgot Password'}
                {mode === 'reset_password' && 'Reset Your Password'}
                {mode === 'verify_email' && 'Check Your Email'}
              </h2>
            </div>

            {/* Prompt Notice for First-Time / Unauthenticated Access */}
            {redirectNotice && (
              <div className="p-3.5 rounded-xl bg-[#FFF0B3] neo-border-sm text-xs font-bold text-[#171717] flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#171717]">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{redirectNotice}</span>
              </div>
            )}

            {/* Notification & Error Banners */}
            {statusMessage && (
              <div className="p-3 rounded-xl bg-[#D8EEDC] neo-border-sm text-xs font-bold text-[#171717] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/40 neo-border-sm text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@dsahack.dev"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot_password')}
                      className="text-xs font-bold text-[#171717] dark:text-white hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-sm neo-btn neo-shadow flex items-center justify-center gap-2 mt-2"
                >
                  <span>Sign In & Continue Streak</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. SIGN UP FORM (Single Public Student Role Only) */}
            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Chen"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-3 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-3 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FFF4E6] dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-[11px] text-gray-600 dark:text-gray-400">
                  🛡️ <strong>Single Public Registration:</strong> All accounts are registered with free Student privileges. Internal administrative access requires authorization via secure server-side credentials.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-sm neo-btn neo-shadow flex items-center justify-center gap-2 mt-2"
                >
                  <span>Create Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD */}
            {mode === 'forgot_password' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Enter your registered student email address and we will issue a secure verification reset token.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@dsahack.dev"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-sm neo-btn neo-shadow"
                >
                  Send Reset Token
                </button>
              </form>
            )}

            {/* 4. RESET PASSWORD */}
            {mode === 'reset_password' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Verification Token
                  </label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl neo-border-sm bg-[#FFF0B3] text-sm text-[#171717] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New secure password"
                    required
                    className="w-full px-4 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full px-4 py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-sm neo-btn neo-shadow"
                >
                  Save New Password
                </button>
              </form>
            )}

            {/* 5. EMAIL VERIFICATION */}
            {mode === 'verify_email' && (
              <form onSubmit={handleVerifyEmailSubmit} className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Please enter the 6-digit verification code sent to <strong>{email || 'your email'}</strong>.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="7 4 9 2 0 1"
                    maxLength={6}
                    required
                    className="w-full text-center tracking-widest text-lg py-3 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] font-mono font-bold text-[#171717] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#D8EEDC] text-[#171717] neo-border font-extrabold text-sm neo-btn neo-shadow"
                >
                  Confirm & Launch Dashboard
                </button>
              </form>
            )}

            {/* Bottom Toggle between Sign In / Sign Up */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-600 dark:text-gray-400">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setMode('signup');
                    }}
                    className="font-extrabold text-[#171717] dark:text-white hover:underline"
                  >
                    Register as Student
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setMode('login');
                    }}
                    className="font-extrabold text-[#171717] dark:text-white hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
