import React, { useState } from 'react';
import {
  Brain,
  Home,
  Layers,
  Sparkles,
  Sliders,
  GitFork,
  BookOpen,
  MapPin,
  Code,
  TrendingUp,
  CheckSquare,
  Music,
  Activity,
  ShieldCheck,
  ChevronDown,
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

interface TopNavDeckProps {
  activeView: MindTraceViewType;
  setActiveView: (view: MindTraceViewType) => void;
  currentMastery?: number;
}

export const TopNavDeck: React.FC<TopNavDeckProps> = ({
  activeView,
  setActiveView,
  currentMastery = 85,
}) => {
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(false);

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hasApiKey = Boolean((envKey && envKey !== 'your_gemini_api_key_here') || getApiKey());

  const coreViews = [
    { id: 'home', label: 'Command Hub', icon: Home, color: 'hover:text-amber-400' },
    { id: 'sessions', label: 'Diagnostic Studio', icon: Layers, color: 'hover:text-rose-400' },
    { id: 'tutor', label: 'AI Socratic Tutor', icon: Sparkles, color: 'hover:text-violet-400', badge: 'Gemini' },
    { id: 'sandbox', label: 'Live Sandbox', icon: Sliders, color: 'hover:text-emerald-400', badge: 'Sim' },
    { id: 'causal', label: 'Causal Mind Map', icon: Brain, color: 'hover:text-cyan-400', badge: 'Novel' },
    { id: 'fork', label: 'Reality Forking Engine', icon: GitFork, color: 'hover:text-pink-400', badge: 'What-If' },
  ];

  const toolViews = [
    { id: 'roadmap', label: 'AI Roadmap', icon: MapPin },
    { id: 'challenges', label: 'Code IDE', icon: Code },
    { id: 'progress', label: 'Differential Matrix', icon: TrendingUp },
    { id: 'quizzes', label: 'Quizzes', icon: CheckSquare },
    { id: 'knowledge', label: 'Knowledge Graph', icon: BookOpen },
    { id: 'music', label: 'Focus Audio', icon: Music },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c0e17]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl select-none px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* BRAND LOGO */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-rose-500 to-amber-400 text-white flex items-center justify-center font-extrabold shadow-lg shadow-violet-500/20 group-hover:scale-105 transition">
            <Brain className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white font-sans tracking-tight">
                Mind<span className="text-amber-400">Trace</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                v3.0 Production
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Bayesian Reasoning Architecture
            </p>
          </div>
        </div>

        {/* TOP HORIZONTAL NAVIGATION DECK */}
        <nav className="flex items-center gap-1 bg-[#141726]/90 p-1.5 rounded-2xl border border-white/10 shadow-inner overflow-x-auto">
          {coreViews.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as MindTraceViewType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-rose-500 text-white font-bold shadow-md'
                    : `text-slate-300 ${item.color} hover:bg-white/5`
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white text-violet-950' : 'bg-white/10 text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* TOP RIGHT TELEMETRY BAR & GEMINI STATUS */}
        <div className="flex items-center gap-3">
          {/* QUICK TOOL DROPDOWN */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-semibold text-slate-300 cursor-pointer">
              <span>Tools</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-[#141726] border border-white/10 rounded-2xl p-2 shadow-2xl hidden group-hover:block z-50 animate-fadeIn space-y-1">
              {toolViews.map((t) => {
                const TIcon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveView(t.id as MindTraceViewType)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-sans text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <TIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC MASTERY BADGE TRIGGER */}
          <button
            onClick={() => setShowTelemetryDrawer(!showTelemetryDrawer)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/20 transition cursor-pointer shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Mastery: {currentMastery}%</span>
          </button>

          {/* GEMINI ENV BADGE */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold ${
              hasApiKey
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">{hasApiKey ? 'Gemini 3.6 Active' : 'Fallback Engine'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavDeck;
