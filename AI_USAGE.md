# AI_USAGE.md: Architectural Decisions & AI Partnership Report

This document records the meaningful AI-assisted decisions made while designing and building the LLD Practice Platform MVP for CipherSchools, detailing what was suggested, what was accepted or rejected, and the engineering rationale.

---

### Decision 1: Hybrid Evaluation Pipeline vs. Pure LLM Prompting
- **AI Suggestion**: Pass the candidate's entire solution directly to an LLM prompt (e.g. GPT-4 / Gemini) and request a single large JSON response containing all feedback, score, and SOLID ratings.
- **Engineering Decision**: **Rejected in part; adopted a Hybrid Pipeline instead**.
- **Rationale**:
  - Relying exclusively on an LLM creates three major vulnerabilities: high latency ($2$–$5$s), API quota/cost bloat, and prompt indeterminism (scoring variations on identical code).
  - Instead, we architected a **Strategy Pattern** with a **`DeterministicEvaluator`** (running static AST/pattern rules for instant entity checks and baseline SOLID scoring) combined with an **`AIEvaluator`** (focused purely on qualitative trade-offs and semantic pattern detection).
  - This guarantees sub-second feedback and reliable fallback even if the LLM network request times out.

---

### Decision 2: Input Format (Interactive Code Workspace vs. Visual UML Canvas)
- **AI Suggestion**: Implement a React Flow / Mermaid diagram visual canvas where learners drag and drop class boxes and draw relationship arrows.
- **Engineering Decision**: **Rejected visual drag-and-drop; adopted a Code/Pseudocode Editor**.
- **Rationale**:
  - In technical engineering interviews, candidates are asked to define classes, interfaces, method signatures, and access modifiers in code. Visual diagram builders are often clunky and slow down practice.
  - A code-first editor allows learners to practice syntax, encapsulation (`private`, `readonly`), and interfaces directly, while preserving the ability to express pseudocode.

---

### Decision 3: Timeout Protection & Fault Tolerance in Evaluation Engine
- **AI Suggestion**: Add polling or an async queue job with webhooks for AI evaluation.
- **Engineering Decision**: **Accepted timeout race (`Promise.race`) with graceful degradation**.
- **Rationale**:
  - The assignment explicitly cautioned: *"Keep this practical; do not turn the assignment into a distributed-systems project."*
  - Using a 4,000ms `Promise.race` timeout ensures the platform returns deterministic insights immediately if the AI response lags, providing an uninterrupted learner experience without server infrastructure overhead.

---

### Decision 4: History Tracking & Progression Metrics
- **AI Suggestion**: Store only the latest attempt to save storage space.
- **Engineering Decision**: **Rejected; implemented full Attempt History with Score Deltas**.
- **Rationale**:
  - The core prompt requirement emphasizes: *"The learner can see previous attempts so the product supports improvement, not just one-time solving."*
  - We engineered the `AttemptRepository` to maintain timestamped iterations, allowing learners to compare their progression (e.g., $+15$ pts improvement after applying the Strategy Pattern).
