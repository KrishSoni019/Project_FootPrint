import { Github, ListTodo, Activity, BarChart3 } from 'lucide-react';

const SOURCES = [
  { label: 'GitHub', status: 'Not connected', icon: Github },
  { label: 'Tasks', status: 'No tasks yet', icon: ListTodo },
  { label: 'Activity', status: 'No activity recorded', icon: Activity },
  { label: 'Analysis', status: 'Not enough evidence', icon: BarChart3 },
];

/**
 * EvidenceOverview
 *
 * Every evidence source FootPrint will eventually pull from, shown
 * honestly at zero. No invented counts.
 */
export default function EvidenceOverview() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {SOURCES.map((source) => {
        const Icon = source.icon;
        return (
          <div
            key={source.label}
            className="rounded-lg border border-ink-700 bg-ink-900/50 p-4"
          >
            <Icon className="h-4 w-4 text-mist-500" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-paper-100">{source.label}</p>
            <p className="mt-0.5 text-xs text-mist-500">{source.status}</p>
          </div>
        );
      })}
    </div>
  );
}
