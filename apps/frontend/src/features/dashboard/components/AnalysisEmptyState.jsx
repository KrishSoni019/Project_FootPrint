import { Code2, ListChecks, Users2, LineChart, FileEdit } from 'lucide-react';

const DIMENSIONS = [
  { label: 'Code Activity', icon: Code2 },
  { label: 'Task Completion', icon: ListChecks },
  { label: 'Collaboration', icon: Users2 },
  { label: 'Consistency', icon: LineChart },
  { label: 'Non-Code Contribution', icon: FileEdit },
];

/**
 * AnalysisEmptyState
 *
 * Explains what contribution analysis WILL become — five weighted
 * indices — without assigning a single fake percentage before the
 * Python engine exists.
 */
export default function AnalysisEmptyState() {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/50 p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-mist-500">
        Contribution Analysis
      </p>

      <p className="mt-2 max-w-lg text-sm text-mist-400">
        Contribution analysis will appear once enough evidence has been
        collected from GitHub, tasks, and manual activity.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {DIMENSIONS.map((dimension) => {
          const Icon = dimension.icon;
          return (
            <div
              key={dimension.label}
              className="flex items-center justify-between rounded-lg border border-dashed border-ink-700 px-3.5 py-2.5"
            >
              <span className="flex items-center gap-2.5 text-sm text-mist-400">
                <Icon className="h-4 w-4 text-mist-500" aria-hidden="true" />
                {dimension.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mist-600">
                Waiting for evidence
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
