import React, { useState } from 'react';
import { ScreenId, Problem, TopicName, Language, Difficulty } from '../types';
import { INITIAL_PROBLEMS, DSA_TOPICS } from '../data/mockData';
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
  Database
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (screen: ScreenId) => void;
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
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'contests'>(initialTab);
  const [problemsList, setProblemsList] = useState<Problem[]>(INITIAL_PROBLEMS);
  const [usersList, setUsersList] = useState<AdminUser[]>([
    { id: 'usr-001', name: 'Alex Chen', email: 'alex@dsahack.dev', role: 'student', solved: 142, status: 'active', joinedDate: 'Aug 2026' },
    { id: 'usr-002', name: 'Siddharth Rao', email: 'sid@iitb.ac.in', role: 'student', solved: 489, status: 'active', joinedDate: 'Jun 2026' },
    { id: 'usr-003', name: 'Elena Rostova', email: 'elena@mit.edu', role: 'student', solved: 462, status: 'active', joinedDate: 'Jul 2026' },
    { id: 'usr-004', name: 'Devon Vance', email: 'devon@cmu.edu', role: 'student', solved: 344, status: 'active', joinedDate: 'Sep 2026' },
    { id: 'usr-005', name: 'Spam Bot 99', email: 'spam@botnet.xyz', role: 'student', solved: 0, status: 'suspended', joinedDate: 'Oct 2026' },
  ]);

  // Question Creation Form State
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Easy');
  const [newTopic, setNewTopic] = useState<TopicName>('Arrays');
  const [newDesc, setNewDesc] = useState('');
  const [newSampleInput, setNewSampleInput] = useState('');
  const [newSampleOutput, setNewSampleOutput] = useState('');

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newProblem: Problem = {
      id: `prob-${Date.now().toString().slice(-4)}`,
      number: problemsList.length + 1,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      difficulty: newDifficulty,
      topic: newTopic,
      languageTags: ['java', 'python', 'javascript', 'cpp', 'c'],
      acceptance: '50.0%',
      description: newDesc || 'Solve this algorithmic challenge.',
      examples: [
        {
          input: newSampleInput || 'nums = [1,2,3]',
          output: newSampleOutput || '6',
        },
      ],
      constraints: ['1 <= n <= 10^5'],
      hints: ['Level 1: Consider linear scan.', 'Level 2: Use auxiliary hash map.'],
      starterCode: {
        python: 'class Solution:\n    def solve(self):\n        pass',
        javascript: 'function solve() {\n}',
        java: 'class Solution {\n    public void solve() {}\n}',
        cpp: 'class Solution {\npublic:\n    void solve() {}\n};',
        c: 'void solve() {}',
      },
      testCases: [{ input: newSampleInput || '[1,2,3]', expectedOutput: newSampleOutput || '6' }],
      companyTags: ['Internal Lab'],
    };

    setProblemsList([newProblem, ...problemsList]);
    setIsAddingQuestion(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteQuestion = (id: string) => {
    setProblemsList((prev) => prev.filter((p) => p.id !== id));
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
      
      {/* INTERNAL ADMIN BADGE & SECURITY BAR */}
      <div className="p-6 rounded-2xl bg-[#171717] text-white neo-border neo-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500 neo-border-sm flex items-center justify-center font-bold text-white shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight">
                DsaHack Internal Admin Console
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                ROLE: SYSTEM_ADMIN
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Secure internal route. Authorization verified via server-side session token. Public registration prohibited.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Cluster: us-central-1</span>
          <span>·</span>
          <span>Latency: 28ms</span>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b-2 border-[#171717] dark:border-[#383838] pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Platform Overview', icon: Activity },
          { id: 'questions', label: 'Question Bank Management', icon: FileCode },
          { id: 'users', label: 'Student Directory & Moderation', icon: Users },
          { id: 'contests', label: 'Contest Orchestration', icon: Trophy },
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

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
              <p className="text-[11px] font-bold text-gray-500 uppercase">Total Students</p>
              <p className="text-3xl font-extrabold text-[#171717] dark:text-white tabular-nums mt-1">14,820</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">+12.4% MoM Growth</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
              <p className="text-[11px] font-bold text-gray-500 uppercase">Active Questions</p>
              <p className="text-3xl font-extrabold text-[#171717] dark:text-white tabular-nums mt-1">540</p>
              <p className="text-[11px] text-gray-500 mt-1">Across 18 Core Topics</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
              <p className="text-[11px] font-bold text-gray-500 uppercase">Daily Submissions</p>
              <p className="text-3xl font-extrabold text-[#171717] dark:text-white tabular-nums mt-1">48,910</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">74.2% Passed Rate</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow">
              <p className="text-[11px] font-bold text-gray-500 uppercase">Live Contestants</p>
              <p className="text-3xl font-extrabold text-[#171717] dark:text-white tabular-nums mt-1">2,480</p>
              <p className="text-[11px] text-amber-600 font-bold mt-1">In Weekly Clash</p>
            </div>

          </div>

          {/* System Health & Audit Log */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
              <h3 className="text-base font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#F4A6C1]" />
                <span>Popular Practice Topics This Week</span>
              </h3>

              <div className="space-y-3">
                {[
                  { name: 'Dynamic Programming', count: '14,290 solves', pct: 88 },
                  { name: 'Graphs & BFS/DFS', count: '11,400 solves', pct: 76 },
                  { name: 'Arrays & Two Pointers', count: '9,840 solves', pct: 64 },
                  { name: 'Trees & BST', count: '7,210 solves', pct: 52 },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#171717] dark:text-white">{item.name}</span>
                      <span className="text-gray-500 font-mono text-[11px]">{item.count}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className="h-full bg-[#F4A6C1] rounded-full" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-3">
              <h3 className="text-base font-extrabold text-[#171717] dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Audit & Security Events</span>
              </h3>

              <div className="space-y-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div className="p-2.5 rounded bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800">
                  <span className="text-emerald-600 font-bold">[200 OK]</span> System check passed: 5 compilers healthy (Java, Py, JS, C++, C).
                </div>
                <div className="p-2.5 rounded bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800">
                  <span className="text-amber-600 font-bold">[ROLE]</span> Verified Student registration token for user 'alexcoder'.
                </div>
                <div className="p-2.5 rounded bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800">
                  <span className="text-rose-600 font-bold">[BLOCKED]</span> Unauthorized privilege escalation attempt rejected.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. QUESTIONS TAB (CRUD operations) */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
                Question Repository ({problemsList.length})
              </h3>
              <p className="text-xs text-gray-500">Create, edit, assign topics, or publish problems</p>
            </div>

            <button
              onClick={() => setIsAddingQuestion(true)}
              className="px-4 py-2.5 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border font-extrabold text-xs neo-btn neo-shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Problem</span>
            </button>
          </div>

          {/* Question List Table */}
          <div className="rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF4E6] dark:bg-[#1a1a1a] border-b-2 border-[#171717] dark:border-[#383838] text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Acceptance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {problemsList.map((prob) => (
                  <tr key={prob.id} className="hover:bg-gray-50 dark:hover:bg-[#282828]">
                    <td className="py-3 px-4 font-mono font-bold text-gray-500">#{prob.number}</td>
                    <td className="py-3 px-4 font-bold text-[#171717] dark:text-white">{prob.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold">
                        {prob.topic}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">{prob.difficulty}</td>
                    <td className="py-3 px-4 font-mono">{prob.acceptance}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteQuestion(prob.id)}
                        className="p-1 rounded text-gray-400 hover:text-rose-500"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. USERS TAB (Moderation & Student Directory) */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
              Student Directory & Moderation
            </h3>
            <p className="text-xs text-gray-500">All public accounts are registered with Student privileges.</p>
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
                Contest Scheduler & Problem Assignment
              </h3>
              <p className="text-xs text-gray-500">Configure Weekly Clashes and penalty scoring formulas</p>
            </div>

            <button
              onClick={() => alert('Contest scheduled in server-side worker queue.')}
              className="px-4 py-2.5 rounded-xl bg-[#FFF0B3] text-[#171717] neo-border font-extrabold text-xs neo-btn neo-shadow"
            >
              + Schedule Weekly Contest
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-4">
            <h4 className="text-sm font-bold text-[#171717] dark:text-white">
              Scheduled Contest Pipeline
            </h4>
            <div className="p-4 rounded-xl bg-[#FFF4E6] dark:bg-[#1a1a1a] neo-border-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#171717] dark:text-white">Weekly Clash #412</p>
                <p className="text-xs text-gray-500 mt-0.5">Saturday Nov 07 · 4 Problems Assigned · 1,420 Registered</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#D8EEDC] text-[#171717] text-xs font-bold neo-border-sm">
                Ready to Deploy
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE QUESTION MODAL */}
      {isAddingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#212121] neo-border rounded-2xl neo-shadow-lg p-6 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-extrabold text-[#171717] dark:text-white">
              Publish New Question to Bank
            </h3>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Problem Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Subarray Sum Equals K"
                  required
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                    className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">DSA Topic</label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value as TopicName)}
                    className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white"
                  >
                    {DSA_TOPICS.map((t) => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Problem Statement</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Given an array of integers nums and an integer k..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-sm text-[#171717] dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Sample Input</label>
                  <input
                    type="text"
                    value={newSampleInput}
                    onChange={(e) => setNewSampleInput(e.target.value)}
                    placeholder="[1,1,1], k = 2"
                    className="w-full p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Sample Output</label>
                  <input
                    type="text"
                    value={newSampleOutput}
                    onChange={(e) => setNewSampleOutput(e.target.value)}
                    placeholder="2"
                    className="w-full p-2 rounded-xl neo-border-sm bg-white dark:bg-[#1a1a1a] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm font-extrabold text-xs neo-btn"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
