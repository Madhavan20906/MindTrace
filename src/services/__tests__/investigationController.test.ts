import { describe, it, expect, beforeEach } from 'vitest';
import { InvestigationController } from '../investigationController';
import type { DiagnosisResult } from '../aiEngine';

describe('InvestigationController', () => {
  let controller: InvestigationController;

  const mockDiagnosis: DiagnosisResult = {
    domain: 'Computer Science',
    concept: 'Hash Table Time Complexity',
    situationType: 'CS Algorithm Complexity',
    reasoningClassification: 'MISCONCEPTION',
    reasoningTags: ['Algorithms', 'Data Structures'],
    engineStatus: 'live',
    whyExplanation: 'Confuses worst-case O(N) collision degradation with average O(1) lookup.',
    evidenceTrace: ['User claimed hash map lookups are always O(N)'],
    competingHypotheses: [
      {
        id: 'H1',
        name: 'Worst-case / Average-case conflation',
        description: 'Assumes worst-case bucket collision is the normal performance.',
        confidence: 0.70,
        evidence: ['Claims O(N) lookup always'],
        status: 'active',
      },
      {
        id: 'H2',
        name: 'Array scan confusion',
        description: 'Thinks hash maps traverse sequentially like linked lists.',
        confidence: 0.30,
        evidence: ['Mentions array search'],
        status: 'active',
      },
    ],
    reconstructedMentalModel: {
      description: 'Model treats hash maps as sequential search containers.',
      causalChain: ['Key hash calculated', 'Scans sequentially through array'],
      implicitAssumptions: ['Hash index does not jump directly to bucket'],
    },
    skepticReview: {
      skepticQuestion: 'If collision rate is zero, what is the lookup cost?',
      couldBeWrongReason: 'User might be assuming a bad hash function.',
      disprovingEvidenceNeeded: 'User acknowledges dynamic bucket indexing.',
      isAmbiguous: false,
    },
    diagnosticProbe: {
      targetHypothesisId: 'H1',
      modality: 'scenario',
      probeStatement: 'If a hash table has 1000 items and 1000 buckets with a uniform hash, how many checks occur?',
      expectedInformationGain: '0.85',
    },
    isInsufficientEvidence: true,
  };

  beforeEach(() => {
    controller = new InvestigationController();
  });

  it('initializes in OBSERVE stage with cycle 1', () => {
    expect(controller.stage).toBe('OBSERVE');
    expect(controller.probeCycle).toBe(1);
    expect(controller.maxProbes).toBe(3);
    expect(controller.probeHistory).toHaveLength(0);
  });

  it('starts investigation and transitions to INVESTIGATE stage', () => {
    controller.startInvestigation(mockDiagnosis);
    expect(controller.stage).toBe('INVESTIGATE');
    expect(controller.currentProbe?.targetHypothesisId).toBe('H1');
  });

  it('records probe responses and tracks history', () => {
    controller.startInvestigation(mockDiagnosis);
    controller.recordProbeResponse(
      'Probe Question 1',
      'It takes 1 check',
      'Because each item gets its own bucket index directly',
      0.75
    );

    expect(controller.probeHistory).toHaveLength(1);
    expect(controller.probeHistory[0].userAnswer).toBe('It takes 1 check');
    expect(controller.probeHistory[0].evaluatedPosterior).toBe(0.75);
  });

  it('evaluates evidence sufficiency correctly (<0.80 top posterior)', () => {
    controller.startInvestigation(mockDiagnosis);
    controller.recordProbeResponse('Probe 1', 'Ans 1', 'Reason 1', 0.75);
    expect(controller.isEvidenceSufficient()).toBe(false);

    controller.recordProbeResponse('Probe 2', 'Ans 2', 'Reason 2', 0.85);
    expect(controller.isEvidenceSufficient()).toBe(true);
  });

  it('advances probe cycle up to maxProbes limit (3)', () => {
    controller.startInvestigation(mockDiagnosis);
    
    // Cycle 1 -> 2
    const canAdvance1 = controller.advanceProbeCycle();
    expect(canAdvance1).toBe(true);
    expect(controller.probeCycle).toBe(2);

    // Cycle 2 -> 3
    const canAdvance2 = controller.advanceProbeCycle();
    expect(canAdvance2).toBe(true);
    expect(controller.probeCycle).toBe(3);

    // Cycle 3 -> Exceeded limit
    const canAdvance3 = controller.advanceProbeCycle();
    expect(canAdvance3).toBe(false);
    expect(controller.probeCycle).toBe(3);
  });

  it('resets state correctly on reset()', () => {
    controller.startInvestigation(mockDiagnosis);
    controller.recordProbeResponse('Probe 1', 'Ans 1', 'Reason 1', 0.85);
    controller.reset();

    expect(controller.stage).toBe('OBSERVE');
    expect(controller.probeCycle).toBe(1);
    expect(controller.probeHistory).toHaveLength(0);
    expect(controller.currentProbe).toBeNull();
  });
});
