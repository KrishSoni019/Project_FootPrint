import TaskCard from './TaskCard';

const COLUMNS = [
  { status: 'TODO', label: 'To Do' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'COMPLETED', label: 'Completed' },
];

/**
 * TaskBoard
 *
 * Simple three-column board. Grouping happens on every render from the
 * flat `tasks` array — no separate per-column state to keep in sync.
 */
export default function TaskBoard({ tasks, onStatusChange, updatingTaskId }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <div key={column.status} className="rounded-xl border border-ink-700 bg-ink-900/40 p-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-mono text-xs font-medium uppercase tracking-wider text-mist-400">
                {column.label}
              </h2>
              <span className="rounded-full border border-ink-700 bg-ink-800 px-2 py-0.5 font-mono text-[10px] text-mist-500">
                {columnTasks.length}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {columnTasks.length === 0 ? (
                <p className="rounded-lg border border-dashed border-ink-700 px-3 py-6 text-center text-xs text-mist-600">
                  No tasks here yet.
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    isUpdating={updatingTaskId === task.id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
