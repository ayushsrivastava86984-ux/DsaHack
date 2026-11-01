import React from 'react';
import { ScreenId, Language } from '../types';
import { PROGRAMMING_LANGUAGES } from '../data/mockData';
import { 
  ArrowRight, 
  Code2, 
  Terminal, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Layers,
  Cpu
} from 'lucide-react';

interface LanguageSelectionPageProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectLanguage: (langId: Language) => void;
}

export const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({
  onNavigate,
  onSelectLanguage,
}) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#D8EEDC] text-[#171717] neo-border-sm text-xs font-bold">
          <Code2 className="w-3.5 h-3.5 text-emerald-800" />
          <span>Polyglot Programming Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] dark:text-white tracking-tight">
          Choose Your Language. <br />
          <span className="text-[#F4A6C1]">Start Building Logic.</span>
        </h1>

        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          Select your target programming language to practice syntax fundamentals, standard library structures, and language-specific interview questions.
        </p>
      </div>

      {/* 5 Language Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAMMING_LANGUAGES.map((lang) => {
          const completionPct = Math.round((lang.solvedCount / lang.totalQuestions) * 100);
          
          return (
            <div
              key={lang.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#212121] neo-border neo-shadow flex flex-col justify-between space-y-6 transition-transform hover:-translate-y-1"
            >
              <div className="space-y-4">
                
                {/* Language Header with Accent Badge */}
                <div className="flex items-center justify-between">
                  <div 
                    className="w-12 h-12 rounded-xl neo-border flex items-center justify-center font-extrabold text-xl shadow-[2px_2px_0px_0px_#171717]"
                    style={{ backgroundColor: lang.color }}
                  >
                    <span className="text-[#171717]">{lang.name.slice(0, 2)}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300">
                    {lang.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-[#171717] dark:text-white">
                    {lang.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {lang.description}
                  </p>
                </div>

                {/* Progress & Question Counts */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-[#171717] dark:text-white tabular-nums">
                      {lang.solvedCount} / {lang.totalQuestions} ({completionPct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${completionPct}%`,
                        backgroundColor: lang.color === '#FFF0B3' ? '#e6b800' : lang.color 
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
                    <span>{lang.topicsCount} Module Topics</span>
                    <span className="text-emerald-600 font-semibold">Starter templates included</span>
                  </div>
                </div>

                {/* Code preview snippet */}
                <div className="p-3 rounded-xl bg-[#171717] text-gray-200 text-[11px] font-mono overflow-x-auto border border-gray-800">
                  <pre>{lang.starterHello.slice(0, 80)}...</pre>
                </div>

              </div>

              {/* Start learning button */}
              <button
                onClick={() => {
                  onSelectLanguage(lang.id);
                  onNavigate('language_practice');
                }}
                className="w-full py-3 rounded-xl font-extrabold text-xs neo-border-sm neo-btn flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#171717] dark:shadow-[2px_2px_0px_0px_#383838]"
                style={{ backgroundColor: lang.color, color: '#171717' }}
              >
                <span>Practice {lang.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
