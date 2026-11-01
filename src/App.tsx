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
  // Starts logged out so the user can sign up or log in themselves
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [selectedTopic, setSelectedTopic] = useState<TopicName | 'All'>('All');
  const [selectedProblem, setSelectedProblem] = useState<Problem>(INITIAL_PROBLEMS[0]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['prob-4', 'prob-7']);
  const [solvedIds, setSolvedIds] = useState<string[]>(['prob-1', 'prob-2', 'prob-3']);
  const [isDailySolved, setIsDailySolved] = useState<boolean>(false);

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

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProblemSolved = (id: string) => {
    if (!solvedIds.includes(id)) {
      setSolvedIds((prev) => [...prev, id]);
      if (user) {
        setUser({
          ...user,
          solvedCount: user.solvedCount + 1,
          xp: user.xp + 50,
          solvedProblemIds: [...user.solvedProblemIds, id],
        });
      }
    }
  };

  const handleSolveDaily = () => {
    setIsDailySolved(true);
    handleProblemSolved(INITIAL_PROBLEMS[0].id);
    if (user) {
      setUser({
        ...user,
        streak: user.streak + 1,
        xp: user.xp + 50,
      });
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
          onNavigate={(screen) => setCurrentScreen(screen)}
          user={user}
          onLogout={() => {
            setUser(null);
            setCurrentScreen('landing');
          }}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1">
          {currentScreen === 'landing' && (
            <LandingPage
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectLanguage={(l) => {
                setSelectedLanguage(l as Language);
                setCurrentScreen('language_practice');
              }}
              onSelectTopic={(t) => {
                setSelectedTopic(t as TopicName);
                setCurrentScreen('dsa_questions');
              }}
            />
          )}

          {currentScreen === 'login' && (
            <AuthPage
              initialMode="login"
              onNavigate={(s) => setCurrentScreen(s)}
              onLoginSuccess={(u) => {
                setUser(u);
                setCurrentScreen('dashboard');
              }}
            />
          )}

          {currentScreen === 'signup' && (
            <AuthPage
              initialMode="signup"
              onNavigate={(s) => setCurrentScreen(s)}
              onLoginSuccess={(u) => {
                setUser(u);
                setCurrentScreen('dashboard');
              }}
            />
          )}

          {currentScreen === 'forgot_password' && (
            <AuthPage
              initialMode="forgot_password"
              onNavigate={(s) => setCurrentScreen(s)}
              onLoginSuccess={(u) => {
                setUser(u);
                setCurrentScreen('dashboard');
              }}
            />
          )}

          {currentScreen === 'dashboard' && (
            user ? (
              <StudentDashboard
                user={user}
                onNavigate={(s) => setCurrentScreen(s)}
                onSelectProblem={(p) => {
                  setSelectedProblem(p);
                  setCurrentScreen('problem_detail');
                }}
              />
            ) : (
              <AuthPage
                initialMode="login"
                onNavigate={(s) => setCurrentScreen(s)}
                onLoginSuccess={(u) => {
                  setUser(u);
                  setCurrentScreen('dashboard');
                }}
              />
            )
          )}

          {currentScreen === 'languages' && (
            <LanguageSelectionPage
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectLanguage={(l) => {
                setSelectedLanguage(l);
                setCurrentScreen('language_practice');
              }}
            />
          )}

          {currentScreen === 'language_practice' && (
            <LanguagePracticePage
              language={selectedLanguage}
              onSelectLanguage={(l) => setSelectedLanguage(l)}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectProblem={(p) => {
                setSelectedProblem(p);
                setCurrentScreen('problem_detail');
              }}
              bookmarkedIds={bookmarkedIds}
              solvedIds={solvedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentScreen === 'dsa_topics' && (
            <DsaTopicSelectionPage
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectTopic={(t) => {
                setSelectedTopic(t);
                setCurrentScreen('dsa_questions');
              }}
            />
          )}

          {currentScreen === 'dsa_questions' && (
            <DsaQuestionListingPage
              selectedTopic={selectedTopic}
              onSelectTopic={(t) => setSelectedTopic(t)}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectProblem={(p) => {
                setSelectedProblem(p);
                setCurrentScreen('problem_detail');
              }}
              bookmarkedIds={bookmarkedIds}
              solvedIds={solvedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentScreen === 'problem_detail' && (
            <CodingWorkspace
              problem={selectedProblem}
              onNavigate={(s) => setCurrentScreen(s)}
              isBookmarked={bookmarkedIds.includes(selectedProblem.id)}
              isSolved={solvedIds.includes(selectedProblem.id)}
              onToggleBookmark={handleToggleBookmark}
              onProblemSolved={handleProblemSolved}
              onOpenAiMentorWithContext={handleOpenAiMentorWithContext}
            />
          )}

          {currentScreen === 'ai_mentor' && (
            <AiMentorPage
              onNavigate={(s) => setCurrentScreen(s)}
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
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectProblem={(p) => {
                setSelectedProblem(p);
                setCurrentScreen('problem_detail');
              }}
              isDailySolved={isDailySolved}
              onSolveDaily={handleSolveDaily}
            />
          )}

          {currentScreen === 'contests' && (
            <ContestsPage onNavigate={(s) => setCurrentScreen(s)} />
          )}

          {currentScreen === 'leaderboard' && (
            <LeaderboardPage onNavigate={(s) => setCurrentScreen(s)} />
          )}

          {currentScreen === 'profile' && (
            user ? (
              <StudentProfilePage
                user={user}
                onUpdateUser={(updated) => setUser({ ...user, ...updated })}
                onNavigate={(s) => setCurrentScreen(s)}
                onSelectProblem={(p) => {
                  setSelectedProblem(p);
                  setCurrentScreen('problem_detail');
                }}
              />
            ) : (
              <AuthPage
                initialMode="login"
                onNavigate={(s) => setCurrentScreen(s)}
                onLoginSuccess={(u) => {
                  setUser(u);
                  setCurrentScreen('profile');
                }}
              />
            )
          )}

          {currentScreen === 'achievements' && (
            <AchievementsPage
              user={user || {
                id: 'guest',
                name: 'Guest Coder',
                username: 'guest',
                email: 'guest@dsahack.dev',
                role: 'student',
                avatar: '',
                bio: '',
                joinedDate: 'Today',
                streak: 0,
                maxStreak: 0,
                xp: 0,
                level: 1,
                rating: 1200,
                solvedCount: 0,
                solvedByDifficulty: { easy: 0, medium: 0, hard: 0 },
                totalSubmissions: 0,
                accuracy: 0,
                solvedProblemIds: [],
                bookmarkedProblemIds: [],
                wrongAnswerIds: [],
              }}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {currentScreen === 'notes' && (
            <PersonalNotesPage
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectProblem={(p) => {
                setSelectedProblem(p);
                setCurrentScreen('problem_detail');
              }}
            />
          )}

          {currentScreen === 'settings' && (
            user ? (
              <SettingsPage
                user={user}
                onUpdateUser={(updated) => setUser({ ...user, ...updated })}
                onNavigate={(s) => setCurrentScreen(s)}
                onLogout={() => {
                  setUser(null);
                  setCurrentScreen('landing');
                }}
              />
            ) : (
              <AuthPage
                initialMode="login"
                onNavigate={(s) => setCurrentScreen(s)}
                onLoginSuccess={(u) => {
                  setUser(u);
                  setCurrentScreen('settings');
                }}
              />
            )
          )}
        </main>

        {/* Global Footer (omitted on full-height coding workspace to maximize editor viewport) */}
        {currentScreen !== 'problem_detail' && (
          <Footer onNavigate={(s) => setCurrentScreen(s)} />
        )}

      </div>
    </ThemeProvider>
  );
}
