import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getAuthToken, clearAuthToken } from '../../auth/utils/authToken';

const API_BASE_URL = 'http://localhost:5000';

/**
 * AddMemberModal
 *
 * Adds an EXISTING FootPrint user to a project by email. There is no
 * invitation system yet — the person must already have an account, and
 * the backend returns a clear 404 if they don't.
 *
 * POST /api/projects/:projectId/members
 */
export default function AddMemberModal({ projectId, isOpen, onClose, onMemberAdded }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setFieldError('');
      setApiError('');
      // Focus the input once the entrance animation has started.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setFieldError('Email is required.');
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setFieldError('Enter a valid email address.');
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
      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: trimmedEmail }),
        }
      );

      if (response.status === 401) {
        clearAuthToken();
        navigate('/login');
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setApiError(data.message || 'Could not add this member. Please try again.');
        return;
      }

      onMemberAdded(data.member);
      onClose();
    } catch (error) {
      console.error('Add member request failed:', error);
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
            aria-labelledby="add-member-title"
            className="relative w-full max-w-sm rounded-xl border border-ink-700 bg-ink-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2
                  id="add-member-title"
                  className="font-display text-lg font-medium text-paper-100"
                >
                  Add a member
                </h2>
                <p className="mt-1 text-sm text-mist-400">
                  They need an existing FootPrint account.
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
                  htmlFor="member-email"
                  className="block font-mono text-xs uppercase tracking-wider text-mist-500"
                >
                  Email
                </label>
                <input
                  ref={inputRef}
                  id="member-email"
                  type="email"
                  placeholder="teammate@example.com"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-mist-600 outline-none transition-colors duration-150 focus:border-signal-500/60 focus:ring-2 focus:ring-signal-500/20"
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
                      Adding…
                    </>
                  ) : (
                    'Add Member'
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
