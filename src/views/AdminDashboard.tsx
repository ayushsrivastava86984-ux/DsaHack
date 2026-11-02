import React, { useState, useMemo } from 'react';
import { ScreenId, Problem, TopicName, Language, Difficulty, TestCase, UserProfile } from '../types';
import { DSA_TOPICS } from '../data/mockData';
import { 
  ShieldCheck, 
  Users, 
  FileCode, 
  Trophy, 
  Activity, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  BarChart3,
  Sliders,
  Database,
  Upload,
  Download,
  Eye,
  EyeOff,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  FileJson,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (screen: ScreenId) => void;
  problems: Problem[];
  onAddProblem: (newProb: Problem) => void;
  onUpdateProblem: (updated: Problem) => void;
  onDeleteProblem: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onBulkImport: (newProblems: Problem[]) => void;
  currentUser?: UserProfile | null;
  initialTab?: 'overview' | 'questions' | 'users' | 'contests';
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  solved: number;
  status: 'active' | 'suspended';
  joinedDate: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  problems,
  onAddProblem,
  onUpdateProblem,
  onDeleteProblem,
  onTogglePublish,
  onBulkImport,
  currentUser,
  initialTab = 'questions',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'contests'>(initialTab);
  
  // Filter & Search states for questions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<'All' | TopicName>('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [selectedPublishFilter, setSelectedPublishFilter] = useState<'All' | 'published' | 'draft'>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState<TopicName>('Arrays');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('Easy');
  const [formDescription, setFormDescription] = useState('');
  const [formConstraints, setFormConstraints] = useState('1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9');
  const [formHints, setFormHints] = useState('Consider using a two-pointer approach.\nRemember to handle edge cases where array is empty.');
  const [formCompanyTags, setFormCompanyTags] = useState('Google, Meta, Amazon');
  const [formIsPublished, setFormIsPublished] = useState(true);

  // Sample test cases (shown to user)
  const [sampleCases, setSampleCases] = useState<Array<{ input: string; output: string; explanation?: string }>>([
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
  ]);

  // Hidden test cases (used for automated validation)
  const [hiddenCases, setHiddenCases] = useState<TestCase[]>([
    { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
    { input: '[3,3], 6', expectedOutput: '[0,1]' },
  ]);

  // Bulk Upload Form State
  const [bulkMode, setBulkMode] = useState<'json' | 'csv'>('json');
  const [bulkText, setBulkText] = useState('');
  const [bulkFileError, setBulkFileError] = useState<string | null>(null);
  const [parsedBulkProblems, setParsedBulkProblems] = useState<Problem[]>([]);
  const [bulkPreviewReady, setBulkPreviewReady] = useState(false);

  // Mock Students for Users Tab
  const [usersList, setUsersList] = useState<AdminUser[]>([
    { id: 'usr-001', name: 'Alex Chen', email: 'alex@dsahack.dev', role: 'student', solved: 142, status: 'active', joinedDate: 'Aug 2026' },
    { id: 'usr-002', name: 'Siddharth Rao', email: 'sid@iitb.ac.in', role: 'student', solved: 489, status: 'active', joinedDate: 'Jun 2026' },
    { id: 'usr-003', name: 'Elena Rostova', email: 'elena@mit.edu', role: 'student', solved: 462, status: 'active', joinedDate: 'Jul 2026' },
    { id: 'usr-004', name: 'Devon Vance', email: 'devon@cmu.edu', role: 'student', solved: 344, status: 'active', joinedDate: 'Sep 2026' },
    { id: 'usr-005', name: 'Spam Bot 99', email: 'spam@botnet.xyz', role: 'student', solved: 0, status: 'suspended', joinedDate: 'Oct 2026' },
  ]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((prob) => {
      if (selectedTopicFilter !== 'All' && prob.topic !== selectedTopicFilter) return false;
      if (selectedDifficultyFilter !== 'All' && prob.difficulty !== selectedDifficultyFilter) return false;
      if (selectedPublishFilter === 'published' && prob.isPublished === false) return false;
      if (selectedPublishFilter === 'draft' && prob.isPublished !== false) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          prob.title.toLowerCase().includes(q) ||
          prob.topic.toLowerCase().includes(q) ||
          prob.companyTags.some((t) => t.toLowerCase().includes(q)) ||
          String(prob.number).includes(q)
        );
      }
      return true;
    });
  }, [problems, selectedTopicFilter, selectedDifficultyFilter, selectedPublishFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = problems.length;
    const published = problems.filter((p) => p.isPublished !== false).length;
    const drafts = total - published;
    const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
    const medCount = problems.filter((p) => p.difficulty === 'Medium').length;
    const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;
    return { total, published, drafts, easyCount, medCount, hardCount };
  }, [problems]);

  // Reset Add/Edit Form
  const resetForm = () => {
    setEditingProblemId(null);
    setFormTitle('');
    setFormTopic('Arrays');
    setFormDifficulty('Easy');
    setFormDescription('');
    setFormConstraints('1 <= nums.length <= 10^5');
    setFormHints('Consider optimal data structures.\nWatch for negative numbers.');
    setFormCompanyTags('Google, Meta, Amazon');
    setFormIsPublished(true);
    setSampleCases([{ input: 'nums = [1,2,3]', output: '6', explanation: 'Sum of elements is 6.' }]);
    setHiddenCases([
      { input: '[1,1,1]', expectedOutput: '3' },
      { input: '[0,0]', expectedOutput: '0' }
    ]);
  };

  // Open Edit Modal
  const handleOpenEdit = (prob: Problem) => {
    setEditingProblemId(prob.id);
    setFormTitle(prob.title);
    setFormTopic(prob.topic);
    setFormDifficulty(prob.difficulty);
    setFormDescription(prob.description);
    setFormConstraints(prob.constraints ? prob.constraints.join('\n') : '');
    setFormHints(prob.hints ? prob.hints.join('\n') : '');
    setFormCompanyTags(prob.companyTags ? prob.companyTags.join(', ') : '');
    setFormIsPublished(prob.isPublished !== false);
    setSampleCases(
      prob.examples && prob.examples.length > 0 
        ? prob.examples 
        : [{ input: 'nums = [1,2,3]', output: '6' }]
    );
    setHiddenCases(
      prob.hiddenTestCases && prob.hiddenTestCases.length > 0
        ? prob.hiddenTestCases
        : prob.testCases || [{ input: '[1,2,3]', expectedOutput: '6' }]
    );
    setIsEditModalOpen(true);
  };

  // Save Add or Edit
  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedConstraints = formConstraints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedHints = formHints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedCompanies = formCompanyTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const defaultStarterCode: Record<Language, string> = {
      python: `class Solution:\n    def solve(self, nums):\n        # Write your code here\n        pass`,
      javascript: `function solve(nums) {\n    // Write your code here\n}`,
      java: `class Solution {\n    public int solve(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int solve(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};`,
      c: `int solve(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}`,
    };

    if (editingProblemId) {
      // Update existing
      const existing = problems.find((p) => p.id === editingProblemId);
      if (!existing) return;

      const updated: Problem = {
        ...existing,
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        topic: formTopic,
        difficulty: formDifficulty,
        description: formDescription,
        constraints: parsedConstraints,
        hints: parsedHints,
        companyTags: parsedCompanies.length > 0 ? parsedCompanies : ['General'],
        examples: sampleCases,
        testCases: sampleCases.map((sc) => ({ input: sc.input, expectedOutput: sc.output })),
        hiddenTestCases: hiddenCases,
        isPublished: formIsPublished,
      };

      onUpdateProblem(updated);
      setIsEditModalOpen(false);
      resetForm();
    } else {
      // Add new
      const maxNumber = problems.reduce((acc, p) => Math.max(acc, p.number || 0), 0);
      const newProblem: Problem = {
        id: `prob-${Date.now().toString().slice(-6)}`,
        number: maxNumber + 1,
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        difficulty: formDifficulty,
        topic: formTopic,
        languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
        acceptance: '52.4%',
        description: formDescription || 'Solve this algorithmic challenge.',
        examples: sampleCases,
        constraints: parsedConstraints.length > 0 ? parsedConstraints : ['1 <= n <= 10^5'],
        hints: parsedHints.length > 0 ? parsedHints : ['Try a greedy or DP formulation.'],
        starterCode: defaultStarterCode,
        testCases: sampleCases.map((sc) => ({ input: sc.input, expectedOutput: sc.output })),
        hiddenTestCases: hiddenCases,
        companyTags: parsedCompanies.length > 0 ? parsedCompanies : ['Core DSA'],
        isPublished: formIsPublished,
      };

      onAddProblem(newProblem);
      setIsAddModalOpen(false);
      resetForm();
    }
  };

  // Add / Remove Sample Test Case
  const handleAddSampleCase = () => {
    setSampleCases([...sampleCases, { input: '', output: '', explanation: '' }]);
  };
  const handleRemoveSampleCase = (idx: number) => {
    setSampleCases(sampleCases.filter((_, i) => i !== idx));
  };
  const handleUpdateSampleCase = (idx: number, field: 'input' | 'output' | 'explanation', val: string) => {
    const updated = [...sampleCases];
    updated[idx] = { ...updated[idx], [field]: val };
    setSampleCases(updated);
  };

  // Add / Remove Hidden Test Case
  const handleAddHiddenCase = () => {
    setHiddenCases([...hiddenCases, { input: '', expectedOutput: '' }]);
  };
  const handleRemoveHiddenCase = (idx: number) => {
    setHiddenCases(hiddenCases.filter((_, i) => i !== idx));
  };
  const handleUpdateHiddenCase = (idx: number, field: 'input' | 'expectedOutput', val: string) => {
    const updated = [...hiddenCases];
    updated[idx] = { ...updated[idx], [field]: val };
    setHiddenCases(updated);
  };

  // Bulk Upload Parsing
  const handleParseBulk = () => {
    setBulkFileError(null);
    setParsedBulkProblems([]);
    setBulkPreviewReady(false);

    if (!bulkText.trim()) {
      setBulkFileError('Please paste or upload JSON or CSV text to parse.');
      return;
    }

    try {
      if (bulkMode === 'json') {
        const raw = JSON.parse(bulkText);
        const arr = Array.isArray(raw) ? raw : [raw];
        if (arr.length === 0) {
          setBulkFileError('JSON array contains 0 items.');
          return;
        }

        const maxNum = problems.reduce((acc, p) => Math.max(acc, p.number || 0), 0);
        const parsed: Problem[] = arr.map((item, idx) => {
          const num = Number(item.number) || maxNum + idx + 1;
          const title = item.title || `Imported Problem ${num}`;
          const topic = (item.topic as TopicName) || 'Arrays';
          const difficulty = (item.difficulty as Difficulty) || 'Medium';

          return {
            id: item.id || `bulk-${Date.now()}-${idx}`,
            number: num,
            title,
            slug: item.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            difficulty,
            topic,
            languageTags: item.languageTags || ['java', 'python', 'javascript', 'cpp', 'c'],
            acceptance: item.acceptance || '50.0%',
            description: item.description || 'Problem statement to be solved.',
            examples: item.examples || [
              { input: item.sample_input || '[1,2,3]', output: item.sample_output || '6' }
            ],
            constraints: Array.isArray(item.constraints) ? item.constraints : ['1 <= n <= 10^5'],
            hints: Array.isArray(item.hints) ? item.hints : ['Analyze edge cases first.'],
            starterCode: item.starterCode || {
              python: 'class Solution:\n    def solve(self):\n        pass',
              javascript: 'function solve() {\n}',
              java: 'class Solution {\n    public void solve() {}\n}',
              cpp: 'class Solution {\npublic:\n    void solve() {}\n};',
              c: 'void solve() {}',
            },
            testCases: item.testCases || [{ input: item.sample_input || '[1,2,3]', expectedOutput: item.sample_output || '6' }],
            hiddenTestCases: item.hiddenTestCases || [
              { input: item.hidden_input || '[4,5,6]', expectedOutput: item.hidden_output || '15' }
            ],
            companyTags: Array.isArray(item.companyTags) ? item.companyTags : ['Imported'],
            isPublished: item.isPublished !== undefined ? Boolean(item.isPublished) : true,
          };
        });

        setParsedBulkProblems(parsed);
        setBulkPreviewReady(true);
      } else {
        // CSV Parsing
        const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          setBulkFileError('CSV must contain a header row and at least 1 data row.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const titleIdx = headers.indexOf('title');
        const topicIdx = headers.indexOf('topic');
        const diffIdx = headers.indexOf('difficulty');
        const descIdx = headers.indexOf('description');
        const sampleInIdx = headers.indexOf('sample_input');
        const sampleOutIdx = headers.indexOf('sample_output');
        const hiddenInIdx = headers.indexOf('hidden_input');
        const hiddenOutIdx = headers.indexOf('hidden_output');
        const compIdx = headers.indexOf('company_tags');

        if (titleIdx === -1) {
          setBulkFileError('CSV header must contain a "title" column.');
          return;
        }

        const maxNum = problems.reduce((acc, p) => Math.max(acc, p.number || 0), 0);
        const parsed: Problem[] = [];

        for (let i = 1; i < lines.length; i++) {
          // simple CSV comma split respecting quotes
          const rawRow = lines[i];
          const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
          const cols: string[] = [];
          let match;
          while ((match = regex.exec(rawRow)) !== null) {
            let val = match[1];
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.slice(1, -1).replace(/""/g, '"');
            }
            cols.push(val);
            if (regex.lastIndex >= rawRow.length) break;
          }

          const title = cols[titleIdx] || `Problem ${maxNum + i}`;
          const topic = (topicIdx !== -1 && cols[topicIdx] ? cols[topicIdx] : 'Arrays') as TopicName;
          const difficulty = (diffIdx !== -1 && cols[diffIdx] ? cols[diffIdx] : 'Medium') as Difficulty;
          const desc = descIdx !== -1 && cols[descIdx] ? cols[descIdx] : 'Algorithmic problem';
          const sampleIn = sampleInIdx !== -1 && cols[sampleInIdx] ? cols[sampleInIdx] : '[1,2]';
          const sampleOut = sampleOutIdx !== -1 && cols[sampleOutIdx] ? cols[sampleOutIdx] : '3';
          const hiddenIn = hiddenInIdx !== -1 && cols[hiddenInIdx] ? cols[hiddenInIdx] : '[10,20]';
          const hiddenOut = hiddenOutIdx !== -1 && cols[hiddenOutIdx] ? cols[hiddenOutIdx] : '30';
          const compTags = compIdx !== -1 && cols[compIdx] ? cols[compIdx].split(';').map((s) => s.trim()) : ['Interview'];

          parsed.push({
            id: `csv-${Date.now()}-${i}`,
            number: maxNum + i,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            difficulty: ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium',
            topic: topic || 'Arrays',
            languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
            acceptance: '51.0%',
            description: desc,
            examples: [{ input: sampleIn, output: sampleOut }],
            constraints: ['1 <= nums.length <= 10^5'],
            hints: ['Break problem into smaller subproblems.'],
            starterCode: {
              python: 'class Solution:\n    def solve(self):\n        pass',
              javascript: 'function solve() {\n}',
              java: 'class Solution {\n    public void solve() {}\n}',
              cpp: 'class Solution {\npublic:\n    void solve() {}\n};',
              c: 'void solve() {}',
            },
            testCases: [{ input: sampleIn, expectedOutput: sampleOut }],
            hiddenTestCases: [{ input: hiddenIn, expectedOutput: hiddenOut }],
            companyTags: compTags,
            isPublished: true,
          });
        }

        setParsedBulkProblems(parsed);
        setBulkPreviewReady(true);
      }
    } catch (err: unknown) {
      setBulkFileError(`Parse error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Commit Bulk Upload
  const handleCommitBulk = () => {
    if (parsedBulkProblems.length === 0) return;
    onBulkImport(parsedBulkProblems);
    setIsBulkModalOpen(false);
    setBulkText('');
    setParsedBulkProblems([]);
    setBulkPreviewReady(false);
  };

  // Download Templates
  const handleDownloadTemplate = (type: 'json' | 'csv') => {
    if (type === 'json') {
      const template = [
        {
          title: 'Two Sum II - Input Array Is Sorted',
          topic: 'Arrays',
          difficulty: 'Medium',
          description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.',
          acceptance: '60.5%',
          companyTags: ['Amazon', 'Google'],
          constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000'],
          hints: ['Since array is sorted, two pointers can scan from opposite ends.'],
          examples: [
            { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]', explanation: '2 + 7 = 9.' }
          ],
          testCases: [
            { input: '[2,7,11,15], 9', expectedOutput: '[1,2]' }
          ],
          hiddenTestCases: [
            { input: '[2,3,4], 6', expectedOutput: '[1,3]' },
            { input: '[-1,0], -1', expectedOutput: '[1,2]' }
          ],
          isPublished: true
        }
      ];
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dsahack_problems_template.json';
      a.click();
    } else {
      const csv = `title,topic,difficulty,acceptance,description,sample_input,sample_output,hidden_input,hidden_output,company_tags\n"Rotate Array","Arrays","Medium","40.2%","Given an integer array nums, rotate the array to the right by k steps.","nums = [1,2,3,4,5,6,7], k = 3","[5,6,7,1,2,3,4]","nums = [-1,-100,3,99], k = 2","[3,99,-1,-100]","Microsoft;Amazon"\n"Maximum Subarray","Dynamic Programming","Medium","51.3%","Given an integer array nums, find the subarray with the largest sum and return its sum.","nums = [-2,1,-3,4,-1,2,1,-5,4]","6","nums = [5,4,-1,7,8]","23","Google;Meta"`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dsahack_problems_template.csv';
      a.click();
    }
  };

  // Export all current problems as JSON
  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(problems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsahack_questions_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Load sample bulk 80 problems generator for quick testing
  const handleLoadSampleBulk80 = () => {
    setBulkMode('json');
    const topics: TopicName[] = [
      'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Hashing',
      'Binary Search', 'Sorting', 'Recursion', 'Backtracking', 'Trees',
      'Binary Search Trees', 'Heaps', 'Graphs', 'Greedy Algorithms',
      'Dynamic Programming', 'Tries', 'Bit Manipulation'
    ];
    const diffs: Difficulty[] = ['Easy', 'Medium', 'Hard'];
    const sampleBatch: any[] = [];

    const baseTitles = [
      'Container With Most Water', 'Trapping Rain Water', 'Valid Palindrome', 'Longest Common Prefix',
      'Merge Two Sorted Lists', 'Remove Nth Node From End', 'Min Stack', 'Daily Temperatures',
      'Implement Queue using Stacks', 'Design Circular Queue', 'Group Anagrams', 'Subarray Sum Equals K',
      'Search in Rotated Sorted Array', 'Find Minimum in Rotated Sorted Array', 'Merge Intervals', 'Sort Colors',
      'Subsets', 'Permutations', 'Word Search', 'N-Queens', 'Invert Binary Tree', 'Diameter of Binary Tree',
      'Validate Binary Search Tree', 'Kth Smallest Element in BST', 'Kth Largest Element in an Array',
      'Top K Frequent Elements', 'Course Schedule', 'Clone Graph', 'Jump Game', 'Gas Station',
      'Climbing Stairs', 'House Robber', 'Coin Change', 'Longest Increasing Subsequence', 'Implement Trie Prefix Tree',
      'Single Number', 'Number of 1 Bits', 'Counting Bits'
    ];

    for (let i = 1; i <= 80; i++) {
      const title = `${baseTitles[(i - 1) % baseTitles.length]} Variant ${Math.floor((i - 1) / baseTitles.length) + 1}`;
      const topic = topics[(i - 1) % topics.length];
      const diff = diffs[(i - 1) % diffs.length];

      sampleBatch.push({
        title,
        topic,
        difficulty: diff,
        acceptance: `${(45 + (i % 30)).toFixed(1)}%`,
        description: `High-frequency interview challenge on ${topic}. Optimize time complexity for scale.`,
        constraints: [`1 <= n <= ${10 ** ((i % 4) + 2)}`, 'All values fit in standard 32-bit integer.'],
        hints: [`Think about how ${topic} properties can prune search space.`, 'Edge case: single-element inputs.'],
        sample_input: `nums = [${i}, ${i + 1}, ${i + 2}], target = ${i * 2}`,
        sample_output: `${i + 3}`,
        hidden_input: `nums = [${i * 3}, ${i * 4}], target = ${i * 7}`,
        hidden_output: `${i * 7}`,
        company_tags: ['Google', 'Meta', 'Microsoft', 'Amazon'][(i % 4)],
        isPublished: true,
      });
    }

    setBulkText(JSON.stringify(sampleBatch, null, 2));
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* INTERNAL ADMIN HEADER BAR */}
      <div className="p-6 rounded-2xl bg-[#171717] text-white neo-border neo-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F4A6C1] neo-border-sm flex items-center justify-center font-bold text-[#171717] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-white">
                DsaHack Internal Admin Console
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#D8EEDC] text-emerald-950 neo-border-sm">
                INTERNAL PRIVILEGES
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              Manage questions repository, bulk import 80–100 questions (JSON/CSV), configure hidden test cases, and publish live content.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dsa_questions')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Student Questions</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 rounded-lg bg-[#FFF0B3] text-[#171717] text-xs font-bold neo-border-sm neo-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b-2 border-[#171717] dark:border-[#383838] pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'questions', label: `Question Bank (${problems.length})`, icon: FileCode },
          { id: 'overview', label: 'Platform Statistics', icon: Activity },
          { id: 'users', label: 'Student Directory', icon: Users },
          { id: 'contests', label: 'Contest Scheduler', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#171717] text-white neo-border-sm shadow-[1.5px_1.5px_0px_0px_#171717] dark:bg-[#F4A6C1] dark:text-[#171717]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282828]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. QUESTIONS TAB (CRUD, Bulk Upload, Publish/Unpublish, Test Cases) */}
      {activeTab === 'questions' && (
        <div className="space-y-6">

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#212121] neo-border-sm shadow-[2px_2px_0px_0px_#171717]">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Total Problems</span>
              <p className="text-2xl font-extrabold text-[#171717] dark:text-white mt-0.5">{stats.total}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#D8EEDC] neo-border-sm shadow-[2px_2px_0px_0px_#171717] text-[#171717]">
              <span className="text-[10px] font-bold uppercase">Published Live</span>
              <p className="text-2xl font-extrabold mt-0.5">{stats.published}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FFF4E6] dark:bg-[#242424] neo-border-sm shadow-[2px_2px_0px_0px_#171717]">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Drafts / Hidden</span>
              <p className="text-2xl font-extrabold text-[#171717] dark:text-white mt-0.5">{stats.drafts}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 neo-border-sm shadow-[2px_2px_0px_0px_#171717]">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">Easy</span>
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">{stats.easyCount}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 neo-border-sm shadow-[2px_2px_0px_0px_#171717]">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase">Medium</span>
              <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-0.5">{stats.medCount}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 neo-border-sm shadow-[2px_2px_0px_0px_#171717]">
              <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase">Hard</span>
              <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300 mt-0.5">{stats.hardCount}</p>
            </div>
          </div>

          {/* Action Header & Tools */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
                Manage Coding Questions
              </h3>
              <p className="text-xs text-gray-500">
                Create new problems, bulk import questions with JSON/CSV, edit sample & hidden test cases, and publish.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportAll}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#212121] neo-border-sm text-xs font-bold text-[#171717] dark:text-white hover:bg-gray-100 dark:hover:bg-[#282828] flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717]"
                title="Export all problems as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  setBulkText('');
                  setParsedBulkProblems([]);
                  setBulkPreviewReady(false);
                  setBulkFileError(null);
                  setIsBulkModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#FFF0B3] text-[#171717] neo-border-sm font-extrabold text-xs neo-btn flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#171717]"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Bulk Upload (80-100)</span>
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-xs neo-btn neo-shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, number, company, or keyword..."
                className="w-full pl-9 pr-4 py-2 rounded-xl neo-border-sm bg-[#FFF4E6]/50 dark:bg-[#1a1a1a] text-xs text-[#171717] dark:text-white focus:outline-none"
              />
            </div>

            {/* Topic Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value as any)}
                className="w-full p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white"
              >
                <option value="All">All Topics (18 Tracks)</option>
                {DSA_TOPICS.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value as any)}
                className="w-full p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Publish Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedPublishFilter}
                onChange={(e) => setSelectedPublishFilter(e.target.value as any)}
                className="w-full p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white"
              >
                <option value="All">All Statuses</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts / Hidden</option>
              </select>
            </div>

          </div>

          {/* Problems Table */}
          <div className="rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF4E6] dark:bg-[#1a1a1a] border-b-2 border-[#171717] dark:border-[#383838] text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12">#</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Topic</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Test Cases</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        <FileCode className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="font-bold">No questions found matching your filter criteria.</p>
                        <p className="text-[11px] mt-1">Try resetting the search query or topic filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((prob) => {
                      const isPublished = prob.isPublished !== false;
                      const sampleCount = prob.examples?.length || 0;
                      const hiddenCount = prob.hiddenTestCases?.length || (prob.testCases?.length || 0);

                      return (
                        <tr key={prob.id} className="hover:bg-gray-50 dark:hover:bg-[#282828] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-gray-500">
                            #{prob.number}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#171717] dark:text-white text-sm">
                              {prob.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-500">
                              <span>Slug: /{prob.slug}</span>
                              {prob.companyTags && prob.companyTags.length > 0 && (
                                <>
                                  <span>·</span>
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                                    {prob.companyTags.slice(0, 3).join(', ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-700 dark:text-gray-300">
                              {prob.topic}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}>
                              {prob.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-[11px] font-mono">
                              <span className="text-gray-600 dark:text-gray-400" title="Sample cases">
                                {sampleCount} sample
                              </span>
                              <span>·</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold" title="Hidden judge cases">
                                {hiddenCount} hidden
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => onTogglePublish(prob.id)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold neo-border-sm flex items-center gap-1 transition-transform active:scale-95 ${
                                isPublished
                                  ? 'bg-[#D8EEDC] text-emerald-950'
                                  : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                              }`}
                              title={isPublished ? 'Click to unpublish (hide from students)' : 'Click to publish (make live)'}
                            >
                              {isPublished ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Published</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 text-gray-500" />
                                  <span>Draft (Hidden)</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEdit(prob)}
                              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              title="Edit Problem"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(prob.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Delete Problem"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 flex justify-between items-center">
              <span>Showing {filteredProblems.length} of {problems.length} total questions</span>
              <span className="font-mono text-[11px]">DsaHack Internal Question Bank v2.4</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Topic Distribution */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
              <h3 className="text-base font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#F4A6C1]" />
                <span>Question Bank Distribution Across 18 Topics</span>
              </h3>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2">
                {DSA_TOPICS.map((topic) => {
                  const countInBank = problems.filter((p) => p.topic === topic.name).length;
                  const pct = Math.min(100, Math.round((countInBank / Math.max(1, problems.length)) * 100));

                  return (
                    <div key={topic.name} className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#171717] dark:text-white">{topic.name}</span>
                        <span className="text-gray-500 font-mono text-[11px]">
                          {countInBank} questions ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full bg-[#F4A6C1] rounded-full" style={{ width: `${Math.max(5, pct)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System Health & Supabase Bridge Status */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-3">
                <h3 className="text-base font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Storage & Supabase Bridge</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#D8EEDC] neo-border-sm text-[#171717]">
                    <p className="font-extrabold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Client State & LocalStorage Active
                    </p>
                    <p className="text-[11px] mt-1 text-gray-700 leading-relaxed">
                      Questions are held in reactive application memory and backed up to browser local storage. Changes are live immediately.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFF0B3] neo-border-sm text-[#171717]">
                    <p className="font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      Supabase Client Connected
                    </p>
                    <p className="text-[11px] mt-1 text-gray-800">
                      URL: <span className="font-mono">glptbmbodfvlafzwfyfm</span>
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Ready to sync with Supabase PostgreSQL tables once DDL approval is given.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-[#171717] text-white neo-border neo-shadow space-y-3">
                <h4 className="text-sm font-bold text-[#F4A6C1]">Admin Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      resetForm();
                      setIsAddModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-left flex items-center justify-between transition-colors"
                  >
                    <span>Create a new coding challenge</span>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsBulkModalOpen(true)}
                    className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-left flex items-center justify-between transition-colors"
                  >
                    <span>Bulk upload 80-100 questions</span>
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleExportAll}
                    className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-left flex items-center justify-between transition-colors"
                  >
                    <span>Download question backup (JSON)</span>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
              Student Directory & Moderation
            </h3>
            <p className="text-xs text-gray-500">
              Review student accounts, track problem completion rates, and manage access status.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF4E6] dark:bg-[#1a1a1a] border-b-2 border-[#171717] dark:border-[#383838] text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Problems Solved</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-[#282828]">
                    <td className="py-3 px-4 font-bold text-[#171717] dark:text-white">{u.name}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-emerald-950">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">{u.solved}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-3 py-1 rounded-lg neo-border-sm text-[11px] font-bold ${
                          u.status === 'active'
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Reinstate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CONTESTS TAB */}
      {activeTab === 'contests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
                Contest Orchestration & Problem Assignment
              </h3>
              <p className="text-xs text-gray-500">Configure weekly clashes and link questions to arena schedules</p>
            </div>

            <button
              onClick={() => onNavigate('contests')}
              className="px-4 py-2.5 rounded-xl bg-[#FFF0B3] text-[#171717] neo-border font-extrabold text-xs neo-btn neo-shadow"
            >
              View Public Contests Page
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
            <h4 className="text-sm font-bold text-[#171717] dark:text-white">
              Active Scheduled Arena Contests
            </h4>
            <div className="p-4 rounded-xl bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#171717] dark:text-white">Weekly Clash #412</p>
                <p className="text-xs text-gray-500 mt-0.5">Saturday Nov 07 · 4 Questions Assigned · 1,420 Students Registered</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#D8EEDC] text-[#171717] text-xs font-bold neo-border-sm">
                Live Ready
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT QUESTION MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#212121] neo-border rounded-2xl neo-shadow-lg p-6 max-w-2xl w-full my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#F4A6C1]" />
                <span>{editingProblemId ? 'Edit Coding Question' : 'Manually Add New Question'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProblem} className="space-y-4 text-xs font-bold">
              
              {/* Title & Publish Switch */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-8">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Subarray Sum Equals K"
                    required
                    className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Publish Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormIsPublished(!formIsPublished)}
                    className={`w-full py-2.5 px-3 rounded-xl neo-border-sm flex items-center justify-center gap-2 text-xs font-extrabold transition-colors ${
                      formIsPublished 
                        ? 'bg-[#D8EEDC] text-emerald-950' 
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {formIsPublished ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Live / Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-gray-500" />
                        <span>Draft / Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Topic & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    DSA Core Track / Topic *
                  </label>
                  <select
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value as TopicName)}
                    className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white"
                  >
                    {DSA_TOPICS.map((t) => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                    className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white"
                  >
                    <option value="Easy">Easy (Fundamental syntax / scan)</option>
                    <option value="Medium">Medium (Optimal data structure / two pointers)</option>
                    <option value="Hard">Hard (Complex DP / segment tree / graph cut)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Problem Description * (Supports Markdown)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k..."
                  rows={4}
                  required
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs text-[#171717] dark:text-white"
                />
              </div>

              {/* Company Tags & Constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Company Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formCompanyTags}
                    onChange={(e) => setFormCompanyTags(e.target.value)}
                    placeholder="Google, Meta, Uber, Amazon"
                    className="w-full p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs text-[#171717] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Constraints (one per line)
                  </label>
                  <textarea
                    value={formConstraints}
                    onChange={(e) => setFormConstraints(e.target.value)}
                    rows={2}
                    className="w-full p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono text-[#171717] dark:text-white"
                  />
                </div>
              </div>

              {/* SAMPLE TEST CASES (Visible to student in problem statement) */}
              <div className="p-3.5 rounded-xl bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Sample Test Cases (Visible in Problem Description)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSampleCase}
                    className="px-2 py-1 rounded bg-white dark:bg-[#282828] text-[11px] font-bold neo-border-sm hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Sample</span>
                  </button>
                </div>

                {sampleCases.map((sc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-[#242424] neo-border-sm space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                      <span>Example #{idx + 1}</span>
                      {sampleCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSampleCase(idx)}
                          className="text-rose-600 hover:text-rose-800 text-[10px]"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-gray-500">Input:</span>
                        <input
                          type="text"
                          value={sc.input}
                          onChange={(e) => handleUpdateSampleCase(idx, 'input', e.target.value)}
                          placeholder="nums = [2,7,11,15], target = 9"
                          className="w-full p-1.5 rounded neo-border-sm text-xs font-mono bg-white dark:bg-[#1a1a1a]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500">Output:</span>
                        <input
                          type="text"
                          value={sc.output}
                          onChange={(e) => handleUpdateSampleCase(idx, 'output', e.target.value)}
                          placeholder="[0,1]"
                          className="w-full p-1.5 rounded neo-border-sm text-xs font-mono bg-white dark:bg-[#1a1a1a]"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500">Explanation (Optional):</span>
                      <input
                        type="text"
                        value={sc.explanation || ''}
                        onChange={(e) => handleUpdateSampleCase(idx, 'explanation', e.target.value)}
                        placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                        className="w-full p-1.5 rounded neo-border-sm text-xs bg-white dark:bg-[#1a1a1a]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* HIDDEN TEST CASES (Used for automated grading & edge case evaluation) */}
              <div className="p-3.5 rounded-xl bg-[#D8EEDC]/60 dark:bg-[#1a1a1a] neo-border-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-800" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Hidden Test Cases (Executed during Code Submission)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHiddenCase}
                    className="px-2 py-1 rounded bg-white dark:bg-[#282828] text-[11px] font-bold neo-border-sm hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Hidden Case</span>
                  </button>
                </div>

                {hiddenCases.map((hc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-[#242424] neo-border-sm space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                      <span>Hidden Fixture #{idx + 1}</span>
                      {hiddenCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHiddenCase(idx)}
                          className="text-rose-600 hover:text-rose-800 text-[10px]"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-gray-500">Raw Input:</span>
                        <input
                          type="text"
                          value={hc.input}
                          onChange={(e) => handleUpdateHiddenCase(idx, 'input', e.target.value)}
                          placeholder="[3,2,4], 6"
                          className="w-full p-1.5 rounded neo-border-sm text-xs font-mono bg-white dark:bg-[#1a1a1a]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500">Expected Output:</span>
                        <input
                          type="text"
                          value={hc.expectedOutput}
                          onChange={(e) => handleUpdateHiddenCase(idx, 'expectedOutput', e.target.value)}
                          placeholder="[1,2]"
                          className="w-full p-1.5 rounded neo-border-sm text-xs font-mono bg-white dark:bg-[#1a1a1a]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2c2c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-xs neo-btn shadow-[2px_2px_0px_0px_#171717]"
                >
                  {editingProblemId ? 'Save Changes' : 'Create & Publish Question'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: BULK UPLOAD (80-100 QUESTIONS VIA JSON OR CSV) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#212121] neo-border rounded-2xl neo-shadow-lg p-6 max-w-3xl w-full my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#F4A6C1]" />
                  <span>Bulk Upload Questions (80–100 Items)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Import entire curriculum batches at once using structured JSON or CSV.
                </p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Select & Template Downloads */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-xl neo-border-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBulkMode('json');
                    setBulkPreviewReady(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    bulkMode === 'json'
                      ? 'bg-[#171717] text-white dark:bg-[#F4A6C1] dark:text-[#171717] neo-border-sm'
                      : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>JSON Array</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBulkMode('csv');
                    setBulkPreviewReady(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    bulkMode === 'csv'
                      ? 'bg-[#171717] text-white dark:bg-[#F4A6C1] dark:text-[#171717] neo-border-sm'
                      : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV Table</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleBulk80}
                  className="px-2.5 py-1.5 rounded-lg bg-[#D8EEDC] text-emerald-950 text-xs font-bold neo-border-sm hover:opacity-90"
                  title="Generate 80 sample DSA questions in JSON"
                >
                  ⚡ Load 80 Sample Questions
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(bulkMode)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#282828] text-xs font-bold text-gray-700 dark:text-gray-300 neo-border-sm hover:bg-gray-100 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Template</span>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {bulkFileError && (
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs font-bold neo-border-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{bulkFileError}</span>
              </div>
            )}

            {/* Textarea for JSON/CSV */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Paste {bulkMode.toUpperCase()} Payload:</span>
                <span className="font-mono text-[11px] text-gray-500">
                  {bulkMode === 'json' ? 'Array of Problem objects' : 'Headers: title,topic,difficulty,description,...'}
                </span>
              </div>
              <textarea
                value={bulkText}
                onChange={(e) => {
                  setBulkText(e.target.value);
                  setBulkPreviewReady(false);
                }}
                rows={9}
                placeholder={
                  bulkMode === 'json'
                    ? '[\n  {\n    "title": "Subarray Sum Equals K",\n    "topic": "Arrays",\n    "difficulty": "Medium",\n    "description": "...",\n    "sample_input": "[1,1,1], 2",\n    "sample_output": "2"\n  }\n]'
                    : 'title,topic,difficulty,acceptance,description,sample_input,sample_output,hidden_input,hidden_output,company_tags\n"Rotate Array","Arrays","Medium","40.2%","...","[1,2,3], 1","[3,1,2]","[4,5], 1","[5,4]","Amazon"'
                }
                className="w-full p-3 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono text-[#171717] dark:text-white"
              />
            </div>

            {/* Parse & Validate Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleParseBulk}
                className="px-4 py-2 rounded-xl bg-[#FFF0B3] text-[#171717] text-xs font-extrabold neo-border-sm neo-btn flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#171717]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Parse & Validate Payload</span>
              </button>

              {bulkPreviewReady && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{parsedBulkProblems.length} questions successfully validated!</span>
                </span>
              )}
            </div>

            {/* Preview Grid */}
            {bulkPreviewReady && parsedBulkProblems.length > 0 && (
              <div className="space-y-2 border-t pt-3 border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Batch Preview ({parsedBulkProblems.length} questions ready to commit):</span>
                  <span className="text-gray-500 text-[11px]">Next Problem Number: #{problems.length + 1}</span>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl neo-border-sm border bg-gray-50 dark:bg-[#1a1a1a]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 dark:bg-[#282828] text-gray-700 dark:text-gray-300 font-bold sticky top-0">
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Topic</th>
                        <th className="p-2">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {parsedBulkProblems.slice(0, 15).map((p, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-mono text-gray-500">#{idx + 1}</td>
                          <td className="p-2 font-bold text-[#171717] dark:text-white">{p.title}</td>
                          <td className="p-2">{p.topic}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-black">
                              {p.difficulty}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedBulkProblems.length > 15 && (
                    <div className="p-2 text-center text-[11px] text-gray-500 font-bold bg-gray-100 dark:bg-[#242424]">
                      + {parsedBulkProblems.length - 15} more questions in this batch...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Commit Dialog Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!bulkPreviewReady || parsedBulkProblems.length === 0}
                onClick={handleCommitBulk}
                className="px-5 py-2.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-xs neo-btn disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_#171717]"
              >
                Commit {parsedBulkProblems.length} Questions to Bank
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#212121] neo-border rounded-2xl neo-shadow-lg p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-[#171717] dark:text-white">
                Delete Coding Question?
              </h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete this question? Students will no longer see this question in the problem listings or in test practice.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProblem(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs neo-border-sm hover:bg-rose-700 shadow-[1.5px_1.5px_0px_0px_#171717]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
