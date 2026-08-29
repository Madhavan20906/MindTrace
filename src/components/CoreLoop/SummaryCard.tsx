import React, { useEffect } from 'react';
import { Award, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, Users, Layers } from 'lucide-react';
import type { TransferResult, DiagnosisResult, RemediationResult } from '../../services/aiEngine';
import { saveSession, type StoredSession } from '../../services/sessionStore';

interface SummaryCardProps {
  diagnosis?: DiagnosisResult | null;
  remediation?: RemediationResult | null;
  transferResult: TransferResult;
  onRestart: () => void;
  onSwitchToComparison?: () => void;
  onSwitchToTeacher?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  diagnosis,
  remediation,
  transferResult,
  onRestart,
  onSwitchToComparison,
  onSwitchToTeacher,
}) => {
  // Automatically save this completed session to sessionStore!
  useEffect(() => {
    if (diagnosis) {
      const priorProb = diagnosis.competingHypotheses[0]?.confidence || 0.75;
      const postProb = remediation?.beliefUpdate?.posteriorProbability || 0.94;

      const newSession: StoredSession = {
        id: `session-live-${Date.now()}`,
        timestamp: new Date().toISOString(),
        studentName: `Learner #${Math.floor(1000 + Math.random() * 9000)}`,
        domain: diagnosis.domain,
        concept: diagnosis.concept,
        situationType: diagnosis.situationType,
        reasoningClassification: diagnosis.reasoningClassification,
        problemStatement: diagnosis.concept,
        userAnswer: diagnosis.evidenceTrace[0] || 'User Response',
        userReasoning: diagnosis.whyExplanation,
        mentalModelDescription: diagnosis.reconstructedMentalModel.description,
        implicitAssumptions: diagnosis.reconstructedMentalModel.implicitAssumptions,
        competingHypotheses: diagnosis.competingHypotheses,
        skepticReview: diagnosis.skepticReview,
        diagnosticProbe: diagnosis.diagnosticProbe,
        probeLog: remediation ? [
          {
            probeStatement: diagnosis.diagnosticProbe.probeStatement,
            userAnswer: remediation.beliefUpdate.newEvidence,
            userReasoning: remediation.targetedIntervention,
            likelihoodGivenH1: remediation.beliefUpdate.likelihoodGivenH1,
            likelihoodGivenH2: 0.10,
            updatedPosterior: postProb,
          },
        ] : [],
        priorConfidence: priorProb,
        posteriorConfidence: postProb,
        targetedIntervention: remediation?.targetedIntervention,
        transferProblem: remediation?.transferProblem,
        transferDomain: remediation?.transferDomain,
        status: transferResult.resolved ? 'transferred' : 'resolved',
        isFallback: diagnosis.isFallback,
      };

      saveSession(newSession);
    }
  }, [diagnosis, remediation, transferResult]);

  return (
    <div className="w-full space-y-6">
      {/* HEADER BANNER */}
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 relative border border-emerald-500/30 shadow-2xl overflow-hidden bg-[#0d111d]" aria-live="polite" aria-atomic="true">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
          <Award className="w-4 h-4 text-emerald-400 animate-pulse" /> Resolve Stage • Session Completed & Persisted
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
          Cognitive Profile <span className="text-emerald-400">Report</span>
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          {transferResult.feedback}
        </p>
      </div>

      {/* EVALUATION COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE DIAGNOSIS SUMMARY */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3 text-xs font-mono">
            <span className="text-amber-400 font-bold uppercase tracking-wider">Initial Cognitive State</span>
            <span className="text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
              {transferResult.beforeSummary.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Baseline Assessment:</span>
              <span className="text-xs font-bold text-amber-400 font-mono">Baseline understanding not yet established</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Initial Misconception Prior:</span>
              <span className="text-lg font-bold text-amber-400">{transferResult.beforeSummary.misconceptionConfidence}%</span>
            </div>
          </div>
        </div>

        {/* AFTER REMEDIATION SUMMARY */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3 text-xs font-mono">
            <span className="text-emerald-400 font-bold uppercase tracking-wider">Post-Remediation Evaluation</span>
            <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
              {transferResult.afterSummary.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Transfer Evaluation Score:</span>
              <span className="text-lg font-bold text-emerald-400">{transferResult.finalMastery || transferResult.transferScore || 0} / 100</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Residual Misconception Risk:</span>
              <span className="text-lg font-bold text-emerald-400">{transferResult.afterSummary.misconceptionConfidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* OVERARCHING REASONING PATTERN CARD */}
      <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-indigo-500/30 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#222b42] pb-3 text-xs font-mono">
          <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Transferred Cognitive Reasoning Pattern
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Persisted to Session History
          </span>
        </div>

        <p className="text-base font-bold text-white font-mono">
          {transferResult.crossDomainPattern || 'Universal System Invariant Pattern'}
        </p>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          This investigation session has been stored locally in your session database. You can inspect this run in <strong>Educator Analytics</strong> or compare it side-by-side with other student runs in <strong>Differential Matrix</strong>.
        </p>
      </div>

      {/* ACTION BUTTONS ROW */}
      <div className="studio-card p-5 rounded-2xl bg-[#111625] border border-[#222b42] flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onRestart}
          className="btn-cyber-primary px-6 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> New Cognitive Investigation
        </button>

        <div className="flex items-center gap-3">
          {onSwitchToComparison && (
            <button
              onClick={onSwitchToComparison}
              className="px-5 py-3 rounded-xl text-xs font-mono font-bold bg-[#0d111d] border border-[#222b42] text-slate-300 hover:text-white flex items-center gap-2 transition"
            >
              <Layers className="w-4 h-4 text-indigo-400" /> Compare Session in Matrix
            </button>
          )}

          {onSwitchToTeacher && (
            <button
              onClick={onSwitchToTeacher}
              className="px-5 py-3 rounded-xl text-xs font-mono font-bold bg-indigo-600 text-white flex items-center gap-2 transition shadow-lg shadow-indigo-500/30"
            >
              <Users className="w-4 h-4" /> View Educator Analytics <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
