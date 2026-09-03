import React, { useState } from 'react';
import { HelpCircle, ArrowRight, Brain, RefreshCw, Sparkles, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DomainPresets } from '../DomainPresets';
import { type MultiDomainPreset } from '../../services/aiEngine';

interface ProblemInputProps {
  onSubmit: (problem: string, answer: string, reasoning: string, subjectHint?: string, isSeed?: boolean) => void;
  onSelectPerspective?: (perspective: 'learner' | 'educator' | 'manager' | 'challenge') => void;
  isLoading: boolean;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit, onSelectPerspective, isLoading }) => {
  const [selectedPreset, setSelectedPreset] = useState<MultiDomainPreset | null>(null);
  const [activePerspective, setActivePerspective] = useState<'learner' | 'educator' | 'manager' | 'challenge'>('learner');

  const [questionText, setQuestionText] = useState<string>('');
  const [subjectHint, setSubjectHint] = useState<string>('');
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [studentReasoning, setStudentReasoning] = useState<string>('');

  const handleSelectPreset = (preset: MultiDomainPreset) => {
    setSelectedPreset(preset);
    setQuestionText(preset.inputContent);
    setSubjectHint(preset.domain);
    setStudentAnswer(preset.studentAnswer);
    setStudentReasoning(preset.studentReasoning);
  };

  const handleQuestionChange = (val: string) => {
    setQuestionText(val);
    if (selectedPreset && val !== selectedPreset.inputContent) {
      setSelectedPreset(null);
    }
  };

  const handlePerspectiveChange = (p: 'learner' | 'educator' | 'manager' | 'challenge') => {
    setActivePerspective(p);
    if (onSelectPerspective) onSelectPerspective(p);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const finalAnswer = studentAnswer.trim() || `User asked to investigate understanding of "${questionText.slice(0, 60)}"`;
    const finalReasoning = studentReasoning.trim() || `User requested MindTrace to reconstruct mental model for "${questionText.slice(0, 60)}"`;
    
    const isSeed = selectedPreset !== null && questionText === selectedPreset.inputContent;

    onSubmit(questionText, finalAnswer, finalReasoning, subjectHint || undefined, isSeed);
  };

  return (
    <div className="w-full space-y-8">
      {/* HERO SECTION */}
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 relative border border-indigo-500/30 shadow-2xl overflow-hidden bg-[#0d111d]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
          <Brain className="w-4 h-4 text-indigo-400 animate-pulse" /> Universal Cognitive Scientist Engine
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
          What are you <span className="text-blue-400">trying to understand?</span>
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          MindTrace investigates how you think. Enter any text, question, reasoning, legal scenario, code, or decision. AI automatically infers domain and reconstructs your mental model.
        </p>

        {/* Perspective Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'learner', label: 'Learner ("What am I misunderstanding?")', icon: <UserCheck className="w-3.5 h-3.5" /> },
            { id: 'educator', label: 'Educator ("What misconception affects my class?")', icon: <Brain className="w-3.5 h-3.5" /> },
            { id: 'manager', label: 'Mentor/Manager ("Why is this mistake repeating?")', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'challenge', label: 'Skeptic ("Challenge my reasoning")', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePerspectiveChange(p.id as any)}
              aria-label={`Switch to ${p.label} perspective`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                activePerspective === p.id
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                  : 'bg-[#111625] text-slate-400 border-[#222b42] hover:text-white'
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1-CLICK MULTI-DOMAIN DEMO PRESETS */}
      <DomainPresets onSelectPreset={handleSelectPreset} />

      {/* INPUT BUILDER CARD */}
      <form onSubmit={handleSubmit} className="studio-card p-7 space-y-6 bg-[#111625] border border-[#222b42]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222b42] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Observe Phase • Evidence Input
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Universal Input Statement or Question
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="subject-hint-input" className="text-xs font-mono text-slate-400">AI Inferred Domain:</label>
            <input
              id="subject-hint-input"
              type="text"
              value={subjectHint}
              onChange={(e) => setSubjectHint(e.target.value)}
              aria-label="AI Inferred Domain"
              className="bg-[#0d111d] border border-[#222b42] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Auto-inferred by AI"
            />
          </div>
        </div>

        {/* Input Question / Problem / Context */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="problem-text-area" className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
              Task, Problem, Question, Argument, Code, or Concept
            </label>
            <span className="text-[11px] font-mono text-indigo-400">
              Zero hardcoded rules • Domain inferred dynamically
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] flex items-start gap-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <textarea
              id="problem-text-area"
              rows={3}
              value={questionText}
              onChange={(e) => handleQuestionChange(e.target.value)}
              aria-label="Task, Problem, Question, Argument, Code, or Concept Input"
              className="w-full bg-transparent text-white font-bold text-base border-none focus:outline-none resize-none leading-relaxed font-sans"
              placeholder="e.g. Paste any statement, question, legal scenario, economic argument, code, or decision..."
            />
          </div>
        </div>

        {/* Student Answer & Reasoning Inputs (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="student-answer-input" className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                Your Answer / Output / Decision
              </label>
              <span className="text-[10px] text-slate-500 font-mono">(Optional)</span>
            </div>
            <input
              id="student-answer-input"
              type="text"
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              aria-label="Your Answer or Conclusion"
              className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your answer or conclusion (if any)..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="student-reasoning-input" className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                Your Explanation / Rationale
              </label>
              <span className="text-[10px] text-slate-500 font-mono">(Optional)</span>
            </div>
            <input
              id="student-reasoning-input"
              type="text"
              value={studentReasoning}
              onChange={(e) => setStudentReasoning(e.target.value)}
              aria-label="Your Explanation or Rationale"
              className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Why you reached this conclusion (if any)..."
            />
          </div>
        </div>

        {/* Submit Button Row */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#222b42]">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {selectedPreset ? (
              <span>Preset Selected: <strong className="text-indigo-400">{selectedPreset.title}</strong></span>
            ) : (
              <span>Domain Inference: <strong className="text-indigo-300">{subjectHint || 'Dynamic Inference'}</strong></span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !questionText.trim()}
            aria-label="Investigate Reasoning button"
            className="btn-quantum-primary w-full sm:w-auto flex items-center justify-center gap-2 px-9 py-4 rounded-xl text-sm font-bold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" /> Multi-Agent Cognitive Diagnostic Inference...
              </>
            ) : (
              <>
                Investigate Reasoning <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
