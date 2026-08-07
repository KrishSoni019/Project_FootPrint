function formatDeadline(deadline) {
  if (!deadline) return 'No deadline set';

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return 'No deadline set';

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * WorkspaceOverview
 *
 * The one card that reflects data we actually have on a project today:
 * name, description, role and deadline. Nothing here is invented.
 */
export default function WorkspaceOverview({ project }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-mist-500">
            Workspace
          </p>
          <h2 className="mt-1.5 font-display text-xl font-medium text-paper-100">
            {project.name}
          </h2>
          {project.description && (
            <p className="mt-1.5 text-sm text-mist-400">{project.description}</p>
          )}
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-trace-500/30 bg-trace-500/10 px-3 py-1 font-mono text-[11px] text-trace-400">
          <span className="h-1.5 w-1.5 rounded-full bg-trace-400" aria-hidden="true" />
          Setup in progress
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-ink-700/80 pt-5 sm:w-1/2">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-mist-500">
            Role
          </dt>
          <dd className="mt-1 text-sm font-medium text-paper-100">{project.role}</dd>
        </div>

        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-mist-500">
            Deadline
          </dt>
          <dd className="mt-1 text-sm font-medium text-paper-100">
            {formatDeadline(project.deadline)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
