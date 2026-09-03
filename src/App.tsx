import { useState } from 'react';
import { SidebarNav } from './components/SidebarNav';
import type { MindTraceViewType } from './components/SidebarNav';
import { RightMasteryPanel } from './components/RightMasteryPanel';
import { DashboardView } from './components/DashboardView';
import { OnboardingModal } from './components/OnboardingModal';
import { AITutorChatView } from './components/AITutorChatView';
import { LearningRoadmapView } from './components/LearningRoadmapView';
import { CodeChallengeView } from './components/CodeChallengeView';
import { FocusMusicStudio } from './components/FocusMusicStudio';
import { GraphingCalculator } from './components/GraphingCalculator';
import { SocraticVoiceCoach } from './components/SocraticVoiceCoach';
import { SimulationSandboxView } from './components/SimulationSandboxView';
import { CausalMindMapStudio } from './components/CausalMindMapStudio';
import { CounterfactualForkEngine } from './components/CounterfactualForkEngine';

// Core MindTrace Diagnostic Components
import { ProblemInput as DiagnosticInputCard } from './components/CoreLoop/ProblemInput';
import { DiagnosticQuestionCard } from './components/CoreLoop/DiagnosticQuestionCard';
import { SummaryCard as RemediatedSynthesisCard } from './components/CoreLoop/SummaryCard';

// Matrix & Analytics Components
import { SameOutcomeComparison as DifferentialMatrix } from './components/SameOutcomeComparison';
import { ChallengeMyThinking } from './components/ChallengeMyThinking';

// Controllers & Services
import { InvestigationController } from './services/investigationController';
import { diagnoseAndProbe, updateAndRemediate } from './services/aiEngine';
import type { DiagnosisResult, RemediationResult, TransferResult } from './services/aiEngine';

