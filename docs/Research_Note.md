# Research Note: Low-Level Design (LLD) Practice Platform
**Author:** Pruthvi R  
**Context:** CipherSchools 2-Day Engineering Challenge  
**Target:** Engineering Candidate Evaluation  

---

## 1. Executive Summary & Problem Space
Mastering Low-Level Design (LLD) and Object-Oriented Design (OOD) is pivotal for software engineers transitioning from writing procedural scripts to building maintainable, enterprise-grade software systems. However, while platforms like LeetCode and HackerRank have solved Data Structures and Algorithms (DSA) practice with automated input/output test suites, **LLD practice remains broken, fragmented, and frustrating for learners**.

In LLD, there is rarely a single "correct" answer. A Parking Lot, Elevator Controller, or Vending Machine can be implemented through multiple valid architectural paradigms. Because automated evaluation of abstractions, class relationships, and design principles has traditionally been considered impossible without human interviewers, learners suffer from the **"Echo-Chamber Effect"**: they draft class diagrams or code, yet have zero visibility into whether their abstractions, decoupling, or SOLID adherences are sound.

---

## 2. Competitive Landscape & Existing Approaches

| Platform / Approach | Strengths | Critical Gaps |
| :--- | :--- | :--- |
| **LeetCode / HackerRank** | Exceptional for DSA; instant, deterministic I/O test verification. | Completely binary pass/fail; evaluates only runtime correctness and algorithmic complexity, completely ignoring design patterns, class encapsulation, and extensibility. |
| **Educative / GitHub Repos (Grokking OOD)** | Rich reference solutions; UML diagrams; covers classic interview problems. | **Passive reading only**. No active sandbox; no personalized evaluation of a learner's custom code or alternative trade-offs. |
| **Human Mock Interviews (Pramp / Interviewing.io)** | Deep qualitative feedback; handles nuanced trade-offs and discussion. | Highly expensive ($100–$250/hr), non-scalable, inconsistent reviewer quality, and slow turnaround. |
| **Generic Chatbots (ChatGPT / Claude)** | Capable of reviewing snippets; explains concepts well. | Lacks structured rubrics, contextual memory of problem requirements, progressive attempt tracking, and deterministic design scoring. |

---

## 3. Key Gaps Identified in Learner Journey
1. **The Evaluation Paradox**: Unit tests only check *what* code outputs, not *how* clean, decoupled, or extensible the code is.
2. **Ambiguous Problem Scopes**: Learners get stuck on non-functional requirements (e.g., trying to solve distributed locking for a local parking lot problem) instead of core domain modeling.
3. **Absence of Iterative Feedback Loops**: Existing tools provide answers, not iterative coaching. Learners cannot observe how their design score evolves between Attempt #1 and Attempt #3.
4. **Lack of Trade-off Articulation**: Software design is fundamentally about trade-offs. Learners are rarely challenged with questions like: *"Why did you use a Singleton here over Dependency Injection?"*

---

## 4. Product Direction & Value Proposition
Our MVP addresses these gaps through an interactive, focused **LLD Practice Sandbox** engineered around the principle: **"Practice loop $\rightarrow$ Explainable Evaluation $\rightarrow$ Progression Tracking"**.

### Core Pillars of the Solution:
- **Interactive Scoped Challenges**: Curated classic problems (Parking Lot, Elevator Controller, Vending Machine) with explicit domain boundaries, expected interfaces, and interview-style trade-off questions.
- **Hybrid Evaluation Architecture**:
  - *Deterministic Static Engine*: High-speed AST/regex analysis checking class counts, encapsulation modifiers, interface declarations, and SOLID markers.
  - *AI Semantic Reasoning*: Contextual LLM evaluation assessing design pattern applicability, extensibility trade-offs, and actionable refactoring suggestions.
- **Fail-Safe Graceful Fallback**: If the LLM experiences latency or network failure, the system falls back seamlessly to deterministic evaluation within milliseconds.
- **Attempt History & Score Delta**: Visual tracking of learner improvements across multiple iterations with score deltas ($+15$ pts).
