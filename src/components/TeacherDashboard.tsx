import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, BarChart2, ArrowRight, Activity, Trash2, Download, Upload, Cpu, Play, Award, Sparkles, Layers } from 'lucide-react';
import {
  getStoredSessions,
  deleteSession,
  clearAllSessions,
  exportClassroomJSON,
  importClassroomJSON,
  detectCrossDomainPatterns,
  type StoredSession,
} from '../services/sessionStore';
import { runBenchmarkSuite, type BenchmarkReport } from '../services/benchmarkDataset';

interface TeacherDashboardProps {
  onReturnToLoop: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onReturnToLoop }) => {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('All');
  const [importStatus, setImportStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'benchmark'>('sessions');

  // Benchmark Runner state
  const [benchmarkReport, setBenchmarkReport] = useState<BenchmarkReport | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkProgress, setBenchmarkProgress] = useState<{ current: number; total: number }>({ current: 0, total: 20 });

  const loadSessions = () => {
    setSessions(getStoredSessions());
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    loadSessions();
  };

  const handleClearAll = () => {
    if (confirm('Clear all stored student sessions?')) {
      clearAllSessions();
      loadSessions();
    }
  };

  const handleExportJSON = () => {
    const json = exportClassroomJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindtrace-classroom-data-${Date.now()}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && importClassroomJSON(text)) {
          setImportStatus('Successfully imported classroom session database!');
          loadSessions();
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Error importing JSON data.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRunBenchmark = async () => {
    setIsBenchmarking(true);
    try {
      const report = await runBenchmarkSuite((current, total) => {
        setBenchmarkProgress({ current, total });
      });
      setBenchmarkReport(report);
    } catch (e) {
      console.error('Benchmark execution error:', e);
    } finally {
      setIsBenchmarking(false);
    }
  };

  const filteredSessions = selectedDomainFilter === 'All'
    ? sessions
    : sessions.filter((s) => s.domain.toLowerCase().includes(selectedDomainFilter.toLowerCase()));

  const totalStudents = sessions.length;
  const misconceptionCount = sessions.filter((s) => s.reasoningClassification === 'MISCONCEPTION').length;
  const proceduralCount = sessions.filter((s) => s.reasoningClassification === 'PROCEDURAL_ERROR').length;
  
  const avgPosteriorConfidence = totalStudents > 0
    ? Math.round((sessions.reduce((acc, s) => acc + (s.posteriorConfidence || 0.90), 0) / totalStudents) * 100)
    : 92;

  const crossDomainPatterns = detectCrossDomainPatterns(sessions);

  const domainCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    domainCounts[s.domain] = (domainCounts[s.domain] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-7 py-2">
      {/* Header Banner */}
      <div className="glass-panel p-7 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-indigo-500 border border-indigo-500/20 shadow-xl bg-[#0d111d]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Users className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Local Classroom Analytics Prototype
              </span>
              <span className="text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                Live Storage ({totalStudents} Sessions)
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Classroom Cognitive Learning Diagnostics
            </h2>
          </div>
        </div>

        {/* View Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#111625] p-1 rounded-xl border border-[#222b42]">
            <button
              type="button"
              onClick={() => setActiveTab('sessions')}
              aria-label="View Recorded Student Sessions Tab"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                activeTab === 'sessions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Sessions ({totalStudents})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('benchmark')}
              aria-label="View Benchmark Suite Tab"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                activeTab === 'benchmark' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> AI Benchmark Suite (20 Cases)
            </button>
          </div>

          <button
            type="button"
            onClick={onReturnToLoop}
            aria-label="Return to Diagnostic Studio"
            className="btn-cyber-primary flex items-center gap-2 text-xs font-semibold px-5 py-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Return to Diagnostic Studio <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 text-center">
          {importStatus}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-xl text-center space-y-1 border border-zinc-800 bg-[#0d111d]">
              <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">Recorded Sessions</span>
              <div className="text-2xl font-bold text-white font-mono">{totalStudents} Sessions</div>
            </div>

            <div className="glass-panel p-5 rounded-xl text-center space-y-1 border-t-4 border-t-amber-500 border-x border-b border-zinc-800 bg-[#0d111d]">
              <span className="text-[11px] text-amber-400 font-mono uppercase tracking-wider font-semibold">Conceptual Deficits</span>
              <div className="text-2xl font-bold text-amber-400 font-mono">
                {totalStudents > 0 ? `${Math.round((misconceptionCount / totalStudents) * 100)}% (${misconceptionCount}/${totalStudents})` : '0%'}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl text-center space-y-1 border-t-4 border-t-cyan-500 border-x border-b border-zinc-800 bg-[#0d111d]">
              <span className="text-[11px] text-cyan-400 font-mono uppercase tracking-wider font-semibold">Procedural Errors</span>
              <div className="text-2xl font-bold text-cyan-400 font-mono">
                {totalStudents > 0 ? `${Math.round((proceduralCount / totalStudents) * 100)}% (${proceduralCount}/${totalStudents})` : '0%'}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl text-center space-y-1 border-t-4 border-t-emerald-500 border-x border-b border-zinc-800 bg-[#0d111d]">
              <span className="text-[11px] text-emerald-400 font-mono uppercase tracking-wider font-semibold">Evaluated Confidence Index</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{avgPosteriorConfidence}% Index</div>
            </div>
          </div>

          {/* Longitudinal Cross-Domain Patterns Banner */}
          {crossDomainPatterns.length > 0 && (
            <div className="studio-card p-5 rounded-xl border border-indigo-500/30 bg-[#0d111d] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-400 font-bold uppercase">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Longitudinal Cross-Domain Patterns Detected
                </span>
                <span className="text-[10px] text-slate-400">Multi-session pattern detection</span>
              </div>
              <div className="space-y-2">
                {crossDomainPatterns.map((pat, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-[#070912] border border-[#222b42] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white font-mono block">{pat.patternName}</span>
                      <span className="text-slate-400 text-[11px] font-sans">{pat.description}</span>
                    </div>
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold shrink-0">
                      {pat.domainsInvolved.join(' + ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Class Roster Table */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-zinc-800 shadow-2xl bg-[#0d111d]">
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <BarChart2 className="w-4 h-4 text-indigo-400" /> Active Student Diagnostic Sessions
              </h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportJSON}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#111625] border border-[#222b42] text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" /> Export JSON
                </button>

                <label className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#111625] border border-[#222b42] text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import JSON
                  <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>

                <select
                  value={selectedDomainFilter}
                  onChange={(e) => setSelectedDomainFilter(e.target.value)}
                  className="bg-[#111625] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-indigo-300 focus:outline-none"
                >
                  <option value="All">All Domains</option>
                  {Object.keys(domainCounts).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <button
                  onClick={handleClearAll}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-[#070912] text-zinc-400 font-mono uppercase text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Student / Session</th>
                    <th className="p-3.5">Domain & Concept</th>
                    <th className="p-3.5">Diagnosed Pattern</th>
                    <th className="p-3.5">Posterior P(H|E)</th>
                    <th className="p-3.5">Prescribed Intervention</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-zinc-800/30 transition">
                        <td className="p-3.5 font-bold text-white font-mono">
                          {session.studentName}
                          <span className="block text-[10px] text-zinc-500 font-normal">
                            {new Date(session.timestamp).toLocaleTimeString()}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-indigo-300 block">{session.domain}</span>
                          <span className="text-[11px] text-zinc-400 line-clamp-1">{session.concept}</span>
                        </td>
                        <td className="p-3.5 font-mono text-amber-300">
                          {session.situationType}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-400">
                          {Math.round((session.posteriorConfidence || 0.92) * 100)}% Posterior
                        </td>
                        <td className="p-3.5 text-zinc-200 max-w-xs line-clamp-2">
                          {session.targetedIntervention || 'Targeted Socratic visual scrubber'}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {session.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
                        No active sessions found for filter "{selectedDomainFilter}". Conduct an investigation in Diagnostic Studio!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BENCHMARK SUITE RUNNER TAB */}
      {activeTab === 'benchmark' && (
        <div className="studio-card p-6 rounded-2xl bg-[#0d111d] border border-[#222b42] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222b42] pb-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Empirical AI Diagnostic Benchmark Suite
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Ground-Truth Reasoning Evaluation (20 Curated Scenarios)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Executes MindTrace AI engine across 20 pre-labeled scenarios (Physics, CS, Law, Economics, Logic) to calculate live empirical Precision, Recall, Accuracy, and Latency.
              </p>
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="btn-quantum-primary px-6 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {isBenchmarking ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-white" /> Evaluating Case {benchmarkProgress.current} / {benchmarkProgress.total}...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Run 20-Case Benchmark Suite
                </>
              )}
            </button>
          </div>

          {/* BENCHMARK RESULTS REPORT */}
          {benchmarkReport ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#111625] border border-emerald-500/30 text-center space-y-1">
                  <span className="text-xs font-mono text-slate-400 uppercase">Empirical Accuracy</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{benchmarkReport.accuracyPercentage}%</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111625] border border-indigo-500/30 text-center space-y-1">
                  <span className="text-xs font-mono text-slate-400 uppercase">Macro Precision / Recall</span>
                  <div className="text-2xl font-bold font-mono text-indigo-400">{benchmarkReport.macroPrecision} / {benchmarkReport.macroRecall}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111625] border border-cyan-500/30 text-center space-y-1">
                  <span className="text-xs font-mono text-slate-400 uppercase">Macro F1-Score</span>
                  <div className="text-2xl font-bold font-mono text-cyan-400">{benchmarkReport.macroF1Score}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111625] border border-amber-500/30 text-center space-y-1">
                  <span className="text-xs font-mono text-slate-400 uppercase">Mean Latency</span>
                  <div className="text-2xl font-bold font-mono text-amber-400">{benchmarkReport.averageLatencyMs} ms</div>
                </div>
              </div>

              {/* Individual Case Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" /> Benchmark Evaluation Breakdown ({benchmarkReport.evaluatedCases} Cases)
                </h4>

                <div className="overflow-x-auto rounded-xl border border-[#222b42]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#070912] text-slate-400 uppercase text-[10px] border-b border-[#222b42]">
                      <tr>
                        <th className="p-3">Case ID</th>
                        <th className="p-3">Domain</th>
                        <th className="p-3">Expected Ground-Truth</th>
                        <th className="p-3">AI Predicted</th>
                        <th className="p-3">Match</th>
                        <th className="p-3 text-right">Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222b42] bg-[#111625]">
                      {benchmarkReport.results.map((res) => (
                        <tr key={res.caseId} className="hover:bg-[#161c2e]">
                          <td className="p-3 text-indigo-300 font-bold">{res.caseId}</td>
                          <td className="p-3 text-slate-300">{res.domain}</td>
                          <td className="p-3 text-amber-400">{res.expected}</td>
                          <td className="p-3 text-slate-200">{res.predicted}</td>
                          <td className="p-3">
                            {res.match ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                                MATCH ✓
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                                MISMATCH ✗
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right text-slate-400">{res.latencyMs} ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#111625] rounded-xl border border-[#222b42] space-y-3">
              <Award className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
              <h4 className="text-base font-bold text-white font-mono">Benchmark Suite Ready</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click "Run 20-Case Benchmark Suite" above to evaluate MindTrace against ground-truth reasoning cases and compute live metrics.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