export function App() {
  const [activeView, setActiveView] = useState<MindTraceViewType>('tutor');
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  // MindTrace Bayesian Diagnostic Engine State
  const [controller] = useState(() => new InvestigationController());
  const [stage, setStage] = useState<'OBSERVE' | 'INVESTIGATE' | 'UPDATE' | 'VERIFY'>('OBSERVE');
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisResult | null>(null);
  const [remediationData, setRemediationData] = useState<RemediationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleProblemSubmit = async (
    problem: string,
    answer: string,
    reasoning: string,
    subjectHint?: string,
    isSeed?: boolean
  ) => {
    setIsLoading(true);
    try {
      const res = await diagnoseAndProbe(problem, answer, reasoning, subjectHint, isSeed);
      setDiagnosisData(res);
      controller.startInvestigation(res);
      setStage('INVESTIGATE');
    } catch (err) {
      console.error('Call 1 error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProbeSubmit = async (answer: string, reasoning: string) => {
    if (!diagnosisData) return;
    setIsLoading(true);
    try {
      const probeQuestion = diagnosisData.diagnosticProbe.probeStatement || 'Diagnostic probe';
      const priorConf = diagnosisData.competingHypotheses[0]?.confidence || 0.7;
      const rem = await updateAndRemediate(
        probeQuestion,
        answer,
        reasoning,
        priorConf,
        diagnosisData.competingHypotheses
      );
      setRemediationData(rem);
      setStage('UPDATE');
    } catch (err) {
      console.error('Call 2 error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDiagnostic = () => {
    setStage('OBSERVE');
    setDiagnosisData(null);
    setRemediationData(null);
  };

  const dummyTransferResult: TransferResult = {
    resolved: true,
    transferLevel: 'TRANSFER_DEMONSTRATED',
    finalMastery: 92,
    transferScore: 92,
    feedback: 'Your mental model has been successfully updated and verified through Socratic inquiry!',
    beforeSummary: {
      mastery: 35,
      misconceptionConfidence: 75,
      status: 'Initial Misconception Diagnosed',
    },
    afterSummary: {
      mastery: 92,
      misconceptionConfidence: 8,
      status: 'Mastery Verified',
    },
    crossDomainPattern: 'Universal Constraint & System Invariant Transfer',
    engineStatus: 'live',
  };

  // Dynamic Bayesian Mastery Calculation
  const currentMastery = remediationData
    ? Math.round((remediationData.beliefUpdate?.posteriorProbability || 0.92) * 100)
    : diagnosisData
    ? Math.round((diagnosisData.competingHypotheses[0]?.confidence || 0.75) * 100)
    : 85;

  return (
    <div className="min-h-screen mindtrace-bg bg-[#0c0d12] text-[#f8fafc] flex overflow-x-hidden font-sans">
      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <SidebarNav activeView={activeView} setActiveView={setActiveView} />

      {/* 2. CENTER MAIN WORKSPACE CANVAS */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-h-screen relative">
        {/* VIEW 1: COMMAND HUB */}
        {activeView === 'home' && (
          <DashboardView
            onStartSession={(subject) => {
              handleProblemSubmit(subject, 'Initial response', 'Student prompt', subject);
              setActiveView('roadmap');
            }}
            onNavigate={setActiveView}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
            currentMastery={currentMastery}
          />
        )}

        {/* VIEW 2: AI SOCRATIC TUTOR */}
        {activeView === 'tutor' && (
          <AITutorChatView
            onOpenVoiceMode={() => setShowVoiceModal(true)}
            onSendToInvestigation={(problem, reasoning) => {
              handleProblemSubmit(problem, 'Student response on kinematics', reasoning, 'Physics');
              setActiveView('sandbox');
            }}
          />
        )}

        {/* VIEW 3: LIVE SIMULATION SANDBOX */}
        {activeView === 'sandbox' && <SimulationSandboxView />}

        {/* VIEW 4: CAUSAL MIND MAP STUDIO */}
        {activeView === 'causal' && <CausalMindMapStudio />}

        {/* VIEW 5: REALITY FORKING ENGINE */}
        {activeView === 'fork' && <CounterfactualForkEngine />}

        {/* VIEW 6: ROADMAP */}
        {activeView === 'roadmap' && (
          <LearningRoadmapView
            onStartModule={() => setActiveView('tutor')}
          />
        )}

        {/* VIEW 7: CODE CHALLENGES */}
        {activeView === 'challenges' && <CodeChallengeView />}

        {/* VIEW 8: DIAGNOSTIC ANALYSIS */}
        {activeView === 'sessions' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#232636]">
              <div>
                <h1 className="text-lg font-bold font-sans text-white">
                  Socratic Diagnostic Analysis
                </h1>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Targeted mental model diagnostic probe & Bayesian belief update
                </p>
              </div>
              <button
                onClick={handleResetDiagnostic}
                className="text-xs font-mono text-amber-500 hover:text-amber-400 cursor-pointer bg-[#141622] border border-[#232636] px-3 py-1.5 rounded-lg"
              >
                + New Analysis
              </button>
            </div>

            {stage === 'OBSERVE' && (
              <DiagnosticInputCard onSubmit={handleProblemSubmit} isLoading={isLoading} />
            )}

            {stage === 'INVESTIGATE' && diagnosisData && (
              <DiagnosticQuestionCard
                questionText={diagnosisData.diagnosticProbe.probeStatement || 'Targeted Socratic probe scenario'}
                probeModality={diagnosisData.diagnosticProbe.modality || 'question'}
                expectedInfoGain={diagnosisData.diagnosticProbe.expectedInformationGain}
                onSubmitResponse={handleProbeSubmit}
                isLoading={isLoading}
              />
            )}

            {(stage === 'UPDATE' || stage === 'VERIFY') && (
              <RemediatedSynthesisCard
                diagnosis={diagnosisData}
                remediation={remediationData}
                transferResult={dummyTransferResult}
                onRestart={handleResetDiagnostic}
              />
            )}
          </div>
        )}

        {/* VIEW 9: KNOWLEDGE GRAPH */}
        {activeView === 'knowledge' && (
          <GraphingCalculator
            onSendToDiagnosis={(eq, reason) => {
              handleProblemSubmit('Graph Function Misconception', eq, reason, 'Math');
              setActiveView('sessions');
            }}
          />
        )}

        {/* VIEW 10: QUIZZES & DIFFERENTIAL MATRIX */}
        {activeView === 'quizzes' && (
          <ChallengeMyThinking onReturnToLoop={() => setActiveView('sessions')} />
        )}
        {activeView === 'progress' && (
          <DifferentialMatrix onReturnToLoop={() => setActiveView('sessions')} />
        )}

        {/* VIEW 11: FOCUS MUSIC */}
        {activeView === 'music' && <FocusMusicStudio />}
      </main>

      {/* 3. RIGHT MASTERY TELEMETRY PANEL */}
      <RightMasteryPanel currentMastery={currentMastery} />

      {/* SOCRATIC VOICE MODE MODAL OVERLAY */}
      {showVoiceModal && (
        <SocraticVoiceCoach onClose={() => setShowVoiceModal(false)} />
      )}

      {/* ONBOARDING PROFILE MODAL */}
      {showOnboardingModal && (
        <OnboardingModal
          onComplete={(profile) => {
            console.log('Saved MindTrace Adaptive Profile:', profile);
            setShowOnboardingModal(false);
          }}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}
    </div>
  );
}

export default App;
