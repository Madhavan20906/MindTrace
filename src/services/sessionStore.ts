export interface CompetingHypothesis {
  id: string;
  name: string;
  description: string;
  confidence: number;
  posteriorProbability?: number;
  evidence: string[];
  status: 'active' | 'confirmed' | 'weakened' | 'disproven';
}

export interface SkepticReview {
  skepticQuestion: string;
  couldBeWrongReason: string;
  disprovingEvidenceNeeded: string;
  isAmbiguous: boolean;
}

export interface DiagnosticProbe {
  modality:
    | 'question'
    | 'counterexample'
    | 'prediction'
    | 'scenario'
    | 'code_test'
    | 'comparison'
    | 'thought_experiment'
    | 'simulation'
    | 'decision';
  expectedInformationGain: string;
  probeStatement: string;
  targetHypothesisId: string;
}

export interface ProbeResponseLog {
  probeStatement: string;
  userAnswer: string;
  userReasoning: string;
  likelihoodGivenH1: number;
  likelihoodGivenH2: number;
  updatedPosterior: number;
}

export interface StoredSession {
  id: string;
  timestamp: string;
  studentName: string;
  domain: string;
  concept: string;
  situationType: string;
  reasoningClassification: 'VALID_REASONING' | 'MISCONCEPTION' | 'PROCEDURAL_ERROR' | 'UNCERTAINTY' | 'KNOWLEDGE_GAP' | 'NO_ISSUE';
  problemStatement: string;
  userAnswer: string;
  userReasoning: string;
  mentalModelDescription: string;
  implicitAssumptions: string[];
  competingHypotheses: CompetingHypothesis[];
  skepticReview: SkepticReview;
  diagnosticProbe: DiagnosticProbe;
  probeLog: ProbeResponseLog[];
  priorConfidence: number;
  posteriorConfidence: number;
  targetedIntervention?: string;
  transferProblem?: string;
  transferDomain?: string;
  status: 'transferred' | 'resolved' | 'investigating' | 'valid';
  isFallback?: boolean;
}

export type CanonicalPatternType =
  | 'Constraint-insensitive generalization'
  | 'Derivative / Level Confusion'
  | 'Directional / Causal Inversion'
  | 'Categorical Scope Overreach'
  | 'Static State Assumption';

export interface CrossDomainPatternMatch {
  patternName: string;
  occurrencesCount: number;
  domainsInvolved: string[];
  sessionsInvolved: string[];
  description: string;
}

const STORAGE_KEY = 'MINDTRACE_PERSISTENT_SESSIONS_V2';

export function normalizeToCanonicalPattern(
  hypName: string = '',
  mentalModelDesc: string = '',
  situationType: string = ''
): { pattern: CanonicalPatternType; description: string } {
  const text = (hypName + ' ' + mentalModelDesc + ' ' + situationType).toLowerCase();

  if (
    text.includes('direction') ||
    text.includes('directional') ||
    text.includes('reverse') ||
    text.includes('inverse') ||
    text.includes('inversion') ||
    text.includes('causal') ||
    text.includes('consequent')
  ) {
    return {
      pattern: 'Directional / Causal Inversion',
      description: 'Infers antecedent presence directly from consequent observation (P -> Q confused with Q -> P).',
    };
  }

  if (text.includes('peak') || text.includes('acceleration') || text.includes('derivative') || text.includes('velocity') || text.includes('rate')) {
    return {
      pattern: 'Derivative / Level Confusion',
      description: 'Conflates instantaneous value (level) with rate of change (derivative) at boundary conditions.',
    };
  }

  if (
    text.includes('stack') ||
    text.includes('heap') ||
    text.includes('memory') ||
    text.includes('scope') ||
    text.includes('floor') ||
    text.includes('rule') ||
    text.includes('constraint') ||
    text.includes('overgeneraliz') ||
    text.includes('generalization')
  ) {
    return {
      pattern: 'Constraint-insensitive generalization',
      description: 'Applies local rules or assumptions beyond context boundary constraints across distinct subject domains.',
    };
  }

  if (text.includes('correlation') || text.includes('scope') || text.includes('universal') || text.includes('overreach')) {
    return {
      pattern: 'Categorical Scope Overreach',
      description: 'Treats contextual domain observation as universal structural rule.',
    };
  }

  if (text.includes('static') || text.includes('balance') || text.includes('steady state') || text.includes('stop')) {
    return {
      pattern: 'Static State Assumption',
      description: 'Assumes dynamic system forces cease acting once macro equilibrium state is reached.',
    };
  }

  return {
    pattern: 'Constraint-insensitive generalization',
    description: 'Applies local rules beyond context boundary constraints across distinct subject domains.',
  };
}

