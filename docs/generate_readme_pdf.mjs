import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

function cleanText(str) {
  // Strip emojis, non-ascii characters, and common markdown symbols that cause font glitched glyphs
  return str
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\*\*/g, '')
    .replace(/\`/g, '');
}

function createCleanMarkdownPdf(title, subtitle, sections, outputPath) {
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

  // Top accent banner
  doc.rect(50, 45, 495, 4).fill('#6366f1');
  doc.moveDown(1.5);

  doc.font('Helvetica-Bold').fontSize(20).fillColor('#111827').text(title);
  doc.font('Helvetica').fontSize(10).fillColor('#6b7280').text(subtitle);
  doc.moveDown(1.2);

  sections.forEach(sec => {
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#1e293b').text(sec.heading);
    doc.moveDown(0.3);

    sec.paragraphs.forEach(p => {
      if (p.startsWith('* ') || p.startsWith('- ')) {
        doc.font('Helvetica').fontSize(9).fillColor('#374151').lineGap(2.5).text('  • ' + cleanText(p.substring(2)));
      } else {
        doc.font('Helvetica').fontSize(9).fillColor('#374151').lineGap(2.5).text(cleanText(p));
      }
      doc.moveDown(0.2);
    });

    doc.moveDown(0.6);
  });

  doc.fontSize(8).fillColor('#9ca3af').text('LLD Practice Platform • CipherSchools Documentation • Candidate: Pruthvi R', 50, 780, {
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
  const rootDir = path.resolve('.');
  const sections = [
    {
      heading: 'AI_USAGE: Key Architectural Decisions & AI Partnership',
      paragraphs: [
        'Decision 1: Hybrid Evaluation Pipeline vs. Pure LLM Prompting',
        '- AI Suggestion: Pass full solution directly to an LLM prompt for single-shot JSON evaluation.',
        '- Engineering Decision: Rejected pure LLM; implemented a Hybrid Strategy Pipeline instead.',
        '- Rationale: Mitigates 3s latency, eliminates API quota bloat, and solves non-deterministic scoring variations by running deterministic AST/keyword checks alongside qualitative AI reasoning.',
        '',
        'Decision 2: Interactive Code Workspace vs. Visual UML Drag-and-Drop Canvas',
        '- AI Suggestion: Build a React Flow visual node-based UML diagramming canvas.',
        '- Engineering Decision: Rejected visual diagrammer; adopted Code/Pseudocode Editor.',
        '- Rationale: Real-world engineering LLD interviews require implementing actual classes, interfaces, and access modifiers.',
        '',
        'Decision 3: Timeout Protection & Resilient Fallback',
        '- AI Suggestion: Add complex background worker queues with polling/webhooks.',
        '- Engineering Decision: Accepted client-side Promise.race timeout (4,000ms) with graceful fallback.',
        '- Rationale: Complies with assignment boundary ("skip distributed systems overhead") while guaranteeing 0% failure rate for learners.',
        '',
        'Decision 4: Attempt History & Score Progression',
        '- AI Suggestion: Overwrite state with only the latest attempt.',
        '- Engineering Decision: Rejected; engineered full AttemptRepository tracking iterations and score deltas (+15 pts).'
      ]
    },
    {
      heading: 'Project Quick Start & Execution Guide',
      paragraphs: [
        'Prerequisites: Node.js (v18+) and npm.',
        '- Step 1: Install dependencies using `npm install`',
        '- Step 2: Start local development server with `npm run dev` (running at http://localhost:5173)',
        '- Step 3: Run automated test suite using `npm test`',
        '- Step 4: Build production bundle using `npm run build`'
      ]
    },
    {
      heading: 'Automated Testing & Reliability',
      paragraphs: [
        'The platform includes a Vitest suite covering:',
        '- Deterministic parser handling of empty/trivial submissions (returns Incomplete verdict).',
        '- Pattern recognition: Strategy, Singleton, and State pattern detection in reference solutions.',
        '- SOLID metric synthesis across Single Responsibility, Open/Closed, and Dependency Inversion.',
        '- Hybrid pipeline coordination with timeout boundary testing.'
      ]
    }
  ];

  await createCleanMarkdownPdf(
    'README + AI_USAGE Report',
    'Candidate: Pruthvi R | CipherSchools 2-Day Engineering Challenge',
    sections,
    path.join(rootDir, 'docs', 'README_AND_AI_USAGE.pdf')
  );
  console.log('✓ Cleanly generated docs/README_AND_AI_USAGE.pdf');
}

run().catch(console.error);
