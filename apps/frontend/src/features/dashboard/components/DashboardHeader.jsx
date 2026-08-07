/**
 * DashboardHeader
 *
 * Greets the real logged-in user and names the active workspace.
 * No placeholder copy, no invented data.
 */
export default function DashboardHeader({ userName, projectName, role }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <h1 className="font-display text-2xl font-medium text-paper-100 sm:text-3xl">
          Welcome back, {userName}
        </h1>
        <p className="mt-1.5 text-sm text-mist-400">
          Here's what's happening in {projectName}.
        </p>
      </div>

      {role && (
        <span className="inline-flex w-fit items-center rounded-full border border-signal-500/30 bg-signal-500/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-signal-400">
          {role}
        </span>
      )}
    </div>
  );
}
