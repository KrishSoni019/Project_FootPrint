import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

const ACTIVITY_TYPES = [
  { value: 'RESEARCH', label: 'Research' },
  { value: 'DOCUMENTATION', label: 'Documentation' },
  { value: 'TESTING', label: 'Testing' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'MEETING', label: 'Meeting' },
];

const EMPTY_FORM = {
  type: 'RESEARCH',
  title: '',
  description: '',
  evidenceUrl: '',
  activityDate: '',
};

// yyyy-mm-dd for the <input type="date"> — activityDate comes back from the
// API as a full ISO timestamp, so this trims it down for editing.
function toDateInputValue(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

/**
 * CreateActivityModal
 *
 * Doubles as the edit modal: pass an `activity` prop to switch it into edit
 * mode (PATCH /api/activities/:id) instead of create mode
 * (POST /api/projects/:projectId/activities). This mirrors CreateTaskModal
 * for creation, with editing folded in rather than a second modal file,
 * since editable fields are identical minus type (immutable — see below).
 *
 * memberId and projectId are never part of the form payload — the backend
 * derives memberId from the authenticated user, and projectId/memberId
 * aren't editable from the frontend per Phase D scope.
 */
export default function CreateActivityModal({
  projectId,
  isOpen,
  onClose,
  activity,
  onActivityCreated,
  onActivityUpdated,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const isEditMode = Boolean(activity);

  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(
        isEditMode
          ? {
              type: activity.type,
              title: activity.title ?? '',
              description: activity.description ?? '',
              evidenceUrl: activity.evidenceUrl ?? '',
              activityDate: toDateInputValue(activity.activityDate),
            }
          : EMPTY_FORM
      );
      setFieldError('');
      setApiError('');
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isEditMode, activity]);

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
    const trimmedDescription = form.description.trim();

    if (!trimmedTitle) {
      setFieldError('Title is required.');
      return;
    }

    if (trimmedTitle.length < 2) {
      setFieldError('Title must be at least 2 characters.');
      return;
    }

    if (!trimmedDescription) {
      setFieldError('Description is required.');
      return;
    }

    if (!form.activityDate) {
      setFieldError('Activity date is required.');
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
      type: form.type,
      title: trimmedTitle,
      description: trimmedDescription,
      activityDate: new Date(form.activityDate).toISOString(),
    };

    // Optional field — only send it when present, and explicitly send null
    // on edit if the person clears a previously-set evidence link.
    if (form.evidenceUrl.trim()) {
      payload.evidenceUrl = form.evidenceUrl.trim();
    } else if (isEditMode) {
      payload.evidenceUrl = null;
    }

    const url = isEditMode
      ? `${API_BASE_URL}/api/activities/${activity.id}`
      : `${API_BASE_URL}/api/projects/${projectId}/activities`;
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
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
        setApiError(
          data.message ||
            `Could not ${isEditMode ? 'update' : 'create'} this activity. Please try again.`
        );
        return;
      }

      if (isEditMode) {
        onActivityUpdated(data.activity);
      } else {
        onActivityCreated(data.activity);
      }
      onClose();
    } catch (error) {
      console.error(`${isEditMode ? 'Update' : 'Create'} activity request failed:`, error);
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
            aria-labelledby="activity-modal-title"
            className="relative w-full max-w-md rounded-xl border border-ink-700 bg-ink-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2
                  id="activity-modal-title"
                  className="font-display text-lg font-medium text-paper-100"
                >
                  {isEditMode ? 'Edit activity' : 'Log an activity'}
                </h2>
                <p className="mt-1 text-sm text-mist-400">
                  {isEditMode
                    ? "Update this logged activity's details."
                    : 'Record non-code work with optional evidence.'}
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
                  htmlFor="activity-type"
                  className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                >
                  Type
                </label>
                <select
                  id="activity-type"
                  value={form.type}
                  onChange={updateField('type')}
                  className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                >
                  {ACTIVITY_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="activity-title"
                  className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                >
                  Title
                </label>
                <input
                  ref={inputRef}
                  id="activity-title"
                  type="text"
                  placeholder="Competitor research for scoring UI"
                  autoComplete="off"
                  value={form.title}
                  onChange={updateField('title')}
                  className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-mist-600 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="activity-description"
                  className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                >
                  Description
                </label>
                <textarea
                  id="activity-description"
                  rows={3}
                  placeholder="What did you do, and what came out of it?"
                  value={form.description}
                  onChange={updateField('description')}
                  className="w-full resize-none rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-mist-600 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="activity-date"
                    className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                  >
                    Activity date
                  </label>
                  <input
                    id="activity-date"
                    type="date"
                    value={form.activityDate}
                    onChange={updateField('activityDate')}
                    className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="activity-evidence"
                    className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                  >
                    Evidence URL
                  </label>
                  <input
                    id="activity-evidence"
                    type="url"
                    placeholder="Optional link"
                    autoComplete="off"
                    value={form.evidenceUrl}
                    onChange={updateField('evidenceUrl')}
                    className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-mist-600 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
                  />
                </div>
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
                      {isEditMode ? 'Saving…' : 'Logging…'}
                    </>
                  ) : isEditMode ? (
                    'Save Changes'
                  ) : (
                    'Log Activity'
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