const INITIAL_SAMPLE_SESSIONS: StoredSession[] = [
  {
    id: 'session-cs-001',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    studentName: 'Blake T.',
    domain: 'Computer Science',
    concept: 'Call Stack Allocation vs Heap Memory',
    situationType: 'Constraint-insensitive generalization',
    reasoningClassification: 'MISCONCEPTION',
    problemStatement: 'Why does recursion without a base case crash with StackOverflowError?',
    userAnswer: 'It consumes all RAM memory immediately',
    userReasoning: 'Every recursive call creates a new copy of the entire program in heap memory until physical system memory runs out.',
    mentalModelDescription: 'Assumes general memory allocation rules apply without recognizing stack frame quota constraints.',
    implicitAssumptions: ['Functions copy their entire bytecode on each call', 'Stack and heap share identical allocation behaviors'],
    competingHypotheses: [
      {
        id: 'H1',
        name: 'Constraint-insensitive generalization',
        description: 'Overgeneralizes heap memory growth to thread stack frame boundaries.',
        confidence: 0.80,
        posteriorProbability: 0.96,
        evidence: ['Mentioned "entire program in heap memory"', 'Blamed physical RAM exhaustion rather than stack segment limits'],
        status: 'confirmed',
      },
      {
        id: 'H2',
        name: 'Infinite Loop Equivalence',
        description: 'Believes recursive calls loop identically to infinite while loops.',
        confidence: 0.20,
        posteriorProbability: 0.04,
        evidence: ['Stated "until computer runs out"'],
        status: 'disproven',
      },
    ],
    skepticReview: {
      skepticQuestion: 'Did the learner mean execution context overhead rather than literal heap copy?',
      couldBeWrongReason: 'Learner might use "heap memory" colloquially for general system memory.',
      disprovingEvidenceNeeded: 'Ask learner where return addresses and local primitive variables are pushed.',
      isAmbiguous: false,
    },
    diagnosticProbe: {
      modality: 'code_test',
      expectedInformationGain: 'High (Tests activation stack frame pushing understanding)',
      probeStatement: 'If a function has 0 local variables and calls itself recursively, why does it still crash with StackOverflowError after ~10,000 calls?',
      targetHypothesisId: 'H1',
    },
    probeLog: [
      {
        probeStatement: 'If a function has 0 local variables and calls itself recursively, why does it still crash with StackOverflowError after ~10,000 calls?',
        userAnswer: 'Because the thread stack segment has a fixed memory size limit.',
        userReasoning: 'Return addresses are pushed onto the call stack until it exceeds the thread stack frame quota.',
        likelihoodGivenH1: 0.95,
        likelihoodGivenH2: 0.05,
        updatedPosterior: 0.96,
      },
    ],
    priorConfidence: 0.80,
    posteriorConfidence: 0.96,
    targetedIntervention: 'Each recursive call pushes an activation stack frame containing return instructions onto a thread-restricted Call Stack buffer.',
    transferProblem: 'In a deeply nested event listener, why does infinite triggering throw a stack error rather than garbage collection?',
    transferDomain: 'Software Engineering Architecture',
    status: 'transferred',
  },
  {
    id: 'session-econ-002',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    studentName: 'Blake T.',
    domain: 'Economics',
    concept: 'Price Floor Market Equilibrium Surplus',
    situationType: 'Constraint-insensitive generalization',
    reasoningClassification: 'MISCONCEPTION',
    problemStatement: 'If government sets a minimum price floor above market equilibrium, why does market surplus emerge?',
    userAnswer: 'Sellers lower prices below floor to clear unsold inventory',
    userReasoning: 'Consumers buy less at high prices, forcing suppliers to discount below floor to attract buyers.',
    mentalModelDescription: 'Assumes free market discounting rules apply under legally enforced price floor constraints.',
    implicitAssumptions: ['Price floor is advisory rather than legally binding', 'Sellers can unilaterally undercut legal minimums'],
    competingHypotheses: [
      {
        id: 'H1',
        name: 'Constraint-insensitive generalization',
        description: 'Overgeneralizes free-market price flexibility to legally constrained price floors.',
        confidence: 0.75,
        posteriorProbability: 0.92,
        evidence: ['Stated "sellers lower prices below floor"'],
        status: 'confirmed',
      },
      {
        id: 'H2',
        name: 'Demand Elasticity Miscalculation',
        description: 'Believes higher price increases demand volume.',
        confidence: 0.25,
        posteriorProbability: 0.08,
        evidence: [],
        status: 'weakened',
      },
    ],
    skepticReview: {
      skepticQuestion: 'Could this mean black-market illegal discounting rather than legal market clearing?',
      couldBeWrongReason: 'Learner might be contemplating informal economic workarounds.',
      disprovingEvidenceNeeded: 'Ask whether price floor is government enforced.',
      isAmbiguous: false,
    },
    diagnosticProbe: {
      modality: 'scenario',
      expectedInformationGain: 'High (Decouples illegal market discounting from enforced price floor mechanics)',
      probeStatement: 'If government strictly penalizes selling below price floor, how do suppliers react when quantity supplied exceeds quantity demanded?',
      targetHypothesisId: 'H1',
    },
    probeLog: [
      {
        probeStatement: 'If government strictly penalizes selling below price floor, how do suppliers react when quantity supplied exceeds quantity demanded?',
        userAnswer: 'Suppliers accumulate unsold surplus inventory.',
        userReasoning: 'Because they cannot legally lower prices, excess supply remains unsold.',
        likelihoodGivenH1: 0.90,
        likelihoodGivenH2: 0.10,
        updatedPosterior: 0.92,
      },
    ],
    priorConfidence: 0.75,
    posteriorConfidence: 0.92,
    targetedIntervention: 'Legally enforced price floors prevent prices from dropping to equilibrium, creating persistent surplus.',
    transferProblem: 'If minimum wage is set above market clearing wage, what happens to labor quantity supplied vs demanded?',
    transferDomain: 'Labor Economics',
    status: 'transferred',
  },
  {
    id: 'session-physics-003',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    studentName: 'Blake T.',
    domain: 'Physics Kinematics',
    concept: 'Trajectory Apex Dynamics',
    situationType: 'Constraint-insensitive generalization',
    reasoningClassification: 'MISCONCEPTION',
    problemStatement: 'A ball is thrown vertically upward. What is its acceleration at the highest point of trajectory?',
    userAnswer: 'Acceleration is zero at the peak',
    userReasoning: 'The ball comes to a complete stop at the peak, so velocity is zero, which means acceleration must be zero too.',
    mentalModelDescription: 'Assumes zero velocity implies zero net force and zero acceleration at trajectory apex.',
    implicitAssumptions: ['Gravity stops acting when object motion pauses'],
    competingHypotheses: [
      {
        id: 'H1',
        name: 'Constraint-insensitive generalization',
        description: 'Overgeneralizes static rest conditions to dynamic trajectory turning points.',
        confidence: 0.85,
        posteriorProbability: 0.95,
        evidence: ['Stated "velocity is zero so acceleration must be zero"'],
        status: 'confirmed',
      },
      {
        id: 'H2',
        name: 'Directional Acceleration Inversion',
        description: 'Believes acceleration changes sign at apex.',
        confidence: 0.15,
        posteriorProbability: 0.05,
        evidence: [],
        status: 'weakened',
      },
    ],
    skepticReview: {
      skepticQuestion: 'Did learner confuse instantaneous zero velocity with zero force?',
      couldBeWrongReason: 'Learner might confuse velocity with acceleration.',
      disprovingEvidenceNeeded: 'Ask what force acts on the ball at the apex.',
      isAmbiguous: false,
    },
    diagnosticProbe: {
      modality: 'counterexample',
      expectedInformationGain: 'High (Isolates gravitational force from instantaneous velocity)',
      probeStatement: 'If acceleration were zero at the peak, would the ball stay floating in air forever or fall back down?',
      targetHypothesisId: 'H1',
    },
    probeLog: [],
    priorConfidence: 0.85,
    posteriorConfidence: 0.95,
    targetedIntervention: 'Gravity exerts continuous downward acceleration (9.8 m/s²) even when instantaneous vertical velocity passes through zero.',
    transferProblem: 'In a pendulum at maximum amplitude displacement, is acceleration zero or maximum?',
    transferDomain: 'Harmonic Motion Physics',
    status: 'transferred',
  },
];

