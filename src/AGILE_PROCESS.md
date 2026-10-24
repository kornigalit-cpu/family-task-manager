# Underground Vault - Agile Development & Engineering Process

This document details the Agile lifecycle, story point estimations, sprint progress, and code review trail for the Underground Vault project.

---

## 1. Project Management & Agile Board

- **Live Board Link:** [Underground Vault - Sprint Board] (https://github.com/users/kornigalit-cpu/projects/2/views/1)
- **Methodology:** Kanban / Agile Lifecycle
- **Estimation Units:** Story Points (SP) based on the Fibonacci sequence (1, 2, 3, 5, 8).

---

## 2. Feature & Sprint Progress Tracking

| Issue ID | Feature / Epic     | User Story                                                                                                             | SP  |     Status      | Related PR       | Visual Verification / Proof      |
| :------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------- | :-: | :-------------: | :--------------- | :------------------------------- |
| **#4**   | Project Setup      | Initialize Vite + React project with Atomic Design directory structure                                                 |  2  |    **Done**     | Merged to `main` | Initial commit & scaffold        |
| **#5**   | Documentation      | Create ALL_LICENSES file and configure package dependencies                                                            |  1  |    **Done**     | Merged to `main` | Dependency audit                 |
| **#6**   | Catalog Management | As a collector, I want to view, add, edit, and delete releases so that I can maintain my vault inventory in real time. |  5  | **In Progress** | PR #1, PR #2     | `docs/screenshots/crud-demo.png` |
| **#7**   | Input Security     | Input Sanitization & Validation Module                                                                                 |  3  |    **Todo**     | -                | -                                |
| **#8**   | Core Module        | System & Trade Action Logging Module                                                                                   |  3  |    **Todo**     | -                | -                                |
| **#9**   | Test Suite         | Setup Vitest & Implement Unit Tests >= 70% Coverage                                                                    |  5  |    **Todo**     | -                | -                                |
| **#10**  | Discovery          | Advanced Multi-Attribute Filtering & Sorting Controls                                                                  |  3  |    **Todo**     | -                | -                                |
| **#11**  | Core Trading       | Trade Proposal Request Modal & Status Flow                                                                             |  5  |    **Todo**     | -                | -                                |

---

## 3. Work Breakdown Structure (Issue #6 Sub-issues)

To adhere to Atomic Design and granular Agile delivery, Issue #6 was decomposed into targeted sub-tasks:

1. `[Atom] Button component with variant styles and contrast accessibility` - **Completed**
2. `[Molecule] AddReleaseModal & Form inputs composition` - **Completed**
3. `[Organism] ReleaseCard & ReleaseGrid interactive actions` - **Completed**
4. `[State] CRUD state management & localStorage persistence` - **Completed**
5. `[Testing] Component tests for Modal, Form submission and Delete triggers` - **Pending Vitest Setup (#9)**

---

## 4. Code Reviews & Peer Review Trail

Requirement: At least one major feature PR reviewed by a course peer.

- **PR Target for Peer Review:** `feature/filters-sorting` (Issue #10) / `feature/trade-request-flow` (Issue #11)
- **Reviewer:** _(TBD - Course Peer)_
- **PR Link:** _(Will be added upon branch submission)_
- **Key Feedback & Resolutions:**
  - _Feedback:_ (To be updated after review)
  - _Resolution:_ (To be updated after changes)

---

## 5. Visual Sprint History (Screenshots)

- **Initial Kanban State:** `docs/screenshots/01-kanban-initial.png`
- **Sub-issues Decomposition:** `docs/screenshots/02-sub-issues-breakdown.png`
- **CRUD UI & LocalStorage Persistence:** `docs/screenshots/03-crud-localstorage.png`
