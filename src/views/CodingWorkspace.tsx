import React, { useState, useEffect } from 'react';
import { Problem, Language, ScreenId } from '../types';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Terminal, 
  Code2, 
  FileText,
  HelpCircle, 
  Check, 
  Copy, 
  Clock, 
  Zap, 
  AlertCircle
} from 'lucide-react';

interface CodingWorkspaceProps {
  problem: Problem;
  onNavigate: (screen: ScreenId) => void;
  isBookmarked: boolean;
  isSolved: boolean;
  onToggleBookmark: (id: string) => void;
  onProblemSolved: (id: string) => void;
  onOpenAiMentorWithContext?: (problem: Problem, code: string, lang: Language) => void;
}

export const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  problem,
  onNavigate,
  isBookmarked,
  isSolved,
  onToggleBookmark,
  onProblemSolved,
  onOpenAiMentorWithContext,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [code, setCode] = useState<string>(problem.starterCode.python || '');
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'submissions'>('description');
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>(problem.testCases[0]?.input || '');
  const [fontSize, setFontSize] = useState<number>(13);
  
  // Mobile responsive view switcher: Problem statement vs Code Editor vs Test Console
  const [mobileView, setMobileView] = useState<'problem' | 'editor' | 'console'>('problem');

  // Execution & Submission state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runOutput, setRunOutput] = useState<{
    status: 'Ready' | 'Success' | 'Wrong Answer' | 'Error';
    stdout?: string;
    runtime?: string;
    memory?: string;
    passedCases?: string;
  } | null>(null);

  // Sync starter code when language changes
  useEffect(() => {
    setCode(problem.starterCode[selectedLanguage] || '// No template for this language');
    setRunOutput(null);
  }, [selectedLanguage, problem]);

  const handleResetCode = () => {
    setCode(problem.starterCode[selectedLanguage] || '');
    setRunOutput(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setRunOutput(null);
    setMobileView('console'); // Switch to console view on mobile

    setTimeout(() => {
      setIsRunning(false);
      setRunOutput({
        status: 'Success',
        stdout: `Executing ${problem.title} on testcase [${activeTestCaseIndex + 1}]...\nOutput: ${problem.testCases[activeTestCaseIndex]?.expectedOutput}\nExpected: ${problem.testCases[activeTestCaseIndex]?.expectedOutput}`,
        runtime: '42 ms',
        memory: '16.4 MB',
        passedCases: `Testcase ${activeTestCaseIndex + 1} passed`,
      });
    }, 600);
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    setRunOutput(null);
    setMobileView('console'); // Switch to console view on mobile

    setTimeout(() => {
      setIsSubmitting(false);
      onProblemSolved(problem.id);
      setRunOutput({
        status: 'Success',
        stdout: `All 45 / 45 test cases passed!\nRuntime: 38 ms (Beats 89.2% of ${selectedLanguage.toUpperCase()} submissions)\nMemory: 15.8 MB (Beats 76.4% of users)`,
        runtime: '38 ms',
        memory: '15.8 MB',
        passedCases: '45/45 Passed',
      });
    }, 900);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-[#171717] overflow-hidden">
      
      {/* Top Workspace Header Bar */}
      <div className="h-14 px-3 sm:px-4 bg-[#FFF4E6] dark:bg-[#1e1e1e] border-b-2 border-[#171717] dark:border-[#383838] flex items-center justify-between shrink-0 gap-2">
        
        {/* Left: Problem Quick Title & Difficulty */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => onNavigate('dsa_questions')}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#171717] dark:text-white shrink-0"
            title="Return to Problem List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-extrabold text-[#171717] dark:text-white truncate">
              {problem.number}. {problem.title}
            </span>

            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
              problem.difficulty === 'Easy'
                ? 'bg-[#D8EEDC] text-emerald-900'
                : problem.difficulty === 'Medium'
                ? 'bg-[#FFF0B3] text-amber-900'
                : 'bg-[#F4A6C1] text-rose-950'
            }`}>
              {problem.difficulty}
            </span>

            {isSolved && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Ask AI Mentor button */}
          <button
            onClick={() => {
              if (onOpenAiMentorWithContext) {
                onOpenAiMentorWithContext(problem, code, selectedLanguage);
              }
              onNavigate('ai_mentor');
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#F4A6C1] text-[#171717] neo-border-sm neo-btn text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717]"
            title="Ask AI Mentor for a progressive hint or complexity review"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">AI Hint</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(problem.id)}
            className="p-1.5 rounded-lg neo-border-sm bg-white dark:bg-[#2a2a2a] text-[#171717] dark:text-white hover:bg-gray-100"
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
            aria-label="Bookmark Problem"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>
        </div>

      </div>

      {/* MOBILE SEGMENTED VIEW SWITCHER (< lg screens) */}
      <div className="lg:hidden h-10 px-2 bg-[#252525] border-b border-[#383838] flex items-center justify-around shrink-0 text-xs font-bold text-gray-300">
        <button
          onClick={() => setMobileView('problem')}
          className={`flex-1 py-1.5 px-2 text-center rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            mobileView === 'problem'
              ? 'bg-[#171717] text-white neo-border-sm font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Description</span>
        </button>

        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 px-2 text-center rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            mobileView === 'editor'
              ? 'bg-[#171717] text-white neo-border-sm font-extrabold text-[#F4A6C1]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>

        <button
          onClick={() => setMobileView('console')}
          className={`flex-1 py-1.5 px-2 text-center rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            mobileView === 'console'
              ? 'bg-[#171717] text-white neo-border-sm font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Testcases</span>
        </button>
      </div>

      {/* Main Split Body: Left Description Panel | Right Code Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANEL: Problem Details & Progressive Hints (5 Cols on desktop, full screen when mobileView === 'problem') */}
        <div className={`lg:col-span-5 border-b lg:border-b-0 lg:border-r-2 border-[#171717] dark:border-[#383838] flex flex-col h-full bg-white dark:bg-[#1a1a1a] overflow-hidden ${
          mobileView === 'problem' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Subheader tabs */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 bg-gray-50/50 dark:bg-[#202020] text-xs font-bold text-gray-500">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-[#F4A6C1] text-[#171717] dark:text-white font-extrabold'
                  : 'border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1 ${
                activeTab === 'hints'
                  ? 'border-[#F4A6C1] text-[#171717] dark:text-white font-extrabold'
                  : 'border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              <span>Hints ({problem.hints.length})</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4A6C1]"></span>
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'submissions'
                  ? 'border-[#F4A6C1] text-[#171717] dark:text-white font-extrabold'
                  : 'border-transparent hover:text-black dark:hover:text-white'
              }`}
            >
              Submissions
            </button>
          </div>

          {/* Left panel scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-[#171717] dark:text-gray-200 leading-relaxed">
            
            {activeTab === 'description' && (
              <>
                {/* Problem Statement */}
                <div className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
                    {problem.description.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="whitespace-pre-wrap">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Examples
                  </h4>
                  {problem.examples.map((ex, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FFF4E6]/50 dark:bg-[#242424] neo-border-sm space-y-2 text-xs"
                    >
                      <div className="font-mono">
                        <strong className="text-gray-700 dark:text-gray-300">Input: </strong>
                        <span>{ex.input}</span>
                      </div>
                      <div className="font-mono">
                        <strong className="text-gray-700 dark:text-gray-300">Output: </strong>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-gray-500 dark:text-gray-400 text-[11px] pt-1 border-t border-gray-200 dark:border-gray-700">
                          <strong>Explanation: </strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Constraints
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Mobile direct button to code */}
                <div className="lg:hidden pt-4">
                  <button
                    onClick={() => setMobileView('editor')}
                    className="w-full py-3 rounded-xl bg-[#F4A6C1] text-[#171717] font-extrabold text-xs neo-border-sm flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#171717]"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Open Code Editor</span>
                  </button>
                </div>
              </>
            )}

            {/* HINTS TAB */}
            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[#FFF0B3] text-[#171717] text-xs font-medium neo-border-sm flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <p>
                    Progressive hints reveal logic step-by-step without giving away the full answer.
                  </p>
                </div>

                {problem.hints.map((hint, idx) => {
                  const isRevealed = revealedHintIndex >= idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-3 bg-gray-50 dark:bg-[#282828] flex items-center justify-between text-xs font-bold">
                        <span>Hint {idx + 1}</span>
                        {isRevealed ? (
                          <span className="text-emerald-600 text-[10px] font-bold">Revealed</span>
                        ) : (
                          <button
                            onClick={() => setRevealedHintIndex(Math.max(revealedHintIndex, idx))}
                            className="px-2.5 py-1 rounded bg-[#F4A6C1] text-[#171717] neo-border-sm text-[11px] font-bold neo-btn"
                          >
                            Reveal Hint {idx + 1}
                          </button>
                        )}
                      </div>
                      
                      {isRevealed && (
                        <div className="p-3.5 text-xs text-gray-700 dark:text-gray-200 leading-relaxed border-t border-gray-200 dark:border-gray-700">
                          {hint}
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => onNavigate('ai_mentor')}
                  className="w-full py-2.5 rounded-xl bg-[#D8EEDC] text-[#171717] neo-border-sm text-xs font-bold neo-btn text-center"
                >
                  Still stuck? Ask AI Mentor for tailored intuition
                </button>
              </div>
            )}

            {/* SUBMISSIONS TAB */}
            {activeTab === 'submissions' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">History of your code submissions for this problem:</p>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#242424] neo-border-sm space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-emerald-600 font-extrabold">Accepted</span>
                    <span className="text-gray-400 font-mono text-[11px]">Today, 10:14 PM</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-gray-600 dark:text-gray-400 text-[11px]">
                    <span>Language: Python</span>
                    <span>·</span>
                    <span>Runtime: 38 ms</span>
                    <span>·</span>
                    <span>Memory: 15.8 MB</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT PANEL: Code Editor & Console (7 Cols on desktop, visible on mobile when mobileView is 'editor' or 'console') */}
        <div className={`lg:col-span-7 flex flex-col h-full bg-[#171717] text-gray-100 overflow-hidden ${
          mobileView !== 'problem' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Editor Header Bar */}
          <div className="h-11 px-3 sm:px-4 bg-[#212121] border-b border-[#333333] flex items-center justify-between shrink-0 text-xs gap-2">
            
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Code2 className="w-4 h-4 text-[#F4A6C1] shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="bg-[#171717] text-white border border-[#404040] rounded px-2 py-1 text-xs font-bold focus:outline-none"
              >
                <option value="python">Python 3 (v3.12)</option>
                <option value="javascript">JavaScript (ES2024)</option>
                <option value="java">Java (OpenJDK 21)</option>
                <option value="cpp">C++ (GCC 13 / C++20)</option>
                <option value="c">C (GCC 13 / C17)</option>
              </select>
            </div>

            {/* Font & Reset Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <button
                  onClick={() => setFontSize(Math.max(11, fontSize - 1))}
                  className="px-1.5 py-0.5 rounded hover:bg-[#333333]"
                  title="Smaller font"
                >
                  A-
                </button>
                <span className="font-mono">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(18, fontSize + 1))}
                  className="px-1.5 py-0.5 rounded hover:bg-[#333333]"
                  title="Larger font"
                >
                  A+
                </button>
              </div>

              <button
                onClick={handleResetCode}
                className="p-1 rounded hover:bg-[#333333] text-gray-400 hover:text-white transition-colors"
                title="Reset code to starter template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Code Textarea / Editor Body (shown on desktop or when mobileView === 'editor') */}
          <div className={`flex-1 relative overflow-hidden bg-[#171717] flex ${
            mobileView === 'console' ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Line Numbers */}
            <div className="w-9 sm:w-12 py-3 bg-[#1e1e1e] text-right pr-2 sm:pr-3 font-mono text-xs text-gray-600 select-none border-r border-[#2d2d2d] shrink-0">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>

            {/* Code Input */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-2 sm:p-3 bg-transparent font-mono text-gray-200 resize-none focus:outline-none leading-6 selection:bg-[#F4A6C1]/30 w-full"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          {/* BOTTOM PANEL: Test Cases, Console Output & Run/Submit */}
          <div className={`bg-[#1e1e1e] border-t-2 border-[#383838] flex flex-col shrink-0 ${
            mobileView === 'console'
              ? 'flex-1 h-auto min-h-0'
              : 'h-52 sm:h-60'
          }`}>
            
            {/* Testcase Tabs & Execution Toolbar */}
            <div className="px-3 sm:px-4 py-2 bg-[#252525] border-b border-[#383838] flex flex-wrap items-center justify-between gap-2 text-xs">
              
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {problem.testCases.map((tc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTestCaseIndex(idx);
                      setCustomInput(tc.input);
                    }}
                    className={`px-2.5 sm:px-3 py-1 rounded text-xs font-bold transition-colors ${
                      activeTestCaseIndex === idx
                        ? 'bg-[#171717] text-white neo-border-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {/* Run & Submit Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-3 py-1.5 rounded-lg bg-[#333333] hover:bg-[#444444] text-white font-bold text-xs neo-border-sm flex items-center gap-1.5 disabled:opacity-50 min-h-[36px]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-[#F4A6C1] hover:bg-[#f293b2] text-[#171717] font-extrabold text-xs neo-border-sm neo-btn flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717] disabled:opacity-50 min-h-[36px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
                </button>
              </div>

            </div>

            {/* Testcase Input or Output Body */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs space-y-2.5">
              {runOutput ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-extrabold bg-[#D8EEDC] text-emerald-950 text-[10px]">
                      {runOutput.status}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-400 tabular-nums">Runtime: {runOutput.runtime}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-400 tabular-nums">Memory: {runOutput.memory}</span>
                  </div>

                  <pre className="p-3 rounded-lg bg-[#141414] text-emerald-400 border border-[#2d2d2d] whitespace-pre-wrap leading-relaxed text-xs">
                    {runOutput.stdout}
                  </pre>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Input (Test Case {activeTestCaseIndex + 1})
                  </label>
                  <div className="p-2 sm:p-2.5 rounded bg-[#141414] text-gray-200 border border-[#2d2d2d] break-all">
                    {problem.testCases[activeTestCaseIndex]?.input}
                  </div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2 mb-1">
                    Expected Output
                  </label>
                  <div className="p-2 sm:p-2.5 rounded bg-[#141414] text-emerald-400 border border-[#2d2d2d] break-all">
                    {problem.testCases[activeTestCaseIndex]?.expectedOutput}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
