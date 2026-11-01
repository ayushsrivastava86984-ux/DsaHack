import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScreenId, Language, TopicName, Problem, UserProfile } from './types';
import { INITIAL_PROBLEMS } from './data/mockData';

// Views
import { LandingPage } from './views/LandingPage';
import { AuthPage } from './views/AuthPage';
import { StudentDashboard } from './views/StudentDashboard';
import { LanguageSelectionPage } from './views/LanguageSelectionPage';
import { LanguagePracticePage } from './views/LanguagePracticePage';
import { DsaTopicSelectionPage } from './views/DsaTopicSelectionPage';
import { DsaQuestionListingPage } from './views/DsaQuestionListingPage';
import { CodingWorkspace } from './views/CodingWorkspace';
import { AiMentorPage } from './views/AiMentorPage';
import { DailyChallengePage } from './views/DailyChallengePage';
import { ContestsPage } from './views/ContestsPage';
import { LeaderboardPage } from './views/LeaderboardPage';
import { StudentProfilePage } from './views/StudentProfilePage';
import { AchievementsPage } from './views/AchievementsPage';
import { PersonalNotesPage } from './views/PersonalNotesPage';
import { SettingsPage } from './views/SettingsPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');

  // User profile state - restored from localStorage if available, starts null for first-time visitors
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('dsahack_user');
      return saved ? (JSON.parse(saved) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [selectedTopic, setSelectedTopic] = useState<TopicName | 'All'>('All');
  const [selectedProblem, setSelectedProblem] = useState<Problem>(INITIAL_PROBLEMS[0]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['prob-4', 'prob-7']);
  const [solvedIds, setSolvedIds] = useState<string[]>(['prob-1', 'prob-2', 'prob-3']);
  const [isDailySolved, setIsDailySolved] = useState<boolean>(false);

  // Track pending destination and notice when an unauthenticated visitor attempts to access learning/coding
  const [pendingDestination, setPendingDestination] = useState<{
    screen: ScreenId;
    language?: Language;
    topic?: TopicName | 'All';
    problem?: Problem;
  } | null>(null);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);

  // AI Mentor specific context
  const [mentorContext, setMentorContext] = useState<{
    problem?: Problem;
    code?: string;
    lang?: Language;
  }>({
    problem: INITIAL_PROBLEMS[0],
    code: INITIAL_PROBLEMS[0].starterCode.python,
    lang: 'python',
  });

  // Protected screens that require account signup/login
  const PROTECTED_SCREENS: ScreenId[] = [
    'languages',
    'language_practice',
    'dsa_topics',
    'dsa_questions',
    'problem_detail',
    'ai_mentor',
    'daily_challenge',
    'dashboard',
    'profile',
    'notes',
    'settings',
    'contests',
    'leaderboard',
    'achievements',
  ];

  // Centralized navigation handler with auth guarding
  const handleNavigate = (screen: ScreenId) => {
    if (!user && PROTECTED_SCREENS.includes(screen)) {
      let notice = 'Please create a free account or sign in to continue!';
      if (screen === 'dsa_questions') {
        notice = '⚡ Please sign up or log in to solve questions and track your progress!';
      } else if (screen === 'language_practice' || screen === 'languages') {
        notice = '⚡ Please sign up or log in to practice programming in Java, Python, and C++!';
      } else if (screen === 'problem_detail') {
        notice = '⚡ Please sign up or log in to solve problems in the interactive code workspace!';
      } else if (screen === 'daily_challenge') {
        notice = '⚡ Please sign up or log in to solve today\'s challenge and build your streak!';
      } else if (screen === 'ai_mentor') {
        notice = '⚡ Please sign up or log in to get non-spoiler hints from AI Mentor!';
      } else if (screen === 'dashboard') {
        notice = '⚡ Please sign up or log in to access your student dashboard!';
      } else if (screen === 'contests') {
        notice = '⚡ Please sign up or log in to register for contests and compete in the arena!';
      } else if (screen === 'leaderboard') {
        notice = '⚡ Please sign up or log in to view rankings and join the global leaderboard!';
      } else if (screen === 'achievements') {
        notice = '⚡ Please sign up or log in to view achievements, unlock badges, and earn XP!';
      } else if (screen === 'notes') {
        notice = '⚡ Please sign up or log in to access your personal notebook and revision notes!';
      }

      setRedirectNotice(notice);
      setPendingDestination({ screen });
      setCurrentScreen('signup');
      return;
    }

    if (screen === 'landing') {
      setRedirectNotice(null);
    }
    setCurrentScreen(screen);
  };

  // Language selection with auth guard
  const handleSelectLanguage = (lang: Language | string) => {
    const normalizedLang = lang.toLowerCase() as Language;
    setSelectedLanguage(normalizedLang);

    if (!user) {
      const langNames: Record<string, string> = {
        java: 'Java',
        python: 'Python',
        javascript: 'JavaScript',
        cpp: 'C++',
        c: 'C',
      };
      const name = langNames[normalizedLang] || lang;
      setRedirectNotice(`⚡ Please sign up or log in to practice ${name} programming and solve problems!`);
      setPendingDestination({
        screen: 'language_practice',
        language: normalizedLang,
      });
      setCurrentScreen('signup');
      return;
    }

    setCurrentScreen('language_practice');
  };

  // DSA Topic selection with auth guard
  const handleSelectTopic = (topic: TopicName | 'All' | string) => {
    setSelectedTopic(topic as TopicName | 'All');

    if (!user) {
      setRedirectNotice(`⚡ Please sign up or log in to solve ${topic} DSA questions!`);
      setPendingDestination({
        screen: 'dsa_questions',
        topic: topic as TopicName | 'All',
      });
      setCurrentScreen('signup');
      return;
    }

    setCurrentScreen('dsa_questions');
  };

  // Problem selection with auth guard
  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);

    if (!user) {
      setRedirectNotice(`⚡ Please sign up or log in to solve "${problem.title}" in the code workspace!`);
      setPendingDestination({
        screen: 'problem_detail',
        problem,
      });
      setCurrentScreen('signup');
      return;
    }

    setCurrentScreen('problem_detail');
  };

  // Login / Signup success handler with state restoration
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem('dsahack_user', JSON.stringify(loggedInUser));
    } catch (e) {
      console.warn('Could not persist session', e);
    }

    // If visitor was redirected while trying to access a specific feature, route them there
    if (pendingDestination) {
      const dest = pendingDestination;
      setPendingDestination(null);
      setRedirectNotice(null);
      if (dest.language) setSelectedLanguage(dest.language);
      if (dest.topic) setSelectedTopic(dest.topic);
      if (dest.problem) setSelectedProblem(dest.problem);
      setCurrentScreen(dest.screen);
    } else {
      setRedirectNotice(null);
      setCurrentScreen('dashboard');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('dsahack_user');
    } catch (e) {
      console.warn('Could not clear session', e);
    }
    setPendingDestination(null);
    setRedirectNotice(null);
    setCurrentScreen('landing');
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProblemSolved = (id: string) => {
    if (!solvedIds.includes(id)) {
      setSolvedIds((prev) => [...prev, id]);
      if (user) {
        const updated = {
          ...user,
          solvedCount: user.solvedCount + 1,
          xp: user.xp + 50,
          solvedProblemIds: [...user.solvedProblemIds, id],
        };
        setUser(updated);
        try {
          localStorage.setItem('dsahack_user', JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
    }
  };

  const handleSolveDaily = () => {
    setIsDailySolved(true);
    handleProblemSolved(INITIAL_PROBLEMS[0].id);
    if (user) {
      const updated = {
        ...user,
        streak: user.streak + 1,
        xp: user.xp + 50,
      };
      setUser(updated);
      try {
        localStorage.setItem('dsahack_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const handleOpenAiMentorWithContext = (problem: Problem, code: string, lang: Language) => {
    setMentorContext({ problem, code, lang });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#FFF4E6] dark:bg-[#171717] text-[#171717] dark:text-[#FFFFFF] transition-colors">
        
        {/* Navigation Bar */}
        <Navbar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1">
          {currentScreen === 'landing' && (
            <LandingPage
              onNavigate={handleNavigate}
              onSelectLanguage={handleSelectLanguage}
              onSelectTopic={handleSelectTopic}
            />
          )}

          {currentScreen === 'login' && (
            <AuthPage
              initialMode="login"
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              redirectNotice={redirectNotice}
            />
          )}

          {currentScreen === 'signup' && (
            <AuthPage
              initialMode="signup"
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              redirectNotice={redirectNotice}
            />
          )}

          {currentScreen === 'forgot_password' && (
            <AuthPage
              initialMode="forgot_password"
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              redirectNotice={redirectNotice}
            />
          )}

          {currentScreen === 'dashboard' && (
            user ? (
              <StudentDashboard
                user={user}
                onNavigate={handleNavigate}
                onSelectProblem={handleSelectProblem}
              />
            ) : (
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                redirectNotice={redirectNotice || 'Please sign up or log in to access your dashboard.'}
              />
            )
          )}

          {currentScreen === 'languages' && (
            <LanguageSelectionPage
              onNavigate={handleNavigate}
              onSelectLanguage={handleSelectLanguage}
            />
          )}

          {currentScreen === 'language_practice' && (
            <LanguagePracticePage
              language={selectedLanguage}
              onSelectLanguage={handleSelectLanguage}
              onNavigate={handleNavigate}
              onSelectProblem={handleSelectProblem}
              bookmarkedIds={bookmarkedIds}
              solvedIds={solvedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentScreen === 'dsa_topics' && (
            <DsaTopicSelectionPage
              onNavigate={handleNavigate}
              onSelectTopic={handleSelectTopic}
            />
          )}

          {currentScreen === 'dsa_questions' && (
            <DsaQuestionListingPage
              selectedTopic={selectedTopic}
              onSelectTopic={handleSelectTopic}
              onNavigate={handleNavigate}
              onSelectProblem={handleSelectProblem}
              bookmarkedIds={bookmarkedIds}
              solvedIds={solvedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentScreen === 'problem_detail' && (
            <CodingWorkspace
              problem={selectedProblem}
              onNavigate={handleNavigate}
              isBookmarked={bookmarkedIds.includes(selectedProblem.id)}
              isSolved={solvedIds.includes(selectedProblem.id)}
              onToggleBookmark={handleToggleBookmark}
              onProblemSolved={handleProblemSolved}
              onOpenAiMentorWithContext={handleOpenAiMentorWithContext}
            />
          )}

          {currentScreen === 'ai_mentor' && (
            <AiMentorPage
              onNavigate={handleNavigate}
              contextProblem={mentorContext.problem || selectedProblem}
              contextCode={mentorContext.code || ''}
              contextLanguage={mentorContext.lang || selectedLanguage}
            />
          )}

          {currentScreen === 'daily_challenge' && (
            <DailyChallengePage
              user={user || {
                id: 'guest',
                name: 'Guest Coder',
                username: 'guest',
                email: 'guest@dsahack.dev',
                role: 'student',
                avatar: '',
                bio: 'Ready to learn algorithms',
                joinedDate: 'Today',
                streak: 1,
                maxStreak: 1,
                xp: 0,
                level: 1,
                rating: 1200,
                solvedCount: 0,
                solvedByDifficulty: { easy: 0, medium: 0, hard: 0 },
                totalSubmissions: 0,
                accuracy: 100,
                solvedProblemIds: [],
                bookmarkedProblemIds: [],
                wrongAnswerIds: [],
              }}
              onNavigate={handleNavigate}
              onSelectProblem={handleSelectProblem}
              isDailySolved={isDailySolved}
              onSolveDaily={handleSolveDaily}
            />
          )}

          {currentScreen === 'contests' && (
            user ? (
              <ContestsPage onNavigate={handleNavigate} />
            ) : (
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                redirectNotice={redirectNotice || '⚡ Please sign up or log in to enter the contest arena.'}
              />
            )
          )}

          {currentScreen === 'leaderboard' && (
            user ? (
              <LeaderboardPage onNavigate={handleNavigate} />
            ) : (
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                redirectNotice={redirectNotice || '⚡ Please sign up or log in to view the competitive leaderboard.'}
              />
            )
          )}

          {currentScreen === 'profile' && (
            user ? (
              <StudentProfilePage
                user={user}
                onUpdateUser={(updated) => {
                  const newUser = { ...user, ...updated };
                  setUser(newUser);
                  try {
                    localStorage.setItem('dsahack_user', JSON.stringify(newUser));
                  } catch {
                    // ignore
                  }
                }}
                onNavigate={handleNavigate}
                onSelectProblem={handleSelectProblem}
              />
            ) : (
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                redirectNotice={redirectNotice || 'Please sign up or log in to view your profile.'}
              />
            )
          )}

          {currentScreen === 'achievements' && (
            user ? (
              <AchievementsPage
                user={user}
                onNavigate={handleNavigate}
              />
            ) : (
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                redirectNotice={redirectNotice || '⚡ Please sign up or log in to view achievements, unlock badges, and earn XP!'}
              />
            )
          )}

          {currentScreen === 'notes' && (
            user ? (
              <PersonalNotesPage
                onNavigate={handleNavigate}
                onSelectProblem={handleSelectProblem}
              />
            ) : (
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                redirectNotice={redirectNotice || '⚡ Please sign up or log in to access your personal notebook and notes.'}
              />
            )
          )}

          {currentScreen === 'settings' && (
            user ? (
              <SettingsPage
                user={user}
                onUpdateUser={(updated) => {
                  const newUser = { ...user, ...updated };
                  setUser(newUser);
                  try {
                    localStorage.setItem('dsahack_user', JSON.stringify(newUser));
                  } catch {
                    // ignore
                  }
                }}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            ) : (
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                redirectNotice={redirectNotice || 'Please sign up or log in to manage settings.'}
              />
            )
          )}
        </main>

        {/* Global Footer (omitted on full-height coding workspace to maximize editor viewport) */}
        {currentScreen !== 'problem_detail' && (
          <Footer onNavigate={handleNavigate} />
        )}

      </div>
    </ThemeProvider>
  );
}

