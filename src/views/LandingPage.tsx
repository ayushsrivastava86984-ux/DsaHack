import React, { useState } from 'react';
import { ScreenId, Language } from '../types';
import { PROGRAMMING_LANGUAGES, DSA_TOPICS, INITIAL_PROBLEMS } from '../data/mockData';
import { 
  ArrowRight, 
  Terminal, 
  Code2, 
  Sparkles, 
  Trophy, 
  Flame, 
  Layers, 
  Brain, 
  Cpu, 
  CheckCircle2, 
  Zap, 
  GitBranch, 
  Check, 
  ChevronRight,
  Play,
  Award,
  BookOpen,
  Calendar,
  ShieldCheck,
  Building2,
  Lock,
  Clock,
  Compass,
  Star,
  UserPlus
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectLanguage?: (langId: string) => void;
  onSelectTopic?: (topicName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate, 
  onSelectLanguage, 
  onSelectTopic 
}) => {
  // Interactive demo state for live code preview on the home page
  const [activePreviewTab, setActivePreviewTab] = useState<'editor' | 'ai' | 'topics' | 'contests'>('editor');
  const [demoLang, setDemoLang] = useState<Language>('python');
  const [demoHintStep, setDemoHintStep] = useState<number>(1);
  const [demoRunOutput, setDemoRunOutput] = useState<string | null>(null);

  const sampleProblem = INITIAL_PROBLEMS[0]; // Two Sum

  const handleSimulateRun = () => {
    setDemoRunOutput('Running tests...\n✓ Testcase 1 Passed: [0, 1]\n✓ Testcase 2 Passed: [1, 2]\nAll tests passed in 38ms! (+50 XP)');
  };

  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#171717] dark:border-[#383838]">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0B3] text-[#171717] neo-border-sm text-xs font-bold neo-shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#171717]" />
              <span>Next-Gen Algorithm & Programming Playground</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] dark:text-white leading-[1.08] text-balance">
              Think in Code. <br className="hidden sm:inline" />
              <span className="relative inline-block mt-1">
                <span className="relative z-10">Grow Through</span>
                <span className="absolute bottom-1 left-0 right-0 h-4 bg-[#F4A6C1] -rotate-1 -z-0 rounded"></span>
              </span> Practice.
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
              Learn programming, master DSA and build the problem-solving skills to become interview-ready. Code in 5 languages, get progressive AI mentoring without spoilers, and track streaks.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('signup')}
                className="px-6 py-3.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-base neo-btn neo-shadow flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started (Sign Up Free)</span>
              </button>

              <button
                onClick={() => onNavigate('dsa_questions')}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#262626] text-[#171717] dark:text-white neo-border font-bold text-base neo-btn neo-shadow hover:bg-gray-50 dark:hover:bg-[#303030] flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-[#171717] dark:text-[#F4A6C1] fill-current" />
                <span>Solve Questions</span>
              </button>
            </div>

            {/* Language Tag Strip */}
            <div className="pt-4 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                5 Native Languages:
              </span>
              {['Java', 'Python', 'JavaScript', 'C++', 'C'].map((lang, idx) => {
                const bgColors = ['#F4A6C1', '#D8EEDC', '#FFF0B3', '#F4A6C1', '#D8EEDC'];
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      if (onSelectLanguage) onSelectLanguage(lang.toLowerCase());
                      onNavigate('language_practice');
                    }}
                    className="px-2.5 py-1 text-xs font-extrabold neo-border-sm rounded-md shadow-[1.5px_1.5px_0px_0px_#171717] dark:shadow-[1.5px_1.5px_0px_0px_#383838] text-[#171717] hover:scale-105 transition-transform"
                    style={{ backgroundColor: bgColors[idx] }}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Visual Composition with Hero 3D Render & Interactive Mini Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl neo-border neo-shadow-lg overflow-hidden bg-white dark:bg-[#212121]">
              <div className="bg-[#171717] dark:bg-[#2a2a2a] px-4 py-2.5 flex items-center justify-between border-b-2 border-[#171717] dark:border-[#383838]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F4A6C1] neo-border-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFF0B3] neo-border-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-[#D8EEDC] neo-border-sm"></span>
                </div>
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  DsaHack Interactive Engine
                </span>
                <span className="text-[10px] font-mono text-[#D8EEDC] font-semibold">
                  ● Ready
                </span>
              </div>

              <div className="relative aspect-4/3 overflow-hidden bg-[#eaf4ec] dark:bg-[#1a1a1a]">
                <img
                  src="/images/dsa_hero_composition_1793517787857.jpg"
                  alt="DsaHack 3D Playground Composition"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom Interactive Strip */}
              <div className="p-4 bg-white dark:bg-[#212121] border-t-2 border-[#171717] dark:border-[#383838] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D8EEDC] neo-border-sm flex items-center justify-center font-bold text-[#171717]">
                    <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#171717] dark:text-white">Daily Coding Streak</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">14 days unbroken · +50 XP Today</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('daily_challenge')}
                  className="px-3 py-1.5 rounded-md bg-[#FFF0B3] neo-border-sm text-xs font-bold text-[#171717] hover:bg-[#ffe58f] transition-colors"
                >
                  Solve Today
                </button>
              </div>
            </div>

            {/* Floating Contest Ribbon */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-[#D8EEDC] neo-border rounded-xl p-3 neo-shadow items-center gap-3 text-[#171717] animate-bounce [animation-duration:3s]">
              <Trophy className="w-6 h-6 text-amber-700 fill-amber-400" />
              <div>
                <p className="text-xs font-extrabold leading-none">Weekly Clash #412</p>
                <p className="text-[10px] font-bold text-gray-700 mt-0.5">Registration Open · Live Sat 8PM</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. COMPREHENSIVE FEATURES GRID - SHOWCASING ALL WEBSITE CAPABILITIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-block px-3 py-1 rounded-md bg-[#D8EEDC] text-[#171717] neo-border-sm text-xs font-bold uppercase tracking-wider">
            Platform Capabilities & Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] dark:text-white">
            Everything You Need To Crack Tech Interviews
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            DsaHack bridges pure coding practice with guided pedagogical mentoring, competitive arenas, and spaced-repetition revision.
          </p>
        </div>

        {/* 9 Feature Cards - Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1: Multi-Language Practice Hub */}
          <div 
            onClick={() => onNavigate('languages')}
            className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F4A6C1] neo-border-sm flex items-center justify-center font-bold text-[#171717]">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-[#171717]">
                  5 Languages
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] dark:text-white group-hover:text-[#F4A6C1] transition-colors">
                Polyglot Language Practice
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Dedicated learning tracks in <strong>Java</strong>, <strong>Python</strong>, <strong>JavaScript</strong>, <strong>C++</strong>, and <strong>C</strong>. Standard starter code, compiler support, and structured Beginner, Intermediate, and Advanced tiers.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#171717] dark:text-white gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Explore Languages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 2: 18 Core DSA Topic Syllabus */}
          <div 
            onClick={() => onNavigate('dsa_topics')}
            className="p-6 rounded-2xl bg-[#FFF4E6] dark:bg-[#242424] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0B3] neo-border-sm flex items-center justify-center font-bold text-[#171717]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white neo-border-sm">
                  18 Tracks
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] dark:text-white group-hover:text-[#F4A6C1] transition-colors">
                18 Visual DSA Core Topics
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Structured topic cards covering Arrays, Strings, Linked Lists, Stacks, Queues, Hashing, Binary Search, Trees, Graphs, Backtracking, and Dynamic Programming with difficulty breakdowns.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#171717] dark:text-white gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>View Topic Cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 3: Progressive AI DSA Mentor */}
          <div 
            onClick={() => onNavigate('ai_mentor')}
            className="p-6 rounded-2xl bg-[#D8EEDC] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group text-[#171717]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white neo-border-sm flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5 text-emerald-800" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#171717] text-white">
                  Gemini AI
                </span>
              </div>
              <h3 className="text-xl font-bold">
                Non-Spoiler AI DSA Mentor
              </h3>
              <p className="text-xs text-gray-800 leading-relaxed">
                Stuck on a test case? Receive progressive hints (Level 1 Intuition → Level 2 Data Structure → Level 3 Pseudocode) without spoiling direct code. Request line-by-line code breakdowns and Big-O analysis.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold gap-1 pt-2 border-t border-black/10">
              <span>Talk to AI Mentor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 4: Distraction-Free Code Workspace */}
          <div 
            onClick={() => onNavigate('problem_detail')}
            className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white neo-border-sm flex items-center justify-center font-bold">
                  <Terminal className="w-5 h-5 text-[#F4A6C1]" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF0B3] text-[#171717]">
                  IDE Workspace
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] dark:text-white group-hover:text-[#F4A6C1] transition-colors">
                Professional Coding Editor
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Monaco-inspired dark coding editor with custom test cases, multiple language compilers, real runtime metrics (ms / MB), standard output console, and progressive hint disclosure.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#171717] dark:text-white gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Launch IDE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 5: Daily Mission & Unbroken Streak */}
          <div 
            onClick={() => onNavigate('daily_challenge')}
            className="p-6 rounded-2xl bg-[#FFF0B3] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group text-[#171717]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white neo-border-sm flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 text-orange-600 fill-orange-500" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white neo-border-sm">
                  +50 XP
                </span>
              </div>
              <h3 className="text-xl font-bold">
                Daily Challenge & Streak Saver
              </h3>
              <p className="text-xs text-gray-800 leading-relaxed">
                Build an unbroken daily coding habit with 1 curated problem every 24 hours, live countdown timer to midnight, streak freeze protection, and a 30-day consistency heatmap.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold gap-1 pt-2 border-t border-black/10">
              <span>View Daily Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 6: Competitive Arena & Contests */}
          <div 
            onClick={() => onNavigate('contests')}
            className="p-6 rounded-2xl bg-[#F4A6C1] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group text-[#171717]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white neo-border-sm flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5 text-amber-700" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white neo-border-sm">
                  Live Rating
                </span>
              </div>
              <h3 className="text-xl font-bold">
                Weekly & Biweekly Contests
              </h3>
              <p className="text-xs text-gray-800 leading-relaxed">
                Test your skills under strict competition time constraints. Solve 4-5 problems in 90 minutes, earn contest rating points, and battle students from top universities globally.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold gap-1 pt-2 border-t border-black/10">
              <span>Enter Contest Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 7: Global & Collegiate Leaderboard */}
          <div 
            onClick={() => onNavigate('leaderboard')}
            className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0B3] neo-border-sm flex items-center justify-center font-bold text-[#171717]">
                  <Award className="w-5 h-5 text-amber-800" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-[#171717]">
                  Top Podium
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] dark:text-white group-hover:text-[#F4A6C1] transition-colors">
                Podium & College Rankings
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Climb the 1st, 2nd, and 3rd place podium. Filter rankings by Global, College teams (IIT, MIT, Stanford, BITS, ETH), Weekly sprints, or Monthly leaderboards.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#171717] dark:text-white gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>View Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 8: Gamification, Badges & XP */}
          <div 
            onClick={() => onNavigate('achievements')}
            className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#D8EEDC] neo-border-sm flex items-center justify-center font-bold text-[#171717]">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF4E6] text-[#171717]">
                  Collectible
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] dark:text-white group-hover:text-[#F4A6C1] transition-colors">
                Gamification & Badges
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Earn XP for every test case passed and unlock collectible badges: First Blood, Firekeeper (10-day streak), Century Club (100 Solved), Graph Gladiator, and DP Alchemist.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#171717] dark:text-white gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>See All Badges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 9: Wrong Answer Notebook & Revision */}
          <div 
            onClick={() => onNavigate('notes')}
            className="p-6 rounded-2xl bg-[#FFF4E6] dark:bg-[#242424] neo-border neo-shadow flex flex-col justify-between space-y-5 cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F4A6C1] neo-border-sm flex items-center justify-center font-bold text-[#171717]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white neo-border-sm">
                  Gotcha Vault
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#171717] dark:text-white group-hover:text-[#F4A6C1] transition-colors">
                Wrong Answer & Gotcha Notebook
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Save edge-case pitfalls, tricky off-by-one errors, and interview takeaways in a personal revision notebook. One-click "Reattempt" button for spaced repetition before real interviews.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#171717] dark:text-white gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Open Gotcha Notebook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* 3. INTERACTIVE LIVE FEATURE PREVIEW (Try it directly on the Home Page) */}
      <section className="py-16 bg-white dark:bg-[#1a1a1a] border-y-2 border-[#171717] dark:border-[#383838] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F4A6C1]">
              Live Interactive Demonstration
            </span>
            <h2 className="text-3xl font-extrabold text-[#171717] dark:text-white">
              Experience DsaHack in Action
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test out the workspace, review progressive AI hints, and explore topics right here.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: 'editor', label: '🖥️ Code Runner Preview' },
              { id: 'ai', label: '🤖 AI Progressive Hint Demo' },
              { id: 'topics', label: '📚 18 Topic Catalog' },
              { id: 'contests', label: '🏆 Live Contest Preview' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePreviewTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all neo-border-sm ${
                  activePreviewTab === tab.id
                    ? 'bg-[#171717] text-white shadow-[2px_2px_0px_0px_#171717] dark:bg-[#F4A6C1] dark:text-[#171717]'
                    : 'bg-[#FFF4E6] dark:bg-[#282828] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Live Code Editor Preview */}
          {activePreviewTab === 'editor' && (
            <div className="rounded-2xl neo-border neo-shadow-lg overflow-hidden bg-[#171717] text-white max-w-4xl mx-auto">
              <div className="bg-[#212121] px-4 py-3 border-b border-[#333333] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F4A6C1]">Problem #1: Two Sum</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-emerald-400">Easy</span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={demoLang}
                    onChange={(e) => setDemoLang(e.target.value as Language)}
                    className="bg-[#171717] text-white border border-[#404040] rounded px-2.5 py-1 text-xs focus:outline-none"
                  >
                    <option value="python">Python 3</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>

                  <button
                    onClick={handleSimulateRun}
                    className="px-3.5 py-1 rounded-md bg-[#F4A6C1] text-[#171717] font-bold text-xs neo-btn"
                  >
                    Run Code
                  </button>
                </div>
              </div>

              <div className="p-4 font-mono text-xs text-gray-300 bg-[#171717] overflow-x-auto leading-relaxed">
                <pre>{sampleProblem.starterCode[demoLang]}</pre>
              </div>

              {demoRunOutput && (
                <div className="p-4 bg-[#141414] border-t border-[#333333] font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {demoRunOutput}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Live AI Progressive Hint Preview */}
          {activePreviewTab === 'ai' && (
            <div className="rounded-2xl neo-border neo-shadow p-6 bg-[#FFF4E6] dark:bg-[#212121] max-w-3xl mx-auto space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D8EEDC] neo-border-sm flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#171717] dark:text-white">
                    DsaHack AI Progressive Hint System (No Spoilers)
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Step through levels of guidance as you need them.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setDemoHintStep(step)}
                    className={`p-2.5 rounded-xl neo-border-sm text-center text-xs font-bold transition-all ${
                      demoHintStep === step
                        ? 'bg-[#F4A6C1] text-[#171717] neo-shadow-sm'
                        : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Level {step} {step === 1 ? 'Intuition' : step === 2 ? 'Approach' : 'Pseudocode'}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] neo-border-sm text-xs leading-relaxed text-[#171717] dark:text-gray-200">
                {demoHintStep === 1 && (
                  <p>💡 <strong>Level 1 Intuition:</strong> A brute force search uses nested loops in O(N²) time. Instead, compute what complement value Y = target - X you need at index i.</p>
                )}
                {demoHintStep === 2 && (
                  <p>🔍 <strong>Level 2 Approach:</strong> Use a Hash Map to store previously visited elements. Since hash lookup takes $O(1)$ average time, this brings the overall complexity down to linear $O(N)$.</p>
                )}
                {demoHintStep === 3 && (
                  <div>
                    <p className="font-bold">📝 Level 3 Pseudocode:</p>
                    <pre className="mt-1 p-2.5 rounded bg-gray-100 dark:bg-[#252525] font-mono text-[11px] overflow-x-auto text-gray-800 dark:text-gray-200">
{`seen = {}
for i, num in enumerate(nums):
    diff = target - num
    if diff in seen:
        return [seen[diff], i]
    seen[num] = i`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: 18 Topic Catalog Preview */}
          {activePreviewTab === 'topics' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
              {DSA_TOPICS.slice(0, 12).map((t) => (
                <div
                  key={t.name}
                  onClick={() => {
                    if (onSelectTopic) onSelectTopic(t.name);
                    onNavigate('dsa_questions');
                  }}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#212121] neo-border-sm text-center cursor-pointer hover:bg-[#F4A6C1] transition-colors group"
                >
                  <p className="text-xs font-extrabold text-[#171717] dark:text-white group-hover:text-[#171717] truncate">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-gray-500 group-hover:text-[#171717] mt-0.5 font-mono">
                    {t.totalQuestions} Questions
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Contest Arena Preview */}
          {activePreviewTab === 'contests' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF0B3] text-[#171717]">
                  Upcoming Contest
                </span>
                <h4 className="text-xl font-extrabold text-[#171717] dark:text-white">
                  DsaHack Weekly Clash 412
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Saturday 8:00 PM EST · 4 Algorithmic Problems · 90 Minutes · +500 XP
                </p>
              </div>

              <button
                onClick={() => onNavigate('contests')}
                className="px-5 py-2.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm font-extrabold text-xs neo-btn whitespace-nowrap"
              >
                Register Free
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. COMPANY INTERVIEW PREPARATION TAGS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
          Targeted Interview Questions For Top Engineering Teams
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber', 'Goldman Sachs'].map((comp) => (
            <span
              key={comp}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#212121] neo-border-sm text-xs font-bold text-[#171717] dark:text-white shadow-[1.5px_1.5px_0px_0px_#171717] dark:shadow-[1.5px_1.5px_0px_0px_#383838]"
            >
              {comp}
            </span>
          ))}
        </div>
      </section>

      {/* 5. HOW DSAHACK WORKS - 3-STEP PIPELINE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#F4A6C1]">
            Methodology
          </span>
          <h2 className="text-3xl font-extrabold text-[#171717] dark:text-white">
            How DsaHack Builds Problem-Solving Intuition
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4A6C1] neo-border flex items-center justify-center text-xl font-extrabold text-[#171717]">
              1
            </div>
            <h3 className="text-xl font-bold text-[#171717] dark:text-white">
              Learn Invariants, Not Code
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Understand why Sliding Windows work on contiguous constraints and how Monotonic Stacks eliminate redundant comparison loops.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#D8EEDC] neo-border neo-shadow space-y-4 text-[#171717]">
            <div className="w-12 h-12 rounded-xl bg-[#171717] text-white neo-border-sm flex items-center justify-center text-xl font-extrabold">
              2
            </div>
            <h3 className="text-xl font-bold">
              Solve with Native Tooling
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed">
              Code in your target language (Java, Python, JS, C++, C) with instant test verification and zero distraction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFF0B3] neo-border neo-shadow space-y-4 text-[#171717]">
            <div className="w-12 h-12 rounded-xl bg-[#171717] text-white neo-border-sm flex items-center justify-center text-xl font-extrabold">
              3
            </div>
            <h3 className="text-xl font-bold">
              Retain via Gotcha Notebook
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed">
              Save tricky test cases into your Personal Gotcha Vault so you never repeat the same algorithmic error during technical interviews.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow-lg p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="inline-block px-3 py-1 rounded-full bg-[#F4A6C1] neo-border-sm text-xs font-extrabold text-[#171717]">
            Free Student Access
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171717] dark:text-white max-w-2xl mx-auto tracking-tight">
            Ready to Code, Compete and Conquer?
          </h2>

          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
            Join thousands of competitive programmers building real logic every day.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-base neo-btn neo-shadow flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Free Student Account</span>
            </button>
            <button
              onClick={() => onNavigate('dsa_questions')}
              className="px-8 py-4 rounded-xl bg-white dark:bg-[#2a2a2a] text-[#171717] dark:text-white neo-border font-bold text-base neo-btn neo-shadow"
            >
              Browse Problems Without Account
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
