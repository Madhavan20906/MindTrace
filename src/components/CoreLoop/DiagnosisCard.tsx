import React, { useState } from 'react';
import { ArrowRight, HelpCircle, ShieldCheck, Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import type { DiagnosisResult } from '../../services/aiEngine';
import { UniversalReasoningGraph } from '../UniversalReasoningGraph';

interface DiagnosisCardProps {
  diagnosis: DiagnosisResult;
  onProceed: () => void;
  onLoadSeed?: () => void;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({
  diagnosis,
  onProceed,
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'evidence'>('graph');

  const isValidReasoning = diagnosis.reasoningClassification === 'VALID_REASONING' || diagnosis.reasoningClassification === 'NO_ISSUE';

  return (
    <div className="w-full space-y-6">
      {/* HEADER BANNER */}
      <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl" aria-live="polite" aria-atomic="true">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Brain className="w-6 h-6 animate-pulse text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Investigate Stage • Multi-Agent Cognitive Diagnosis
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isValidReasoning
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {diagnosis.reasoningClassification}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Reconstructed Mental Model & Hypotheses
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'graph' ? 'evidence' : 'graph')}
            aria-label={activeTab === 'graph' ? 'Switch to Text Evidence View' : 'Switch to Reasoning DAG Graph View'}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#0d111d] border border-[#222b42] text-slate-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {activeTab === 'graph' ? 'View Text Evidence' : 'View Reasoning DAG'}
          </button>
        </div>
      </div>

      {/* OFFLINE FALLBACK DISCLAIMER BANNER */}
      {diagnosis.isFallback && (
        <div className="studio-card p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-3 text-xs font-mono text-amber-300">
          <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Offline Structural Analysis Active — Deep cognitive diagnosis unavailable without Live AI engine.</span>
        </div>
      )}

      {/* VALID REASONING NOTICE */}
      {isValidReasoning && (
        <div className="studio-card p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white font-mono">Valid Reasoning Detected!</h4>
              <p className="text-xs text-slate-300">
                Your stated logic is sound and correctly accounts for system invariants. Proceeding through verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC DAG GRAPH OR EVIDENCE TAB */}
      {activeTab === 'graph' ? (
        <UniversalReasoningGraph diagnosis={diagnosis} />
      ) : (
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-[#222b42] space-y-4">
          <h3 className="text-base font-bold text-white font-mono">Extracted Evidence Trail</h3>
          <div className="space-y-2">
            {diagnosis.evidenceTrace.map((ev, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0d111d] border border-[#222b42] text-xs font-mono text-slate-300">
                • {ev}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPETING HYPOTHESES & SKEPTIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COMPETING HYPOTHESES CARD */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Competing Diagnostic Hypotheses
            </span>
            <span className="text-[11px] font-mono text-slate-400">Priors sum to 100%</span>
          </div>

          <div className="space-y-3">
            {diagnosis.competingHypotheses.map((h) => (
              <div key={h.id} className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{h.id}: {h.name}</span>
                  <span className="text-amber-400 font-bold">{Math.round(h.confidence * 100)}% Prior</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{h.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* INDEPENDENT ADVERSARIAL SKEPTIC CARD */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Independent Skeptic Review
            </span>
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/40">
              Adversarial Call 1b
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-1">
              <span className="text-indigo-400 font-mono font-bold block">Skeptic Counter-Question:</span>
              <p className="text-white font-medium">"{diagnosis.skepticReview.skepticQuestion}"</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-1">
              <span className="text-amber-400 font-mono font-bold block">Could Diagnosis Be Wrong?</span>
              <p className="text-slate-300">{diagnosis.skepticReview.couldBeWrongReason}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PROCEED ACTION ROW */}
      <div className="studio-card p-5 rounded-2xl bg-[#111625] border border-[#222b42] flex items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Diagnostic Probe Ready: <strong className="text-indigo-300">{diagnosis.diagnosticProbe.modality.toUpperCase()}</strong></span>
        </div>

        <button
          type="button"
          onClick={onProceed}
          aria-label="Proceed to Diagnostic Probe"
          className="btn-quantum-primary px-8 py-3.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Proceed to Diagnostic Probe <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
