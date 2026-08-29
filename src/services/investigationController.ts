import { type DiagnosisResult, type CompetingHypothesis, type DiagnosticProbe } from './aiEngine';

export type InvestigationStage = 'OBSERVE' | 'INVESTIGATE' | 'UPDATE' | 'VERIFY';

export interface ProbeRecord {
  cycle: number;
  probeStatement: string;
  userAnswer: string;
  userReasoning: string;
  evaluatedPosterior?: number;
}

export class InvestigationController {
  public stage: InvestigationStage = 'OBSERVE';
  public probeCycle: number = 1;
  public maxProbes: number = 3; // Up to 3 adaptive probes (0-3 dynamic stopping)
  public probeHistory: ProbeRecord[] = [];
  public currentDiagnosis: DiagnosisResult | null = null;
  public currentProbe: DiagnosticProbe | null = null;
  public topPosterior: number = 0;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.stage = 'OBSERVE';
    this.probeCycle = 1;
    this.probeHistory = [];
    this.currentDiagnosis = null;
    this.currentProbe = null;
    this.topPosterior = 0;
  }

  public startInvestigation(diagnosis: DiagnosisResult): void {
    this.currentDiagnosis = diagnosis;
    this.currentProbe = diagnosis.diagnosticProbe;
    this.stage = 'INVESTIGATE';
    this.probeCycle = 1;
    this.probeHistory = [];

    const topHyp = this.getTopHypothesis(diagnosis.competingHypotheses);
    this.topPosterior = topHyp?.posteriorProbability || topHyp?.confidence || 0.70;
  }

  public recordProbeResponse(probeStatement: string, answer: string, reasoning: string, updatedPosterior?: number): void {
    const post = updatedPosterior ?? this.topPosterior;
    this.topPosterior = post;

    this.probeHistory.push({
      cycle: this.probeCycle,
      probeStatement,
      userAnswer: answer,
      userReasoning: reasoning,
      evaluatedPosterior: post,
    });
  }

  public isEvidenceSufficient(): boolean {
    if (!this.currentDiagnosis) return false;
    
    // Evidence is sufficient if top hypothesis posterior reaches >= 0.80 threshold
    if (this.topPosterior >= 0.80) {
      return true;
    }
    // Hard safety cap at maxProbes (3)
    if (this.probeCycle >= this.maxProbes) {
      return true;
    }
    return false;
  }

  public advanceProbeCycle(): boolean {
    if (this.isEvidenceSufficient()) {
      this.stage = 'UPDATE';
      return false; // No more probes needed
    }
    if (this.probeCycle < this.maxProbes) {
      this.probeCycle += 1;
      return true; // Another dynamic probe needed
    }
    this.stage = 'UPDATE';
    return false;
  }

  public setNextProbe(probe: DiagnosticProbe): void {
    this.currentProbe = probe;
    if (this.currentDiagnosis) {
      this.currentDiagnosis.diagnosticProbe = probe;
    }
  }

  public proceedToUpdate(): void {
    this.stage = 'UPDATE';
  }

  public proceedToVerify(): void {
    this.stage = 'VERIFY';
  }

  private getTopHypothesis(hypotheses: CompetingHypothesis[]): CompetingHypothesis | null {
    if (!hypotheses || hypotheses.length === 0) return null;
    return [...hypotheses].sort((a, b) => (b.posteriorProbability || b.confidence) - (a.posteriorProbability || a.confidence))[0];
  }
}

