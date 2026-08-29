import React, { useState } from 'react';
import { AlertTriangle, Calculator, ArrowRight, CheckCircle2, Layers, User, Brain, ShieldAlert, Code, TrendingUp } from 'lucide-react';

interface SameOutcomeComparisonProps {
  onReturnToLoop: () => void;
}

export const SameOutcomeComparison: React.FC<SameOutcomeComparisonProps> = ({ onReturnToLoop }) => {
  const [selectedScenario, setSelectedScenario] = useState<'math_score' | 'code_test' | 'business_decision'>('math_score');
  const [selectedPerson, setSelectedPerson] = useState<'A' | 'B'>('A');

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Banner */}
      <div className="glass-panel p-8 rounded-2xl text-center space-y-3 relative border border-indigo-500/30 shadow-2xl overflow-hidden bg-[#0d111d]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-indigo-400" /> Differential Reasoning Matrix
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          SAME OUTCOME. <span className="text-blue-400">DIFFERENT REASONING.</span>
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          Traditional evaluation looks only at the output: a matching test score, passing unit test, or identical decision. MindTrace investigates the internal mental models behind identical outcomes to expose latent risk.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setSelectedScenario('math_score')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border flex items-center gap-2 ${
            selectedScenario === 'math_score'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
              : 'bg-[#111625] text-slate-400 border-[#222b42] hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" /> Math Assessment (Score: 100%)
        </button>

        <button
          onClick={() => setSelectedScenario('code_test')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border flex items-center gap-2 ${
            selectedScenario === 'code_test'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
              : 'bg-[#111625] text-slate-400 border-[#222b42] hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" /> Code Review (Tests: 10/10 Passed)
        </button>

        <button
          onClick={() => setSelectedScenario('business_decision')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border flex items-center gap-2 ${
            selectedScenario === 'business_decision'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
              : 'bg-[#111625] text-slate-400 border-[#222b42] hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Strategy Decision (Revenue: +15%)
        </button>
      </div>

      {/* Profile Switcher */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setSelectedPerson('A')}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 border ${
            selectedPerson === 'A'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-[#111625] text-slate-400 border-[#222b42] hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" /> Person A: Sound Mental Model (Low Risk)
        </button>

        <button
          onClick={() => setSelectedPerson('B')}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 border ${
            selectedPerson === 'B'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-[#111625] text-slate-400 border-[#222b42] hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" /> Person B: Coincidental Rule (High Future Risk)
        </button>
      </div>

      {/* Side-by-Side Differential Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSON A: SOUND REASONING */}
        <div
          className={`studio-card p-6 rounded-2xl space-y-6 border-t-4 border-t-emerald-500 transition-all ${
            selectedPerson === 'A' ? 'ring-2 ring-emerald-500/40 bg-emerald-950/10' : 'border-[#222b42]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#222b42] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl font-mono">
                A
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Person A</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedScenario === 'math_score' && 'Calculus Turning Point'}
                  {selectedScenario === 'code_test' && 'Recursive Algorithm'}
                  {selectedScenario === 'business_decision' && 'Product Pricing Model'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-mono uppercase">Observable Outcome</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {selectedScenario === 'math_score' && 'Score: 100%'}
                {selectedScenario === 'code_test' && 'Pass: 10/10 Tests'}
                {selectedScenario === 'business_decision' && 'Q3 Profit: +15%'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
              <CheckCircle2 className="w-4 h-4" /> Investigated Mental Model
            </div>
            <div className="bg-[#070912] p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" /> Sound First-Principles Logic
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedScenario === 'math_score' &&
                  'Understands that stationary points f\'(x)=0 indicate zero slope turning points, and evaluates second derivative concavity f\'\'(x) for local max/min.'}
                {selectedScenario === 'code_test' &&
                  'Understands stack frame allocation limits, explicitly setting base condition bounds before invoking tail recursion.'}
                {selectedScenario === 'business_decision' &&
                  'Separated rate of growth from absolute revenue level, accounting for long-term customer elasticity.'}
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-1 font-semibold">
                Future Risk Assessment: LOW (0.02) • High Transfer Capability
              </div>
            </div>
          </div>
        </div>

        {/* PERSON B: COINCIDENTAL FLAWED REASONING */}
        <div
          className={`studio-card p-6 rounded-2xl space-y-6 border-t-4 border-t-amber-500 transition-all ${
            selectedPerson === 'B' ? 'ring-2 ring-amber-500/40 bg-amber-950/10' : 'border-[#222b42]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#222b42] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl font-mono">
                B
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Person B</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedScenario === 'math_score' && 'Calculus Turning Point'}
                  {selectedScenario === 'code_test' && 'Recursive Algorithm'}
                  {selectedScenario === 'business_decision' && 'Product Pricing Model'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-mono uppercase">Observable Outcome</div>
              <div className="text-lg font-bold text-amber-400 font-mono">
                {selectedScenario === 'math_score' && 'Score: 100%'}
                {selectedScenario === 'code_test' && 'Pass: 10/10 Tests'}
                {selectedScenario === 'business_decision' && 'Q3 Profit: +15%'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-bold">
              <ShieldAlert className="w-4 h-4" /> Investigated Mental Model
            </div>
            <div className="bg-[#070912] p-4 rounded-xl border border-amber-500/30 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Flawed Coincidental Rule
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedScenario === 'math_score' &&
                  'Memorized a superficial rule that derivative=0 means answer is 0. Got 100% on this test because the test problem f(x)=x^2 happened to have its turning point at x=0!'}
                {selectedScenario === 'code_test' &&
                  'Relied on input array length happening to fit inside stack frame buffer limits for small unit test fixtures, but will fail with StackOverflow in production on large datasets!'}
                {selectedScenario === 'business_decision' &&
                  'Assumed inflation drop meant price drops, which accidentally coincided with a competitor seasonal sale.'}
              </p>
              <div className="text-[11px] font-mono text-amber-400 pt-1 font-semibold">
                Future Risk Assessment: CRITICAL HIGH (0.94) • Severe Failure Expected on Transfer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return to loop button */}
      <div className="text-center pt-2">
        <button
          onClick={onReturnToLoop}
          className="btn-cyber-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold"
        >
          Return to Core Diagnostic Loop <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export { SameOutcomeComparison as SameScoreComparison };
