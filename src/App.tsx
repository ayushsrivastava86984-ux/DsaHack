import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScreenId, Language, TopicName, Problem, UserProfile } from './types';
import { fetchPublishedProblems, fetchProblemByIdOrSlug } from './services/problemsService';

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
import { INITIAL_USER } from './data/mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');

  // Supabase problems repository: fetched from public.problems where is_published = true
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState<boolean>(true);
  const [problemsError, setProblemsError] = useState<string | null>(null);

  const loadPublishedProblems = useCallback(async () => {
    setIsLoadingProblems(true);
    setProblemsError(null);
    try {
      const { problems: fetched, error } = await fetchPublishedProblems();
      if (error) {
        setProblemsError(error.message);
      } else {
        setProblems(fetched);
        if (fetched.length > 0) {
          setSelectedProblem((prev) => {
            if (!prev) return fetched[0];
            const found = fetched.find(
              (p) => p.id === prev.id || p.problemId === prev.problemId || p.slug === prev.slug
            );
            return found || fetched[0];
          });
        }
      }
    } catch (err) {
      setProblemsError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoadingProblems(false);
    }
  }, []);

  useEffect(() => {
    loadPublishedProblems();
  }, [loadPublishedProblems]);

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
  const [selectedProblem, setSelectedProblem] = useState<Problem>(() => ({
    id: 'fc7b2713-445e-4afb-8664-2d74db0624d9',
    problemId: 'TWO_SUM',
    number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    languageTags: ['python', 'java', 'cpp', 'c', 'javascript'],
    acceptance: '53.8%',
    description:
      'Given an array of integers nums and an integer target, return the indices of the two numbers whose sum is equal to the target. You may assume that exactly one valid answer exists. You cannot use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10000',
      '-1000000000 <= nums[i] <= 1000000000',
      '-1000000000 <= target <= 1000000000',
    ],
    hints: ['A brute force approach searches all pairs. Can you use a hash map for O(n)?'],
    starterCode: {
      python: '# Two Sum\nclass Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass\n',
      java: '// Two Sum\nimport java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
      cpp: '// Two Sum\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};',
      c: '// Two Sum\n#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 0;\n    return NULL;\n}',
      javascript: '/**\n * Two Sum\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n};',
    },
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
      },
    ],
    companyTags: ['Google', 'Meta', 'Amazon'],
    isPublished: true,
  }));
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
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

  // Problem selection with auth guard - supports object, DB uuid (id), or problem_id
  const handleSelectProblem = (problemOrId: Problem | string) => {
    let problem: Problem | undefined;
    const lookupKey = typeof problemOrId === 'string' ? problemOrId : problemOrId.id || problemOrId.problemId;

    if (typeof problemOrId === 'string') {
      problem =
        problems.find(
          (p) => p.id === problemOrId || p.problemId === problemOrId || p.slug === problemOrId
        ) ||
        (selectedProblem.id === problemOrId || selectedProblem.problemId === problemOrId
          ? selectedProblem
          : undefined);
    } else {
      problem = problemOrId;
    }

    if (!problem) return;

    setSelectedProblem(problem);

    // Fetch full question detail from Supabase in background to ensure up-to-date content
    if (lookupKey) {
      fetchProblemByIdOrSlug(lookupKey).then(({ problem: fullProblem }) => {
        if (fullProblem) {
          setSelectedProblem(fullProblem);
        }
      }).catch((err) => {
        console.warn('Could not fetch updated question details:', err);
      });
    }

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
    handleProblemSolved(problems[0]?.id || selectedProblem.id);
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
              problems={problems}
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
              problems={problems}
              isLoading={isLoadingProblems}
              error={problemsError}
              onRetry={loadPublishedProblems}
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

