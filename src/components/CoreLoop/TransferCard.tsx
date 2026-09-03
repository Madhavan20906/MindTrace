import React, { useState } from 'react';
import { HelpCircle, ArrowRight, RefreshCw, CheckCircle2, Award } from 'lucide-react';

interface TransferCardProps {
  transferProblemText: string;
  onVerifyTransfer: (answer: string, reasoning: string) => void;
  isLoading: boolean;
}

export const TransferCard: React.FC<TransferCardProps> = ({
  transferProblemText,
  onVerifyTransfer,
  isLoading,
}) => {
  const [transferAnswer, setTransferAnswer] = useState<string>('');
  const [transferReasoning, setTransferReasoning] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAnswer.trim() && !transferReasoning.trim()) return;
    onVerifyTransfer(transferAnswer, transferReasoning);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER BAR */}
      <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl" aria-live="polite" aria-atomic="true">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Award className="w-6 h-6 animate-pulse text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Verify Phase • Context Transfer Verification
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Cross-Constraint Context Transfer Test
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0d111d] px-3.5 py-1.5 rounded-xl border border-[#222b42]">
          <Award className="w-4 h-4 text-emerald-400" /> Evaluated via Evidence-Based Rubric (100 pts)
        </div>
      </div>

      {/* TRANSFER PROBLEM CONTAINER */}
      <form onSubmit={handleSubmit} className="studio-card p-7 rounded-2xl bg-[#111625] border border-[#222b42] space-y-6 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" /> Context Transfer Problem
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Evaluates whether corrected mental model generalizes
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d111d] border border-indigo-500/30 text-white font-bold text-lg leading-relaxed shadow-inner">
            "{transferProblemText}"
          </div>
        </div>

        {/* RESPONSE INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
              Your Transfer Answer / Conclusion
            </label>
            <input
              type="text"
              value={transferAnswer}
              onChange={(e) => setTransferAnswer(e.target.value)}
              className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-indigo-500 focus:outline-none"
              placeholder="Your answer to this transfer problem..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
              Your Transfer Rationale / Why
            </label>
            <input
              type="text"
              value={transferReasoning}
              onChange={(e) => setTransferReasoning(e.target.value)}
              className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-indigo-500 focus:outline-none"
              placeholder="Why does your corrected mental model apply here?"
              required
            />
          </div>
        </div>

        {/* SUBMIT BUTTON ROW */}
        <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#222b42]">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-dimensional Rubric Scoring: Conceptual (40) + Reasoning (30) + Adaptation (20) + Independence (10)
          </span>

          <button
            type="submit"
            disabled={isLoading || (!transferAnswer.trim() && !transferReasoning.trim())}
            className="btn-quantum-primary px-9 py-4 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" /> Verifying Mental Model Transfer...
              </>
            ) : (
              <>
                Verify Context Transfer <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
