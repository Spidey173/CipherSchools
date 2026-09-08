export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: 'functional' | 'non-functional';
  keyEntities: string[];
}

export interface Problem {
  id: string;
  title: string;
  tagline: string;
  difficulty: Difficulty;
  estimatedTimeMin: number;
  tags: string[];
  description: string;
  coreRequirements: Requirement[];
  starterCode: {
    language: string;
    code: string;
  };
  sampleSolution: {
    language: string;
    code: string;
    explanation: string;
  };
  keyDesignQuestions: string[];
  expectedClasses: string[];
}

export interface SolidScore {
  singleResponsibility: { score: number; comment: string };
  openClosed: { score: number; comment: string };
  liskovSubstitution: { score: number; comment: string };
  interfaceSegregation: { score: number; comment: string };
  dependencyInversion: { score: number; comment: string };
}

export interface DesignFeedback {
  overallScore: number; // 0-100
  verdict: 'Excellent' | 'Good' | 'Needs Improvement' | 'Incomplete';
  summary: string;
  solidAnalysis: SolidScore;
  strengths: string[];
  weaknesses: string[];
  designPatternsDetected: string[];
  missingEntities: string[];
  actionableImprovements: string[];
  tradeOffAnalysis: string;
  evaluationSource: 'deterministic' | 'llm' | 'hybrid';
  latencyMs: number;
}

export interface Attempt {
  id: string;
  problemId: string;
  problemTitle: string;
  timestamp: number;
  language: string;
  solutionCode: string;
  feedback: DesignFeedback;
}
