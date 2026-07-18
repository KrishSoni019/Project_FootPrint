# Project Footprint — Master Design Review & Development Blueprint

**Status:** Living document — this is the master execution blueprint for the entire project
**Supersedes:** Nothing — this builds on top of the Blueprint, Architecture Review, and Master Development Roadmap already in `/docs`. Those documents remain the detailed reference; this document defines the *order of execution*.

---

## 1. Gaps in Existing Documentation

| Gap | Why it matters |
|---|---|
| **No explicit landing/marketing page defined** | Every doc jumps straight to "sign up." A real app needs an unauthenticated entry point explaining what the product is before asking for an account. |
| **No defined "empty state" experience** | What does a brand-new workspace look like before any GitHub repo is connected, before any task exists? Undefined empty states are a common beginner trap — the app looks broken on day one otherwise. |
| **No explicit MVP definition, only a feature classification** | We classified features as Must/Should/Nice/Future, but never drew the line for "what is version 1.0 that gets demoed/deployed first." Fixed in Section 5. |
| **No page-level navigation map** | We have features and API endpoints, but no diagram of how a user actually clicks from page to page. Fixed in Section 6. |
| **No "solo developer execution order" distinct from the "architectural phase order"** | The 10-phase roadmap is correct architecturally, but written like a team's roadmap, not a beginner's daily to-do list. Fixed in Section 7. |

None of these are architectural flaws — they're missing layers between "what we've designed" and "what you open VS Code and do on Monday morning."

---

## 2. Folder Structure Review

The apps/services/packages monorepo structure is correct — no redesign. Two small adjustments:

- **`packages/contracts` and `packages/shared`:** architecturally correct for the long run, but overhead you don't need until Python and Node are both writing real code. Leave the folders in place, don't invest time in them until Phase F.
- **`prisma/` stays at repo root**, not nested inside `services/api` — both the API and any future admin scripts need the same schema reference.

Everything else in the structure stays as-is.

---

## 3. Where This Blueprint Disagrees With the Prior Roadmap (and why)

The original 10-phase roadmap, taken literally in order, front-loads too much infrastructure (the Node↔Python Redis bridge) before there's anything visible to show. That's correct for a team building a scalable product, but for a solo learner, going weeks without a single clickable screen is demotivating and makes it hard to tell if something's wrong.

**Adjustment:** every phase from the master roadmap is kept, but early phases are resequenced so a visible, clickable app (auth + workspace + empty dashboard) exists before touching Redis, BullMQ, or Python at all. The queue bridge is still built early — just not before the first login screen works.

Everything else in the existing plan — the five-index scoring model, the webhook accept/process split, the versioned weight profiles — stands as designed. No other disagreements.

---

## 4. Complete User Flow (Landing → Completion)

```
Landing Page (unauthenticated)
   │
   ▼
Sign Up / Log In
   │
   ▼
Create Workspace  ──────────────► Join Workspace (via invite/code)
   │                                        │
   ▼                                        ▼
Empty Dashboard (no data yet) ◄─────────────┘
   │
   ├──► Connect GitHub Repo ──► Backfill runs ──► Identity Mapping
   │
   ├──► Create Tasks ──► Assign ──► Move across board
   │
   ├──► Log Manual Activity (non-code work)
   │
   ▼
Unified Timeline fills in (auto, continuous)
   │
   ▼
Scores compute (auto, continuous, in background)
   │
   ▼
Dashboard comes alive: charts, leaderboard, per-member breakdown
   │
   ├──► Click any score ──► Evidence Drill-down (underlying events)
   │
   ▼
Export Report (PDF/CSV) ──► Project Completion / Archival
```

This flow is what every page-flow, feature order, and milestone below is built to support.

---

## 5. MVP Definition (Version 1.0)

The smallest set of features that lets the user flow above run start to finish, once, for one real project.

**In MVP:**
- Auth (signup/login/JWT)
- One workspace, one owner, invite one member
- Connect one GitHub repo, backfill + webhook sync
- Manual identity mapping (basic, no fuzzy-matching yet)
- Task board (create/assign/move)
- Manual activity logging (text + optional link, file upload can wait)
- Unified timeline
- Five-index scoring engine, fixed default weights (configurable weights can wait)
- Basic dashboard: leaderboard + one chart
- Evidence drill-down
- CSV export only (PDF can wait)

**Explicitly deferred past MVP:** file-upload evidence, configurable/versioned weight profiles, PDF export, alerts/notifications, consistency & spike detection, work-area tagging, admin panel — all already designed, just not required for the first working end-to-end demo.

---

## 6. Page Flow & Navigation Map

```
/                        → Landing page (public)
/login, /signup           → Auth pages (public)
/join/:code                → Accept invite (public until logged in, then joins)

--- Authenticated shell (sidebar + topbar) ---
/projects                  → List of workspaces user belongs to
/projects/new               → Create workspace
/projects/:id/dashboard      → Main dashboard (default landing after login)
/projects/:id/timeline        → Unified activity timeline
/projects/:id/tasks            → Task board
/projects/:id/activities/new    → Log manual activity
/projects/:id/github/connect     → GitHub connection screen
/projects/:id/github/identity-map → Identity mapping screen
/projects/:id/settings             → Workspace settings, invitations, roles
/projects/:id/reports               → Export reports
```

Everything nests under `/projects/:id/...` — this keeps every future feature (notifications, admin, alerts) an additive route, never a restructure.

---

## 7. Development Phases — Actual Execution Order

**Phase A — Skeleton you can see (Week 1)**
Backend health check → Frontend shell renders → both talk to each other. No auth, no DB yet. Goal: confirm the three services boot and connect.

**Phase B — Auth & Workspace (Weeks 1–2)**
DB schema → signup/login API → auth pages → workspace CRUD API → workspace UI → invitations. Goal: create an account, make a workspace, see an empty (but real) dashboard page.

