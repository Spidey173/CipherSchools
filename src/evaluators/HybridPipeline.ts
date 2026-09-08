import type { Problem, DesignFeedback } from '../domain/types';
import { DeterministicEvaluator } from './DeterministicEvaluator';
import { AIEvaluator } from './AIEvaluator';

/**
 * Hybrid Pipeline:
 * Coordinates deterministic AST rules + LLM semantic reasoning.
 * Resilient against timeout or failure with automatic graceful fallback.
 */
export class HybridEvaluationPipeline {
  private deterministicEvaluator: DeterministicEvaluator;
  private aiEvaluator: AIEvaluator;

  constructor() {
    this.deterministicEvaluator = new DeterministicEvaluator();
    this.aiEvaluator = new AIEvaluator();
  }

  public async evaluate(problem: Problem, code: string): Promise<DesignFeedback> {
    const startTime = performance.now();

    // 1. Run deterministic evaluation (guaranteed to succeed fast)
    const deterministicFeedback = await this.deterministicEvaluator.evaluate(problem, code);

    // If code is incomplete, return deterministic directly without running AI
    if (deterministicFeedback.verdict === 'Incomplete') {
      return {
        ...deterministicFeedback,
        latencyMs: Math.round(performance.now() - startTime),
        evaluationSource: 'deterministic'
      } as DesignFeedback;
    }

    // 2. Attempt AI evaluation with timeout protection
    let aiFeedback: Partial<DesignFeedback> = {};
    let evaluationSource: 'hybrid' | 'deterministic' = 'hybrid';

    try {
      // 4-second timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI Evaluation Timeout')), 4000)
      );

      aiFeedback = await Promise.race([
        this.aiEvaluator.evaluate(problem, code),
        timeoutPromise
      ]);
    } catch (error) {
      console.warn('AI Evaluation failed or timed out. Falling back cleanly to deterministic rules.', error);
      evaluationSource = 'deterministic';
    }

    // 3. Merge results gracefully
    const combinedStrengths = Array.from(
      new Set([...(deterministicFeedback.strengths || []), ...(aiFeedback.strengths || [])])
    );
    const combinedWeaknesses = Array.from(
      new Set([...(deterministicFeedback.weaknesses || []), ...(aiFeedback.weaknesses || [])])
    );
    const combinedImprovements = Array.from(
      new Set([...(deterministicFeedback.actionableImprovements || []), ...(aiFeedback.actionableImprovements || [])])
    );

    const mergedFeedback: DesignFeedback = {
      overallScore: deterministicFeedback.overallScore ?? 70,
      verdict: deterministicFeedback.verdict ?? 'Good',
      summary: aiFeedback.summary || deterministicFeedback.summary || 'Solution evaluation completed.',
      solidAnalysis: deterministicFeedback.solidAnalysis!,
      strengths: combinedStrengths,
      weaknesses: combinedWeaknesses,
      designPatternsDetected: deterministicFeedback.designPatternsDetected || [],
      missingEntities: deterministicFeedback.missingEntities || [],
      actionableImprovements: combinedImprovements,
      tradeOffAnalysis: aiFeedback.tradeOffAnalysis || deterministicFeedback.tradeOffAnalysis || '',
      evaluationSource,
      latencyMs: Math.round(performance.now() - startTime)
    };

    return mergedFeedback;
  }
}
