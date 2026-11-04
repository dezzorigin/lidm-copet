# Product Requirements Document (PRD) & Action Planner

## Project Overview
**Name:** LEXiCO (Literacy & English Critical Observation)
**Objective:** A gamified micro-teaching web platform to educate students on English language scams, social engineering, and basic OSINT awareness.

## Tech Stack
- Frontend: React 18, TypeScript, Vite
- Styling: Tailwind CSS
- Animation: `framer-motion`
- Icons: `lucide-react`
- State Management: React Custom Hooks (Context if necessary)

## Architecture Rules
1. **Strict Separation of Concerns:** UI components must not contain hardcoded scenario data. All text, vocab, and questions live in `src/data/`.
2. **Component Modularity:** Build small, reusable components (e.g., `Button`, `PhoneMockup`, `FeedbackCard`).

---

## 🚀 Execution Planner (Checklist)

*AI Agent Instructions: When asked to proceed, find the next unchecked item `[ ]`, mark it as `[x]` in your internal memory, and execute ONLY that phase.*

- [x] **Phase 1: Data Architecture**
  - Create `src/data/vocabulary.ts` (10 items).
  - Create `src/data/quizData.ts` (5 realistic scenarios).
  - Create `src/data/simulationData.ts` (1 interactive branch).
- [x] **Phase 2: Global State Management**
  - Create `src/hooks/useGameEngine.ts` to manage `userPoints`, `masteredCount`, and `currentMode` ('home', 'vocab', 'quiz', 'sim').
- [x] **Phase 3: Core Shell & Dashboard UI**
  - Create the main `Layout.tsx` (Navbar/Header).
  - Create `DashboardView.tsx` with stats (Points, Badges) and menu selection cards using the Sleek Tech design.
- [x] **Phase 4: OSINT Realistic Mockups**
  - Create `src/components/ui/WhatsAppMockup.tsx`.
  - Create `src/components/ui/EmailMockup.tsx`.
- [x] **Phase 5: Game Modes Implementation**
  - Create `SpotTheScamView.tsx` utilizing the mockups.
  - Implement the animated `FeedbackDrawer` using Framer Motion.
  - Connect actions to the `useGameEngine` state to update scores.
- [x] **Phase 6: Finalizing Modes & Application Routing**
  - Create `VocabView.tsx` with animated flashcards.
  - Create `SimulationView.tsx` with interactive branching scenario.
  - Update `App.tsx` with conditional rendering logic based on global state.