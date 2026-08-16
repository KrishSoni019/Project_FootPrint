import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
  assigneeId: '',
};

/**
 * CreateTaskModal
 *
 * POST /api/projects/:projectId/tasks
 *
 * `members` is the project's member list (same shape as MembersPage uses)
 * so the assignee dropdown only ever offers people who actually belong to
 * this workspace — the backend re-checks this anyway, but the UI shouldn't
 * offer choices it knows will be rejected.
 */
export default function CreateTaskModal({ projectId, members, isOpen, onClose, onTaskCreated }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setFieldError('');
      setApiError('');
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const updateField = (field) => (e) => {
    setForm((current) => ({ ...current, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const trimmedTitle = form.title.trim();

    if (!trimmedTitle) {
      setFieldError('Title is required.');
      return;
    }

    if (trimmedTitle.length < 2) {
      setFieldError('Title must be at least 2 characters.');
      return;
    }

    setFieldError('');

    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);

    const payload = {
      title: trimmedTitle,
      priority: form.priority,
    };

    if (form.description.trim()) payload.description = form.description.trim();
    if (form.dueDate) payload.dueDate = new Date(form.dueDate).toISOString();
    if (form.assigneeId) payload.assigneeId = Number(form.assigneeId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        clearAuthToken();
        navigate('/login');
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setApiError(data.message || 'Could not create this task. Please try again.');
        return;
      }

      onTaskCreated(data.task);
      onClose();
    } catch (error) {
      console.error('Create task request failed:', error);
      setApiError('Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-task-title"
            className="relative w-full max-w-md rounded-xl border border-ink-700 bg-ink-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2
                  id="create-task-title"
                  className="font-display text-lg font-medium text-paper-100"
                >
                  New task
                </h2>
                <p className="mt-1 text-sm text-mist-400">
                  Add a task to this workspace's board.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1 text-mist-500 transition-colors hover:bg-ink-800 hover:text-paper-100"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="task-title"
                  className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                >
                  Title
                </label>
                <input
                  ref={inputRef}
                  id="task-title"
                  type="text"
                  placeholder="Set up CI pipeline"
                  autoComplete="off"
                  value={form.title}
                  onChange={updateField('title')}
                  className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-mist-600 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="task-description"
                  className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  rows={2}
                  placeholder="Optional details…"
                  value={form.description}
                  onChange={updateField('description')}
                  className="w-full resize-none rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-mist-600 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="task-priority"
                    className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                  >
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={form.priority}
                    onChange={updateField('priority')}
                    className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="task-due-date"
                    className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                  >
                    Due date
                  </label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={form.dueDate}
                    onChange={updateField('dueDate')}
                    className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="task-assignee"
                  className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                >
                  Assignee
                </label>
                <select
                  id="task-assignee"
                  value={form.assigneeId}
                  onChange={updateField('assigneeId')}
                  className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>

              {(fieldError || apiError) && (
                <div
                  role="alert"
                  className="rounded-lg border border-flag-500/20 bg-flag-500/10 px-4 py-3 text-sm text-flag-400"
                >
                  {fieldError || apiError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-mist-400 transition-colors hover:text-paper-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-signal-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-all duration-150 hover:bg-signal-400 hover:shadow-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400/50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950"
                      />
                      Creating…
                    </>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
