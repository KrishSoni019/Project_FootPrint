import { Calendar, ExternalLink, Pencil } from 'lucide-react';

const TYPE_LABELS = {
  RESEARCH: 'Research',
  DOCUMENTATION: 'Documentation',
  TESTING: 'Testing',
  DESIGN: 'Design',
  MEETING: 'Meeting',
};

const TYPE_STYLES = {
  RESEARCH: 'border-signal-500/30 bg-signal-500/10 text-signal-400',
  DOCUMENTATION: 'border-ink-700 bg-ink-800 text-mist-400',
  TESTING: 'border-flag-500/30 bg-flag-500/10 text-flag-400',
  DESIGN: 'border-signal-500/30 bg-signal-500/10 text-signal-400',
  MEETING: 'border-ink-700 bg-ink-800 text-mist-400',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}

function formatActivityDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * ActivityCard
 *
 * Mirrors TaskCard's layout conventions (type badge in the top-right corner,
 * member initials, muted meta row) but for a manually logged, non-code
 * activity rather than a board task. There's no status control here — a
 * logged activity doesn't move through states the way a task does; the only
 * per-card action is editing.
 */
export default function ActivityCard({ activity, onEdit }) {
  const dateLabel = formatActivityDate(activity.activityDate);
  const memberName = activity.member?.user?.name;

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-paper-100">{activity.title}</p>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${
            TYPE_STYLES[activity.type] ?? TYPE_STYLES.DOCUMENTATION
          }`}
        >
          {TYPE_LABELS[activity.type] ?? activity.type}
        </span>
      </div>

      {activity.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-mist-500">{activity.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {memberName ? (
            <span
              title={memberName}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal-500/10 font-mono text-[10px] font-semibold text-signal-400 ring-1 ring-signal-500/30"
            >
              {getInitials(memberName)}
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-mist-600">
              Unknown member
            </span>
          )}

          {dateLabel && (
            <span className="flex items-center gap-1 text-[11px] text-mist-500">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              {dateLabel}
            </span>
          )}
        </div>

        {activity.evidenceUrl && (
          <a
            href={activity.evidenceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium text-signal-400 transition-colors hover:text-signal-500"
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            Evidence
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={() => onEdit(activity)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1.5 text-xs text-mist-400 transition-colors hover:border-ink-600 hover:text-paper-100"
      >
        <Pencil className="h-3 w-3" aria-hidden="true" />
        Edit
      </button>
    </div>
  );
}
