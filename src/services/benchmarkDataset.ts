import { type DiagnosisResult, diagnoseAndProbe } from './aiEngine';

export interface BenchmarkCase {
  id: string;
  domain: string;
  problemStatement: string;
  studentAnswer: string;
  studentReasoning: string;
  expectedReasoningClassification: 'MISCONCEPTION' | 'VALID_REASONING' | 'PROCEDURAL_ERROR' | 'UNCERTAINTY' | 'KNOWLEDGE_GAP';
  groundTruthConcept: string;
}

export interface ClassMetrics {
  className: string;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface BenchmarkReport {
  totalCases: number;
  evaluatedCases: number;
  correctClassifications: number;
  accuracyPercentage: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1Score: number;
  averageLatencyMs: number;
  classMetrics: ClassMetrics[];
  confusionMatrix: Record<string, Record<string, number>>;
  results: Array<{
    caseId: string;
    domain: string;
    expected: string;
    predicted: string;
    match: boolean;
    latencyMs: number;
  }>;
}

export const BENCHMARK_CLASSES = ['MISCONCEPTION', 'VALID_REASONING', 'PROCEDURAL_ERROR', 'UNCERTAINTY', 'KNOWLEDGE_GAP'];

export const BENCHMARK_DATASET: BenchmarkCase[] = [
  // 1-4: Physics & Kinematics
  {
    id: 'bm-phys-01',
    domain: 'Physics',
    problemStatement: 'A ball is thrown vertically upward. What is its acceleration at the highest point?',
    studentAnswer: 'Zero acceleration at the top',
    studentReasoning: 'Velocity is zero at peak, so acceleration must be zero.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Velocity-Acceleration Conflation',
  },
  {
    id: 'bm-phys-02',
    domain: 'Physics',
    problemStatement: 'A heavy bowling ball and light feather are dropped in a vacuum chamber. Which lands first?',
    studentAnswer: 'Both land at the exact same time',
    studentReasoning: 'In a vacuum, gravity accelerates all masses equally at g = 9.8 m/s² regardless of mass.',
    expectedReasoningClassification: 'VALID_REASONING',
    groundTruthConcept: 'Equivalence Principle / Universal Free Fall',
  },
  {
    id: 'bm-phys-03',
    domain: 'Physics',
    problemStatement: 'When a car rounds a sharp turn at constant speed, is it accelerating?',
    studentAnswer: 'No acceleration because speed is constant',
    studentReasoning: 'Speedometer stays at 50 mph so rate of speed change is zero.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Centripetal Directional Acceleration',
  },
  {
    id: 'bm-phys-04',
    domain: 'Physics',
    problemStatement: 'Calculate heat required to melt 5kg ice at 0°C.',
    studentAnswer: 'Q = 5 * 4.184 * 100',
    studentReasoning: 'Used temperature change formula Q=mcΔT instead of latent heat Q=mLf.',
    expectedReasoningClassification: 'PROCEDURAL_ERROR',
    groundTruthConcept: 'Latent Heat Phase Transition Formula Misapplication',
  },

  // 5-8: Computer Science & Systems
  {
    id: 'bm-cs-01',
    domain: 'Computer Science',
    problemStatement: 'Why does recursion without a base case crash with StackOverflowError?',
    studentAnswer: 'It duplicates the program binary in heap RAM',
    studentReasoning: 'Each call copies program bytecode into heap memory until physical RAM runs out.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Call Stack Allocation vs Heap Memory Boundary',
  },
  {
    id: 'bm-cs-02',
    domain: 'Computer Science',
    problemStatement: 'Does increasing threads indefinitely speed up a CPU-bound array multiplication?',
    studentAnswer: 'No, performance drops beyond thread count = CPU cores due to context switching overhead',
    studentReasoning: 'Hardware execution units are fixed; excess threads incur scheduling overhead and cache thrashing.',
    expectedReasoningClassification: 'VALID_REASONING',
    groundTruthConcept: 'Hardware Concurrency & Context Switching Limits',
  },
  {
    id: 'bm-cs-03',
    domain: 'Computer Science',
    problemStatement: 'Is quicksort always O(n log n) time complexity?',
    studentAnswer: 'Yes, quicksort is always O(n log n)',
    studentReasoning: 'Divide and conquer algorithms always take logarithmic depth.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Worst-case Pivot Selection Quadratic Complexity',
  },
  {
    id: 'bm-cs-04',
    domain: 'Computer Science',
    problemStatement: 'Implement binary search on a sorted array.',
    studentAnswer: 'mid = (low + high) / 2',
    studentReasoning: 'Off by one index range error when updating boundary low = mid instead of mid + 1.',
    expectedReasoningClassification: 'PROCEDURAL_ERROR',
    groundTruthConcept: 'Binary Search Boundary Index Update Error',
  },

  // 9-12: Economics & Markets
  {
    id: 'bm-econ-01',
    domain: 'Economics',
    problemStatement: 'If government sets a minimum price floor above market equilibrium, why does surplus emerge?',
    studentAnswer: 'Sellers lower prices to clear unsold stock',
    studentReasoning: 'Consumers buy less at high prices, forcing suppliers to discount below floor.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Price Floor Enforceability & Quantity Supplied/Demanded Divergence',
  },
  {
    id: 'bm-econ-02',
    domain: 'Economics',
    problemStatement: 'What happens to equilibrium price when demand shifts right while supply stays fixed?',
    studentAnswer: 'Equilibrium price rises as buyers compete for fixed quantity',
    studentReasoning: 'Higher demand at every price level creates shortage until price rises to balance market.',
    expectedReasoningClassification: 'VALID_REASONING',
    groundTruthConcept: 'Supply & Demand Price Discovery Equilibrium',
  },
  {
    id: 'bm-econ-03',
    domain: 'Economics',
    problemStatement: 'Does printing money always cause proportional price inflation in a depressed economy?',
    studentAnswer: 'Yes, doubling money supply always doubles prices instantly',
    studentReasoning: 'Quantity theory of money M*V = P*Y means P always moves linearly with M.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Money Velocity & Output Gap Invariance',
  },
  {
    id: 'bm-econ-04',
    domain: 'Economics',
    problemStatement: 'Calculate total revenue when price increases from $10 to $12.',
    studentAnswer: '$12 * 100 = $1200',
    studentReasoning: 'Forgot to adjust quantity demanded down according to elasticity schedule.',
    expectedReasoningClassification: 'PROCEDURAL_ERROR',
    groundTruthConcept: 'Elasticity Demand Quantity Adjustment Omission',
  },

  // 13-16: Law & Jurisprudence
  {
    id: 'bm-law-01',
    domain: 'Law',
    problemStatement: 'Is a written promise to make a future gift enforceable under contract law?',
    studentAnswer: 'Yes, because it is signed in writing',
    studentReasoning: 'Any written signed agreement creates an enforceable contract.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Contract Consideration Requirement',
  },
  {
    id: 'bm-law-02',
    domain: 'Law',
    problemStatement: 'What standard of proof is required in a criminal prosecution vs civil tort lawsuit?',
    studentAnswer: 'Beyond reasonable doubt for criminal; preponderance of evidence for civil',
    studentReasoning: 'Criminal sanctions threaten liberty requiring higher certainty, whereas civil disputes weigh probability.',
    expectedReasoningClassification: 'VALID_REASONING',
    groundTruthConcept: 'Standard of Proof Classification',
  },
  {
    id: 'bm-law-03',
    domain: 'Law',
    problemStatement: 'Can an oral agreement to purchase real estate be enforced?',
    studentAnswer: 'Yes, verbal agreements are always fully legally binding',
    studentReasoning: 'Oral agreement constitutes meeting of minds.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Statute of Frauds Real Estate Writing Requirement',
  },
  {
    id: 'bm-law-04',
    domain: 'Law',
    problemStatement: 'Apply negligence elements to a slip-and-fall scenario.',
    studentAnswer: 'Duty and breach exist, so defendant is liable',
    studentReasoning: 'Omitted causation and actual damages elements.',
    expectedReasoningClassification: 'PROCEDURAL_ERROR',
    groundTruthConcept: 'Negligence 4-Element Test Incompleteness',
  },

  // 17-20: Formal Logic & Critical Reasoning
  {
    id: 'bm-logic-01',
    domain: 'Logic',
    problemStatement: 'If it rains, the ground gets wet. The ground is wet. Did it rain?',
    studentAnswer: 'Yes, it must have rained',
    studentReasoning: 'Ground is wet, so the premise condition "it rains" must be true.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Affirming the Consequent Logical Fallacy',
  },
  {
    id: 'bm-logic-02',
    domain: 'Logic',
    problemStatement: 'If P then Q. Not Q. What can be validly inferred about P?',
    studentAnswer: 'Not P is guaranteed to be true',
    studentReasoning: 'By Modus Tollens contrapositive inference, negation of consequent implies negation of antecedent.',
    expectedReasoningClassification: 'VALID_REASONING',
    groundTruthConcept: 'Modus Tollens Valid Deductive Inference',
  },
  {
    id: 'bm-logic-03',
    domain: 'Logic',
    problemStatement: 'All birds fly. Penguins are birds. Therefore, penguins fly.',
    studentAnswer: 'Argument is valid and true',
    studentReasoning: 'Syllogism follows premise structure strictly.',
    expectedReasoningClassification: 'MISCONCEPTION',
    groundTruthConcept: 'Soundness vs Validity Premise Counter-Factuality',
  },
  {
    id: 'bm-logic-04',
    domain: 'Logic',
    problemStatement: 'I don\'t know if the statement is true or false.',
    studentAnswer: 'I have no idea',
    studentReasoning: 'Insufficient information provided.',
    expectedReasoningClassification: 'UNCERTAINTY',
    groundTruthConcept: 'Epistemic Uncertainty State',
  },
];

export async function runBenchmarkSuite(
  onProgress?: (current: number, total: number) => void
): Promise<BenchmarkReport> {
  const totalCases = BENCHMARK_DATASET.length;
  let correctClassifications = 0;
  let totalLatencyMs = 0;
  const results: BenchmarkReport['results'] = [];

  // Initialize confusion matrix: [expected][predicted]
  const confusionMatrix: Record<string, Record<string, number>> = {};
  BENCHMARK_CLASSES.forEach((exp) => {
    confusionMatrix[exp] = {};
    BENCHMARK_CLASSES.forEach((pred) => {
      confusionMatrix[exp][pred] = 0;
    });
  });

  for (let i = 0; i < totalCases; i++) {
    const testCase = BENCHMARK_DATASET[i];
    if (onProgress) onProgress(i + 1, totalCases);

    const startTime = performance.now();
    let diagnosis: DiagnosisResult;
    try {
      diagnosis = await diagnoseAndProbe(
        testCase.problemStatement,
        testCase.studentAnswer,
        testCase.studentReasoning,
        testCase.domain
      );
    } catch (e) {
      console.warn(`Benchmark case ${testCase.id} failed execution:`, e);
      continue;
    }
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    totalLatencyMs += latency;

    let predicted = (diagnosis.reasoningClassification || 'MISCONCEPTION') as string;
    if (predicted === 'NO_ISSUE') predicted = 'VALID_REASONING';

    const expected = testCase.expectedReasoningClassification;

    // Record in confusion matrix
    if (confusionMatrix[expected] && confusionMatrix[expected][predicted] !== undefined) {
      confusionMatrix[expected][predicted]++;
    }

    const match = predicted === expected;
    if (match) correctClassifications++;

    results.push({
      caseId: testCase.id,
      domain: testCase.domain,
      expected,
      predicted,
      match,
      latencyMs: latency,
    });
  }

  const evaluatedCount = results.length || 1;
  const accuracyPercentage = Math.round((correctClassifications / evaluatedCount) * 100);

  // Compute per-class True Positives (TP), False Positives (FP), False Negatives (FN)
  const classMetrics: ClassMetrics[] = BENCHMARK_CLASSES.map((cls) => {
    const tp = confusionMatrix[cls]?.[cls] || 0;
    
    let fp = 0;
    BENCHMARK_CLASSES.forEach((otherCls) => {
      if (otherCls !== cls) {
        fp += confusionMatrix[otherCls]?.[cls] || 0;
      }
    });

    let fn = 0;
    BENCHMARK_CLASSES.forEach((otherCls) => {
      if (otherCls !== cls) {
        fn += confusionMatrix[cls]?.[otherCls] || 0;
      }
    });

    const precision = tp + fp > 0 ? Number((tp / (tp + fp)).toFixed(2)) : 0.0;
    const recall = tp + fn > 0 ? Number((tp / (tp + fn)).toFixed(2)) : 0.0;
    const f1 = precision + recall > 0 ? Number(((2 * precision * recall) / (precision + recall)).toFixed(2)) : 0.0;

    return {
      className: cls,
      truePositives: tp,
      falsePositives: fp,
      falseNegatives: fn,
      precision,
      recall,
      f1,
    };
  });

  // Calculate Macro Metrics (Macro F1 = unweighted mean of per-class F1 scores)
  const sumPrecision = classMetrics.reduce((acc, m) => acc + m.precision, 0);
  const sumRecall = classMetrics.reduce((acc, m) => acc + m.recall, 0);
  const macroPrecision = Number((sumPrecision / BENCHMARK_CLASSES.length).toFixed(2));
  const macroRecall = Number((sumRecall / BENCHMARK_CLASSES.length).toFixed(2));
  const macroF1Score = Number((classMetrics.reduce((acc, m) => acc + m.f1, 0) / BENCHMARK_CLASSES.length).toFixed(2));
  const averageLatencyMs = Math.round(totalLatencyMs / evaluatedCount);

  return {
    totalCases,
    evaluatedCases: evaluatedCount,
    correctClassifications,
    accuracyPercentage,
    macroPrecision,
    macroRecall,
    macroF1Score,
    averageLatencyMs,
    classMetrics,
    confusionMatrix,
    results,
  };
}
