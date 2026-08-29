import { useState, useEffect } from 'react';
import {
  diagnoseAndProbe,
  updateAndRemediate,
  verifyTransfer,
  generateAdaptiveProbe,
  getApiKey,
  setApiKey,
  type DiagnosisResult,
  type RemediationResult,
  type TransferResult,
} from './services/aiEngine';
import { InvestigationController, type InvestigationStage } from './services/investigationController';
import { ProblemInput } from './components/CoreLoop/ProblemInput';
import { DiagnosisCard } from './components/CoreLoop/DiagnosisCard';
import { DiagnosticQuestionCard } from './components/CoreLoop/DiagnosticQuestionCard';
import { RemediationCard } from './components/CoreLoop/RemediationCard';
import { TransferCard } from './components/CoreLoop/TransferCard';
import { SummaryCard } from './components/CoreLoop/SummaryCard';
import { SameOutcomeComparison } from './components/SameOutcomeComparison';
import { ChallengeMyThinking } from './components/ChallengeMyThinking';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Activity, Layers, Users, ShieldCheck, ChevronRight, Zap, ShieldAlert, Key, X, Check } from 'lucide-react';

export function App() {
  // 4-Stage Adaptive Controller State Machine
  const [stage, setStage] = useState<InvestigationStage>('OBSERVE');
  const [investigateSubStep, setInvestigateSubStep] = useState<number>(1); // 1 = DiagnosisCard, 2 = DiagnosticQuestionCard
  const [verifySubStep, setVerifySubStep] = useState<number>(1); // 1 = TransferCard, 2 = SummaryCard
  const [controller] = useState<InvestigationController>(() => new InvestigationController());

  const [activeView, setActiveView] = useState<'loop' | 'challenge' | 'comparison' | 'teacher'>('loop');

  // Track if current run is explicit seed fallback request
  const [isSeedMode, setIsSeedMode] = useState<boolean>(false);

  // API Key State & Modal
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [activeApiKey, setActiveApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  useEffect(() => {
    const key = getApiKey();
    setActiveApiKey(key);
    setApiKeyInput(key);
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(apiKeyInput);
    setActiveApiKey(apiKeyInput.trim());
    setShowKeyModal(false);
  };

  // AI Pipeline States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisResult | null>(null);
  const [remediationData, setRemediationData] = useState<RemediationResult | null>(null);
  const [transferData, setTransferData] = useState<TransferResult | null>(null);

  // Stage 1 (OBSERVE) Submission: Call 1 (Diagnose & Probe)
  const handleProblemSubmit = async (
    problem: string,
    answer: string,
    reasoning: string,
    subjectHint?: string,
    isSeed?: boolean
  ) => {
    setIsLoading(true);
    setIsSeedMode(!!isSeed);
    try {
      const res = await diagnoseAndProbe(problem, answer, reasoning, subjectHint, isSeed);
      setDiagnosisData(res);
      controller.startInvestigation(res);
      setStage('INVESTIGATE');
      setInvestigateSubStep(1);
    } catch (err) {
      console.error('Call 1 error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 2 (INVESTIGATE) Submission: Call 2 (Update & Remediate) + Dynamic AI Next-Probe Generation
  const handleDiagnosticProbeSubmit = async (answer: string, reasoning: string) => {
    setIsLoading(true);
    try {
      const questionText =
        controller.currentProbe?.probeStatement ||
        diagnosisData?.diagnosticProbe?.probeStatement ||
        'Consider a related scenario to test your mental model.';
      const prevConf = diagnosisData?.competingHypotheses?.[0]?.confidence || 0.75;
      const hyps = diagnosisData?.competingHypotheses || [];

      // 1. Calculate Bayesian Update & Remediation with Learner Probe Evidence
      const res = await updateAndRemediate(questionText, answer, reasoning, prevConf, hyps, isSeedMode);
      setRemediationData(res);

      const topPost = res.beliefUpdate?.posteriorProbability || prevConf;

      // Update local hypothesis posteriors
      const updatedHyps = hyps.map((h, idx) => {
        if (idx === 0) return { ...h, posteriorProbability: topPost, status: topPost >= 0.80 ? ('confirmed' as const) : h.status };
        return { ...h, posteriorProbability: Number(((1 - topPost) / (hyps.length - 1 || 1)).toFixed(4)) };
      });

      controller.recordProbeResponse(questionText, answer, reasoning, topPost);

      // 2. Evaluate Evidence Sufficiency
      if (controller.isEvidenceSufficient()) {
        controller.proceedToUpdate();
        setStage('UPDATE');
      } else {
        // 3. Evidence not yet sufficient (<0.80 top posterior): Advance probe cycle and generate NEW probe dynamically
        const anotherNeeded = controller.advanceProbeCycle();
        if (anotherNeeded) {
          const nextProbe = await generateAdaptiveProbe(
            diagnosisData?.concept || 'Core Concept',
            diagnosisData?.domain || 'General Systems',
            updatedHyps,
            controller.probeHistory,
            isSeedMode
          );
          controller.setNextProbe(nextProbe);
          if (diagnosisData) {
            setDiagnosisData({
              ...diagnosisData,
              diagnosticProbe: nextProbe,
              competingHypotheses: updatedHyps,
            });
          }
          setInvestigateSubStep(2);
        } else {
          controller.proceedToUpdate();
          setStage('UPDATE');
        }
      }
    } catch (err) {
      console.error('Call 2 adaptive probe error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 4 (VERIFY) Submission: Call 3 (Verify Transfer)
  const handleTransferSubmit = async (answer: string, reasoning: string) => {
    setIsLoading(true);
    try {
      const transferProblem =
        remediationData?.transferProblem ||
        'In a completely different system context where an equilibrium point is reached, does the governing system law stop acting or maintain dynamic balance?';
      const priorConf = diagnosisData?.competingHypotheses?.[0]?.confidence || 0.75;
      const res = await verifyTransfer(transferProblem, answer, reasoning, priorConf, isSeedMode);
      setTransferData(res);
      controller.proceedToVerify();
      setStage('VERIFY');
      setVerifySubStep(2);
    } catch (err) {
      console.error('Call 3 error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetLoop = () => {
    controller.reset();
    setStage('OBSERVE');
    setInvestigateSubStep(1);
    setVerifySubStep(1);
    setIsSeedMode(false);
    setDiagnosisData(null);
    setRemediationData(null);
    setTransferData(null);
    setActiveView('loop');
  };

  const handlePerspectiveSelect = (p: 'learner' | 'educator' | 'manager' | 'challenge') => {
    if (p === 'challenge') {
      setActiveView('challenge');
    } else if (p === 'educator') {
      setActiveView('teacher');
    }
  };

  const handleSendChallengeToInvestigation = (argumentText: string) => {
    setActiveView('loop');
    handleProblemSubmit(argumentText, 'Stated Argument', 'User requested challenge investigation');
  };

  return (
    <div className="w-full min-h-screen text-slate-100 font-sans pb-20 selection:bg-indigo-600 selection:text-white relative vibrant-mesh-bg">
      {/* GLOBAL RADIANT HUD HEADER */}
      <header className="sticky top-0 z-50 bg-[#0b0f19]/95 backdrop-blur-2xl border-b border-[#222b42] px-6 py-3 shadow-2xl w-full">
        <div className="w-full max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Product Name */}
          <button
            type="button"
            className="flex items-center gap-3.5 cursor-pointer group text-left border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1"
            onClick={handleResetLoop}
            aria-label="Return to MindTrace home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center text-indigo-400 group-hover:bg-transparent group-hover:text-white transition">
                <Activity className="w-5 h-5 animate-pulse text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  MINDTRACE
                </span>
                <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-400" /> REASONING ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block font-sans">
                Universal AI Diagnostic & Bayesian Investigation Engine
              </p>
            </div>
          </button>

          {/* Telemetry Status & API Key Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#111625] hover:bg-[#182035] border border-[#222b42] text-xs font-mono transition"
            >
              <ShieldCheck className={`w-4 h-4 ${activeApiKey ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-slate-400">Engine Mode:</span>
              <span className={`font-bold ${activeApiKey ? 'text-emerald-400' : 'text-amber-400'}`}>
                {activeApiKey ? 'Gemini 2.5 Live (Universal)' : 'Generic AI Engine'}
              </span>
              <Key className="w-3.5 h-3.5 text-indigo-400 ml-1" />
            </button>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex items-center bg-[#111625] p-1.5 rounded-xl border border-[#222b42] shadow-inner">
            <button
              onClick={() => setActiveView('loop')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeView === 'loop'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Diagnostic Studio
            </button>

            <button
              onClick={() => setActiveView('challenge')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeView === 'challenge'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Challenge My Thinking
            </button>

            <button
              onClick={() => setActiveView('comparison')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeView === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Differential Matrix
            </button>

            <button
              onClick={() => setActiveView('teacher')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeView === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Educator Analytics
            </button>
          </div>
        </div>
      </header>

      {/* API KEY CONFIGURATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="studio-card max-w-md w-full p-6 rounded-2xl bg-[#111625] border border-indigo-500/40 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Live Intelligence Mode</h3>
                <p className="text-xs text-slate-400 font-mono">Gemini 2.5 Flash API Key Setup</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              MindTrace works dynamically on <strong>ANY arbitrary topic, question, decision, or code</strong> in real-time when a Gemini API key is provided. Without a key, it executes structural generic reasoning fallbacks.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-400 uppercase font-semibold">
                  Google Gemini API Key (VITE_GEMINI_API_KEY)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-[#0d111d] border border-[#222b42] rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setApiKeyInput('');
                    setApiKey('');
                    setActiveApiKey('');
                    setShowKeyModal(false);
                  }}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Use Generic Engine
                </button>

                <button
                  type="submit"
                  className="btn-cyber-primary px-6 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Key & Enable Live Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4-STAGE INVESTIGATION CONTROLLER PROGRESS BAR */}
      {activeView === 'loop' && (
        <div className="bg-[#0b0f19]/95 border-b border-[#222b42] px-6 py-3 sticky top-[65px] z-40 backdrop-blur-xl w-full" aria-live="polite" aria-atomic="true">
          <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between text-xs font-mono">
            {[
              { id: 'OBSERVE', label: 'STAGE 1: OBSERVE', num: 1 },
              { id: 'INVESTIGATE', label: 'STAGE 2: INVESTIGATE', num: 2 },
              { id: 'UPDATE', label: 'STAGE 3: UPDATE', num: 3 },
              { id: 'VERIFY', label: 'STAGE 4: VERIFY', num: 4 },
            ].map((stg, idx) => {
              const stageOrder: InvestigationStage[] = ['OBSERVE', 'INVESTIGATE', 'UPDATE', 'VERIFY'];
              const currentIdx = stageOrder.indexOf(stage);
              const isCurrent = stage === stg.id;
              const isPast = currentIdx > idx;
              return (
                <div key={stg.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!isPast && !isCurrent}
                    onClick={() => {
                      if (isPast) setStage(stg.id as InvestigationStage);
                    }}
                    aria-label={`Navigate to ${stg.label}`}
                    className={`flex items-center gap-2 transition ${
                      isPast ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      isCurrent
                        ? 'text-indigo-400 font-bold scale-105'
                        : isPast
                        ? 'text-emerald-400 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-[#111625] border border-[#222b42] text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : stg.num}
                    </div>
                    <span className="hidden md:inline">{stg.label}</span>
                  </button>
                  {idx < 3 && <ChevronRight className="w-4 h-4 text-slate-600 hidden xl:block" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <main className="w-full max-w-[1700px] mx-auto px-6 pt-8">
        {activeView === 'challenge' && (
          <ChallengeMyThinking
            onReturnToLoop={handleResetLoop}
            onSendToInvestigation={handleSendChallengeToInvestigation}
          />
        )}

        {activeView === 'comparison' && (
          <SameOutcomeComparison onReturnToLoop={handleResetLoop} />
        )}

        {activeView === 'teacher' && (
          <TeacherDashboard onReturnToLoop={handleResetLoop} />
        )}

        {activeView === 'loop' && (
          <>
            {stage === 'OBSERVE' && (
              <ProblemInput
                onSubmit={handleProblemSubmit}
                onSelectPerspective={handlePerspectiveSelect}
                isLoading={isLoading}
              />
            )}

            {stage === 'INVESTIGATE' && investigateSubStep === 1 && diagnosisData && (
              <DiagnosisCard
                diagnosis={diagnosisData}
                onProceed={() => setInvestigateSubStep(2)}
              />
            )}

            {stage === 'INVESTIGATE' && investigateSubStep === 2 && (
              <DiagnosticQuestionCard
                questionText={
                  controller.currentProbe?.probeStatement ||
                  diagnosisData?.diagnosticProbe?.probeStatement ||
                  'Consider a related scenario to test your mental model.'
                }
                probeModality={controller.currentProbe?.modality || diagnosisData?.diagnosticProbe?.modality || 'scenario'}
                expectedInfoGain={controller.currentProbe?.expectedInformationGain || diagnosisData?.diagnosticProbe?.expectedInformationGain}
                isInsufficientEvidence={diagnosisData?.isInsufficientEvidence}
                probeIndex={controller.probeCycle}
                totalProbes={controller.maxProbes}
                onSubmitResponse={handleDiagnosticProbeSubmit}
                isLoading={isLoading}
              />
            )}

            {stage === 'UPDATE' && remediationData && diagnosisData && (
              <RemediationCard
                diagnosis={diagnosisData}
                remediation={remediationData}
                onProceedToTransfer={() => {
                  setStage('VERIFY');
                  setVerifySubStep(1);
                }}
              />
            )}

            {stage === 'VERIFY' && verifySubStep === 1 && (
              <TransferCard
                transferProblemText={
                  remediationData?.transferProblem ||
                  'In a completely different system context where an equilibrium point is reached, does the governing system law stop acting or maintain dynamic balance?'
                }
                onVerifyTransfer={handleTransferSubmit}
                isLoading={isLoading}
              />
            )}

            {stage === 'VERIFY' && verifySubStep === 2 && transferData && (
              <SummaryCard
                diagnosis={diagnosisData}
                remediation={remediationData}
                transferResult={transferData}
                onRestart={handleResetLoop}
                onSwitchToComparison={() => setActiveView('comparison')}
                onSwitchToTeacher={() => setActiveView('teacher')}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER NARRATIVE BRANDING */}
      <footer className="mt-20 border-t border-[#222b42] py-8 text-center text-xs font-mono text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-4 text-slate-300 font-bold uppercase tracking-widest text-[11px]">
          <span>THE SUBJECT CAN CHANGE</span> • <span>THE QUESTION CAN CHANGE</span> • <span>THE DOMAIN CAN CHANGE</span>
        </div>
        <p className="text-indigo-400 font-bold text-sm">
          THE REASONING ENGINE REMAINS.
        </p>
        <p className="text-slate-500 text-[10px]">
          MindTrace Universal Bayesian Reasoning Engine
        </p>
      </footer>
    </div>
  );
}

export default App;
