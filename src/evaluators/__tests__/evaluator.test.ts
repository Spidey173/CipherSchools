import { describe, it, expect } from 'vitest';
import { DeterministicEvaluator } from '../DeterministicEvaluator';
import { AIEvaluator } from '../AIEvaluator';
import { HybridEvaluationPipeline } from '../HybridPipeline';
import { PROBLEMS } from '../../domain/problems';

describe('LLD Evaluation Engine Suite', () => {
  const parkingLotProblem = PROBLEMS.find(p => p.id === 'parking-lot')!;

  describe('DeterministicEvaluator', () => {
    it('returns Incomplete verdict for empty or trivial code', async () => {
      const evaluator = new DeterministicEvaluator();
      const feedback = await evaluator.evaluate(parkingLotProblem, '   ');
      
      expect(feedback.verdict).toBe('Incomplete');
      expect(feedback.overallScore).toBeLessThan(30);
      expect(feedback.missingEntities?.length).toBeGreaterThan(0);
    });

    it('identifies classes, interfaces, and patterns in reference solution', async () => {
      const evaluator = new DeterministicEvaluator();
      const feedback = await evaluator.evaluate(parkingLotProblem, parkingLotProblem.sampleSolution.code);
      
      expect(feedback.overallScore).toBeGreaterThanOrEqual(75);
      expect(feedback.designPatternsDetected).toContain('Strategy Pattern');
      expect(feedback.designPatternsDetected).toContain('Singleton Pattern');
      expect(feedback.solidAnalysis?.openClosed.score).toBeGreaterThanOrEqual(80);
    });
  });

  describe('AIEvaluator', () => {
    it('produces contextual trade-off analysis and strengths', async () => {
      const aiEvaluator = new AIEvaluator();
      const feedback = await aiEvaluator.evaluate(parkingLotProblem, parkingLotProblem.sampleSolution.code);

      expect(feedback.evaluationSource).toBe('llm');
      expect(feedback.strengths?.length).toBeGreaterThan(0);
      expect(feedback.tradeOffAnalysis).toContain('Trade-off');
    });
  });

  describe('HybridEvaluationPipeline', () => {
    it('combines deterministic and AI insights into a unified report', async () => {
      const pipeline = new HybridEvaluationPipeline();
      const feedback = await pipeline.evaluate(parkingLotProblem, parkingLotProblem.sampleSolution.code);

      expect(feedback.evaluationSource).toBe('hybrid');
      expect(feedback.overallScore).toBeGreaterThan(70);
      expect(feedback.solidAnalysis.singleResponsibility.score).toBeGreaterThan(50);
      expect(feedback.latencyMs).toBeGreaterThan(0);
    });

    it('handles incomplete submission fast without timeout', async () => {
      const pipeline = new HybridEvaluationPipeline();
      const feedback = await pipeline.evaluate(parkingLotProblem, '// incomplete');

      expect(feedback.verdict).toBe('Incomplete');
      expect(feedback.evaluationSource).toBe('deterministic');
    });
  });
});
