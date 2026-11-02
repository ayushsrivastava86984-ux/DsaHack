export type Language = 'java' | 'python' | 'javascript' | 'cpp' | 'c';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type TopicName =
  | 'Arrays'
  | 'Strings'
  | 'Linked Lists'
  | 'Stacks'
  | 'Queues'
  | 'Hashing'
  | 'Binary Search'
  | 'Sorting'
  | 'Recursion'
  | 'Backtracking'
  | 'Trees'
  | 'Binary Search Trees'
  | 'Heaps'
  | 'Graphs'
  | 'Greedy Algorithms'
  | 'Dynamic Programming'
  | 'Tries'
  | 'Bit Manipulation';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem {
  id: string;
  problemId?: string;
  number: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: TopicName;
  languageTags: Language[];
  acceptance: string;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  starterCode: Record<Language, string>;
  testCases: TestCase[];
  companyTags: string[];
  isDaily?: boolean;
  isPublished?: boolean;
  hiddenTestCases?: TestCase[];
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  language: Language;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  runtime: string;
  memory: string;
  timestamp: string;
  code: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'student' | 'admin';
  avatar: string;
  bio: string;
  college?: string;
  joinedDate: string;
  streak: number;
  maxStreak: number;
  xp: number;
  level: number;
  rating: number;
  solvedCount: number;
  solvedByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  totalSubmissions: number;
  accuracy: number;
  solvedProblemIds: string[];
  bookmarkedProblemIds: string[];
  wrongAnswerIds: string[];
}

export interface Contest {
  id: string;
  title: string;
  number: number;
  status: 'upcoming' | 'active' | 'past';
  startTime: string;
  duration: string;
  problemsCount: number;
  participantsCount: number;
  prizeXp: number;
  registered: boolean;
  themeColor: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'solved' | 'topic' | 'special';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardXp: number;
  dateUnlocked?: string;
}

export interface PersonalNote {
  id: string;
  problemId: string;
  problemTitle: string;
  topic: TopicName;
  content: string;
  isGotcha: boolean;
  lastUpdated: string;
  tags: string[];
}

export type ScreenId =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'dashboard'
  | 'languages'
  | 'language_practice'
  | 'dsa_topics'
  | 'dsa_questions'
  | 'problem_detail'
  | 'ai_mentor'
  | 'daily_challenge'
  | 'contests'
  | 'leaderboard'
  | 'profile'
  | 'achievements'
  | 'notes'
  | 'settings'
  | 'admin_dashboard'
  | 'admin_questions'
  | 'admin_users'
  | 'admin_contests';
