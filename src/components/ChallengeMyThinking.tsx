import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { challengeMyThinking, type ChallengeReport } from '../services/aiEngine';

interface ChallengeMyThinkingProps {
  onReturnToLoop: () => void;
  onSendToInvestigation?: (argument: string) => void;
}

export const ChallengeMyThinking: React.FC<ChallengeMyThinkingProps> = ({
  onReturnToLoop,
  onSendToInvestigation,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [report, setReport] = useState<ChallengeReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const res = await challengeMyThinking(inputText);
      setReport(res);
    } catch (err) {
      console.error('Challenge error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 py-2">
      {/* HEADER BANNER */}
      <div className="glass-panel p-7 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-rose-500 border border-rose-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                Adversarial Skeptic Engine
              </span>
              <span className="text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded">
                Socratic Stress Testing
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Challenge My Thinking & Argument Deconstruction
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnToLoop}
          aria-label="Return to Diagnostic Studio"
          className="btn-cyber-primary flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          Return to Diagnostic Studio <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleChallenge} className="studio-card p-7 rounded-2xl bg-[#111625] border border-[#222b42] space-y-4 shadow-xl">
        <label htmlFor="challenge-input-textarea" className="block text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
          Enter Any Premise, Business Strategy, Legal Argument, Code Logic, or Decision:
        </label>

        <textarea
          id="challenge-input-textarea"
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          aria-label="Premise or Argument Input"
          className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl p-4 text-white text-sm font-medium focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none leading-relaxed font-sans"
          placeholder="e.g. We should lower our SaaS subscription prices by 30% to increase user acquisition volume..."
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono text-slate-400">
            Adversarial Skeptic decomposes premises and searches for blind spots.
          </span>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            aria-label="Challenge My Thinking Button"
            className="btn-quantum-primary px-8 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" /> Deconstructing Argument...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-rose-400" /> Challenge My Thinking
              </>
            )}
          </button>
        </div>
      </form>

      {/* REPORT OUTPUT */}
      {report && (
        <div className="studio-card p-7 rounded-2xl bg-[#111625] border border-rose-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-rose-400 font-bold tracking-wider">
                Deconstruction Report • {report.domain}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Argument Weakness & Socratic Stress Test
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-1 text-xs">
                <span className="text-amber-400 font-mono font-bold block uppercase">Core Hidden Assumptions:</span>
                <ul className="space-y-1 pt-1 text-slate-200">
                  {report.coreAssumptions.map((a, idx) => (
                    <li key={idx}>• {a}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-1 text-xs">
                <span className="text-rose-400 font-mono font-bold block uppercase">Weakest Premise Link:</span>
                <p className="text-white font-medium">{report.weakestLink}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-1 text-xs">
                <span className="text-indigo-400 font-mono font-bold block uppercase">Alternative Interpretations:</span>
                <ul className="space-y-1 pt-1 text-slate-200">
                  {report.alternativeInterpretations.map((alt, idx) => (
                    <li key={idx}>• {alt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0d111d] border border-rose-500/30 space-y-1 text-xs">
                <span className="text-rose-400 font-mono font-bold block uppercase">Skeptic Probe Test:</span>
                <p className="text-white font-bold text-sm">"{report.diagnosticProbe}"</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d111d] border border-emerald-500/30 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-mono font-bold">Recommended Refinement:</span>
            <span className="text-slate-200">{report.recommendedRefinement}</span>
          </div>

          {onSendToInvestigation && (
            <div className="text-right">
              <button
                onClick={() => onSendToInvestigation(inputText)}
                className="btn-quantum-primary text-xs font-mono font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2"
              >
                Feed Argument into Full Diagnostic Studio <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
