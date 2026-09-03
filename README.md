# MINDTRACE — Universal AI Cognitive Diagnostic System

![Engine](https://img.shields.io/badge/Engine-Domain--Agnostic%20Bayesian%20v5-06b6d4?style=for-the-badge)
![Automated Tests](https://img.shields.io/badge/Tests-13%2F13%20Vitest%20Passed-10b981?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-Edge%20Proxy%20%26%20Rate%20Limited-f59e0b?style=for-the-badge)
![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1%20Informed%20%26%20Accessible-3b82f6?style=for-the-badge)

---

## 💡 System Overview

> **MINDTRACE is an audit-ready, domain-agnostic AI cognitive diagnostic platform that investigates how learners reason, extracts implicit mental models, evaluates competing hypotheses via Bayesian belief updating, and verifies conceptual transfer across STEM, Law, Economics, and Formal Logic.**

### Tagline
> **"Understand the learner's mental model. Not just their score."**

## 🚀 Diagnostic Workflow

Experience the core diagnostic process in 3 steps:

```
Step 1: Select a Domain Preset or Input Problem
        → Observe Phase: AI reconstructs implicit mental model & identifies competing hypotheses.

Step 2: Answer Socratic Probes
        → Investigate Phase: Answer diagnostic probes as the Bayesian Engine recalculates belief probabilities.

Step 3: Transfer Evaluation & Insights
        → Verify Phase: Complete the transfer scenario to evaluate conceptual mastery and view longitudinal reasoning patterns.
```

---

## 🔄 The 4-Stage Adaptive Investigation Pipeline

```
Stage 1: OBSERVE (User Input: Problem, Answer, Rationale & Inferred Domain)
  ↓
Stage 2: INVESTIGATE (Multi-Agent Primary Diagnostic + Independent Skeptic Agent)
  ↓ Reconstructs Mental Model & Generates N Competing Hypotheses + Dynamic Socratic Probe Loop
Stage 3: UPDATE (Bayesian Belief Update P(Hi | E) + Root Cause Analysis + Universal Visual Model)
  ↓
Stage 4: VERIFY (Contextual Transfer Problem & Rubric Evaluation + Longitudinal Pattern Discovery)
```

---

## 🎯 Target Demographic & Educational Scope

MINDTRACE is explicitly architected for **both Teen/High School Students (13+) and Higher-Education/Professional Learners**:
- **Teenagers & High School (13+):** Learner-friendly Socratic voice guidance, step-by-step diagnostic breakdown, and interactive visual DAG graphs.
- **Higher Education & Professional:** Advanced cross-domain reasoning flaw detection, legal case analysis, computer science memory allocation, and macroeconomic policy shifts.

---

## 🛡️ Security & Production Hardening Architecture

1. **Serverless Edge Key Proxy (`api/diagnose.ts`)**: Prevents client-side API key exposure by insulating `GEMINI_API_KEY` on serverless edge functions.
2. **Client Rate Limiting Guard**: Sliding-window rate limiter (15 requests/minute cap) in `aiEngine.ts` to prevent key abuse and cost overruns.
3. **Prompt Sanitization & XML Guarding**: All user inputs are sanitized and wrapped in rigid XML boundaries (`<user_problem>`, `<user_answer>`, `<user_reasoning>`) with system override guards.
4. **Strict Zod Parsing Boundary**: All LLM JSON responses pass through strict Zod schema validation (`safeParseZod`) with automatic structural fallbacks.

> **Production Deployment Note:** Always set the non-prefixed `GEMINI_API_KEY` environment variable on your serverless edge host (e.g. Vercel/Netlify). Avoid configuring `VITE_GEMINI_API_KEY` in production environment builds to ensure all client requests default to routing safely through the edge proxy provider.

---

## 🧪 Automated Test Suite & CI Pipeline

MindTrace includes a comprehensive automated test suite powered by **Vitest** and **GitHub Actions**:

```bash
# Run unit & integration test suite
npm test

# Run tests in watch mode
npm run test:watch
```

### Covered Components
- **`investigationController.test.ts`**: Verifies 4-stage state machine, 3-cycle adaptive probing, and evidence sufficiency threshold (`topPosterior >= 0.80`).
- **`sessionStore.test.ts`**: Validates canonical reasoning pattern normalization, local storage persistence, and cross-domain pattern mining across CS, Law, Economics, and Physics.
- **`aiEngine.test.ts`**: Verifies exact Bayesian posterior calculation, zero-bias missing likelihood handling, Zod validation, and sliding-window rate limiting.

### GitHub Actions CI
The repository includes `.github/workflows/ci.yml` which automatically executes type checking (`tsc -b`), linting (`oxlint`), and unit testing (`vitest`) on all pushes and pull requests.

---

## ♿ Accessibility (a11y) & Inclusivity

- **Full Keyboard Navigation:** All interactive elements feature explicit `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers.
- **WCAG Focus Ring Indicators:** Global visible focus ring styling (`focus-visible:outline-indigo-500`).
- **Vestibular Accessibility:** Full support for `prefers-reduced-motion: reduce` CSS media queries.
- **Screen Reader Support:** Dynamic ARIA live regions (`aria-live="polite"` & `aria-atomic="true"`) on diagnosis cards, probe feedback, stage progress indicators, and voice guidance panels.

---

## 🏗️ Provider-Abstracted AI Architecture

MindTrace uses a modular provider interface (`AIProvider`) decoupling prompt logic from LLM implementations:
- **`ServerProxyProvider`**: Routes requests through secure serverless edge endpoints (default).
- **`GeminiLiveProvider`**: Connects directly to Google Gemini 3.6 Engine via `@google/genai` when an explicit client key is provided.
- **`GenericFallbackProvider`**: Zero-dependency structural engine for offline operation.

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js `v18+` or `v24+`
- npm `v9+` or `v11+`

### Installation & Execution
```bash
# Install dependencies
npm install

# Start Development Server
npm run dev

# Run Automated Test Suite
npm test

# Build Production Bundle
npm run build
```

App runs at `http://localhost:5173/`.
