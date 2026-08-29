import React, { useState } from 'react';
import { HelpCircle, ArrowRight, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

interface DiagnosticQuestionCardProps {
  questionText: string;
  probeModality: string;
  expectedInfoGain?: string;
  isInsufficientEvidence?: boolean;
  probeIndex?: number;
  totalProbes?: number;
  onSubmitResponse: (answer: string, reasoning: string) => void;
  isLoading: boolean;
}

export const DiagnosticQuestionCard: React.FC<DiagnosticQuestionCardProps> = ({
  questionText,
  probeModality,
  expectedInfoGain,
  probeIndex = 1,
  totalProbes = 1,
  onSubmitResponse,
  isLoading,
}) => {
  const [probeAnswer, setProbeAnswer] = useState<string>('');
  const [probeReasoning, setProbeReasoning] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!probeAnswer.trim() && !probeReasoning.trim()) return;
    onSubmitResponse(probeAnswer, probeReasoning);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER BAR */}
      <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl" aria-live="polite" aria-atomic="true">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Zap className="w-6 h-6 animate-pulse text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Investigate Stage • Information Gain Probe #{probeIndex}
              </span>
              <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md uppercase">
                Modality: {probeModality}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Targeted Socratic Probe Test
            </h2>
          </div>
        </div>

        {totalProbes > 1 && (
          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
            Iterative Investigation Probe {probeIndex} of {totalProbes}
          </span>
        )}
      </div>

      {/* PROBE QUESTION CONTAINER */}
      <form onSubmit={handleSubmit} className="studio-card p-7 rounded-2xl bg-[#111625] border border-[#222b42] space-y-6 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" /> Diagnostic Stress Test Scenario
            </span>
            {expectedInfoGain && (
              <span className="text-[11px] font-mono text-slate-400">
                Info Gain: <code className="text-indigo-300">{expectedInfoGain}</code>
              </span>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-[#0d111d] border border-indigo-500/30 text-white font-bold text-lg leading-relaxed shadow-inner">
            "{questionText}"
          </div>
        </div>

        {/* RESPONSE INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="probe-answer-input" className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
              Your Probe Answer / Decision
            </label>
            <input
              id="probe-answer-input"
              type="text"
              value={probeAnswer}
              onChange={(e) => setProbeAnswer(e.target.value)}
              aria-label="Your Probe Answer or Decision"
              className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your answer to this specific probe scenario..."
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="probe-reasoning-input" className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
              Your Rationale / Why
            </label>
            <input
              id="probe-reasoning-input"
              type="text"
              value={probeReasoning}
              onChange={(e) => setProbeReasoning(e.target.value)}
              aria-label="Your Rationale or Explanation"
              className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Why does this happen in your mental model?"
              required
            />
          </div>
        </div>

        {/* SUBMIT BUTTON ROW */}
        <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#222b42]">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Response feeds Bayesian update equation
          </span>

          <button
            type="submit"
            disabled={isLoading || (!probeAnswer.trim() && !probeReasoning.trim())}
            aria-label="Submit Probe Response and Update Belief"
            className="btn-quantum-primary px-9 py-4 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" /> Computing Bayesian Posterior...
              </>
            ) : (
              <>
                Submit Response & Update Belief <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
