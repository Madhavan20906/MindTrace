import React, { useState } from 'react';
import { GitFork, Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { executeAIProviderQuery } from '../services/aiProvider';
import { getApiKey } from '../services/aiEngine';

export const CounterfactualForkEngine: React.FC = () => {
  const [whatIfInput, setWhatIfInput] = useState<string>(
    'What if gravity was directed horizontally towards the right instead of downwards?'
  );
  const [isForking, setIsForking] = useState<boolean>(false);
  const [forkOutput, setForkOutput] = useState<{
    worldA: string;
    worldB: string;
    divergenceInsight: string;
  }>({
    worldA: 'Standard World: Objects accelerate downwards at g = 9.8 m/s². Vertical parabolic trajectory.',
    worldB: 'Forked World: Objects accelerate horizontally rightward. Trajectory curves sideways in a rightward horizontal parabola.',
    divergenceInsight: 'The direction of constant acceleration determines vector curvature independently of initial velocity.',
  });

  const handleForkReality = async () => {
    if (!whatIfInput.trim()) return;

    setIsForking(true);
    try {
      const apiKey = getApiKey();
      const prompt = `System: You are MINDTRACE Counterfactual Reality Forking Engine. 
The student asks a "What-If" counterfactual hypothesis: "${whatIfInput}".
Generate a concise comparison between:
World A (Standard System Invariants)
World B (Forked Counterfactual World)
Divergence Insight (Why changing this axiom breaks or transforms system behavior).
Output strictly in readable markdown with clear section headings.`;

      const res = await executeAIProviderQuery(prompt, undefined, apiKey);

      if (res.rawText) {
        setForkOutput({
          worldA: 'Standard World: Standard physical or logical invariants hold as defined in baseline axioms.',
          worldB: res.rawText,
          divergenceInsight: 'Counterfactual axiom change isolated downstream system invariants.',
        });
      }
    } catch (err) {
      console.error('Fork engine error:', err);
    } finally {
      setIsForking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="relative p-7 md:p-8 rounded-3xl bg-gradient-to-r from-[#1c0d1b] via-[#2d122b] to-[#1c0d1b] border border-pink-500/30 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> COUNTERFACTUAL REALITY ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">
            Live Counterfactual "What-If" Reality Forking Engine
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-sans leading-relaxed">
            Fork system reality by altering any baseline axiom. MindTrace simulates parallel branches side-by-side to prove how counterfactual changes transform system behavior.
          </p>
        </div>
      </div>

      {/* INPUT FORK GENERATOR */}
      <div className="bg-[#18121c]/90 p-7 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        <label className="block text-xs font-mono text-pink-300 uppercase tracking-wider font-semibold">
          Enter Counterfactual Hypothesis ("What If...?")
        </label>

        <div className="flex flex-wrap gap-2">
          {[
            'What if gravity was directed horizontally rightward?',
            'What if recursion base condition was omitted?',
            'What if central bank set interest rates to negative 10%?',
          ].map((preset) => (
            <button
              key={preset}
              onClick={() => setWhatIfInput(preset)}
              className="px-3.5 py-1.5 rounded-xl bg-[#100d14] text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={whatIfInput}
            onChange={(e) => setWhatIfInput(e.target.value)}
            placeholder="What if..."
            className="flex-1 bg-[#0a0b0e] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white font-sans focus:outline-none focus:border-pink-400"
          />
          <button
            onClick={handleForkReality}
            disabled={isForking}
            className="mindtrace-btn-yellow px-6 py-3.5 text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isForking ? <Sparkles className="w-4 h-4 animate-spin text-white" /> : <GitFork className="w-4 h-4" />}
            Fork Reality Engine <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SIDE-BY-SIDE PARALLEL WORLD BRANCHES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WORLD A */}
        <div className="bg-[#18121c]/90 p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> World Branch A (Standard Baseline)
            </span>
            <span className="text-[10px] font-mono text-slate-400">g = 9.8 m/s² Down</span>
          </div>
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-white/5 text-xs font-sans text-slate-200 leading-relaxed min-h-[140px]">
            {forkOutput.worldA}
          </div>
        </div>

        {/* WORLD B */}
        <div className="bg-[#18121c]/90 p-6 rounded-3xl border border-pink-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-pink-400" /> World Branch B (Forked Counterfactual)
            </span>
            <span className="text-[10px] font-mono text-pink-300 font-bold bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30">
              Axiom Shifted
            </span>
          </div>
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-white/5 text-xs font-sans text-slate-200 leading-relaxed min-h-[140px] whitespace-pre-line">
            {forkOutput.worldB}
          </div>
        </div>
      </div>

      {/* DIVERGENCE INSIGHT STRIP */}
      <div className="bg-[#18121c]/90 p-6 rounded-3xl border border-pink-500/30 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold">
          <Zap className="w-4 h-4 text-pink-400" /> SYSTEM DIVERGENCE INSIGHT
        </div>
        <p className="text-sm font-bold text-white font-sans">{forkOutput.divergenceInsight}</p>
      </div>
    </div>
  );
};

export default CounterfactualForkEngine;
