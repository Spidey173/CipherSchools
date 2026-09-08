import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

function createPdf(title, subtitle, contentSections, outputPath) {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    info: {
      Title: title,
      Author: 'Pruthvi R',
      Subject: 'CipherSchools LLD Practice Platform Assignment'
    }
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Header Banner
  doc.rect(50, 45, 495, 4).fill('#6366f1');
  doc.moveDown(1.5);

  // Title & Subtitle
  doc.font('Helvetica-Bold').fontSize(22).fillColor('#111827').text(title);
  doc.font('Helvetica').fontSize(11).fillColor('#6b7280').text(subtitle);
  doc.moveDown(1.2);

  contentSections.forEach(section => {
    // Section Header
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#1e293b').text(section.heading);
    doc.moveDown(0.3);

    // Section Content
    doc.font('Helvetica').fontSize(10).fillColor('#374151').lineGap(3.5).text(section.body);
    doc.moveDown(1);
  });

  // Footer
  doc.fontSize(8).fillColor('#9ca3af').text('LLD Practice Platform • CipherSchools Engineering Assignment • Candidate: Pruthvi R', 50, 780, {
    align: 'center',
    width: 495
  });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function run() {
  const docsDir = path.resolve('docs');

  // 1. Research Note PDF
  const researchSections = [
    {
      heading: '1. Executive Summary & Problem Space',
      body: 'Mastering Low-Level Design (LLD) and Object-Oriented Design (OOD) is pivotal for software engineers transitioning to building maintainable enterprise systems. However, while platforms like LeetCode have solved DSA practice with deterministic test suites, LLD practice remains fragmented and frustrating.\n\nIn LLD, there is rarely a single "correct" answer. Learners suffer from the "Echo-Chamber Effect": they draft class hierarchies or code, yet have zero visibility into whether their abstractions, decoupling, or SOLID adherences are sound.'
    },
    {
      heading: '2. Competitive Landscape & Existing Approaches',
      body: '• LeetCode / HackerRank: Exceptional for DSA, but binary pass/fail ignores design patterns, encapsulation, and extensibility.\n• Educative / GitHub Repos (Grokking OOD): Rich reference solutions, but passive reading only with no active sandbox or evaluation.\n• Human Mock Interviews: High quality, but expensive ($150+/hr), non-scalable, and inconsistent.\n• Generic Chatbots: Capable of reviewing snippets, but lack structured rubrics, contextual memory of problem requirements, and progressive attempt tracking.'
    },
    {
      heading: '3. Key Gaps in the Learner Journey',
      body: '1. The Evaluation Paradox: Unit tests only verify what code outputs, not how clean or decoupled the architecture is.\n2. Ambiguous Problem Scope: Learners frequently get lost in non-functional rabbit holes instead of domain modeling.\n3. Absence of Iterative Feedback Loops: Learners cannot observe how their design score evolves across attempts.\n4. Lack of Trade-Off Articulation: Learners are rarely prompted to explain architectural choices.'
    },
    {
      heading: '4. Product Direction & Value Proposition',
      body: 'Our MVP provides an interactive LLD Practice Sandbox engineered around: Practice loop -> Explainable Evaluation -> Progression Tracking.\n\nKey features include curated classic problems (Parking Lot, Elevator, Vending Machine), a Hybrid Evaluation Architecture combining deterministic static keyword/AST rules with semantic AI reasoning, a 4-second fail-safe timeout boundary, and persistent attempt history tracking score deltas.'
    }
  ];

  await createPdf(
    'Research Note: LLD Practice Platform',
    'Candidate: Pruthvi R | CipherSchools 2-Day Engineering Assignment',
    researchSections,
    path.join(docsDir, 'Research_Note.pdf')
  );
  console.log('✓ Generated docs/Research_Note.pdf');

  // 2. Design Note PDF
  const designSections = [
    {
      heading: '1. System Overview & User Journey',
      body: 'The platform is engineered as a high-velocity, low-friction practice sandbox guiding learners through a 6-stage cycle: Browse Catalog -> Review Requirements & Constraints -> Draft Solution in Workspace -> Hybrid Evaluation Engine -> Inspect SOLID Radar & Trade-offs -> Refine in Attempt History.'
    },
    {
      heading: '2. Core Domain Model & Class Responsibilities',
      body: '• Problem: Holds domain specifications, difficulty tags, core functional requirements, expected entity signatures, and benchmark sample implementations.\n• Evaluator (Strategy Pattern): Common interface permitting pluggable evaluation strategies (Deterministic, LLM, AST, Linters).\n• DeterministicEvaluator: Inspects class counts, interfaces, access modifier encapsulation, and computes baseline SOLID compliance scores.\n• AIEvaluator: Synthesizes design patterns (Strategy, State, Observer, Singleton), trade-offs, and actionable refactoring.\n• HybridEvaluationPipeline: Coordinates deterministic rules with LLM reasoning, protected by a 4000ms timeout boundary.\n• AttemptRepository: Manages timestamped submissions and score progression deltas.'
    },
    {
      heading: '3. Evaluation Philosophy: Deterministic vs. LLM Split',
      body: '• Deterministic Engine: <15ms execution, 100% offline availability, zero API cost. Validates concrete entity signatures, encapsulation modifiers, and interface inheritance.\n• LLM Semantic Engine: Contextual reasoning, design pattern synthesis, architectural trade-offs, and idiomatic refactoring tips.\n• Fallback Guarantee: Protected by a Promise.race timeout boundary. If network latency exceeds 4s, the system seamlessly returns deterministic insights without throwing errors.'
    },
    {
      heading: '4. Key Architectural Trade-Offs',
      body: '• In-App / Client-Side Orchestration vs. Distributed Worker Queues: Eliminates RabbitMQ/Celery complexity for a sub-second interactive MVP while respecting prompt boundaries.\n• Code/Pseudocode Editor vs. Drag-and-Drop UML: Real-world engineering interviews require writing concrete classes and interfaces; code-first reflects interview realism.\n• Graceful Degradation: Guarantees learners never experience unhandled 500 errors or infinite spinners.'
    }
  ];

  await createPdf(
    'Design Note: Architecture & Domain Model',
    'Candidate: Pruthvi R | CipherSchools 2-Day Engineering Assignment',
    designSections,
    path.join(docsDir, 'Design_Note.pdf')
  );
  console.log('✓ Generated docs/Design_Note.pdf');
}

run().catch(console.error);