let memorySessionsStore: StoredSession[] = [...INITIAL_SAMPLE_SESSIONS];

export function getStoredSessions(): StoredSession[] {
  if (typeof localStorage === 'undefined') {
    return memorySessionsStore;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SESSIONS));
      return INITIAL_SAMPLE_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_SESSIONS;
  } catch (e) {
    console.warn('Failed to parse stored sessions:', e);
    return memorySessionsStore;
  }
}

export const getSessions = getStoredSessions;

export function saveSession(session: StoredSession): void {
  try {
    const existing = getStoredSessions();
    const index = existing.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      existing[index] = session;
    } else {
      existing.unshift(session);
    }
    memorySessionsStore = existing;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function deleteSession(id: string): void {
  try {
    const existing = getStoredSessions();
    const filtered = existing.filter((s) => s.id !== id);
    memorySessionsStore = filtered;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Failed to delete session:', e);
  }
}

export function clearAllSessions(): void {
  memorySessionsStore = [];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  } catch (e) {
    console.error('Failed to clear sessions:', e);
  }
}

export const clearSessions = clearAllSessions;

export function exportClassroomJSON(): string {
  const sessions = getStoredSessions();
  return JSON.stringify({ version: '1.0', exportedAt: new Date().toISOString(), sessions }, null, 2);
}

