# 12-Day Frontend Build Plan (React + TypeScript + CSS)

This schedule mirrors the structure and clarity of the prior “Schedule with Tech Stack Mapping,” but scoped strictly to a standalone frontend (no backend work here).

> Scope maps to the Burdd app’s pages and flows (Auth, Project Details, Sprint Board, Issue Details, Ticket Intake/Triage) so you can reuse the same UX.

---

## Baseline & Conventions

- **Stack:** React 18, TypeScript 5, Vite 5, CSS (modules), React Router 6  
- **Quality:** ESLint (typescript + react), Prettier, Vitest + React Testing Library  
- **Data:** local `mock-api/` JSON files + simple fetch helpers (replace with real API later)  
- **Structure:**  
  ```
  frontend/
    src/
      app/ (router, providers)
      components/
      pages/
      features/ (tickets, issues, sprints, auth, projects)
      styles/ (globals.css, variables.css)
      lib/ (fetch, utils)
      assets/
    mock-api/
    index.html
    vite.config.ts
  ```

---

## Day 1 — Repo & Tooling Bootstrap

**Tasks**
- Initialize Vite (React + TS), set TS strict, add CSS modules.
- Add ESLint (React/TS), Prettier, editorconfig; pre-commit lint.
- Create `globals.css` + CSS variables (colors, spacing).

**Deliverables**
- Running dev server, clean lint, sample `<App>` with Router shell.

**Acceptance**
- `npm run dev` works; `npm run lint` and `npm run test` pass.

---

## Day 2 — Routing, Layout, and Navigation

**Tasks**
- Install React Router; define base routes & layout:
  - `/login`, `/projects`, `/projects/:id`, `/sprints/:id`, `/issues/:id`, `/tickets/new`, `/tickets/triage`
- Create `AppLayout` with header/nav and responsive CSS grid.

**Deliverables**
- Placeholder pages render with active-link styles and 404 route.

**Acceptance**
- Deep links refresh without errors; keyboard navigation works.

---

## Day 3 — Mock Data Layer & Fetch Utilities

**Tasks**
- Add `mock-api/*.json` (projects, sprints, issues, tickets).
- Write `lib/fetcher.ts` with typed helpers (`getList<T>`, `getById<T>`).
- Provide an `ApiProvider` (context) to swap sources later.

**Deliverables**
- Pages can fetch and render mock lists/details.

**Acceptance**
- Network tab shows mock fetches; types inferred end-to-end.

---

## Day 4 — Projects List & Details Page

**Tasks**
- Build **Projects List** with filters (text by name), empty state.
- Build **Project Details** page (description, members, latest sprint, issues summary).
- Reusable components: `DataTable`, `Tag`, `EmptyState`.

**Deliverables**
- `/projects` and `/projects/:id` fully styled with CSS modules.

**Acceptance**
- Filtering is instant (client-side), details load by `:id`.

---

## Day 5 — Sprint Board (Columns & Drag-n-Drop Shell)

**Tasks**
- Create Sprint Board with columns: **In Queue → In Progress → Code Review → Done**.
- Implement lightweight drag handle (no persistence yet); keyboard-accessible move menu.

**Deliverables**
- `/sprints/:id` shows grouped issues; column totals; basic DnD.

**Acceptance**
- Drag or menu can move a card between columns; ARIA labels present.

---

## Day 6 — Issue Details & Comments

**Tasks**
- Issue details view (title, status, assignee, description, linked tickets).
- Comments thread with optimistic add (local state).
- Reusable `FormField` components (label, help, error).

**Deliverables**
- `/issues/:id` functional; validation & error states.

**Acceptance**
- Creating a comment updates UI immediately; errors surface inline.

---

## Day 7 — Ticket Intake (Public)

**Tasks**
- Build public **Ticket Intake** form (title, description, email opt, attachment upload mock).
- On submit, show tokenized status link (simulated).
- Accessibility: focus management on success/error.

**Deliverables**
- `/tickets/new` production-ready UI; file input mocked.

**Acceptance**
- Form validation (required fields); success screen shows a “status link”.

---

## Day 8 — Tickets Triage (Developer)

**Tasks**
- Triage queue list with filters (new/linked/converted).
- Actions: **Convert to Issue**, **Link to Issue** (opens modal to search issues).
- Reconcile with Issue schema from ERD (tickets ↔ issues).

**Deliverables**
- `/tickets/triage` operational with modal flow and toasts.

**Acceptance**
- Convert creates a new issue (mock) and removes from “New”.

---

## Day 9 — Auth Shell & Protected Routes

**Tasks**
- Minimal auth state (mock `login()` storing user in memory).
- Route guards; redirect to `/login` when needed.
- Login page with simple form and error handling.

**Deliverables**
- `/login` + guarded routes; header shows user + logout.

**Acceptance**
- Logged-out users can access only `/login` and `/tickets/new`.

---

## Day 10 — Styling Polish & Responsive Pass

**Tasks**
- Global typography scale; spacing system via CSS variables.
- Responsive breakpoints for board/table; compact cards for mobile.
- Empty/loading/error skeletons across major pages.

**Deliverables**
- Consistent look & feel; mobile board scrolls horizontally.

**Acceptance**
- Lighthouse a11y ≥ 90; contrast passes; tab order logical.

---

## Day 11 — Testing, Types Hardening & Error Boundaries

**Tasks**
- Vitest + RTL: unit tests for components, happy-path page tests.
- Strengthen types: discriminated unions for load states.
- Add `ErrorBoundary` and `NotFoundBoundary`.

**Deliverables**
- 15–25 meaningful tests; CI script for lint/test/build (frontend only).
- Error fallbacks render when JSON missing/invalid.

**Acceptance**
- `npm run test` green; type-only errors fail CI.

---

## Day 12 — Packaging, Docs & Release

**Tasks**
- Production build, env wiring (`VITE_API_BASE` reserved for later).
- Create `README_frontend.md` with run/build/test docs and page map.
- Add “handoff” notes describing how to replace mock fetch with real API.

**Deliverables**
- `dist/` build artifact; concise README and a CHANGELOG entry.

**Acceptance**
- `npm run build` succeeds; app preview works with mock data swap.

---

## Checklists

**Daily Definition of Done**
- [ ] Lint clean  
- [ ] Types strict, no `any` leaks  
- [ ] At least 1–2 tests for new components  
- [ ] Keyboard and screen-reader pass on new UI  
- [ ] Updated mock JSON if data shape changed  

**Pre-Release**
- [ ] Build succeeds and serves locally  
- [ ] README_frontend updated (commands, envs, routes)  
- [ ] Known Gaps section lists API integration points  
