import { Calendar, CheckCircle2, ExternalLink, FileText, FlaskConical, ListPlus, PenTool, Search, Users } from 'lucide-react';

// One entry per normalized event `type` the backend can emit (TASK_CREATED,
// TASK_COMPLETED, and the five ManualActivity types). Mirrors the
// TYPE_LABELS / TYPE_STYLES split already used by ActivityCard, extended
// with an icon and a dedicated dot color so the two task events read as
// distinct from a logged activity at a glance.
const TYPE_META = {
  TASK_CREATED: {
    label: 'Task Created',
    icon: ListPlus,
    badgeClass: 'border-ink-700 bg-ink-800 text-mist-400',
    dotClass: 'bg-ink-800 text-mist-400 ring-ink-700',
  },
  TASK_COMPLETED: {
    label: 'Task Completed',
    icon: CheckCircle2,
    badgeClass: 'border-trace-500/30 bg-trace-500/10 text-trace-400',
    dotClass: 'bg-trace-500/10 text-trace-400 ring-trace-500/30',
  },
  RESEARCH: {
    label: 'Research',
    icon: Search,
    badgeClass: 'border-signal-500/30 bg-signal-500/10 text-signal-400',
    dotClass: 'bg-signal-500/10 text-signal-400 ring-signal-500/30',
  },
  DOCUMENTATION: {
    label: 'Documentation',
    icon: FileText,
    badgeClass: 'border-ink-700 bg-ink-800 text-mist-400',
    dotClass: 'bg-ink-800 text-mist-400 ring-ink-700',
  },
  TESTING: {
    label: 'Testing',
    icon: FlaskConical,
    badgeClass: 'border-flag-500/30 bg-flag-500/10 text-flag-400',
    dotClass: 'bg-flag-500/10 text-flag-400 ring-flag-500/30',
  },
  DESIGN: {
    label: 'Design',
    icon: PenTool,
    badgeClass: 'border-signal-500/30 bg-signal-500/10 text-signal-400',
    dotClass: 'bg-signal-500/10 text-signal-400 ring-signal-500/30',
  },
  MEETING: {
    label: 'Meeting',
    icon: Users,
    badgeClass: 'border-ink-700 bg-ink-800 text-mist-400',
    dotClass: 'bg-ink-800 text-mist-400 ring-ink-700',
  },
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}

// "Today" / "Yesterday" / "19 Aug 2026" — same shape as the date formatters
// already used by TaskCard/ActivityCard, just with the two near-term cases
// spelled out since a timeline is read chronologically far more often.
function formatEventTimestamp(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// A TASK event's headline is an action on its title ("Created / Completed
// <title>"); a manual activity's headline is just its own title, same as
// ActivityCard — the type badge already says what kind of work it was.
function getHeadline(event) {
  if (event.type === 'TASK_CREATED') return `Created "${event.title}"`;
  if (event.type === 'TASK_COMPLETED') return `Completed "${event.title}"`;
  return event.title;
}

/**
 * TimelineEvent
 *
 * One row on the vertical contribution timeline. `isLast` suppresses the
 * connector line below the final entry so the rail doesn't dangle past the
 * last dot.
 */
export default function TimelineEvent({ event, isLast }) {
  const meta = TYPE_META[event.type] ?? TYPE_META.DOCUMENTATION;
  const Icon = meta.icon;
  const memberName = event.member?.user?.name;
  const timestampLabel = formatEventTimestamp(event.timestamp);

  return (
    <li className={`relative pl-9 ${isLast ? '' : 'pb-6'}`}>
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[13px] top-7 bottom-[-1.5rem] w-px bg-ink-700"
        />
      )}

      <span
        aria-hidden="true"
        className={`absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-full ring-1 ${meta.dotClass}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>

      <div className="rounded-lg border border-ink-700 bg-ink-900/60 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
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
            <p className="truncate text-sm font-medium text-paper-100">
              {memberName || 'Unknown member'}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${meta.badgeClass}`}
          >
            {meta.label}
          </span>
        </div>

        <p className="mt-2 text-sm text-paper-100">{getHeadline(event)}</p>

        {event.type !== 'TASK_CREATED' && event.type !== 'TASK_COMPLETED' && event.description && (
          <p className="mt-1 line-clamp-2 text-xs text-mist-500">{event.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {timestampLabel && (
            <span className="flex items-center gap-1 text-[11px] text-mist-500">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              {timestampLabel}
            </span>
          )}

          {event.evidenceUrl && (
            <a
              href={event.evidenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium text-signal-400 transition-colors hover:text-signal-500"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              View evidence
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
