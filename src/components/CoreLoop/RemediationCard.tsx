import React from 'react';
import { ArrowRight, Sparkles, AlertCircle, CheckCircle2, Lightbulb, Activity, TrendingUp } from 'lucide-react';
import type { DiagnosisResult, RemediationResult } from '../../services/aiEngine';
import { InteractiveSimCanvas } from '../InteractiveSimCanvas';

interface RemediationCardProps {
  diagnosis: DiagnosisResult;
  remediation: RemediationResult;
  onProceedToTransfer: () => void;
  onLoadSeed?: () => void;
}

export const RemediationCard: React.FC<RemediationCardProps> = ({
  diagnosis,
  remediation,
  onProceedToTransfer,
}) => {
  const bu = remediation.beliefUpdate;
  const h1Prior = bu.priorProbability || 0.70;
  const h1Posterior = bu.posteriorProbability || 0.92;
  const isShiftUp = h1Posterior >= h1Prior;

  return (
    <div className="w-full space-y-6">
      {/* HEADER BANNER */}
      <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl" aria-live="polite" aria-atomic="true">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-6 h-6 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Update Phase • Deterministic Bayesian Belief Update
              </span>
              <span className="text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md uppercase">
                {remediation.engineStatus === 'live' ? 'Live Bayesian Engine' : 'Offline Simulation'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Evidence Probability Update & Root Cause Analysis
            </h2>
          </div>
        </div>
      </div>

      {/* BAYESIAN BELIEF SHIFT VISUALIZATION CARD */}
      <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-indigo-500/30 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#222b42] pb-3 text-xs font-mono">
          <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Calculated Bayesian Posterior Update P(H1 | E)
          </span>
          <span className={`font-bold px-3 py-1 rounded-lg border ${
            isShiftUp
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}>
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
            {bu.confidenceDelta}
          </span>
        </div>

        {/* Belief Probability Shift Graphic */}
        <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Belief Shift (Prior → Posterior):</span>
            <span className="text-white font-bold font-mono">
              H1 Prior: <strong className="text-amber-400">{Math.round(h1Prior * 100)}%</strong> → Posterior: <strong className="text-emerald-400">{Math.round(h1Posterior * 100)}%</strong>
            </span>
          </div>

          <div className="w-full h-3 bg-[#070912] rounded-full overflow-hidden flex border border-[#222b42]">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${Math.round(h1Prior * 100)}%` }}
              title="Prior Probability"
            />
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.max(0, Math.round((h1Posterior - h1Prior) * 100))}%` }}
              title="Posterior Update"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-center">
          <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-1">
            <span className="text-slate-400 block text-[11px]">Prior Probability P(H1)</span>
            <span className="text-xl font-bold text-amber-400">
              {Math.round(h1Prior * 100)}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-1">
            <span className="text-slate-400 block text-[11px]">Evidence Likelihood P(E|H1)</span>
            <span className="text-xl font-bold text-indigo-400">
              {Math.round((bu.likelihoodGivenH1 || 0.85) * 100)}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0d111d] border border-emerald-500/40 space-y-1">
            <span className="text-emerald-400 font-bold block text-[11px]">Posterior Belief P(H1|E)</span>
            <span className="text-xl font-bold text-emerald-400">
              {Math.round(h1Posterior * 100)}%
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-mono leading-relaxed bg-[#0d111d] p-3.5 rounded-xl border border-[#222b42]">
          <strong>Bayesian Rationale:</strong> {bu.whyUpdated}
        </p>
      </div>

      {/* ROOT CAUSE & TARGETED INTERVENTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROOT CAUSE ANALYSIS */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#222b42] pb-3 text-xs font-mono text-amber-400 font-bold uppercase">
            <AlertCircle className="w-4 h-4" /> Root Cause Decomposition
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0d111d] border border-[#222b42]">
              <span className="text-amber-400 font-mono font-bold block text-[11px]">Surface Error:</span>
              <p className="text-white font-medium mt-0.5">{remediation.rootCause.surfaceError}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d111d] border border-[#222b42]">
              <span className="text-slate-400 font-mono font-bold block text-[11px]">Underlying Reasoning Error:</span>
              <p className="text-slate-200 mt-0.5">{remediation.rootCause.underlyingReasoningError}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d111d] border border-[#222b42]">
              <span className="text-indigo-400 font-mono font-bold block text-[11px]">Root Mental Model Issue:</span>
              <p className="text-indigo-200 mt-0.5">{remediation.rootCause.rootMentalModelIssue}</p>
            </div>
          </div>
        </div>

        {/* TARGETED INTERVENTION */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-emerald-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#222b42] pb-3 text-xs font-mono text-emerald-400 font-bold uppercase">
              <Lightbulb className="w-4 h-4" /> Prescribed Targeted Intervention
            </div>

            <div className="p-5 rounded-2xl bg-[#0d111d] border border-emerald-500/30 text-white text-base leading-relaxed font-sans font-medium">
              "{remediation.targetedIntervention}"
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0d111d] border border-[#222b42] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Context Transfer Verification Target:</span>
            <span className="text-indigo-300 font-bold">{remediation.transferDomain}</span>
          </div>
        </div>
      </div>

      {/* UNIVERSAL VISUAL SPECIFICATION SIMULATOR */}
      <InteractiveSimCanvas
        visualSpec={remediation.visualSpec}
        domain={diagnosis.domain}
        concept={diagnosis.concept}
      />

      {/* PROCEED TO TRANSFER */}
      <div className="studio-card p-5 rounded-2xl bg-[#111625] border border-[#222b42] flex items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Next: Context Transfer Verification problem in <strong className="text-indigo-300">{remediation.transferDomain}</strong></span>
        </div>

        <button
          onClick={onProceedToTransfer}
          className="btn-quantum-primary px-8 py-3.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2"
        >
          Proceed to Context Transfer <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
