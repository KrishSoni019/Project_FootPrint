import { Link } from 'react-router-dom';
import { ArrowRight, Circle } from 'lucide-react';

const ONBOARDING_STEPS = [
  'Create workspace',
  'Add team members',
  'Connect GitHub repository',
  'Create tasks',
  'Start collecting evidence',
];

/**
 * EmptyWorkspaceState
 *
 * Shown when the authenticated user has zero projects. Points them
 * straight at the one action that unblocks everything else.
 *
 * "Create Workspace" links to /workspace/new, which doesn't exist as a
 * route yet — intentional per scope, wire it up when that page is built.
 */
export default function EmptyWorkspaceState() {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-wider text-signal-400/90">
        Getting started
      </p>

      <h1 className="mt-3 font-display text-3xl font-medium text-paper-100 sm:text-4xl">
        Welcome to FootPrint
      </h1>

      <p className="mt-3 max-w-md text-sm text-mist-400">
        Create your first workspace to start tracking contribution
        evidence.
      </p>

      <Link
        to="/workspace/new"
        className="mt-7 inline-flex items-center gap-2 rounded-lg bg-signal-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-all duration-150 hover:bg-signal-400 hover:shadow-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400/50"
      >
        Create Workspace
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>

      <ul className="mt-12 w-full max-w-xs space-y-3 text-left">
        {ONBOARDING_STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-3">
            <Circle className="h-4 w-4 shrink-0 text-mist-600" aria-hidden="true" />
            <span className="font-mono text-xs text-mist-600">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-mist-400">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
