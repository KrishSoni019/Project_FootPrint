import { Calendar } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const PRIORITY_STYLES = {
  LOW: 'border-ink-700 bg-ink-800 text-mist-400',
  MEDIUM: 'border-signal-500/30 bg-signal-500/10 text-signal-400',
  HIGH: 'border-flag-500/30 bg-flag-500/10 text-flag-400',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}

function formatDueDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

/**
 * TaskCard
 *
 * MVP status control is a plain <select>, not drag-and-drop — that's an
 * explicit Phase C boundary, kept for a later pass.
 */
export default function TaskCard({ task, onStatusChange, isUpdating }) {
  const dueDateLabel = formatDueDate(task.dueDate);

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-paper-100">{task.title}</p>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${
            PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.MEDIUM
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-mist-500">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <span
              title={task.assignee.user.name}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal-500/10 font-mono text-[10px] font-semibold text-signal-400 ring-1 ring-signal-500/30"
            >
              {getInitials(task.assignee.user.name)}
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-mist-600">
              Unassigned
            </span>
          )}

          {dueDateLabel && (
            <span className="flex items-center gap-1 text-[11px] text-mist-500">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              {dueDateLabel}
            </span>
          )}
        </div>
      </div>

      <select
        value={task.status}
        disabled={isUpdating}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        aria-label={`Change status for ${task.title}`}
        className="mt-3 w-full rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1.5 text-xs text-paper-100 outline-none transition-colors focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
