import React, { useState } from 'react';
import { Play, CheckCircle2, Plus } from 'lucide-react';

export const CodeChallengeView: React.FC = () => {
  const [codeText, setCodeText] = useState<string>(
    `def calculate_distance(speed, time):\n    # Your code here to calculate distance\n    return speed * time`
  );
  const [hasRun, setHasRun] = useState<boolean>(false);

  const testCases = [
    { input: '10, 5', expected: '50', passed: true },
    { input: '0, 10', expected: '0', passed: true },
    { input: '5.5, 2', expected: '11.0', passed: true },
    { input: '100, 0', expected: '0', passed: true },
    { input: '25.3, 3.5', expected: '88.55', passed: true },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. PROBLEM DESCRIPTION CARD (EXACT MATCH TO SCREENSHOT 4) */}
      <div className="bg-[#14161d] p-6 rounded-2xl border border-white/5 shadow-lg">
        <p className="text-sm font-sans text-slate-200 leading-relaxed">
          You're building a simple tool for a physics student. Your task is to write a function that calculates the total distance traveled by an object, given its constant speed and the time it traveled. Remember the fundamental formula: <code className="text-amber-400 font-mono bg-white/5 px-2 py-0.5 rounded">'distance = speed × time'</code>.
        </p>
      </div>

      {/* 2. CODE CELL CONTAINER (SCREENSHOT 4) */}
      <div className="space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Cell 1</span>
        </div>

        <div className="bg-[#14161d] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c0d10] border-b border-white/5 text-xs">
            <span className="text-slate-400 font-bold tracking-wider uppercase text-[10px]">
              PYTHON
            </span>
            <button
              onClick={() => setHasRun(true)}
              className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-yellow-300 text-[#0c0d10] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" /> Run
            </button>
          </div>

          <div className="p-4 bg-[#08080a]">
            <textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              rows={5}
              className="w-full bg-transparent text-sm font-mono text-emerald-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        <button className="w-full py-2.5 rounded-xl bg-[#14161d] hover:bg-[#1a1d26] border border-dashed border-white/10 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition">
          <Plus className="w-3.5 h-3.5" /> Add Cell
        </button>
      </div>

      {/* 3. TEST CASES CONTAINER (SCREENSHOT 4) */}
      <div className="space-y-3 font-mono">
        <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider px-1">
          TEST CASES
        </h3>

        <div className="space-y-2.5">
          {testCases.map((tc, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition flex items-center justify-between ${
                hasRun
                  ? 'bg-[#14161d] border-emerald-500/30'
                  : 'bg-[#14161d] border-white/5'
              }`}
            >
              <div className="text-xs space-y-0.5">
                <p className="text-slate-300">
                  <strong className="text-slate-400">Input:</strong> {tc.input}
                </p>
                <p className="text-slate-300">
                  <strong className="text-slate-400">Expected:</strong> {tc.expected}
                </p>
              </div>

              {hasRun && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
