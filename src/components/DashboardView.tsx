import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  BookOpen,
  Zap,
  Upload,
  ArrowRight,
  Flame,
  Award,
  FileText,
  Play,
  CheckCircle2,
  Brain,
  Compass,
  Code,
  Scale,
  TrendingUp,
  Activity,
  Sliders,
} from 'lucide-react';
import { MULTI_DOMAIN_PRESETS } from '../services/aiEngine';

interface DashboardViewProps {
  onStartSession: (subject: string, file?: File) => void;
  onNavigate: (view: any) => void;
  onOpenOnboarding?: () => void;
  currentMastery?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartSession,
  onNavigate,
  onOpenOnboarding,
  currentMastery = 85,
}) => {
  const [subjectInput, setSubjectInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const domainIcons: Record<string, any> = {
    'Computer Science': Code,
    'Law & Contracts': Scale,
    'Economics': TrendingUp,
    'Physics Kinematics': Zap,
    'Formal Logic': Brain,
  };

  const handleCreateSession = (subjectToUse?: string) => {
    const finalSubject = subjectToUse || subjectInput;
    if (!finalSubject.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onStartSession(finalSubject, selectedFile || undefined);
    }, 900);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn">
      {/* 1. ICONIC CURVED TOP HERO HEADER BANNER (Aether Signature Style) */}
      <div className="relative p-8 md:p-10 rounded-b-[32px] rounded-t-3xl aether-curved-banner border border-amber-500/30 shadow-2xl overflow-hidden backdrop-blur-xl -mt-6 -mx-6 md:-mx-8">
        {/* Glow ambient background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> MindTrace Cognitive Intelligence Platform
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight">
                Welcome back, <span className="text-amber-400">Madhavan</span>
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl font-sans leading-relaxed">
                Your Bayesian diagnostic engine is active. Select a cognitive domain, explore Socratic inquiry, or test live misconception simulations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('sandbox')}
                className="px-4 py-2.5 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-2 transition hover:bg-amber-500/25 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-amber-400" /> Live Sandbox
              </button>

              <button
                onClick={() => onNavigate('causal')}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Brain className="w-4 h-4 text-amber-400" /> Causal Mind Map
              </button>

              {onOpenOnboarding && (
                <button
                  onClick={onOpenOnboarding}
                  className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-400" /> Onboarding Profile
                </button>
              )}

              <button
                onClick={() => handleCreateSession('Physics Kinematics')}
                className="mindtrace-btn-yellow px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Quick Session
              </button>
            </div>
          </div>

          {/* TELEMETRY STRIP WITH DYNAMIC MASTERY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-[#0b0c10]/80 p-4 rounded-2xl border border-white/10 space-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>BAYESIAN MASTERY</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold text-amber-400 font-mono">{currentMastery}%</p>
              <p className="text-[11px] text-amber-300 font-mono font-semibold">Dynamic P(H) Belief</p>
            </div>

            <div className="bg-[#0b0c10]/80 p-4 rounded-2xl border border-white/10 space-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>SOCRATIC STREAK</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">7 Days</p>
              <p className="text-[11px] text-amber-300/90 font-mono font-semibold">🔥 Cognitive Active</p>
            </div>

            <div className="bg-[#0b0c10]/80 p-4 rounded-2xl border border-white/10 space-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>MISCONCEPTIONS RESOLVED</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">14 Flaws</p>
              <p className="text-[11px] text-emerald-400 font-mono font-semibold">100% Bayesian Audit</p>
            </div>

            <div className="bg-[#0b0c10]/80 p-4 rounded-2xl border border-white/10 space-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>ROADMAP PROGRESS</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">40%</p>
              <p className="text-[11px] text-slate-400 font-mono font-semibold">2 of 5 Modules Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MULTI-DOMAIN DIAGNOSTIC EXPLORER GRID */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" /> Explore Cognitive Diagnostics by Domain
          </h2>
          <span className="text-xs font-mono text-slate-400">Click to inspect misconception</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MULTI_DOMAIN_PRESETS.map((preset) => {
            const Icon = domainIcons[preset.domain] || Brain;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  onStartSession(preset.domain);
                }}
                className="bg-[#161824]/90 p-5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition cursor-pointer group space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {preset.domain}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition font-sans">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-sans">
                    "{preset.inputContent}"
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-amber-400 group-hover:translate-x-1 transition">
                  <span>Diagnose Flaw</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CREATE NEW LEARNING SESSION & PROMPT CREATOR */}
      <div className="bg-[#161824]/90 backdrop-blur-xl p-7 rounded-3xl border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">
              Create New Cognitive Investigation
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Enter any concept or topic you are learning. MindTrace will synthesize a Bayesian prerequisite-aware diagnostic sequence.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
            1. Select or Enter Learning Objective
          </label>

          <div className="flex flex-wrap gap-2">
            {['Physics Kinematics', 'Python Recursion', 'Machine Learning Overfitting', 'Organic Chemistry Invariants', 'Quantum Mechanics'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectInput(sub)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                  subjectInput === sub
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0f1017] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="e.g. Kinematics, Python Recursion, Machine Learning, Organic Chemistry..."
            className="w-full bg-[#0c0d12] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-sans text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
          />
        </div>

        {/* STUDY MATERIAL UPLOAD */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
            2. Attach Study Materials (Optional)
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 transition cursor-pointer ${
              dragActive
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-white/10 bg-[#0c0d12]/50 hover:border-white/20'
            }`}
          >
            <Upload className="w-8 h-8 mx-auto text-amber-400" />
            <div className="text-xs font-sans text-slate-300">
              <span className="font-bold text-amber-400">Drop PDF, PPTX, or images here</span> or browse files
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Supported formats: .pdf, .pptx, .png, .jpg (Max 50MB)
            </p>
            {selectedFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono mt-2">
                <FileText className="w-3.5 h-3.5" /> Attached: {selectedFile.name}
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => handleCreateSession()}
            disabled={isGenerating || !subjectInput.trim()}
            className="w-full mindtrace-btn-yellow py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" /> Synthesizing Cognitive AI Roadmap...
              </>
            ) : (
              <>
                Generate AI Roadmap & Start Investigation <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. ACTIVE COGNITIVE LEARNING SESSIONS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" /> Active Cognitive Diagnostic Sessions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#161824]/90 p-6 rounded-2xl border border-white/10 space-y-4 hover:border-amber-500/40 transition shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 rounded-full">
                Physics • Active Investigation
              </span>
              <span className="text-xs font-mono text-slate-400">3/5 Modules</span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white font-sans">
                Gravitational Physics & Kinematics
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Position-time graphs, Newton's Laws, acceleration vectors, and inverse-square gravitation.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> {currentMastery}% Mastery Level
              </span>
              <button
                onClick={() => onNavigate('tutor')}
                className="mindtrace-btn-yellow px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" /> Continue Tutor
              </button>
            </div>
          </div>

          <div className="bg-[#161824]/90 p-6 rounded-2xl border border-white/10 space-y-4 hover:border-amber-500/40 transition shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 rounded-full">
                Computer Science • Active
              </span>
              <span className="text-xs font-mono text-slate-400">1/5 Modules</span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white font-sans">
                Python Recursion & Stack Frames
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Base conditions, call stack memory allocation, and algorithmic time complexity.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 90% Mastery Level
              </span>
              <button
                onClick={() => onNavigate('challenges')}
                className="mindtrace-btn-outline px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" /> Code Challenges
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
