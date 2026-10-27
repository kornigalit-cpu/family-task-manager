# Underground Vault - Agile Development & Engineering Process

This document details the Agile lifecycle, story point estimations, sprint progress, and code review trail for the Underground Vault project.

---

## 1. Project Management & Agile Board

- **Live Board Link:** [Underground Vault - Sprint Board](https://github.com/users/kornigalit-cpu/projects/2/views/1)
- **Methodology:** Kanban / Agile Lifecycle
- **Estimation Units:** Story Points (SP) based on the Fibonacci sequence (1, 2, 3, 5, 8).

---

## 2. Feature & Sprint Progress Tracking

| Issue ID | Feature / Epic     | User Story                                                                                                             | SP  |    Status     | Related PR       | Visual Verification / Proof                           |
| :------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------- | :-: | :-----------: | :--------------- | :---------------------------------------------------- |
| **#4**   | Project Setup      | Initialize Vite + React project with Atomic Design directory structure                                                 |  2  |   **Done**    | Merged to `main` | Initial commit & scaffold                             |
| **#5**   | Documentation      | Create ALL_LICENSES file and configure package dependencies                                                            |  1  |   **Done**    | Merged to `main` | Dependency audit                                      |
| **#6**   | Catalog Management | As a collector, I want to view, add, edit, and delete releases so that I can maintain my vault inventory in real time. |  5  |   **Done**    | PR #1, PR #2     | `docs/screenshots/crud-demo.png`                      |
| **#7**   | Input Security     | Input Sanitization & Centralized Validation Module (`validators.js` + test suite)                                      |  3  |   **Done**    | Merged to `main` | `src/utils/validators.test.js` (100% Branch Coverage) |
| **#8**   | Core Module        | System & Trade Action Logging Module with JSON Export (`logger.js`)                                                    |  3  |   **Done**    | PR #3            | `src/utils/logger.test.js`                            |
| **#9**   | Test Suite         | Setup Vitest & Implement Unit/Integration Tests >= 70% Coverage                                                        |  5  |   **Done**    | PR #1, PR #2     | Coverage report (~88% Lines / ~80% Branches)          |
| **#10**  | Discovery          | Advanced Multi-Attribute Filtering & Sorting with Immutability (`toSorted`)                                            |  3  |   **Done**    | Merged to `main` | `src/utils/filterReleases.test.js`                    |
| **#11**  | Core Trading       | Trade Proposal Request Modal, Discriminated Union ModalContext & Status Flow                                           |  5  |   **Done**    | Merged to `main` | `TradeProposalModal.test.jsx`                         |
| **#12**  | Accessibility & UI | Drawer focus management, Escape key listener, and A11y polish (`ActivityLogDrawer`)                                    |  3  | **In Review** | PR #3            | Live PR review by peer                                |

---

## 3. Work Breakdown Structure (Issue #6 Sub-issues)

To adhere to Atomic Design and granular Agile delivery, Issue #6 was decomposed into targeted sub-tasks:

1. `[Atom] Button component with variant styles and contrast accessibility` — **Completed**
2. `[Molecule] AddReleaseModal & Form inputs composition` — **Completed**
3. `[Organism] ReleaseCard & ReleaseGrid interactive actions` — **Completed**
4. `[State] CRUD state management & localStorage persistence` — **Completed**
5. `[Testing] Component tests for Modal, Form submission and Delete triggers` — **Completed** (Vitest Suite running with 11 passing test files)

---

## 4. Code Reviews & Peer Review Trail

**Requirement Note:** Course requirements updated to **1 required peer code review** for the final project presentation.

- **PR Under Review:** PR #3 (`feature/activity-log-drawer-a11y`)
- **Reviewer:** Course Peer
- **Scope:** Accessibility enhancements, focus trapping/restoration, `Escape` key close handling, and export functionality in `ActivityLogDrawer.jsx`.
- **Status:** **In Review** (Pending peer feedback)
- **Key Feedback & Resolutions:**
  - _Feedback:_ (Awaiting peer review submission)
  - _Resolution:_ (To be implemented upon feedback receipt)

---

## 5. Visual Sprint History & Artifacts

- **Project Kanban Board:** `docs/screenshots/01-github-project-board.png`
- **Granular Issues & Lifecycle:** `docs/screenshots/02-issues-lifecycle.png`
- **Live Application Showcase:** `docs/screenshots/03-app-live-demo.png`
- **Test Coverage Report:** `docs/screenshots/04-test-coverage-report.png`
