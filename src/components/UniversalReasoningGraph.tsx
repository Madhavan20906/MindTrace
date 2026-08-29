import React, { useState } from 'react';
import { Activity, Sparkles, HelpCircle, ShieldCheck, FileText, ArrowRight, GitCommit } from 'lucide-react';
import type { DiagnosisResult } from '../services/aiEngine';

interface UniversalReasoningGraphProps {
  diagnosis: DiagnosisResult;
  onSelectNode?: (nodeId: string) => void;
}

export const UniversalReasoningGraph: React.FC<UniversalReasoningGraphProps> = ({ diagnosis }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-claim');

  const primaryHypothesis = diagnosis.competingHypotheses[0] || {
    id: 'H1',
    name: 'Primary Inferred Model',
    description: diagnosis.whyExplanation,
    confidence: 0.75,
    posteriorProbability: 0.88,
    evidence: diagnosis.evidenceTrace,
    status: 'active',
  };

  const causalSteps = diagnosis.reconstructedMentalModel?.causalChain || [
    `Premise: "${diagnosis.concept}"`,
    'Inferred structural rule',
    'Stated conclusion',
  ];

  const implicitAssumptions = diagnosis.reconstructedMentalModel?.implicitAssumptions || [
    'Assumes surface observations persist across constraint shifts',
  ];

  // Cognitive Topology DAG: CLAIM -> ASSUMPTION -> INFERENCE -> EVIDENCE -> CONCLUSION
  const dagNodes = [
    // 1. CLAIM (User Stated Answer / Claim)
    {
      id: 'node-claim',
      title: '1. CLAIM',
      subtitle: `Stated Answer / Premise`,
      type: 'claim',
      status: 'User Input Claim',
      color: 'amber',
      confidence: 100,
      description: `User stated claim under evaluation: "${diagnosis.concept}"`,
      evidence: diagnosis.evidenceTrace.length > 0 ? diagnosis.evidenceTrace : [diagnosis.concept],
      parents: [],
    },

    // 2. ASSUMPTION (Implicit Assumptions Extracted)
    {
      id: 'node-assumption',
      title: '2. IMPLICIT ASSUMPTION',
      subtitle: 'Inferred Mental Model',
      type: 'assumption',
      status: 'Extracted Assumption',
      color: 'amber',
      confidence: Math.round(primaryHypothesis.confidence * 100),
      description: diagnosis.reconstructedMentalModel.description,
      evidence: implicitAssumptions,
      parents: ['node-claim'],
    },

    // 3. INFERENCE (Causal Reasoning Chain)
    ...causalSteps.map((step, idx) => ({
      id: `node-inference-${idx + 1}`,
      title: `3. INFERENCE STEP ${idx + 1}`,
      subtitle: step.slice(0, 30),
      type: 'inference',
      status: 'Causal Inference',
      color: 'amber',
      confidence: Math.round(primaryHypothesis.confidence * 100),
      description: step,
      evidence: [step],
      parents: idx === 0 ? ['node-assumption'] : [`node-inference-${idx}`],
    })),

    // 4. EVIDENCE (Evidence & Skeptic Stress Test)
    {
      id: 'node-evidence',
      title: '4. EVIDENCE & SKEPTIC',
      subtitle: 'Adversarial Stress Test',
      type: 'evidence',
      status: 'Skeptic Review',
      color: 'indigo',
      confidence: 90,
      description: `Adversarial Question: "${diagnosis.skepticReview.skepticQuestion}"`,
      evidence: [
        `Could be wrong reason: ${diagnosis.skepticReview.couldBeWrongReason}`,
        `Disproving evidence needed: ${diagnosis.skepticReview.disprovingEvidenceNeeded}`,
      ],
      parents: causalSteps.length > 0 ? [`node-inference-${causalSteps.length}`] : ['node-assumption'],
    },

    // 5. CONCLUSION (Target Hypothesis & Diagnostic Probe)
    {
      id: 'node-conclusion',
      title: '5. CONCLUSION & PROBE',
      subtitle: `${diagnosis.reasoningClassification}`,
      type: 'conclusion',
      status: 'Targeted Hypothesis',
      color: 'emerald',
      confidence: Math.round((primaryHypothesis.posteriorProbability || primaryHypothesis.confidence) * 100),
      description: `Target Probe: "${diagnosis.diagnosticProbe.probeStatement}"`,
      evidence: [
        `Expected Info Gain: ${diagnosis.diagnosticProbe.expectedInformationGain}`,
        `Target Hypothesis: ${diagnosis.diagnosticProbe.targetHypothesisId} (${primaryHypothesis.name})`,
      ],
      parents: ['node-evidence'],
    },
  ];

  const activeNode = dagNodes.find((n) => n.id === selectedNodeId) || dagNodes[0];

  return (
    <div className="studio-card rounded-2xl p-6 space-y-6 relative overflow-hidden border border-[#222b42] bg-[#111625]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222b42] pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight font-mono uppercase">
                Cognitive Topology Reasoning Graph
              </h3>
              <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                {diagnosis.domain} • {diagnosis.reasoningClassification}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Extracted user cognitive flow: CLAIM → IMPLICIT ASSUMPTION → INFERENCE → EVIDENCE → CONCLUSION.
            </p>
          </div>
        </div>

        {/* Global Confidence Meter */}
        <div className="flex items-center gap-3 bg-[#0d111d] px-3.5 py-1.5 rounded-xl border border-[#222b42]">
          <span className="text-xs font-mono text-slate-400">Hypothesis Confidence:</span>
          <span className="text-sm font-mono font-bold text-amber-400">
            {Math.round((primaryHypothesis.posteriorProbability || primaryHypothesis.confidence) * 100)}%
          </span>
          <div className="w-16 h-2 bg-[#070912] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full"
              style={{ width: `${Math.round((primaryHypothesis.posteriorProbability || primaryHypothesis.confidence) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC DAG CANVAS & NODES */}
      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {dagNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            let nodeBorderClass = 'border-[#222b42] hover:border-slate-600 bg-[#0d111d]';
            let iconColorClass = 'text-slate-400';
            let statusTagClass = 'bg-slate-800 text-slate-400';

            if (node.color === 'amber') {
              nodeBorderClass = isSelected
                ? 'border-amber-500 ring-2 ring-amber-500/40 bg-amber-500/10'
                : 'border-amber-500/30 hover:border-amber-500/60 bg-[#0d111d]';
              iconColorClass = 'text-amber-400';
              statusTagClass = 'bg-amber-500/20 border border-amber-500/40 text-amber-300';
            } else if (node.color === 'rose') {
              nodeBorderClass = isSelected
                ? 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-500/10'
                : 'border-rose-500/30 hover:border-rose-500/60 bg-[#0d111d]';
              iconColorClass = 'text-rose-400';
              statusTagClass = 'bg-rose-500/20 border border-rose-500/40 text-rose-300';
            } else if (node.color === 'indigo') {
              nodeBorderClass = isSelected
                ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-500/10'
                : 'border-indigo-500/30 hover:border-indigo-500/60 bg-[#0d111d]';
              iconColorClass = 'text-indigo-400';
              statusTagClass = 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300';
            } else if (node.color === 'emerald') {
              nodeBorderClass = isSelected
                ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-500/10'
                : 'border-emerald-500/30 hover:border-emerald-500/60 bg-[#0d111d]';
              iconColorClass = 'text-emerald-400';
              statusTagClass = 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300';
            }

            return (
              <div
                key={node.id}
                tabIndex={0}
                role="button"
                aria-label={`Select node ${node.title}: ${node.subtitle}`}
                onClick={() => setSelectedNodeId(node.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedNodeId(node.id);
                  }
                }}
                className={`studio-card p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${nodeBorderClass} space-y-2 relative group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={`font-semibold flex items-center gap-1 ${iconColorClass}`}>
                    {node.type === 'claim' && <FileText className="w-3.5 h-3.5" />}
                    {node.type === 'assumption' && <Sparkles className="w-3.5 h-3.5" />}
                    {node.type === 'inference' && <GitCommit className="w-3.5 h-3.5" />}
                    {node.type === 'evidence' && <ShieldCheck className="w-3.5 h-3.5" />}
                    {node.type === 'conclusion' && <HelpCircle className="w-3.5 h-3.5" />}
                    {node.title}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${statusTagClass}`}>{node.status}</span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1">
                    {node.subtitle}
                  </h4>
                  <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                    {node.description}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-[#1c2338]">
                  <span>Weight</span>
                  <span className={`font-bold ${iconColorClass}`}>{node.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* INSPECTOR DRAWER */}
        <div className="studio-card p-5 rounded-xl border-indigo-500/30 space-y-4 bg-[#0d111d] relative">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Node Inspector: <strong className="text-indigo-400">{activeNode.title}</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Parents: <code className="text-indigo-300">{activeNode.parents.join(', ') || 'Root'}</code>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-mono text-[11px]">Node Description:</span>
              <p className="text-white font-medium leading-relaxed bg-[#070912] p-3 rounded-lg border border-[#222b42]">
                {activeNode.description}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <span className="text-slate-400 font-mono text-[11px]">Extracted Evidence & Invariants:</span>
              <div className="bg-[#070912] p-3 rounded-lg border border-[#222b42] space-y-1.5">
                {activeNode.evidence.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-200">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="font-mono text-[11px] leading-snug">"{ev}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