**Phase C — Task Board (Week 3)**
Simplest full-stack feature with no external dependency. Goal: prove out the full pattern (schema → API → UI) on something easy before GitHub's complexity.

**Phase D — Manual Activity Log (Week 4)**
Same pattern again, slightly more complex (text + evidence link). Reinforces the pattern, builds toward the timeline.

**Phase E — Unified Timeline (Week 4–5)**
Merge tasks + manual activities into one feed (GitHub not connected yet, so only two sources for now). Goal: see chronological data render for the first time.

**Phase F — GitHub Integration (Weeks 5–7)**
Now the hardest phase, but the patterns from B–E are already trusted. Connection → backfill → identity mapping → webhooks. Correct point to introduce BullMQ/Redis, since there's finally a real async job to run (backfill).

**Phase G — Scoring Engine v1 (Weeks 7–9)**
Only now does the Python worker get built — there's a real unified timeline with real data to score against, so it can be tested meaningfully instead of against fake fixtures alone.

**Phase H — Dashboard Comes Alive (Week 9–10)**
Wire the already-built (empty) dashboard UI to real scores. The most rewarding week — everything suddenly looks like a real product.

**Phase I — Reports & Polish (Week 10–11)**
CSV export, evidence drill-down polish.

**Phase J — Hardening & Deployment (Weeks 12–14)**
Security pass, tests, Docker, CI/CD, deploy.

**Why this order is optimal:** it follows the real-world engineering principle of walking skeleton first, thinnest vertical slice next, hardest external integration only after your own patterns are proven, and the most trust-critical component (scoring) built against real data instead of assumptions. It also front-loads visible progress every single week, which matters enormously for solo, self-directed learning momentum.

---

## 8. Architectural Mistakes / Overengineering Check

- **No mistakes found** in the core five-index scoring design, the webhook split, or the multi-tenancy approach — these remain sound.
- **One overengineering risk (already addressed in Section 3):** building the Redis/BullMQ/Python bridge before Phase F is premature optimization for a solo learner — resequenced above.
- **Second minor risk:** don't build the configurable weight-profile UI in MVP. Hardcode default weights first; versioning them is a Should-Have, not a Must-Have.

---

## 9. Folder Responsibility (Recap)

- `apps/frontend` — everything the user sees.
- `services/api` — everything true regardless of who's asking (auth, ownership, validation, business rules).
- `services/analysis` — the trust-critical scoring brain, deliberately isolated so it's testable without the rest of the app running.
- `packages/*` — shared contracts, built only once both sides actually need them (Phase F onward).
- `prisma/` — the one source of truth for what data means.
- `infra/`, `.github/` — how it runs and ships, touched mainly in Phase J.
- `docs/` — this document and its siblings live here.

---

## 10. Frontend / Backend / DB / GitHub Evolution Over Time

| Stage | Frontend | Backend | Database | GitHub |
|---|---|---|---|---|
| MVP | Static-feeling pages, minimal state | CRUD + JWT only | 6 core tables | Connect + backfill + webhook, no fuzzy matching |
| Post-MVP | Charts, drill-down, real-time feel | Caching, queue jobs | Add scoring/versioning tables | Add fuzzy identity matching |
| Scale-up | Admin panel, notifications | Read replicas, materialized views | Partitioned time-series tables | Multi-repo support |
| Platform | SSO, white-label | Public API | Row-level security | Org-wide integration |

---

## 11. Master Roadmap — Final Ordered Deliverables

**Development roadmap:** Phase A → B → C → D → E → F → G → H → I → J (Section 7).

**Feature implementation order:** Auth → Workspace/Invites → Tasks → Manual Activity → Timeline → GitHub Connect → Backfill → Identity Mapping → Webhooks → Scoring v1 → Dashboard → Drill-down → CSV Export → (post-MVP) PDF, Alerts, Consistency Detection, Tagging, Admin.

**Page implementation order:** Landing → Login/Signup → Project List/Create → Empty Dashboard → Task Board → Log Activity → Timeline → GitHub Connect → Identity Mapping → Live Dashboard → Reports → Settings.

**Backend implementation order:** Health check → Auth → Workspace/Invitations → Tasks → Activities → Timeline aggregation → GitHub connect/backfill → Webhooks (accept, then process) → Score compute (queue) → Score persistence/API → Dashboard aggregation/cache → Reports.

**Database implementation order:** `users` → `projects` → `project_members` → `invitations` → `tasks`/`task_status_history` → `activities` → `activity_feed` → `github_integrations` → `commits`/`pull_requests`/`issues` → `contribution_scores` → `reports`.

**Testing order:** Auth unit tests (first, since everything depends on it) → CRUD integration tests → Webhook idempotency tests → Scoring engine deterministic fixture tests (highest priority for correctness) → E2E happy path → Load/security pass last, before deploy.

**Deployment order:** Dockerize each service → local `docker-compose` full-stack test → CI pipeline (lint/test) → provision managed Postgres/Redis → deploy staging → manual E2E smoke test on staging → deploy production → final documentation pass.

---

## Progress Checklist

- [ ] Phase A — Skeleton (backend health check + frontend shell running and talking)
- [ ] Phase B — Auth & Workspace
- [ ] Phase C — Task Board
- [ ] Phase D — Manual Activity Log
- [ ] Phase E — Unified Timeline
- [ ] Phase F — GitHub Integration
- [ ] Phase G — Scoring Engine v1
- [ ] Phase H — Dashboard Comes Alive
- [ ] Phase I — Reports & Polish
- [ ] Phase J — Hardening & Deployment

---

*This is the master execution blueprint. Everything built from here, session by session, should trace back to one line in Section 7 or Section 11.*
