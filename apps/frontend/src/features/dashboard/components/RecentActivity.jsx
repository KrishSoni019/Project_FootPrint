import { Inbox } from 'lucide-react';

/**
 * RecentActivity
 *
 * Empty until the unified timeline (commits + tasks + manual activity)
 * has a backend to read from.
 */
export default function RecentActivity() {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/50 p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-mist-500">
        Recent Activity
      </p>

      <div className="mt-6 flex flex-col items-center py-8 text-center">
        <Inbox className="h-8 w-8 text-mist-600" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-paper-100">
          No contribution activity yet.
        </p>
        <p className="mt-1.5 max-w-xs text-xs text-mist-500">
          Commits, task updates and manual activities will appear here as
          your team starts working.
        </p>
      </div>
    </div>
  );
}
