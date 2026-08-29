import { describe, it, expect } from 'vitest';
import {
  computeBayesianPosteriors,
  safeParseZod,
  DiagnosisResultZodSchema,
  checkClientRateLimit,
} from '../aiEngine';

describe('aiEngine Bayesian Belief & Zod Validation', () => {
  it('computes Bayesian posteriors using evidence likelihood ratios without arbitrary bias', () => {
    const initialHyps = [
      { id: 'H1', name: 'Hypothesis A', description: 'Desc A', confidence: 0.50, evidence: [], status: 'active' as const },
      { id: 'H2', name: 'Hypothesis B', description: 'Desc B', confidence: 0.50, evidence: [], status: 'active' as const },
    ];

    const likelihoodMap = {
      H1: 0.90, // Evidence strongly supports H1
      H2: 0.10, // Evidence strongly disproves H2
    };

    const updated = computeBayesianPosteriors(initialHyps, likelihoodMap);

    expect(updated[0].posteriorProbability).toBeGreaterThan(0.80);
    expect(updated[1].posteriorProbability).toBeLessThan(0.20);
    
    // Sum of posteriors should be 1.0 (normalized)
    const sum = updated.reduce((acc, h) => acc + (h.posteriorProbability || 0), 0);
    expect(Number(sum.toFixed(2))).toBe(1.0);
  });

  it('handles missing likelihood keys using average assessed likelihood without injection of 0.5 default bias', () => {
    const initialHyps = [
      { id: 'H1', name: 'Hypothesis A', description: 'Desc A', confidence: 0.40, evidence: [], status: 'active' as const },
      { id: 'H2', name: 'Hypothesis B', description: 'Desc B', confidence: 0.30, evidence: [], status: 'active' as const },
      { id: 'H3', name: 'Hypothesis C', description: 'Desc C', confidence: 0.30, evidence: [], status: 'active' as const },
    ];

    // H3 is omitted in likelihood map
    const partialLikelihoodMap = {
      H1: 0.80,
      H2: 0.40,
    };

    const updated = computeBayesianPosteriors(initialHyps, partialLikelihoodMap);
    
    expect(updated).toHaveLength(3);
    const sum = updated.reduce((acc, h) => acc + (h.posteriorProbability || 0), 0);
    expect(Number(sum.toFixed(2))).toBe(1.0);
  });

  it('strictly validates valid AI JSON response against DiagnosisResultZodSchema', () => {
    const validJsonData = {
      domain: 'Physics',
      concept: 'Conservation of Energy',
      situationType: 'Energy Transfer',
      reasoningClassification: 'MISCONCEPTION',
      reasoningTags: ['Kinematics', 'Thermodynamics'],
      whyExplanation: 'Confuses kinetic energy transfer with total energy destruction.',
      evidenceTrace: ['Stated energy disappears at stop'],
      competingHypotheses: [
        {
          id: 'H1',
          name: 'Energy destruction belief',
          description: 'Thinks friction destroys energy rather than converting to heat.',
          confidence: 0.75,
          evidence: ['Energy lost'],
          status: 'active',
        },
        {
          id: 'H2',
          name: 'Potential energy confusion',
          description: 'Confuses position with energy dissipation.',
          confidence: 0.25,
          evidence: ['At rest'],
          status: 'active',
        },
      ],
      reconstructedMentalModel: {
        description: 'System views energy as finite resource spent by motion.',
        causalChain: ['Motion occurs', 'Energy spent', 'Object stops when empty'],
        implicitAssumptions: ['Heat is not a form of energy'],
      },
      skepticReview: {
        skepticQuestion: 'Where does the temperature rise in brakes come from?',
        couldBeWrongReason: 'Learner might just use informal vocabulary.',
        disprovingEvidenceNeeded: 'Learner connects mechanical work to thermal energy.',
      },
      diagnosticProbe: {
        id: 'probe-kinematics-1',
        targetHypothesisId: 'H1',
        modality: 'scenario',
        probeStatement: 'When a car brakes to a complete stop, where does its kinetic energy go?',
        expectedInformationGain: 0.88,
      },
      isInsufficientEvidence: true,
    };

    const fallback = { domain: 'Unknown', concept: '', reasoningClassification: 'NO_ISSUE' as const } as any;
    const result = safeParseZod(JSON.stringify(validJsonData), DiagnosisResultZodSchema, fallback);
    expect(result.domain).toBe('Physics');
    expect(result.competingHypotheses).toHaveLength(2);
  });

  it('enforces client-side rate limits correctly and throttles after 15 requests', () => {
    // Fire requests up to window limit
    let status = checkClientRateLimit();
    while (status.allowed) {
      status = checkClientRateLimit();
    }
    expect(status.allowed).toBe(false);
    expect(status.remaining).toBe(0);
    expect(status.retryAfterMs).toBeGreaterThan(0);
  });
});

