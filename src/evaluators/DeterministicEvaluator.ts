import type { Problem, DesignFeedback, SolidScore } from '../domain/types';

export interface Evaluator {
  name: string;
  evaluate(problem: Problem, code: string): Promise<Partial<DesignFeedback>>;
}

/**
 * Deterministic Evaluator:
 * Inspects AST patterns, classes, interfaces, inheritance, and SOLID markers deterministically.
 * Always fast, predictable, and runs offline without API latency.
 */
export class DeterministicEvaluator implements Evaluator {
  public name = 'Deterministic Rule Engine';

  public async evaluate(problem: Problem, code: string): Promise<Partial<DesignFeedback>> {
    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length < 40) {
      return {
        overallScore: 15,
        verdict: 'Incomplete',
        summary: 'The submitted code is too brief to represent a meaningful Low-Level Design.',
        solidAnalysis: this.generateBlankSolid(),
        strengths: [],
        weaknesses: ['Submission is mostly empty or lacks concrete entities.'],
        designPatternsDetected: [],
        missingEntities: problem.expectedClasses,
        actionableImprovements: ['Define core classes representing the problem domain (e.g. ' + problem.expectedClasses.slice(0, 3).join(', ') + ').'],
        tradeOffAnalysis: 'N/A - Code incomplete.',
        evaluationSource: 'deterministic'
      };
    }

    // 1. Detect Classes and Interfaces
    const classMatches = Array.from(cleanCode.matchAll(/class\s+([A-Za-z0-9_]+)/g)).map(m => m[1]);
    const interfaceMatches = Array.from(cleanCode.matchAll(/interface\s+([A-Za-z0-9_]+)/g)).map(m => m[1]);
    const enumMatches = Array.from(cleanCode.matchAll(/enum\s+([A-Za-z0-9_]+)/g)).map(m => m[1]);

    const allDefinedEntities = new Set([...classMatches, ...interfaceMatches, ...enumMatches]);

    // 2. Missing Key Entities
    const missingEntities = problem.expectedClasses.filter(
      exp => !Array.from(allDefinedEntities).some(entity => entity.toLowerCase().includes(exp.toLowerCase()) || exp.toLowerCase().includes(entity.toLowerCase()))
    );

    // 3. Detect Design Patterns
    const patterns: string[] = [];
    if (/getInstance|private\s+static\s+instance/i.test(cleanCode)) patterns.push('Singleton Pattern');
    if (/implements\s+[A-Za-z0-9_]*Strategy|interface\s+[A-Za-z0-9_]*Strategy/i.test(cleanCode) || /PricingStrategy|DispatcherStrategy/i.test(cleanCode)) patterns.push('Strategy Pattern');
    if (/interface\s+[A-Za-z0-9_]*State|setState|MachineState|IdleState/i.test(cleanCode)) patterns.push('State Pattern');
    if (/Observer|Subscriber|Listener|notify/i.test(cleanCode)) patterns.push('Observer Pattern');
    if (/Factory|create[A-Z][a-zA-Z]+/i.test(cleanCode)) patterns.push('Factory Pattern');

    // 4. SOLID heuristics
    const hasInterfaces = interfaceMatches.length > 0;
    const hasAbstract = /abstract\s+class/i.test(cleanCode);
    const hasInheritance = /extends\s+/i.test(cleanCode);
    const hasEncapsulation = /private\s+|protected\s+|readonly\s+/i.test(cleanCode);
    const hasSingleResponsibility = classMatches.length >= 3;

    const srpScore = hasSingleResponsibility ? 85 : 50;
    const ocpScore = hasInterfaces || patterns.includes('Strategy Pattern') ? 85 : 55;
    const lspScore = hasInheritance && hasAbstract ? 85 : hasInheritance ? 75 : 65;
    const ispScore = interfaceMatches.length >= 1 ? 80 : 60;
    const dipScore = hasInterfaces ? 85 : 50;

