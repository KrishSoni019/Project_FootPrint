import { CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { label: 'Workspace created', done: true },
  { label: 'Add team members', done: false },
  { label: 'Connect GitHub repository', done: false },
  { label: 'Create first task', done: false },
  { label: 'Record first activity', done: false },
];

/**
 * SetupChecklist
 *
 * Reflects the REAL current state of the app. Only "Workspace created"
 * can honestly be marked complete right now — every other step lights up
 * once its backend exists and actually has data to check against.
 */
export default function SetupChecklist() {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/50 p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-mist-500">
        Getting Started
      </p>

      <ul className="mt-4 space-y-3.5">
        {STEPS.map((step) => (
          <li key={step.label} className="flex items-center gap-3">
            {step.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-trace-400" aria-hidden="true" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-mist-600" aria-hidden="true" />
            )}
            <span className={`text-sm ${step.done ? 'text-paper-100' : 'text-mist-400'}`}>
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
