# LLD Practice Platform (CipherSchools Engineering Challenge)

A focused, rich MVP platform for practicing and receiving explainable, iterative feedback on Low-Level Design (LLD) problems like Parking Lot, Elevator System, and Vending Machine.

---

## 🌟 Key Features

1. **Curated Problem Catalog**:
   - Multi-Level Parking Lot, Elevator System, and Vending Machine.
   - Comprehensive functional requirements, expected entities, and interview trade-off questions.
2. **Interactive Practice Workspace**:
   - Split-screen interface with tabbed specifications, requirements, and reference solutions.
   - Code & pseudocode editor with reset and reference injection.
3. **Hybrid Evaluation Engine**:
   - **Deterministic Evaluator**: Fast AST and keyword pattern inspection for entity coverage, access modifier encapsulation, and SOLID compliance.
   - **AI Semantic Evaluator**: Architectural trade-off analysis, design pattern detection (Strategy, State, Singleton, Observer), and constructive feedback.
   - **Resilience**: Automatic 4-second timeout protection falling back to deterministic evaluation without interrupting the user.
4. **Attempt History & Score Progression**:
   - Persistent attempt tracking with score deltas ($+15$ pts).
   - Code snapshot review across iterations.
5. **Modern Glassmorphic UI**:
   - Built with React 19, TypeScript, and Lucide icons.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📂 Project Architecture

```
hi/
├── src/
│   ├── domain/
│   │   ├── types.ts          # Core domain models (Problem, Attempt, Feedback, SolidScore)
│   │   ├── problems.ts       # Problem repository with requirements & starter code
│   │   └── repository.ts     # Attempt storage & progression manager
│   ├── evaluators/
│   │   ├── DeterministicEvaluator.ts  # AST / keyword / SOLID rules
│   │   ├── AIEvaluator.ts             # LLM reasoning & trade-off analyzer
│   │   ├── HybridPipeline.ts          # Strategy pipeline with timeout fallback
│   │   └── __tests__/
│   │       └── evaluator.test.ts      # Automated unit test suite
│   ├── components/
│   │   ├── ProblemList.tsx    # Problem catalog cards & stats
│   │   ├── Workspace.tsx      # Split-pane requirements & code editor
│   │   ├── FeedbackView.tsx   # SOLID radar, scores, and recommendations
│   │   └── AttemptHistory.tsx # Iteration history and code snapshots
│   ├── App.tsx               # Main application coordinator
│   └── index.css             # Dark-mode glassmorphic design system
├── docs/
│   ├── Research_Note.md      # 1–2 page research note
│   ├── Design_Note.md        # Architecture, class models, and trade-offs
│   ├── generate_pdfs.mjs     # Script to generate PDF deliverables
│   ├── Research_Note.pdf     # Submission-ready PDF
│   └── Design_Note.pdf       # Submission-ready PDF
├── AI_USAGE.md               # 4 key AI-assisted architectural decisions
└── README.md
```

---

## 🧪 Testing Coverage

The automated test suite (`npm test`) verifies:
- Deterministic parsing of empty or incomplete code submissions.
- Entity detection, access modifier verification, and SOLID scores on complete solutions.
- AI Evaluator trade-off commentary generation.
- Hybrid pipeline fallback on timeout or failure.