    const solidScore: SolidScore = {
      singleResponsibility: {
        score: srpScore,
        comment: hasSingleResponsibility
          ? `Good separation of responsibilities across ${classMatches.length} classes.`
          : 'Low class separation; consider splitting monolithic responsibilities into dedicated domain classes.'
      },
      openClosed: {
        score: ocpScore,
        comment: hasInterfaces || patterns.includes('Strategy Pattern')
          ? 'Clear extension points via interfaces and strategy implementations.'
          : 'Tight coupling to concrete classes; use interfaces/strategies to allow extension without modification.'
      },
      liskovSubstitution: {
        score: lspScore,
        comment: hasInheritance
          ? 'Uses class inheritance or abstractions to express subtype relationships.'
          : 'No explicit inheritance hierarchy found; consider base abstractions for polymorphic entities.'
      },
      interfaceSegregation: {
        score: ispScore,
        comment: hasInterfaces
          ? 'Explicit interfaces declared for clean contracts.'
          : 'No dedicated interfaces declared; clients may become bound to broad classes.'
      },
      dependencyInversion: {
        score: dipScore,
        comment: hasInterfaces
          ? 'Dependence on abstractions observed.'
          : 'Direct dependency on concrete implementations detected.'
      }
    };

    const avgSolid = Math.round((srpScore + ocpScore + lspScore + ispScore + dipScore) / 5);
    const entityCoverage = Math.max(20, Math.round(((problem.expectedClasses.length - missingEntities.length) / problem.expectedClasses.length) * 100));
    const overallScore = Math.min(98, Math.round(avgSolid * 0.5 + entityCoverage * 0.4 + (patterns.length > 0 ? 10 : 0)));

    const strengths: string[] = [];
    if (hasEncapsulation) strengths.push('Good encapsulation using access modifiers (private/protected/readonly).');
    if (patterns.length > 0) strengths.push(`Identified practical design patterns: ${patterns.join(', ')}.`);
    if (classMatches.length >= 3) strengths.push(`Structured domain model with ${classMatches.length} classes defined.`);
    if (hasInterfaces) strengths.push('Leverages interfaces to decouple consumer contracts.');

    const weaknesses: string[] = [];
    if (missingEntities.length > 0) weaknesses.push(`Missing important domain entities: ${missingEntities.slice(0, 3).join(', ')}.`);
    if (!hasInterfaces) weaknesses.push('Absence of interfaces weakens Open/Closed Principle compliance.');
    if (!hasEncapsulation) weaknesses.push('Fields lack explicit access modifiers, exposing internal state.');

    const actionableImprovements: string[] = [];
    if (missingEntities.length > 0) actionableImprovements.push(`Introduce classes/interfaces for: ${missingEntities.slice(0, 3).join(', ')}.`);
    if (!patterns.includes('Strategy Pattern') && problem.id === 'parking-lot') actionableImprovements.push('Extract fee calculation logic into a PricingStrategy interface.');
    if (!patterns.includes('State Pattern') && problem.id === 'vending-machine') actionableImprovements.push('Refactor if-else status checks into explicit State pattern classes.');
    if (actionableImprovements.length === 0) actionableImprovements.push('Add unit test harness or concurrency guard locks (e.g. mutex/atomic) for thread safety.');

    let verdict: DesignFeedback['verdict'] = 'Good';
    if (overallScore >= 80) verdict = 'Excellent';
    else if (overallScore < 60) verdict = 'Needs Improvement';

    return {
      overallScore,
      verdict,
      summary: `Deterministic review parsed ${classMatches.length} classes, ${interfaceMatches.length} interfaces, and identified ${patterns.length} design pattern(s).`,
      solidAnalysis: solidScore,
      strengths,
      weaknesses,
      designPatternsDetected: patterns,
      missingEntities,
      actionableImprovements,
      tradeOffAnalysis: 'Using in-memory class hierarchies keeps the design simple and fast. For high concurrency, consider optimistic concurrency locks or thread-safe atomic queues.',
      evaluationSource: 'deterministic'
    };
  }

  private generateBlankSolid(): SolidScore {
    return {
      singleResponsibility: { score: 20, comment: 'Not enough code to assess SRP.' },
      openClosed: { score: 20, comment: 'Not enough code to assess OCP.' },
      liskovSubstitution: { score: 20, comment: 'Not enough code to assess LSP.' },
      interfaceSegregation: { score: 20, comment: 'Not enough code to assess ISP.' },
      dependencyInversion: { score: 20, comment: 'Not enough code to assess DIP.' }
    };
  }
}
