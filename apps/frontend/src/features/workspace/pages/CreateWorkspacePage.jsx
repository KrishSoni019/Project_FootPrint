import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

const fieldClasses =
  'w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-mist-600 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20';

const labelClasses =
  'block font-mono text-xs uppercase tracking-wider text-mist-500';

/**
 * CreateWorkspacePage
 *
 * The one action that unblocks a brand-new account: create a project,
 * which the backend turns into a Project row + an OWNER ProjectMember row.
 *
 * POST /api/projects
 */
export default function CreateWorkspacePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
  });

  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      return 'Workspace name is required.';
    }

    if (trimmedName.length > 100) {
      return 'Workspace name must be under 100 characters.';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(deadlineDate.getTime())) {
        return 'Enter a valid deadline.';
      }

      if (deadlineDate < today) {
        return 'Deadline cannot be in the past.';
      }
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError('');

    const validationError = validate();
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError('');

    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          deadline: formData.deadline || undefined,
        }),
      });

      if (response.status === 401) {
        clearAuthToken();
        navigate('/login');
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setApiError(
          data.message || data.error || 'Could not create the workspace. Please try again.'
        );
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Create workspace request failed:', error);
      setApiError('Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-mist-400 transition-colors hover:text-paper-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to dashboard
        </Link>

        <div className="rounded-xl border border-ink-700 bg-ink-900/50 p-8">
          <p className="font-mono text-[11px] uppercase tracking-wider text-signal-400/90">
            New workspace
          </p>

          <h1 className="mt-1.5 font-display text-2xl font-medium text-paper-100">
            Create your workspace
          </h1>

          <p className="mt-2 text-sm text-mist-400">
            This becomes the container for your team, tasks, and contribution
            evidence.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="name" className={labelClasses}>
                Workspace Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Project FootPrint"
                autoComplete="off"
                value={formData.name}
                onChange={handleChange}
                className={fieldClasses}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className={labelClasses}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="MCA mini project — contribution tracking for a 4-person team"
                value={formData.description}
                onChange={handleChange}
                className={`${fieldClasses} resize-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="deadline" className={labelClasses}>
                Deadline
                <span className="ml-1 normal-case tracking-normal text-mist-600">
                  (optional)
                </span>
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className={`${fieldClasses} [color-scheme:dark]`}
              />
            </div>

            {(fieldError || apiError) && (
              <div
                role="alert"
                className="rounded-lg border border-flag-500/20 bg-flag-500/10 px-4 py-3 text-sm text-flag-400"
              >
                {fieldError || apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-signal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition-all duration-150 hover:bg-signal-400 hover:shadow-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400/50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950"
                  />
                  Creating workspace…
                </>
              ) : (
                'Create Workspace'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
