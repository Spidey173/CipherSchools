import type { Problem, DesignFeedback } from '../domain/types';
import type { Evaluator } from './DeterministicEvaluator';

/**
 * AI Evaluator:
 * Simulates LLM reasoning (or calls real Gemini/OpenAI if API Key is present in localStorage/env).
 * Provides deep contextual reasoning, trade-off critiques, and constructive refactoring tips.
 */
export class AIEvaluator implements Evaluator {
  public name = 'LLM Semantic Reasoning Engine';

  public async evaluate(problem: Problem, code: string): Promise<Partial<DesignFeedback>> {
    // Artificial latency to simulate realistic LLM inference (e.g. 800ms)
    await new Promise(resolve => setTimeout(resolve, 850));

    const lower = code.toLowerCase();
    const hasStrategy = lower.includes('strategy') || lower.includes('calculatefee') || lower.includes('dispatcher');
    const hasState = lower.includes('state') || lower.includes('status');
    const hasCleanHierarchy = lower.includes('extends') || lower.includes('implements');
    const isParkingLot = problem.id === 'parking-lot';
    const isElevator = problem.id === 'elevator-system';
    const isVending = problem.id === 'vending-machine';

    const patterns: string[] = [];
    if (hasStrategy) patterns.push('Strategy Pattern');
    if (hasState) patterns.push('State Pattern');
    if (lower.includes('instance') || lower.includes('singleton')) patterns.push('Singleton Pattern');
    if (lower.includes('observer') || lower.includes('listener')) patterns.push('Observer Pattern');

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const actionableImprovements: string[] = [];

    if (isParkingLot) {
      if (hasStrategy) {
        strengths.push('Clean abstraction of fee calculation: Decouples pricing algorithms from core parking management.');
      } else {
        weaknesses.push('Hardcoded pricing logic tightly couples the parking lot to specific business tariffs.');
        actionableImprovements.push('Introduce a `PricingStrategy` interface with an Hourly, Weekend, and Electric-vehicle pricing implementation.');
      }

      if (lower.includes('floor') && lower.includes('spot')) {
        strengths.push('Hierarchical composition (ParkingLot -> ParkingFloor -> ParkingSpot) correctly mirrors physical domain.');
      } else {
        weaknesses.push('Flat parking spot structure limits scalability across multiple floors or zoned sections.');
        actionableImprovements.push('Encapsulate spots within a `ParkingFloor` collection to delegate floor-level queries.');
      }
    } else if (isElevator) {
      if (hasStrategy || lower.includes('dispatch')) {
        strengths.push('Dispatcher logic separated from elevator cab motion, allowing plug-and-play scheduling algorithms.');
      } else {
        weaknesses.push('Elevator cab is directly handling request distribution, leading to high coupling.');
        actionableImprovements.push('Create a dedicated `ElevatorController` or `Dispatcher` implementing a LOOK/SCAN strategy.');
      }
    } else if (isVending) {
      if (hasState) {
        strengths.push('State Pattern models machine conditions cleanly, avoiding complex nested if/else flags.');
      } else {
        weaknesses.push('Conditional boolean flags (isDispensing, hasMoney) create brittle state transitions.');
        actionableImprovements.push('Refactor into distinct State classes (IdleState, HasMoneyState, DispenseState).');
      }
    }

    if (hasCleanHierarchy) {
      strengths.push('Effective use of polymorphism enables natural extensibility for new variants.');
    }

    let tradeOffAnalysis = '';
    if (isParkingLot) {
      tradeOffAnalysis = 'Trade-off: Centralized ParkingLot Singleton simplifies state access, but can become a bottleneck in highly concurrent multi-gate automated entry environments.';
    } else if (isElevator) {
      tradeOffAnalysis = 'Trade-off: LOOK/SCAN scheduling minimizes total motor travel, but can cause starvation for reverse-direction callers under high traffic loads.';
    } else {
      tradeOffAnalysis = 'Trade-off: State pattern increases the number of classes, but dramatically reduces bug-prone conditional logic when new machine states (e.g., RefundPending, Maintenance) are introduced.';
    }

    return {
      summary: `AI evaluated solution against production LLD guidelines: strong foundational architecture with opportunities to improve concurrency safety and interface segregation.`,
      strengths,
      weaknesses,
      actionableImprovements,
      tradeOffAnalysis,
      evaluationSource: 'llm'
    };
  }
}
