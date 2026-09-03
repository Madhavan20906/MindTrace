import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  Sliders,
  Brain,
  GitFork,
  BookOpen,
  MapPin,
  Code,
  TrendingUp,
  CheckSquare,
  Music,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getApiKey } from '../services/aiEngine';

export type MindTraceViewType =
  | 'home'
  | 'sessions'
  | 'tutor'
  | 'sandbox'
  | 'causal'
  | 'fork'
  | 'knowledge'
  | 'roadmap'
  | 'challenges'
  | 'quizzes'
  | 'progress'
  | 'music';

interface SidebarNavProps {
  activeView: MindTraceViewType;
  setActiveView: (view: MindTraceViewType) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeView, setActiveView }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hasApiKey = Boolean((envKey && envKey !== 'your_gemini_api_key_here') || getApiKey());

  const navigationGroups = [
    {
      groupTitle: 'Learning Workspace',
      items: [
        { id: 'tutor', label: 'AI Socratic Tutor', icon: Sparkles },
        { id: 'sandbox', label: 'Misconception Sandbox', icon: Sliders },
        { id: 'causal', label: 'Causal Mind Map', icon: Brain },
        { id: 'fork', label: 'Reality Forking Engine', icon: GitFork },
        { id: 'roadmap', label: 'AI Roadmap', icon: MapPin },
      ],
    },
    {
      groupTitle: 'Tools & Practice',
      items: [
        { id: 'challenges', label: 'Code IDE', icon: Code },
        { id: 'progress', label: 'Differential Matrix', icon: TrendingUp },
        { id: 'quizzes', label: 'Socratic Quizzes', icon: CheckSquare },
        { id: 'knowledge', label: 'Knowledge Graph', icon: BookOpen },
        { id: 'music', label: 'Focus Studio', icon: Music },
        { id: 'home', label: 'Dashboard Overview', icon: Home },
      ],
    },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-60'
      } bg-[#11131c] border-r border-[#212433] flex flex-col justify-between h-screen sticky top-0 z-40 p-3.5 select-none transition-all duration-200`}
    >
      <div className="space-y-5">
        {/* BRAND LOGO HEADER */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveView('tutor')}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white font-sans tracking-tight">
                    Mind<span className="text-amber-500">Trace</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                    Pro
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Adaptive Learning
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded bg-slate-800/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer border border-slate-700/40"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* GROUPED NAVIGATION LIST */}
        <div className="space-y-4 px-0.5 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navigationGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  {group.groupTitle}
                </h4>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as MindTraceViewType)}
                    title={item.label}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer relative ${
                      isActive ? 'bg-[#1b1e2b] text-amber-400 border border-[#2a2e42]' : 'text-slate-300 hover:bg-[#161824] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="font-sans">
                          {item.label}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER USER PROFILE & GEMINI STATUS */}
      <div className="pt-2 border-t border-[#212433] space-y-2">
        <div
          className={`w-full p-2 rounded-lg border flex items-center justify-between text-xs font-mono ${
            hasApiKey
              ? 'bg-slate-800/40 border-slate-700/40 text-slate-300'
              : 'bg-amber-950/20 border-amber-800/30 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            {!isCollapsed && <span className="truncate">{hasApiKey ? 'Gemini Active' : 'Offline Mode'}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[#161824] rounded-lg border border-[#232636]">
          <div className="w-7 h-7 rounded-md bg-amber-600 text-white flex items-center justify-center font-bold font-mono text-xs shrink-0">
            M
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <p className="text-xs font-semibold text-white font-sans truncate">Madhavan</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">Student</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
