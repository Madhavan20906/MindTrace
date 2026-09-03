import React, { useState } from 'react';
import { Brain, Sparkles, ArrowRight, Zap, RefreshCcw, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PrerequisiteNode {
  id: string;
  title: string;
  category: 'primitive' | 'derived' | 'invariant' | 'misconception';
  status: 'mastered' | 'flawed' | 'untested';
  description: string;
  prerequisites: string[];
}

export const CausalMindMapStudio: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-3');
  const [repairBeamActive, setRepairBeamActive] = useState<boolean>(false);

  const nodes: PrerequisiteNode[] = [
    {
      id: 'node-1',
      title: '1. Rate of Change (Calculus Primitive)',
      category: 'primitive',
      status: 'mastered',
      description: 'Understanding derivative dx/dt as instantaneous velocity slope.',
      prerequisites: [],
    },
    {
      id: 'node-2',
      title: '2. Acceleration Vector Field',
      category: 'derived',
      status: 'mastered',
      description: 'Acceleration a = dv/dt acts constantly downward (-g) in uniform gravity.',
      prerequisites: ['node-1'],
    },
    {
      id: 'node-3',
      title: '3. Trajectory Apex Velocity Invariant',
      category: 'misconception',
      status: 'flawed',
      description: 'Identified Misconception: Confusing instantaneous zero velocity (v=0) with zero acceleration (a=0).',
      prerequisites: ['node-1', 'node-2'],
    },
    {
      id: 'node-4',
      title: '4. Prerequisite Root Cause Repair',
      category: 'invariant',
      status: 'untested',
      description: 'Distinguishing state variables (position, velocity) from system forcing functions (gravity).',
      prerequisites: ['node-3'],
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  const triggerRepairBeam = () => {
    setRepairBeamActive(true);
    setTimeout(() => {
      setRepairBeamActive(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="relative p-7 md:p-8 rounded-3xl bg-gradient-to-r from-[#101426] via-[#1b1936] to-[#101426] border border-cyan-500/30 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> HACKATHON NOVELTY FEATURE #1
          </div>
          <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">
            3D Prerequisite Causal Mind Map Studio
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-sans leading-relaxed">
            Visually trace how prerequisite cognitive flaws propagate through downstream mental models. MindTrace isolates the exact root cause node and projects a Socratic Repair Beam.
          </p>
        </div>
      </div>

      {/* GRAPH CANVAS & NODE INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH CANVAS (2/3) */}
        <div className="lg:col-span-2 bg-[#121524]/90 p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative min-h-[420px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" /> Causal Prerequisite Dependency Tree
            </span>
            <button
              onClick={triggerRepairBeam}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" /> Fire Socratic Repair Beam
            </button>
          </div>

          {/* INTERACTIVE NODES FLOW */}
          <div className="relative my-6 space-y-6">
            {repairBeamActive && (
              <div className="absolute inset-0 bg-cyan-500/10 border-2 border-cyan-400 rounded-2xl animate-pulse pointer-events-none flex items-center justify-center text-xs font-mono font-bold text-cyan-300">
                ⚡ SOCRATIC BEAM COMPUTING BAYESIAN PREREQUISITE REPAIR...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isFlawed = node.status === 'flawed';
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-5 rounded-2xl border transition cursor-pointer space-y-2 relative shadow-lg ${
                      isSelected
                        ? 'bg-[#1b2038] border-cyan-400 ring-2 ring-cyan-400/20'
                        : isFlawed
                        ? 'bg-rose-500/10 border-rose-500/40 hover:border-rose-400'
                        : 'bg-[#141726] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isFlawed
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {node.category.toUpperCase()}
                      </span>
                      {isFlawed ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white font-sans">{node.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-sans">{node.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5 pt-3">
            <span>Graph Nodes: 4 Prerequisite Invariants</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              Active Root Cause: Node 3 <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* NODE INSPECTOR PANEL (1/3) */}
        <div className="bg-[#121524]/90 p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-sans">Node Telemetry Inspector</h3>
                <p className="text-[11px] text-slate-400 font-mono">Bayesian Node Probability</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Selected Node</span>
                <p className="text-sm font-bold text-white font-sans">{selectedNode.title}</p>
              </div>

              <div className="bg-[#0b0d18] p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Node Diagnostics</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedNode.description}</p>
              </div>

              <div className="bg-[#0b0d18] p-4 rounded-2xl border border-cyan-500/30 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Prescribed Remediation</span>
                <p className="text-xs font-bold text-white font-sans">Socratic Velocity Scrubber Drill</p>
                <p className="text-[11px] text-slate-400 font-sans">Remediates rate of change derivative vs magnitude inversion.</p>
              </div>
            </div>
          </div>

          <button
            onClick={triggerRepairBeam}
            className="w-full mindtrace-btn-yellow py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Re-verify Prerequisite Tree
          </button>
        </div>
      </div>
    </div>
  );
};

export default CausalMindMapStudio;
