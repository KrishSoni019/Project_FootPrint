/**
 * create-structure.js
 * Generates the full Project Footprint monorepo folder structure.
 *
 * Usage:
 *   node create-structure.js
 *
 * Safe to re-run: it will NOT overwrite files that already exist,
 * so re-running after you've started editing files won't wipe your work.
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// 1. List every file we want to create, with a one-line "responsibility"
//    comment as its placeholder content. Folders are created automatically
//    from these file paths. Empty folders (no files yet) use a .gitkeep.
// ---------------------------------------------------------------------------

const files = [
  // ---------- ROOT ----------
  ["README.md", "# Project Footprint\n\nMulti-source team contribution tracking & attribution system.\n"],
  ["CONTRIBUTING.md", "<!-- Contribution guidelines for this repo -->\n"],
  ["LICENSE", "MIT License placeholder"],
  [".env.example", "# Root-level shared environment variable reference\n"],
  ["package.json", JSON.stringify({ name: "project-footprint", private: true, workspaces: ["apps/*", "services/*", "packages/*"] }, null, 2)],
  ["pnpm-workspace.yaml", "packages:\n  - 'apps/*'\n  - 'services/*'\n  - 'packages/*'\n"],

  // ---------- .github/workflows ----------
  [".github/workflows/ci.yml", "# Runs lint + tests for frontend, api, and analysis on every push\n"],
  [".github/workflows/e2e.yml", "# Runs end-to-end tests across services\n"],
  [".github/workflows/lint.yml", "# Lint-only workflow for fast feedback on PRs\n"],
  [".github/workflows/release.yml", "# Builds and publishes release artifacts/images\n"],
  [".github/workflows/deploy-staging.yml", "# Deploys main branch to staging environment\n"],

  // ---------- apps/frontend ----------
  ["apps/frontend/package.json", JSON.stringify({ name: "frontend" }, null, 2)],
  ["apps/frontend/vite.config.js", "// Vite build/dev server configuration\n"],
  ["apps/frontend/tailwind.config.js", "// Tailwind CSS theme and content paths\n"],
  ["apps/frontend/postcss.config.js", "// PostCSS plugins config\n"],
  ["apps/frontend/.env.example", "# Frontend environment variables (API base URL, etc.)\n"],
  ["apps/frontend/public/robots.txt", "User-agent: *\n"],

  ["apps/frontend/src/app/App.jsx", "// Root application component\n"],
  ["apps/frontend/src/app/routes.jsx", "// Top-level route definitions\n"],
  ["apps/frontend/src/app/entry-client.jsx", "// Client-side entry point\n"],

  ["apps/frontend/src/core/api/axios-client.js", "// Configured Axios instance for API calls\n"],
  ["apps/frontend/src/core/api/auth-interceptor.js", "// Attaches/refreshes JWT on outgoing requests\n"],
  ["apps/frontend/src/core/api/endpoints.js", "// Centralized API endpoint path constants\n"],
  ["apps/frontend/src/core/auth/auth-context.jsx", "// React Context for current user/session state\n"],
  ["apps/frontend/src/core/auth/auth-types.js", "// TypeScript types for auth state/user\n"],
  ["apps/frontend/src/core/auth/session-storage.js", "// Token persistence helpers\n"],
  ["apps/frontend/src/core/config/env.js", "// Reads and validates Vite env variables\n"],
  ["apps/frontend/src/core/hooks/useToast.js", "// Shared toast/notification hook\n"],
  ["apps/frontend/src/core/styles/tailwind.css", "/* Tailwind base/components/utilities import */\n"],

  ["apps/frontend/src/features/dashboard/pages/DashboardPage.jsx", "// Main contribution dashboard page\n"],
  ["apps/frontend/src/features/dashboard/components/ContributionChart.jsx", "// Recharts-based contribution share chart\n"],
  ["apps/frontend/src/features/dashboard/components/Leaderboard.jsx", "// Ranked, evidence-linked leaderboard table\n"],
  ["apps/frontend/src/features/dashboard/hooks/useDashboardData.js", "// Fetches and caches dashboard aggregation data\n"],

  ["apps/frontend/src/features/projects/pages/ProjectListPage.jsx", "// Lists workspaces the user belongs to\n"],
  ["apps/frontend/src/features/projects/pages/ProjectSettingsPage.jsx", "// Workspace settings, invitations, roles\n"],
  ["apps/frontend/src/features/projects/components/InviteMemberModal.jsx", "// Invite-by-email/code modal\n"],

  ["apps/frontend/src/features/github-integration/pages/ConnectGithubPage.jsx", "// GitHub App/OAuth connection screen\n"],
  ["apps/frontend/src/features/github-integration/components/IdentityMappingTable.jsx", "// Unmatched-author identity mapping UI\n"],
  ["apps/frontend/src/features/github-integration/hooks/useBackfillStatus.js", "// Polls historical backfill job progress\n"],

  ["apps/frontend/src/features/reports/components/ExportReportButton.jsx", "// Triggers PDF/CSV report generation\n"],
  ["apps/frontend/src/features/reports/export/downloadReport.js", "// Handles report file download logic\n"],

  ["apps/frontend/src/features/notifications/components/NotificationBell.jsx", "// In-app notification dropdown\n"],
  ["apps/frontend/src/features/notifications/hooks/useNotifications.js", "// Fetches/marks notifications read\n"],

  ["apps/frontend/src/features/admin/pages/AdminPanelPage.jsx", "// Platform-level admin/moderation screen\n"],

  ["apps/frontend/src/features/shared/ui/Button.jsx", "// Base reusable button component\n"],
  ["apps/frontend/src/features/shared/form/FormField.jsx", "// Reusable form field wrapper\n"],
  ["apps/frontend/src/features/shared/charting/ChartTheme.js", "// Shared Recharts theme/colors\n"],

  ["apps/frontend/src/shared/components/PageLayout.jsx", "// Common page shell/layout wrapper\n"],
  ["apps/frontend/src/shared/hooks/useDebounce.js", "// Generic debounce hook\n"],
  ["apps/frontend/src/shared/utils/date.js", "// Date formatting helpers\n"],
  ["apps/frontend/src/shared/validation/schemas.js", "// Shared client-side validation schemas\n"],

  ["apps/frontend/src/types/api.js", "// Shared API response/request TS types\n"],
  ["apps/frontend/src/types/domain.js", "// Domain model types mirrored from backend\n"],

  ["apps/frontend/tests/component/DashboardPage.test.jsx", "// Component test for dashboard rendering\n"],
  ["apps/frontend/tests/integration/auth-flow.test.jsx", "// Integration test for signup/login flow\n"],

  // ---------- services/api ----------
  ["services/api/package.json", JSON.stringify({ name: "api" }, null, 2)],
  ["services/api/.env.example", "# API environment variables (DB, JWT secret, Redis, etc.)\n"],

  ["services/api/src/entry/app.js", "// Express app setup: middleware, routes mounted\n"],
  ["services/api/src/entry/server.js", "// HTTP server bootstrap/listen\n"],
  ["services/api/src/entry/routes.js", "// Top-level route registration\n"],

  ["services/api/src/features/auth/routes/auth.routes.js", "// /api/auth route definitions\n"],
  ["services/api/src/features/auth/controllers/auth.controller.js", "// Handles signup/login/refresh/logout requests\n"],
  ["services/api/src/features/auth/services/auth.service.js", "// Password hashing, JWT issuing/verifying logic\n"],
  ["services/api/src/features/auth/validators/auth.validators.js", "// Zod schemas for auth request bodies\n"],

  ["services/api/src/features/workspaces/routes/workspaces.routes.js", "// /api/projects route definitions\n"],
  ["services/api/src/features/workspaces/controllers/workspaces.controller.js", "// Workspace CRUD + invitations endpoints\n"],
  ["services/api/src/features/workspaces/services/workspaces.service.js", "// Workspace/membership business logic\n"],

  ["services/api/src/features/tasks/routes/tasks.routes.js", "// /api/tasks route definitions\n"],
  ["services/api/src/features/tasks/controllers/tasks.controller.js", "// Task CRUD + status transition endpoints\n"],
  ["services/api/src/features/tasks/services/tasks.service.js", "// Task business logic, status history writes\n"],

  ["services/api/src/features/github/routes/github.routes.js", "// GitHub connect/disconnect/status routes\n"],
  ["services/api/src/features/github/controllers/github.controller.js", "// GitHub connection request handlers\n"],
  ["services/api/src/features/github/services/github.service.js", "// Backfill orchestration, identity mapping logic\n"],
  ["services/api/src/features/github/adapters/octokit-client.js", "// Wrapped Octokit REST client\n"],
  ["services/api/src/features/github/webhooks/accept/github-webhook.controller.js", "// Verifies signature, enqueues payload, returns 200 fast\n"],
  ["services/api/src/features/github/webhooks/process/github-webhook.processor.js", "// Idempotent worker-side webhook event processing\n"],
  ["services/api/src/features/github/validators/github.validators.js", "// Zod schemas for GitHub-related requests\n"],

  ["services/api/src/features/reporting/routes/reporting.routes.js", "// Report generation/export routes\n"],
  ["services/api/src/features/reporting/controllers/reporting.controller.js", "// Handles PDF/CSV export requests\n"],
  ["services/api/src/features/reporting/services/reporting.service.js", "// Report content assembly logic\n"],
  ["services/api/src/features/reporting/score_snapshots/versions/v1.js", "// Score snapshot shape for algorithm v1\n"],

  ["services/api/src/features/notifications/routes/notifications.routes.js", "// Notification list/read routes\n"],
  ["services/api/src/features/notifications/controllers/notifications.controller.js", "// Notification request handlers\n"],
  ["services/api/src/features/notifications/services/notifications.service.js", "// Alert threshold checks, notification creation\n"],

  ["services/api/src/features/admin/routes/admin.routes.js", "// Platform admin-only routes\n"],
  ["services/api/src/features/admin/controllers/admin.controller.js", "// Admin action handlers\n"],

  ["services/api/src/features/analytics/routes/analytics.routes.js", "// Dashboard aggregation routes\n"],
  ["services/api/src/features/analytics/controllers/analytics.controller.js", "// Serves cached dashboard aggregation data\n"],
  ["services/api/src/features/analytics/services/analytics.service.js", "// Aggregation + Redis cache-aside logic\n"],

  ["services/api/src/domains/oltp/entities/User.js", "// OLTP domain entity: User\n"],
  ["services/api/src/domains/oltp/entities/Project.js", "// OLTP domain entity: Project/Workspace\n"],
  ["services/api/src/domains/oltp/use_cases/createProject.js", "// Use-case: create a new workspace\n"],

  ["services/api/src/domains/analytics/entities/ContributionScore.js", "// Analytics domain entity: contribution score\n"],
  ["services/api/src/domains/analytics/use_cases/computeScoreSnapshot.js", "// Use-case: request a score recompute\n"],

  ["services/api/src/core/config/env.js", "// Validated environment variable loader\n"],
  ["services/api/src/core/security/jwt/jwt.service.js", "// JWT sign/verify/refresh logic\n"],
  ["services/api/src/core/security/secrets.js", "// Encryption/decryption helpers for stored tokens\n"],
  ["services/api/src/core/security/secret-store.js", "// Access layer for encrypted secrets at rest\n"],
  ["services/api/src/core/db/prisma-client.js", "// Singleton Prisma client instance\n"],
  ["services/api/src/core/db/repositories/project-scoped/README.md", "<!-- Repositories that must always filter by project_id -->\n"],
  ["services/api/src/core/db/repositories/analytics/README.md", "<!-- Repositories reading time-series/analytical tables -->\n"],
  ["services/api/src/core/queue/bullmq.js", "// BullMQ queue/connection setup\n"],
  ["services/api/src/core/queue/jobs/score-request.job.js", "// Job definition: request a score computation\n"],
  ["services/api/src/core/queue/contracts/queue-contract.js", "// Shared job payload contract (Node side)\n"],
  ["services/api/src/core/logging/logger.js", "// Winston logger instance\n"],
  ["services/api/src/core/logging/winston-config.js", "// Winston transport/format configuration\n"],
  ["services/api/src/core/validation/middleware.js", "// Express middleware applying Zod schemas\n"],
  ["services/api/src/core/tenancy/project-context.js", "// Resolves current project_id from request\n"],
  ["services/api/src/core/tenancy/tenant-guards.js", "// Middleware enforcing project-scoped access\n"],

  ["services/api/src/jobs/enqueue/score-request.js", "// Enqueues a scoring job for the Python worker\n"],
  ["services/api/src/jobs/enqueue/github-sync-request.js", "// Enqueues a GitHub backfill/sync job\n"],
  ["services/api/src/jobs/workers/score-worker.js", "// Node-side listener for score job completion\n"],
  ["services/api/src/jobs/workers/github-webhook-worker.js", "// Worker processing queued webhook payloads\n"],

  ["services/api/src/shared/dto/README.md", "<!-- Shared data-transfer-object shapes -->\n"],
  ["services/api/src/shared/errors/AppError.js", "// Base application error class\n"],
  ["services/api/src/shared/helpers/pagination.js", "// Shared pagination helper\n"],

  ["services/api/src/utils/date.js", "// UTC date/time helpers\n"],
  ["services/api/src/utils/observability.js", "// Request tracing/metrics helpers\n"],

  ["services/api/tests/unit/auth.service.test.js", "// Unit tests for auth service\n"],
  ["services/api/tests/integration/webhook-processing.test.js", "// Integration test for webhook idempotency\n"],

  // ---------- services/analysis ----------
  ["services/analysis/pyproject.toml", "# Python project + dependency definitions\n"],
  ["services/analysis/README.md", "# Analysis engine (Python) — scoring worker\n"],
  ["services/analysis/.env.example", "# Analysis engine environment variables (Redis URL, etc.)\n"],

  ["services/analysis/src/entry/worker.py", "# Main entrypoint: starts the Redis queue listener\n"],
  ["services/analysis/src/entry/queue_listener.py", "# Listens for and dispatches incoming scoring jobs\n"],
  ["services/analysis/src/entry/startup.py", "# Loads config/env before worker starts\n"],

  ["services/analysis/src/contracts/queue_contract.py", "# Shared job payload contract (Python side)\n"],
  ["services/analysis/src/contracts/scoring_contract.py", "# Contract for score computation input/output shape\n"],
  ["services/analysis/src/contracts/weight_profile_contract.py", "# Contract for weight profile configuration shape\n"],

  ["services/analysis/src/adapters/redis/redis_client.py", "# Redis connection wrapper\n"],
  ["services/analysis/src/adapters/redis/redis_queue_adapter.py", "# Adapter translating queue messages to internal jobs\n"],
  ["services/analysis/src/adapters/logging/logger.py", "# Structured logging setup\n"],
  ["services/analysis/src/adapters/github/github_payload_adapter.py", "# Normalizes raw GitHub payloads for pipelines\n"],

  ["services/analysis/src/pipelines/cleaning/activity_cleaner.py", "# Filters bot/CI commits and duplicate events\n"],
  ["services/analysis/src/pipelines/extraction/metric_extractor.py", "# Extracts per-activity metrics from raw events\n"],
  ["services/analysis/src/pipelines/transform/normalize.py", "# Min-max/z-score normalization across indices\n"],
  ["services/analysis/src/pipelines/validation/schema_validator.py", "# Validates incoming payloads against contracts\n"],

  ["services/analysis/src/score_engine/versions/v1/score_calculator.py", "# Algorithm v1: five-index weighted scoring\n"],
  ["services/analysis/src/score_engine/versions/v1/weight_profile.py", "# Algorithm v1: default weight presets\n"],
  ["services/analysis/src/score_engine/versions/v1/docs.md", "<!-- Notes on algorithm v1 behavior -->\n"],
  ["services/analysis/src/score_engine/common/normalizers.py", "# Shared normalization helpers across versions\n"],
  ["services/analysis/src/score_engine/common/metrics.py", "# Shared metric calculation helpers\n"],
  ["services/analysis/src/score_engine/training/feature-engineering.py", "# Future: feature prep for scikit-learn models\n"],

  ["services/analysis/src/services/scoring_service.py", "# Orchestrates cleaning -> extraction -> scoring pipeline\n"],
  ["services/analysis/src/services/snapshot_service.py", "# Persists versioned score snapshots\n"],

  ["services/analysis/src/tests/unit/test_score_calculator.py", "# Deterministic fixture-based scoring tests\n"],
  ["services/analysis/src/tests/integration/test_redis_contract.py", "# Verifies queue contract compatibility\n"],
  ["services/analysis/src/tests/fixtures/sample_activity.json", "{}"],

  ["services/analysis/src/utils/env.py", "# Environment variable loader/validator\n"],
  ["services/analysis/src/utils/json_schema.py", "# JSON schema validation helpers\n"],

  ["services/analysis/fixtures/sample_github_payload.json", "{}"],
  ["services/analysis/fixtures/sample_taskboard_payload.json", "{}"],
  ["services/analysis/scripts/run_local_worker.sh", "#!/bin/sh\n# Starts the Python worker locally\n"],
  ["services/analysis/scripts/validate_contracts.py", "# Confirms TS and Python contracts stay in sync\n"],

  // ---------- packages/contracts ----------
  ["packages/contracts/package.json", JSON.stringify({ name: "@footprint/contracts" }, null, 2)],
  ["packages/contracts/src/ts/queue-job-contract.js", "// Shared TS type for queue job payloads\n"],
  ["packages/contracts/src/ts/scoring-profile-contract.js", "// Shared TS type for weight profile shape\n"],
  ["packages/contracts/src/ts/github-webhook-contract.js", "// Shared TS type for GitHub webhook payloads\n"],
  ["packages/contracts/src/python/queue_job_contract.py", "# Shared Python type for queue job payloads\n"],
  ["packages/contracts/src/python/scoring_profile_contract.py", "# Shared Python type for weight profile shape\n"],
  ["packages/contracts/tests/contract-parity.test.js", "// Confirms TS and Python contracts describe the same shape\n"],

  // ---------- packages/shared ----------
  ["packages/shared/package.json", JSON.stringify({ name: "@footprint/shared" }, null, 2)],
  ["packages/shared/src/constants/api-error-codes.js", "// Shared API error code enum\n"],
  ["packages/shared/src/constants/event-types.js", "// Shared event/activity type constants\n"],
  ["packages/shared/src/tenancy/project-id.js", "// Shared project_id type/validation helper\n"],
  ["packages/shared/src/utils/iso-dates.js", "// Shared UTC/ISO date helpers\n"],

  // ---------- prisma ----------
  ["prisma/schema.prisma", "// Prisma schema: users, projects, tasks, activities, scores\n"],
  ["prisma/seeds/seed.js", "// Seeds a local dev database with sample data\n"],
  ["prisma/docs/data-model.md", "<!-- Entity-relationship notes for the schema -->\n"],

  // ---------- infra ----------
  ["infra/compose/docker-compose.yml", "# Base compose: api, frontend, analysis, postgres, redis\n"],
  ["infra/compose/docker-compose.dev.yml", "# Dev overrides: hot reload, exposed ports\n"],
  ["infra/docker/api.Dockerfile", "# Builds the Node/Express API image\n"],
  ["infra/docker/frontend.Dockerfile", "# Builds and serves the React frontend\n"],
  ["infra/docker/analysis.Dockerfile", "# Builds the Python worker image\n"],
  ["infra/envs/dev/api.env", "# Dev-environment API variables\n"],
  ["infra/envs/dev/frontend.env", "# Dev-environment frontend variables\n"],
  ["infra/envs/dev/analysis.env", "# Dev-environment analysis engine variables\n"],
  ["infra/scripts/local-start.sh", "#!/bin/sh\n# Brings up the full local stack\n"],
  ["infra/scripts/migrate.sh", "#!/bin/sh\n# Runs Prisma migrations against target DB\n"],
  ["infra/docs/deployment.md", "<!-- How the app is deployed -->\n"],

  // ---------- docs ----------
  ["docs/architecture/index.md", "<!-- Architecture overview and diagrams -->\n"],
  ["docs/architecture/scoring-engine.md", "<!-- Deep dive on the five-index scoring model -->\n"],
  ["docs/architecture/multi-tenancy.md", "<!-- How project_id scoping is enforced -->\n"],
  ["docs/onboarding/developer-setup.md", "<!-- Local dev environment setup steps -->\n"],
  ["docs/product/roadmap.md", "<!-- Points to the master development roadmap -->\n"],
  ["docs/operations/security.md", "<!-- Security checklist and practices -->\n"],

  // ---------- tests (cross-service) ----------
  ["tests/e2e/frontend-api/dashboard-flow.spec.js", "// E2E: login -> view dashboard -> see scores\n"],
  ["tests/e2e/full-stack/multi-tenant-isolation.spec.js", "// E2E: confirms one project can't see another's data\n"],
  ["tests/integration/contracts/queue-contract.spec.js", "// Confirms Node enqueue matches Python consume contract\n"],
  ["tests/perf/worker-throughput.spec.js", "// Load test for the analysis engine worker\n"],
];

// Folders that should exist even if they have no files yet.
const emptyDirs = [
  "apps/frontend/src/features/reports/components",
  "apps/frontend/src/features/admin/components",
  "services/api/src/core/db/migrations",
  "services/analysis/src/tests/integration",
];

// ---------------------------------------------------------------------------
// 2. Create everything
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "project-footprint");

let createdFiles = 0;
let skippedFiles = 0;

for (const [relPath, content] of files) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  if (fs.existsSync(fullPath)) {
    skippedFiles++;
    continue;
  }

  fs.writeFileSync(fullPath, content, "utf8");
  createdFiles++;
}

for (const dir of emptyDirs) {
  const fullPath = path.join(ROOT, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  const keepFile = path.join(fullPath, ".gitkeep");
  if (!fs.existsSync(keepFile)) {
    fs.writeFileSync(keepFile, "", "utf8");
  }
}

console.log(`Done.`);
console.log(`  Created:  ${createdFiles} files`);
console.log(`  Skipped:  ${skippedFiles} files (already existed)`);
console.log(`  Root:     ${ROOT}`);
