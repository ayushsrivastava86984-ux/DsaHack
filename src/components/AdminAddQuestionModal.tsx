import React, { useState, useEffect } from 'react';
import { Difficulty, Language, Problem, TopicName, ProblemExample } from '../types';
import { 
  OFFICIAL_DSA_TOPICS, 
  SUPPORTED_LANGUAGES, 
  insertProblemToSupabase 
} from '../services/problemsService';
import { 
  X, 
  Sparkles, 
  Code2, 
  BookOpen, 
  Plus, 
  Check, 
  Copy, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Database 
} from 'lucide-react';

interface AdminAddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemAdded: (problem: Problem) => void;
  initialCategory?: 'dsa' | 'language';
  initialLanguage?: Language;
  initialDsaTopic?: string;
}

export const AdminAddQuestionModal: React.FC<AdminAddQuestionModalProps> = ({
  isOpen,
  onClose,
  onProblemAdded,
  initialCategory = 'dsa',
  initialLanguage = 'java',
  initialDsaTopic = 'Arrays',
}) => {
  const [contentType, setContentType] = useState<'dsa' | 'language'>(initialCategory);
  const [dsaTopic, setDsaTopic] = useState<string>(initialDsaTopic);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  
  const [problemId, setProblemId] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [description, setDescription] = useState('');
  const [constraintsText, setConstraintsText] = useState('1 <= n <= 10^5\n-10^9 <= nums[i] <= 10^9');
  
  const [exampleInput, setExampleInput] = useState('nums = [1, 2, 3]');
  const [exampleOutput, setExampleOutput] = useState('[3, 2, 1]');
  const [exampleExplanation, setExampleExplanation] = useState('Reversed order of elements');
  const [hintsText, setHintsText] = useState('Consider using two pointers from opposite ends.');
  const [starterCode, setStarterCode] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // RLS guidance modal state
  const [rlsBlockedInfo, setRlsBlockedInfo] = useState<{
    sql: string;
    json: string;
    createdProblem?: Problem;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<'sql' | 'json' | null>(null);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      setContentType(initialCategory);
      if (initialLanguage) setLanguage(initialLanguage);
      if (initialDsaTopic) setDsaTopic(initialDsaTopic);
      setErrorMsg(null);
      setSuccessMsg(null);
      setRlsBlockedInfo(null);
    }
  }, [isOpen, initialCategory, initialLanguage, initialDsaTopic]);

  // Update starter code and suggested problem ID prefix when category/language changes
  useEffect(() => {
    if (contentType === 'language') {
      const langUpper = language.toUpperCase();
      if (!problemId || problemId.startsWith('ARR-') || problemId.startsWith('STR-')) {
        setProblemId(`${langUpper}-001`);
      }
      
      const templates: Record<Language, string> = {
        java: `// ${title || 'Java Practice'}\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, Java!");\n    }\n}`,
        python: `# ${title || 'Python Practice'}\ndef solve():\n    # Your code here\n    print("Hello, Python!")\n\nif __name__ == "__main__":\n    solve()`,
        javascript: `// ${title || 'JavaScript Practice'}\nfunction solve() {\n    // Your code here\n    console.log("Hello, JavaScript!");\n}\nsolve();`,
        cpp: `// ${title || 'C++ Practice'}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`,
        c: `// ${title || 'C Practice'}\n#include <stdio.h>\n\nint main() {\n    // Your code here\n    printf("Hello, C!\\n");\n    return 0;\n}`,
      };
      setStarterCode(templates[language] || '');
    } else {
      // DSA Problem
      const prefixMap: Record<string, string> = {
        'Arrays': 'ARR',
        'Strings': 'STR',
        'Linked List': 'LL',
        'Stack': 'STK',
        'Queue': 'QUE',
        'Hashing': 'HASH',
        'Binary Search': 'BS',
        'Sorting': 'SORT',
        'Recursion': 'REC',
        'Backtracking': 'BT',
        'Trees': 'TREE',
        'Binary Search Trees': 'BST',
        'Heaps': 'HEAP',
        'Graphs': 'GRAPH',
        'Greedy': 'GREEDY',
        'Dynamic Programming': 'DP',
        'Trie': 'TRIE',
        'Bit Manipulation': 'BIT',
      };
      const pfx = prefixMap[dsaTopic] || 'DSA';
      if (!problemId || problemId.startsWith('JAVA-') || problemId.startsWith('PY-')) {
        setProblemId(`${pfx}-026`);
      }
    }
  }, [contentType, language, dsaTopic]);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'sql' | 'json') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setRlsBlockedInfo(null);

    if (!problemId.trim() || !title.trim() || !description.trim()) {
      setErrorMsg('Please fill in Problem ID, Title, and Description.');
      return;
    }

    const constraints = constraintsText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const examples: ProblemExample[] = [
      {
        input: exampleInput.trim(),
        output: exampleOutput.trim(),
        explanation: exampleExplanation.trim() || undefined,
      },
    ];

    const hints = hintsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      const res = await insertProblemToSupabase({
        contentType,
        dsaTopic: contentType === 'dsa' ? dsaTopic : undefined,
        language: contentType === 'language' ? language : undefined,
        problemId: problemId.trim(),
        title: title.trim(),
        difficulty,
        description: description.trim(),
        constraints: constraints.length > 0 ? constraints : ['No constraints specified.'],
        examples,
        hints,
        isPublished,
      });

      if (res.success && res.problem) {
        setSuccessMsg(`Successfully published "${res.problem.title}" to Supabase!`);
        onProblemAdded(res.problem);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (res.rlsBlocked) {
        // Construct in-memory problem representation so the student can test immediately
        const mockCreatedProblem: Problem = {
          id: `local-${Date.now()}`,
          problemId: problemId.trim(),
          contentType,
          language: contentType === 'language' ? language : undefined,
          number: parseInt(problemId.replace(/\D+/g, ''), 10) || 999,
          title: title.trim(),
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          difficulty,
          topic: contentType === 'dsa' ? dsaTopic : (language.toUpperCase() as TopicName),
          topics: contentType === 'dsa' ? [dsaTopic] : [language.toUpperCase()],
          languageTags: contentType === 'language' ? [language] : ['python', 'java', 'cpp', 'c', 'javascript'],
          acceptance: '100%',
          description: description.trim(),
          examples,
          constraints,
          hints,
          starterCode: {
            python: starterCode || '# Python solution',
            java: starterCode || '// Java solution',
            cpp: starterCode || '// C++ solution',
            c: starterCode || '// C solution',
            javascript: starterCode || '// JS solution',
          },
          testCases: examples.map((ex) => ({ input: ex.input, expectedOutput: ex.output })),
          companyTags: ['DsaHack Community'],
          isPublished: true,
        };

        // Add to active session so they can view and test right away
        onProblemAdded(mockCreatedProblem);

        setRlsBlockedInfo({
          sql: res.sqlSnippet || '',
          json: res.jsonRow || '',
          createdProblem: mockCreatedProblem,
        });
      } else {
        setErrorMsg(res.error || 'Failed to save question to Supabase.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-2xl neo-border neo-shadow p-5 sm:p-6 my-8 text-[#171717] dark:text-white space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b-2 border-[#171717] dark:border-[#383838]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF0B3] text-[#171717] text-[10px] font-mono font-bold neo-border-sm">
              <Database className="w-3 h-3 text-amber-800" />
              <span>Supabase Content Insertion</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Add New Practice Question
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Categorize questions cleanly between pure DSA Practice tracks and Programming Languages.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2c2c2c] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#D8EEDC] text-emerald-950 neo-border-sm flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* RLS Guidance Dialog */}
        {rlsBlockedInfo && (
          <div className="p-4 rounded-xl bg-[#FFF4E6] dark:bg-[#262626] neo-border space-y-3 text-xs">
            <div className="flex items-start gap-2 text-amber-900 dark:text-amber-300 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-sm">Question Activated in Session & Ready for Supabase</p>
                <p className="text-[11px] font-normal text-gray-700 dark:text-gray-300 mt-0.5">
                  Your question has been added to the current website session! Because Supabase Row-Level Security (RLS) is read-only for public anon clients, choose either option below to persist it permanently in Supabase:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(rlsBlockedInfo.sql, 'sql')}
                className="px-3 py-1.5 rounded-lg bg-[#171717] text-white neo-border-sm text-[11px] font-bold flex items-center gap-1.5"
              >
                {copiedType === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'sql' ? 'Copied SQL!' : 'Copy SQL INSERT Statement'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(rlsBlockedInfo.json, 'json')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] text-[#171717] dark:text-white neo-border-sm text-[11px] font-bold flex items-center gap-1.5"
              >
                {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'json' ? 'Copied Table JSON!' : 'Copy Table Editor Row (JSON)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRlsBlockedInfo(null);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#D8EEDC] text-emerald-950 neo-border-sm text-[11px] font-bold ml-auto"
              >
                Continue to Practice
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#F4A6C1]/30 border-2 border-rose-600 text-rose-950 dark:text-rose-200 flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CATEGORY SELECTION: Explicit choice between DSA Problem vs Language Practice */}
          <div className="space-y-2 p-3.5 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300">
              1. Content Category (Strict Separation)
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setContentType('dsa')}
                className={`p-3 rounded-xl neo-border-sm text-left flex items-center gap-2.5 transition-all ${
                  contentType === 'dsa'
                    ? 'bg-[#F4A6C1] text-[#171717] font-black shadow-[2px_2px_0px_0px_#171717]'
                    : 'bg-white dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs font-black">DSA Problem</div>
                  <div className="text-[10px] opacity-80">Arrays, Strings, Trees, etc.</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContentType('language')}
                className={`p-3 rounded-xl neo-border-sm text-left flex items-center gap-2.5 transition-all ${
                  contentType === 'language'
                    ? 'bg-[#FFF0B3] text-[#171717] font-black shadow-[2px_2px_0px_0px_#171717]'
                    : 'bg-white dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100'
                }`}
              >
                <Code2 className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs font-black">Language Practice</div>
                  <div className="text-[10px] opacity-80">Java, Python, C++, C, JS</div>
                </div>
              </button>
            </div>
          </div>

          {/* CONDITIONAL TOPIC OR LANGUAGE SELECTOR */}
          {contentType === 'dsa' ? (
            <div className="space-y-1.5 p-3 rounded-xl bg-[#FFF4E6]/60 dark:bg-[#222222] neo-border-sm">
              <label className="block text-xs font-black text-[#171717] dark:text-white">
                DSA Practice Topic (18 Curriculum Tracks)
              </label>
              <select
                value={dsaTopic}
                onChange={(e) => setDsaTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl neo-border-sm bg-white dark:bg-[#1c1c1c] text-xs font-bold text-[#171717] dark:text-white focus:outline-none"
              >
                {OFFICIAL_DSA_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500">
                This question will appear ONLY in DSA Practice under the <strong>{dsaTopic}</strong> track.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 p-3 rounded-xl bg-[#D8EEDC]/40 dark:bg-[#222222] neo-border-sm">
              <label className="block text-xs font-black text-[#171717] dark:text-white">
                Programming Language
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const names: Record<Language, string> = {
                    java: 'Java',
                    python: 'Python',
                    javascript: 'JavaScript',
                    cpp: 'C++',
                    c: 'C',
                  };
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold neo-border-sm transition-all ${
                        language === lang
                          ? 'bg-[#171717] text-white shadow-sm font-black'
                          : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {names[lang]}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-500 pt-1">
                This question will appear ONLY in the <strong>{language.toUpperCase()}</strong> practice section.
              </p>
            </div>
          )}

          {/* BASIC QUESTION FIELDS: ID, Title, Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold">Problem ID</label>
              <input
                type="text"
                value={problemId}
                onChange={(e) => setProblemId(e.target.value)}
                placeholder="e.g. ARR-026 or JAVA-001"
                className="w-full px-3 py-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono font-bold focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Find First and Last Position"
                className="w-full px-3 py-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold">Difficulty</label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold neo-border-sm transition-all ${
                    difficulty === d
                      ? d === 'Easy'
                        ? 'bg-[#D8EEDC] text-emerald-950 font-black'
                        : d === 'Medium'
                        ? 'bg-[#FFF0B3] text-amber-950 font-black'
                        : 'bg-[#F4A6C1] text-rose-950 font-black'
                      : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold">Problem Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the challenge, input expectations, and objective..."
              className="w-full px-3 py-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs focus:outline-none font-normal leading-relaxed"
              required
            />
          </div>

          {/* Constraints & Examples */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold">Constraints (one per line)</label>
              <textarea
                rows={2}
                value={constraintsText}
                onChange={(e) => setConstraintsText(e.target.value)}
                placeholder="1 <= nums.length <= 10^5"
                className="w-full px-3 py-1.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold">Hints (one per line)</label>
              <textarea
                rows={2}
                value={hintsText}
                onChange={(e) => setHintsText(e.target.value)}
                placeholder="Can you solve it in O(log n) time?"
                className="w-full px-3 py-1.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Sample Input / Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#232323] border border-gray-200 dark:border-gray-800">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">Sample Input</label>
              <input
                type="text"
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">Sample Output</label>
              <input
                type="text"
                value={exampleOutput}
                onChange={(e) => setExampleOutput(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono"
              />
            </div>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="publish_toggle"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-[#F4A6C1] focus:ring-[#F4A6C1]"
            />
            <label htmlFor="publish_toggle" className="text-xs font-bold cursor-pointer">
              Publish immediately (visible to students where <code className="font-mono">is_published = true</code>)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm neo-btn text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#171717] disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Supabase...' : 'Save & Publish Question'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
