import { describe, it, expect } from 'vitest';
import {
  saveSession,
  getSessions,
  normalizeToCanonicalPattern,
  detectCrossDomainPatterns,
  type StoredSession,
} from '../sessionStore';

describe('sessionStore & Canonical Pattern Normalization', () => {
  it('normalizes diverse domain descriptions into canonical reasoning patterns', () => {
    expect(normalizeToCanonicalPattern('Ignores friction and drag constraints in system').pattern).toBe('Constraint-insensitive generalization');
    expect(normalizeToCanonicalPattern('Confuses velocity with acceleration rate of change').pattern).toBe('Derivative / Level Confusion');
    expect(normalizeToCanonicalPattern('Assumes demand curve shifts in reverse direction').pattern).toBe('Directional / Causal Inversion');
    expect(normalizeToCanonicalPattern('Treats sample correlation as universal system cause').pattern).toBe('Categorical Scope Overreach');
    expect(normalizeToCanonicalPattern('Assumes steady state implies no forces acting').pattern).toBe('Static State Assumption');
  });

  it('saves and retrieves sessions from stored sessions', () => {
    const mockSession: StoredSession = {
      id: 'session-test-1',
      timestamp: new Date().toISOString(),
      studentName: 'Alex Chen',
      domain: 'Computer Science',
      concept: 'Hash Table collisions',
      situationType: 'CS Algorithm Analysis',
      reasoningClassification: 'MISCONCEPTION',
      problemStatement: 'Lookups are O(N)',
      userAnswer: 'Lookups are O(N)',
      userReasoning: 'Because hash collisions scan linear arrays.',
      mentalModelDescription: 'Confuses worst-case bucket collision with average time complexity.',
      implicitAssumptions: ['Hash index does not jump directly'],
      competingHypotheses: [
        {
          id: 'H1',
          name: 'Constraint-insensitive generalization',
          description: 'Applies worst-case collision bound across all lookup scenarios.',
          confidence: 0.75,
          evidence: ['O(N) claim'],
          status: 'active',
        },
      ],
      skepticReview: {
        skepticQuestion: 'What if collision rate is zero?',
        couldBeWrongReason: 'User assumes bad hash function.',
        disprovingEvidenceNeeded: 'Direct bucket index jump acknowledged.',
        isAmbiguous: false,
      },
      diagnosticProbe: {
        modality: 'scenario',
        expectedInformationGain: 'High',
        probeStatement: 'What happens with 100 buckets and 10 items?',
        targetHypothesisId: 'H1',
      },
      probeLog: [],
      priorConfidence: 0.75,
      posteriorConfidence: 0.90,
      targetedIntervention: 'Direct hash index indexing provides O(1) average access time.',
      transferProblem: 'How does array index direct access compare to hash bucket lookups?',
      transferDomain: 'Data Structures',
      status: 'transferred',
    };

    saveSession(mockSession);
    const sessions = getSessions();
    expect(sessions.length).toBeGreaterThanOrEqual(1);
    expect(sessions.some(s => s.id === 'session-test-1')).toBe(true);
  });

  it('detects cross-domain patterns across distinct academic domains', () => {
    const s1: StoredSession = {
      id: 's-cs-1',
      timestamp: new Date().toISOString(),
      studentName: 'Student A',
      domain: 'Computer Science',
      concept: 'Memory Pointers',
      situationType: 'CS Architecture',
      reasoningClassification: 'MISCONCEPTION',
      problemStatement: 'Variables overwrite original memory',
      userAnswer: 'Variables overwrite original memory',
      userReasoning: 'Pointer dereference replaces stack value.',
      mentalModelDescription: 'Ignores pointer boundary constraint',
      implicitAssumptions: ['Pointers mutate original variable directly'],
      competingHypotheses: [
        {
          id: 'H1',
          name: 'Constraint-insensitive generalization',
          description: 'Ignores boundaries across system pointers.',
          confidence: 0.80,
          evidence: ['Pointer overwrite'],
          status: 'active',
        },
      ],
      skepticReview: {
        skepticQuestion: 'Does dereferencing change original value?',
        couldBeWrongReason: 'Pass-by-value confusion.',
        disprovingEvidenceNeeded: 'Memory address separation.',
        isAmbiguous: false,
      },
      diagnosticProbe: {
        modality: 'question',
        expectedInformationGain: 'High',
        probeStatement: 'Does p point to x or copy x?',
        targetHypothesisId: 'H1',
      },
      probeLog: [],
      priorConfidence: 0.80,
      posteriorConfidence: 0.92,
      targetedIntervention: 'Pointers store memory addresses without mutating value representations.',
      transferProblem: 'Reference vs value passing in functions',
      transferDomain: 'Programming Languages',
      status: 'transferred',
    };

    const s2: StoredSession = {
      id: 's-econ-1',
      timestamp: new Date().toISOString(),
      studentName: 'Student B',
      domain: 'Economics',
      concept: 'Price Elasticity',
      situationType: 'Macroeconomic Shift',
      reasoningClassification: 'MISCONCEPTION',
      problemStatement: 'Price increase always increases total revenue',
      userAnswer: 'Price increase always increases total revenue',
      userReasoning: 'Revenue equals price times quantity.',
      mentalModelDescription: 'Ignores demand elasticity constraint',
      implicitAssumptions: ['Demand is completely price inelastic'],
      competingHypotheses: [
        {
          id: 'H1',
          name: 'Constraint-insensitive generalization',
          description: 'Ignores price elasticity boundaries.',
          confidence: 0.85,
          evidence: ['Linear price claim'],
          status: 'active',
        },
      ],
      skepticReview: {
        skepticQuestion: 'What if demand is highly elastic?',
        couldBeWrongReason: 'Assumes inelastic goods.',
        disprovingEvidenceNeeded: 'Quantity reduction impact.',
        isAmbiguous: false,
      },
      diagnosticProbe: {
        modality: 'scenario',
        expectedInformationGain: 'High',
        probeStatement: 'If price doubles and sales drop to zero, what is revenue?',
        targetHypothesisId: 'H1',
      },
      probeLog: [],
      priorConfidence: 0.85,
      posteriorConfidence: 0.95,
      targetedIntervention: 'Price increases reduce total revenue when demand is price elastic.',
      transferProblem: 'Tax incidence on elastic vs inelastic luxury goods.',
      transferDomain: 'Public Policy Economics',
      status: 'transferred',
    };

    saveSession(s1);
    saveSession(s2);

    const patterns = detectCrossDomainPatterns();
    expect(patterns).toBeDefined();
    expect(patterns.length).toBeGreaterThanOrEqual(1);
  });
});
