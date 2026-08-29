import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, GitCompare } from 'lucide-react';
import { getStoredSessions, type StoredSession } from '../services/sessionStore';
import { compareTwoSessions, type DifferentialComparisonReport } from '../services/aiEngine';

interface SameOutcomeComparisonProps {
  onReturnToLoop: () => void;
}

export const SameOutcomeComparison: React.FC<SameOutcomeComparisonProps> = ({ onReturnToLoop }) => {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [sessionAId, setSessionAId] = useState<string>('');
  const [sessionBId, setSessionBId] = useState<string>('');
  const [report, setReport] = useState<DifferentialComparisonReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const list = getStoredSessions();
    setSessions(list);
    if (list.length >= 2) {
      setSessionAId(list[0].id);
      setSessionBId(list[1].id);
    } else if (list.length === 1) {
      setSessionAId(list[0].id);
    }
  }, []);

  const handleRunComparison = async () => {
    const sessA = sessions.find((s) => s.id === sessionAId);
    const sessB = sessions.find((s) => s.id === sessionBId);
    if (!sessA || !sessB) return;

    setIsLoading(true);
    try {
      const res = await compareTwoSessions(sessA, sessB);
      setReport(res);
    } catch (e) {
      console.error('Comparison error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedA = sessions.find((s) => s.id === sessionAId);
  const selectedB = sessions.find((s) => s.id === sessionBId);

  return (
    <div className="max-w-6xl mx-auto space-y-7 py-2">
      {/* HEADER BANNER */}
      <div className="glass-panel p-7 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-indigo-500 border border-indigo-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <GitCompare className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Differential Matrix • Session Comparison
              </span>
              <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded">
                Dynamic Session Picker
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Comparative Cognitive Analysis Matrix
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnToLoop}
          aria-label="Return to Diagnostic Studio"
          className="btn-cyber-primary flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Return to Diagnostic Studio <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* SESSION SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SESSION A SELECTOR */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3 text-xs font-mono">
            <label htmlFor="session-a-select" className="text-amber-400 font-bold uppercase">Select Session A</label>
            <span className="text-slate-400">Target 1</span>
          </div>

          <select
            id="session-a-select"
            value={sessionAId}
            onChange={(e) => setSessionAId(e.target.value)}
            aria-label="Select Target Session A for Comparison"
            className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl p-3 text-xs font-mono text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.studentName} ({s.domain} - {s.concept.slice(0, 30)})
              </option>
            ))}
          </select>

          {selectedA && (
            <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-2 text-xs">
              <div className="font-bold text-white">{selectedA.studentName} • {selectedA.domain}</div>
              <p className="text-slate-300 line-clamp-2">"Answer: {selectedA.userAnswer}"</p>
              <div className="text-[11px] font-mono text-amber-400">
                Mental Model: {selectedA.mentalModelDescription}
              </div>
            </div>
          )}
        </div>

        {/* SESSION B SELECTOR */}
        <div className="studio-card p-6 rounded-2xl bg-[#111625] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-3 text-xs font-mono">
            <label htmlFor="session-b-select" className="text-cyan-400 font-bold uppercase">Select Session B</label>
            <span className="text-slate-400">Target 2</span>
          </div>

          <select
            id="session-b-select"
            value={sessionBId}
            onChange={(e) => setSessionBId(e.target.value)}
            aria-label="Select Target Session B for Comparison"
            className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl p-3 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.studentName} ({s.domain} - {s.concept.slice(0, 30)})
              </option>
            ))}
          </select>

          {selectedB && (
            <div className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] space-y-2 text-xs">
              <div className="font-bold text-white">{selectedB.studentName} • {selectedB.domain}</div>
              <p className="text-slate-300 line-clamp-2">"Answer: {selectedB.userAnswer}"</p>
              <div className="text-[11px] font-mono text-cyan-400">
                Mental Model: {selectedB.mentalModelDescription}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RUN COMPARISON TRIGGER */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleRunComparison}
          disabled={isLoading || !sessionAId || !sessionBId || sessionAId === sessionBId}
          aria-label="Run Live Differential Comparison"
          className="btn-quantum-primary px-9 py-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" /> Running AI Comparative Analysis...
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4" /> Run Live Differential Comparison
            </>
          )}
        </button>
      </div>

      {/* DIFFERENTIAL COMPARISON REPORT */}
      {report && (
        <div className="studio-card p-7 rounded-2xl bg-[#111625] border border-indigo-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#222b42] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-indigo-400 font-bold tracking-wider">
                Differential Diagnostic Results
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Core Cognitive Divergence Report
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                report.sameOutcome
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}
            >
              {report.sameOutcome ? 'Same Surface Outcome / Different Model' : 'Divergent Outcomes & Models'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d111d] border border-indigo-500/30 text-white font-medium text-sm leading-relaxed">
            <strong className="text-indigo-400 font-mono block text-xs uppercase mb-1">Core Reasoning Divergence:</strong>
            "{report.coreDifference}"
          </div>

          {/* INSIGHTS GRID */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Key Comparative Insights</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.comparisonInsights.map((insight, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0d111d] border border-[#222b42] text-xs font-mono text-slate-200">
                  • {insight}
                </div>
              ))}
            </div>
          </div>

          {/* REMEDIATION PATHS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
              <span className="font-bold font-mono text-amber-400 block">Prescribed Path for {report.sessionA.studentName}:</span>
              <p className="text-white">{report.remediationPathA}</p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1 text-xs">
              <span className="font-bold font-mono text-cyan-400 block">Prescribed Path for {report.sessionB.studentName}:</span>
              <p className="text-white">{report.remediationPathB}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