export function importClassroomJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.sessions)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.sessions));
      return true;
    }
  } catch (e) {
    console.error('Invalid classroom JSON:', e);
  }
  return false;
}

// Longitudinal Cognitive Pattern Matcher across 2+ distinct domains using Canonical Normalization
export function detectCrossDomainPatterns(sessionsInput?: StoredSession[]): CrossDomainPatternMatch[] {
  const sessions = sessionsInput || getStoredSessions();
  const patterns: CrossDomainPatternMatch[] = [];

  const flawGroup: Record<
    string,
    {
      pattern: CanonicalPatternType;
      description: string;
      domains: Set<string>;
      concepts: string[];
      sessions: string[];
      studentNames: Set<string>;
    }
  > = {};

  sessions.forEach((session) => {
    const primaryHyp = session.competingHypotheses?.[0]?.name || session.situationType || '';
    const norm = normalizeToCanonicalPattern(
      primaryHyp,
      session.mentalModelDescription || '',
      session.situationType || ''
    );

    if (!flawGroup[norm.pattern]) {
      flawGroup[norm.pattern] = {
        pattern: norm.pattern,
        description: norm.description,
        domains: new Set(),
        concepts: [],
        sessions: [],
        studentNames: new Set(),
      };
    }

    flawGroup[norm.pattern].domains.add(session.domain);
    flawGroup[norm.pattern].concepts.push(session.concept);
    flawGroup[norm.pattern].sessions.push(session.id);
    if (session.studentName) flawGroup[norm.pattern].studentNames.add(session.studentName);
  });

  Object.values(flawGroup).forEach((data) => {
    // Only output pattern if detected across 2+ DIFFERENT domains!
    if (data.domains.size >= 2) {
      const domainList = Array.from(data.domains);
      patterns.push({
        patternName: `🧠 RECURRING CROSS-DOMAIN PATTERN: "${data.pattern}"`,
        occurrencesCount: data.sessions.length,
        domainsInvolved: domainList,
        sessionsInvolved: data.concepts,
        description: `Discovered abstract cognitive pattern "${data.pattern}" across ${domainList.join(', ')}. ${data.description}`,
      });
    }
  });

  return patterns;
}

