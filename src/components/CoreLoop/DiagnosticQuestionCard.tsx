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
    <div className="w-full space-y-5">
      {/* HEADER BAR */}
      <div className="bg-[#141622] p-5 rounded-xl border border-[#232636] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-500">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                Socratic Diagnostic Probe #{probeIndex}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700/50 px-2 py-0.5 rounded uppercase">
                Modality: {probeModality}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Targeted Socratic Probe Test
            </h2>
          </div>
        </div>

        {totalProbes > 1 && (
          <span className="text-xs font-mono text-slate-300 bg-slate-800/60 border border-slate-700/50 px-3 py-1 rounded-lg">
            Probe {probeIndex} of {totalProbes}
          </span>
        )}
      </div>

      {/* PROBE QUESTION CONTAINER */}
      <form onSubmit={handleSubmit} className="bg-[#141622] p-6 rounded-xl border border-[#232636] space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" /> Stress Test Scenario
            </span>
            {expectedInfoGain && (
              <span className="text-[11px] font-mono text-slate-400">
                Info Gain: <code className="text-slate-300">{expectedInfoGain}</code>
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#11131c] border border-[#212433] text-white font-semibold text-base leading-relaxed">
            "{questionText}"
          </div>
        </div>

        {/* RESPONSE INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="probe-answer-input" className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
              Your Probe Answer / Decision
            </label>
            <input
              id="probe-answer-input"
              type="text"
              value={probeAnswer}
              onChange={(e) => setProbeAnswer(e.target.value)}
              aria-label="Your Probe Answer or Decision"
              className="w-full bg-[#11131c] border border-[#212433] rounded-lg px-3.5 py-2.5 text-white text-sm font-medium focus:border-amber-600 focus:outline-none"
              placeholder="Enter your answer to this specific probe scenario..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="probe-reasoning-input" className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
              Your Rationale / Why
            </label>
            <input
              id="probe-reasoning-input"
              type="text"
              value={probeReasoning}
              onChange={(e) => setProbeReasoning(e.target.value)}
              aria-label="Your Rationale or Explanation"
              className="w-full bg-[#11131c] border border-[#212433] rounded-lg px-3.5 py-2.5 text-white text-sm font-medium focus:border-amber-600 focus:outline-none"
              placeholder="Why does this happen in your mental model?"
              required
            />
          </div>
        </div>

        {/* SUBMIT BUTTON ROW */}
        <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#212433]">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> Response updates Bayesian model
          </span>

          <button
            type="submit"
            disabled={isLoading || (!probeAnswer.trim() && !probeReasoning.trim())}
            aria-label="Submit Probe Response and Update Belief"
            className="mindtrace-btn-yellow px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" /> Updating Belief...
              </>
            ) : (
              <>
                Submit Response <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
