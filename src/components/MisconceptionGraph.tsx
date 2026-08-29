import React, { useState } from 'react';
import { AlertCircle, HelpCircle, CheckCircle2, ArrowRight, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import type { Misconception } from '../services/aiEngine';

interface MisconceptionGraphProps {
  domain: string;
  concept: string;
  misconceptions: Misconception[];
  whyExplanation: string;
  remediationText?: string;
  onSelectNode?: (nodeId: string) => void;
}

export const MisconceptionGraph: React.FC<MisconceptionGraphProps> = ({
  domain,
  concept,
  misconceptions,
  whyExplanation,
  remediationText,
}) => {
  const primaryMisconception = misconceptions[0] || {
    name: 'conceptual_gap',
    confidence: 0.85,
    evidence: ['Student reasoning indicates incomplete mental model.'],
  };

  const domainLower = domain.toLowerCase();
  const isCS = domainLower.includes('computer') || domainLower.includes('cs') || domainLower.includes('algorithm') || domainLower.includes('code');
  const isMath = domainLower.includes('math') || domainLower.includes('calc') || domainLower.includes('derivative');
  const isBioChem = domainLower.includes('bio') || domainLower.includes('chem') || domainLower.includes('cell');

  // Domain-specific node content
  const nodeEvidence = isCS
    ? ['Stack frame push/pop boundary ignored.', 'Equates recursion return value with immediate termination.']
    : isMath
    ? ['Stationary point f\'(x)=0 confused with constant function.', 'Neglects second derivative concavity f\'\'(x).']
    : isBioChem
    ? ['Static equilibrium misconception.', 'Fails to model dynamic forward/reverse exchange rates.']
    : primaryMisconception.evidence || ['Equates instantaneous state with zero rate of change.'];

  const probeDescription = remediationText
    ? remediationText
    : isCS
    ? 'Targeted counter-example (Base case condition check in recursive factorial).'
    : isMath
    ? 'Targeted counter-example (Stationary turning point in polynomial f(x) = x^2).'
    : isBioChem
    ? 'Targeted counter-example (Dynamic equilibrium in cellular membrane osmotic pressure).'
    : 'Targeted counter-example (Boundary condition verification in system dynamics).';

  const masteryDescription = isCS
    ? 'Robust mental model of call stack allocation, base condition handling, and tail recursion.'
    : isMath
    ? 'Robust understanding of derivative rates of change, critical points, and differential calculus.'
    : isBioChem
    ? 'Mastery of dynamic steady-state equilibrium and cellular homeostasis principles.'
    : 'Robust mental model separating state variables from continuous system forces.';

  // Node Selection State for Interactive Deep Dive
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-misconception');

  // Interactive Graph Nodes Setup
  const nodes = [
    {
      id: 'node-belief',
      title: '1. Surface Observation',
      subtitle: 'Student Initial Belief',
      type: 'observation',
      status: 'Diagnosed',
      color: 'amber',
      confidence: Math.round(primaryMisconception.confidence * 100),
      description: whyExplanation || `Student applies static assumption to ${domain} problem.`,
      evidence: nodeEvidence,
    },
    {
      id: 'node-misconception',
      title: '2. Root Misconception',
      subtitle: primaryMisconception.name.replace(/_/g, ' ').toUpperCase(),
      type: 'deficit',
      status: 'Targeted Deficit',
      color: 'rose',
      confidence: Math.round(primaryMisconception.confidence * 100),
      description: `Fundamental confusion regarding core ${domain} mechanics in ${concept}.`,
      evidence: [`Fails to account for underlying system laws in ${domain}.`],
    },
    {
      id: 'node-socratic',
      title: '3. Socratic Probe Link',
      subtitle: 'Cognitive Dissonance Trigger',
      type: 'probe',
      status: 'Intervention Point',
      color: 'indigo',
      confidence: 92,
      description: probeDescription,
      evidence: [`Requires testing conceptual transfer across ${domain} scenarios.`],
    },
    {
      id: 'node-mastery',
      title: '4. Target Mastery',
      subtitle: 'Causal Transfer Model',
      type: 'mastery',
      status: 'Refinement Goal',
      color: 'emerald',
      confidence: 98,
      description: masteryDescription,
      evidence: [`Correctly applies ${domain} principles across new problem variations.`],
    },
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  return (
    <div className="studio-card rounded-2xl p-6 space-y-6 relative overflow-hidden border border-[#222b42] bg-[#111625]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222b42] pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight font-mono uppercase">
                Dynamic Cognitive Misconception Graph
              </h3>
              <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                {domain} • {concept}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Interactive causal propagation graph for {domain}. Click any node to inspect evidence.
            </p>
          </div>
        </div>

        {/* Global Confidence Meter */}
        <div className="flex items-center gap-3 bg-[#0d111d] px-3.5 py-1.5 rounded-xl border border-[#222b42]">
          <span className="text-xs font-mono text-slate-400">Diagnosis Confidence:</span>
          <span className="text-sm font-mono font-bold text-amber-400">
            {Math.round(primaryMisconception.confidence * 100)}%
          </span>
          <div className="w-16 h-2 bg-[#070912] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full"
              style={{ width: `${Math.round(primaryMisconception.confidence * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* INTERACTIVE GRAPH & NODES CANVAS */}
      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {nodes.map((node, index) => {
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
                className={`studio-card p-4 rounded-xl cursor-pointer transition-all duration-200 border ${nodeBorderClass} space-y-3 relative group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                {index < nodes.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-[#0d111d] border border-[#222b42] flex items-center justify-center text-slate-400 shadow-md">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={`font-semibold flex items-center gap-1.5 ${iconColorClass}`}>
                    {node.type === 'observation' && <AlertCircle className="w-3.5 h-3.5" />}
                    {node.type === 'deficit' && <ShieldAlert className="w-3.5 h-3.5" />}
                    {node.type === 'probe' && <HelpCircle className="w-3.5 h-3.5" />}
                    {node.type === 'mastery' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {node.title}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded ${statusTagClass}`}>
                    {node.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1">
                    {node.subtitle}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                    {node.description}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-[#1c2338]">
                  <span>Confidence</span>
                  <span className={`font-bold ${iconColorClass}`}>{node.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* NODE INSPECTOR DRAWER */}
        <div className="studio-card p-5 rounded-xl border-indigo-500/30 space-y-4 bg-[#0d111d] relative">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Node Inspector: <strong className="text-indigo-400">{activeNode.title}</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Domain Context: <code className="text-indigo-300">{domain}</code>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-mono text-[11px]">Cognitive Hypothesis:</span>
              <p className="text-white font-medium leading-relaxed bg-[#070912] p-3 rounded-lg border border-[#222b42]">
                {activeNode.description}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <span className="text-slate-400 font-mono text-[11px]">Extracted Student Reasoning Evidence:</span>
              <div className="bg-[#070912] p-3 rounded-lg border border-[#222b42] space-y-1.5">
                {activeNode.evidence.map((ev: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-200">
                    <span className="text-indigo-400 font-mono font-bold">•</span>
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
