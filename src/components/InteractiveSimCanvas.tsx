import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Eye, AlertCircle, CheckCircle2, ArrowRight, Activity, GitBranch, Layers } from 'lucide-react';
import type { UniversalVisualSpec } from '../services/aiEngine';

interface InteractiveSimCanvasProps {
  visualSpec?: UniversalVisualSpec;
  domain?: string;
  concept?: string;
}

export const InteractiveSimCanvas: React.FC<InteractiveSimCanvasProps> = ({
  visualSpec,
  domain = 'Universal Systems',
  concept = 'Dynamic System Model',
}) => {
  const [timeStep, setTimeStep] = useState<number>(50); // 0 to 100
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'telemetry'>('comparison');

  const spec: UniversalVisualSpec = visualSpec || {
    title: `Dynamic Concept Spec: ${concept}`,
    domain,
    visualizationType: 'argument_map',
    nodes: [
      { id: 'n1', label: 'Flawed Input Assumption', value: 'Unverified Premise', status: 'flaw' },
      { id: 'n2', label: 'System Constraint Rule', value: 'Invariant Principle', status: 'correct' },
      { id: 'n3', label: 'Verified Conclusion', value: 'Valid Outcome', status: 'active' },
    ],
    edges: [
      { source: 'n1', target: 'n2', label: 'Contradicts' },
      { source: 'n2', target: 'n3', label: 'Establishes' },
    ],
    parameters: [
      { name: 'Timeline Scrub', value: timeStep, min: 0, max: 100, unit: '%' },
      { name: 'Constraint Value', value: Number(((timeStep - 50) * 0.1).toFixed(2)), min: -5, max: 5 },
    ],
    annotations: {
      studentFlawTitle: 'Diagnosed Premise Flaw',
      studentFlawDescription: `Overgeneralizes initial premise conditions across changing context constraints in ${domain}.`,
      domainRealityTitle: 'True Structural Principle',
      domainRealityDescription: `System invariant rules govern state outcomes continuously across all scenarios in ${domain}.`,
    },
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStep((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeDomain = spec.domain || domain;
  const activeConcept = concept || 'Core Principles';
  const scrubValue = timeStep;

  return (
    <div className="studio-card rounded-2xl p-6 space-y-6 relative overflow-hidden border border-[#222b42] bg-[#111625]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222b42] pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <GitBranch className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Universal Visual Spec: <span className="text-indigo-400">{activeConcept}</span>
              </h3>
              <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md uppercase">
                {activeDomain} • {spec.visualizationType}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Interactive visual specification renderer. Scrub timeline to compare student mental model vs true system reality.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#0d111d] p-1 rounded-xl border border-[#222b42]">
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            aria-label="Switch to Dual Mental Model View"
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeTab === 'comparison' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Dual Mental Model
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('telemetry')}
            aria-label="Switch to Spec Nodes View"
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeTab === 'telemetry' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Spec Nodes ({spec.nodes.length})
          </button>
        </div>
      </div>

      {activeTab === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* PANEL 1: STUDENT FLAWED MENTAL MODEL */}
          <div className="studio-card p-5 rounded-xl border-amber-500/30 space-y-4 bg-[#0d111d]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4" /> STUDENT FLAWED MENTAL MODEL
              </span>
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded text-[10px]">
                Diagnosed Flaw
              </span>
            </div>

            <div className="h-56 bg-[#070912] rounded-xl border border-[#222b42] relative flex flex-col items-center justify-center p-4 overflow-hidden">
              <div className="w-full space-y-3">
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    {spec.annotations?.studentFlawTitle || 'Diagnosed Mental Flaw'}
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    "{spec.annotations?.studentFlawDescription || 'Static premise over-generalization.'}"
                  </p>
                </div>

                <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
                    <span>Scrub Value: {scrubValue}%</span>
                    <span>Flawed Assumption Trigger: {scrubValue > 70 ? 'ACTIVE' : 'IDLE'}</span>
                  </div>
                  <div className="w-full h-2 bg-[#070912] rounded-full overflow-hidden border border-amber-500/30">
                    <div
                      className="h-full bg-amber-500 transition-all duration-75"
                      style={{ width: `${scrubValue}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-amber-400">Diagnosed Rationale:</strong> Equates surface conditions with invariant system laws in {activeDomain}.
            </p>
          </div>

          {/* PANEL 2: TRUE DOMAIN SYSTEM REALITY */}
          <div className="studio-card p-5 rounded-xl border-emerald-500/30 space-y-4 bg-[#0d111d]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> TRUE SYSTEM REALITY
              </span>
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                System Invariant
              </span>
            </div>

            <div className="h-56 bg-[#070912] rounded-xl border border-[#222b42] relative flex flex-col items-center justify-center p-4 overflow-hidden">
              <div className="w-full space-y-3">
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {spec.annotations?.domainRealityTitle || 'True Principle'}
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    "{spec.annotations?.domainRealityDescription || 'Continuous invariant rules govern outcomes.'}"
                  </p>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
                    <span>System Invariant State: Active</span>
                    <span>Transfer Rate: Continuous</span>
                  </div>
                  <div className="w-full h-2 bg-[#070912] rounded-full overflow-hidden border border-emerald-500/30">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, scrubValue + 15)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-emerald-400">Actual Domain Rule:</strong> Invariant principles govern transitions across all scenario parameters in {activeDomain}.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="studio-card p-5 rounded-xl border border-[#222b42] bg-[#0d111d] space-y-4">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3 text-xs font-mono">
            <span className="text-indigo-400 font-bold uppercase flex items-center gap-2">
              <Layers className="w-4 h-4" /> Visual Specification Node & Edge Graph
            </span>
            <span className="text-slate-400">Schema Type: <code>{spec.visualizationType}</code></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Specification Nodes</span>
              <div className="space-y-2">
                {spec.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-3 rounded-lg bg-[#070912] border border-[#222b42] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{node.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {node.id}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        node.status === 'flaw'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : node.status === 'correct'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {node.value || node.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Edges & Relationships</span>
              <div className="space-y-2">
                {spec.edges.map((edge, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#070912] border border-[#222b42] flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-indigo-300 font-bold">{edge.source}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">{edge.label || 'relates'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-emerald-300 font-bold">{edge.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS & TIMELINE SCRUBBER */}
      <div className="studio-card p-4 rounded-xl border border-[#222b42] flex flex-col sm:flex-row items-center gap-4 bg-[#0d111d]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            className="btn-cyber-primary w-10 h-10 rounded-xl flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title={isPlaying ? 'Pause' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setTimeStep(50);
            }}
            aria-label="Reset Scrubber"
            className="btn-cyber-secondary w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Reset Scrubber"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 w-full space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <label htmlFor="timeline-scrubber-input" className="text-slate-400">Timeline Scrubber: <strong>{timeStep}%</strong></label>
            <span className="text-indigo-400 font-bold">Domain: {activeDomain}</span>
          </div>

          <input
            id="timeline-scrubber-input"
            type="range"
            min="0"
            max="100"
            value={timeStep}
            aria-label="Timeline scrubber slider"
            onChange={(e) => {
              setIsPlaying(false);
              setTimeStep(Number(e.target.value));
            }}
            className="w-full h-2 bg-[#070912] rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
    </div>
  );
};
