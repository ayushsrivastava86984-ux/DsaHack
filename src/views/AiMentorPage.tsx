import React, { useState } from 'react';
import { ScreenId, Problem, Language } from '../types';
import { INITIAL_PROBLEMS } from '../data/mockData';
import { 
  Sparkles, 
  Send, 
  Brain, 
  HelpCircle, 
  Clock, 
  Zap, 
  Code2, 
  Lightbulb, 
  ArrowRight,
  RotateCcw,
  Bot
} from 'lucide-react';

interface AiMentorPageProps {
  onNavigate: (screen: ScreenId) => void;
  contextProblem?: Problem;
  contextCode?: string;
  contextLanguage?: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  mode?: string;
}

export const AiMentorPage: React.FC<AiMentorPageProps> = ({
  onNavigate,
  contextProblem = INITIAL_PROBLEMS[0],
  contextCode = '',
  contextLanguage = 'python',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'mentor',
      text: `Hello! I'm your **DsaHack AI Mentor**. 🤖\n\nI can help you build rock-solid intuition without immediately spoiling solutions. I can provide:\n- 💡 **Progressive Hints** (Intuition → Data Structure → Pseudocode)\n- ⏱️ **Time & Space Complexity** Big-O verification\n- 📝 **Line-by-line Code Walkthroughs**\n- ⚡ **Algorithmic Optimizations**\n- 🎯 **Follow-up Interview Challenges**\n\nWhat would you like to explore today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProblem, setActiveProblem] = useState<Problem>(contextProblem);
  const [userCodeInput, setUserCodeInput] = useState(
    contextCode || contextProblem.starterCode[contextLanguage] || ''
  );

  const sendMessageToApi = async (promptText: string, mode: string = 'general_chat') => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          mode,
          problemTitle: activeProblem.title,
          problemDescription: activeProblem.description,
          userCode: userCodeInput,
          language: contextLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      const replyText = data.text || "I'm ready for our next algorithmic challenge! Let's conquer it.";

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-mentor`,
          sender: 'mentor',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-fallback`,
          sender: 'mentor',
          text: `### Progressive Hint for ${activeProblem.title}:\n\n1. **High Level Intuition:** Notice what data structure gives you $O(1)$ constant time lookup for complements.\n2. **Invariant:** Check if \`target - nums[i]\` has been previously visited in a single forward pass.\n3. **Optimization:** This brings the naive $O(N^2)$ brute-force down to $O(N)$ linear time!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionType: string) => {
    let prompt = '';
    if (actionType === 'hint') {
      prompt = `Give me a progressive Level 1 hint for "${activeProblem.title}" without spoiling the code.`;
    } else if (actionType === 'explain') {
      prompt = `Can you explain the problem statement and edge cases of "${activeProblem.title}" simply?`;
    } else if (actionType === 'complexity') {
      prompt = `Analyze the time complexity and space complexity of my current solution for "${activeProblem.title}".`;
    } else if (actionType === 'line_by_line') {
      prompt = `Explain my ${contextLanguage} code line by line with clear reasoning.`;
    } else if (actionType === 'optimize') {
      prompt = `How can I optimize this algorithm further to achieve better runtime and less memory?`;
    } else if (actionType === 'generate_practice') {
      prompt = `Generate a follow-up interview question similar to ${activeProblem.topic}.`;
    }

    sendMessageToApi(prompt, actionType);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl neo-border overflow-hidden bg-[#D8EEDC] shrink-0 shadow-[2px_2px_0px_0px_#171717]">
            <img 
              src="/images/dsa_ai_mentor_avatar_1793517788524.jpg" 
              alt="DsaHack AI Mentor Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#171717] dark:text-white">
                DsaHack AI Mentor
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8EEDC] text-[#171717]">
                Online & Ready
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Your 24/7 personal algorithmic thinking coach. Deep explanations, progressive hints, and zero blind spoilers.
            </p>
          </div>
        </div>

        {/* Current Working Problem Picker */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Focus Problem:</span>
          <select
            value={activeProblem.id}
            onChange={(e) => {
              const found = INITIAL_PROBLEMS.find((p) => p.id === e.target.value) || INITIAL_PROBLEMS[0];
              setActiveProblem(found);
              setUserCodeInput(found.starterCode[contextLanguage] || '');
            }}
            className="px-3 py-2 rounded-xl neo-border-sm bg-[#FFF4E6] dark:bg-[#1a1a1a] text-xs font-bold text-[#171717] dark:text-white focus:outline-none w-full md:w-60"
          >
            {INITIAL_PROBLEMS.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.number} {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Split Layout: Left Context/Shortcuts | Right Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left Column: Quick Action Cards & Active Problem Context (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Problem Card */}
          <div className="p-4 rounded-2xl bg-[#FFF4E6] dark:bg-[#212121] neo-border neo-shadow space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-500">Problem In Context</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#D8EEDC] text-[#171717]">
                {activeProblem.topic}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#171717] dark:text-white">
              {activeProblem.number}. {activeProblem.title}
            </h3>

            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
              {activeProblem.description}
            </p>

            <button
              onClick={() => onNavigate('problem_detail')}
              className="text-xs font-bold text-[#171717] dark:text-white flex items-center gap-1 hover:underline"
            >
              <span>Open in Full Coding Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Guidance Prompts (Buttons in Brand Pink & Black) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Guided Prompts
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => handleQuickAction('hint')}
                className="w-full p-2.5 rounded-xl bg-[#FFF0B3] hover:bg-[#ffe58f] text-[#171717] neo-border-sm text-xs font-bold text-left flex items-center gap-2 transition-all"
              >
                <Lightbulb className="w-4 h-4 text-amber-800 shrink-0" />
                <span>💡 Progressive Hint (No Spoilers)</span>
              </button>

              <button
                onClick={() => handleQuickAction('explain')}
                className="w-full p-2.5 rounded-xl bg-[#D8EEDC] hover:bg-[#c6e6cb] text-[#171717] neo-border-sm text-xs font-bold text-left flex items-center gap-2 transition-all"
              >
                <Brain className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>🧩 Explain Problem & Edge Cases</span>
              </button>

              <button
                onClick={() => handleQuickAction('complexity')}
                className="w-full p-2.5 rounded-xl bg-[#F4A6C1] hover:bg-[#f293b2] text-[#171717] neo-border-sm text-xs font-bold text-left flex items-center gap-2 transition-all"
              >
                <Clock className="w-4 h-4 text-rose-900 shrink-0" />
                <span>⏱️ Analyze Time & Space Complexity</span>
              </button>

              <button
                onClick={() => handleQuickAction('line_by_line')}
                className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 text-[#171717] dark:text-white neo-border-sm text-xs font-bold text-left flex items-center gap-2 transition-all"
              >
                <Code2 className="w-4 h-4 text-gray-600 shrink-0" />
                <span>📝 Line-by-Line Code Breakdown</span>
              </button>

              <button
                onClick={() => handleQuickAction('optimize')}
                className="w-full p-2.5 rounded-xl bg-[#FFF4E6] dark:bg-[#282828] text-[#171717] dark:text-white neo-border-sm text-xs font-bold text-left flex items-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-orange-600 shrink-0" />
                <span>⚡ Suggest Algorithmic Optimizations</span>
              </button>

              <button
                onClick={() => handleQuickAction('generate_practice')}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1e1e1e] text-[#171717] dark:text-white neo-border-sm text-xs font-bold text-left flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>🎯 Generate Follow-Up Interview Question</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Chat Stream & Message Input (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col h-full overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 bg-[#FFF4E6] dark:bg-[#1e1e1e] border-b-2 border-[#171717] dark:border-[#383838] flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#F4A6C1]" />
              <span className="text-[#171717] dark:text-white">Interactive Session</span>
            </div>
            <span className="text-gray-500 font-mono text-[11px]">
              Target: Intuitive Comprehension
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'mentor' && (
                  <div className="w-8 h-8 rounded-lg bg-[#D8EEDC] neo-border-sm flex items-center justify-center font-bold text-[#171717] shrink-0">
                    <Sparkles className="w-4 h-4 text-emerald-800" />
                  </div>
                )}

                <div 
                  className={`max-w-xl p-4 rounded-2xl neo-border-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#F4A6C1] text-[#171717] shadow-[2px_2px_0px_0px_#171717]'
                      : 'bg-[#FFF4E6]/60 dark:bg-[#282828] text-[#171717] dark:text-gray-100'
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap">
                    {msg.text}
                  </div>
                  <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-2 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-lg bg-[#D8EEDC] neo-border-sm flex items-center justify-center font-bold text-[#171717]">
                  <Sparkles className="w-4 h-4 text-emerald-800 animate-spin" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-[#FFF4E6] dark:bg-[#282828] text-xs font-bold text-gray-600 dark:text-gray-300">
                  AI Mentor is crafting a progressive hint...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-4 bg-[#FFF4E6]/30 dark:bg-[#1a1a1a] border-t-2 border-[#171717] dark:border-[#383838]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessageToApi(inputPrompt);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about this problem, request a Level 1 hint, or paste code..."
                className="flex-1 px-4 py-3 rounded-xl neo-border-sm bg-white dark:bg-[#262626] text-xs font-medium text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4A6C1]"
              />

              <button
                type="submit"
                disabled={isLoading || !inputPrompt.trim()}
                className="px-5 py-3 rounded-xl bg-[#F4A6C1] text-[#171717] neo-border-sm font-extrabold text-xs neo-btn flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#171717] disabled:opacity-50"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
