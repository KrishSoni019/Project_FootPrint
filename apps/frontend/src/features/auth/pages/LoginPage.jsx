import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import GoogleButton from '../components/GoogleButton';
import AuthDivider from '../components/AuthDivider';
import TerminalPreview from '../components/TerminalPreview';
import { setAuthToken } from '../utils/authToken';
import { useWorkspace } from '../../workspace/context/WorkspaceContext';

/**
 * LoginPage
 *
 * Handles authentication through:
 * POST /api/auth/login
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { reloadWorkspace } = useWorkspace();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid email or password.');
        return;
      }

      setAuthToken(data.token);

      // Refresh the shared workspace state now that we have a fresh token,
      // so Dashboard doesn't briefly render with a previous session's (or
      // no) workspace data before its own load kicks in.
      await reloadWorkspace();

      setSuccessMessage(`Welcome back, ${data.user.name}.`);

      setFormData({
        email: '',
        password: '',
      });

      navigate('/dashboard');

    } catch (error) {
      console.error('Login request failed:', error);

      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Left branding panel — hidden below lg */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-ink-700/80 px-12 py-12 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />

        <Link to="/" className="relative flex items-center gap-2">
          <span className="font-display text-lg font-medium text-paper-100">
            FootPrint
          </span>
        </Link>

        <div className="relative flex flex-1 items-center justify-center py-16">
          <TerminalPreview />
        </div>

        <div className="relative max-w-sm">
          <p className="font-display text-2xl leading-snug text-paper-100">
            Turning invisible effort into visible evidence.
          </p>

          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-mist-400/70">
            commits · tasks · activity · analysis
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 lg:hidden"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-500/10 font-mono text-sm font-semibold text-signal-400 ring-1 ring-signal-500/30">
              fp
            </span>

            <span className="font-display text-lg font-medium text-paper-100">
              FootPrint
            </span>
          </Link>

          <h1 className="font-display text-3xl font-medium text-paper-100">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-mist-400">
            Sign in to see where your team's effort actually went.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
            noValidate
          >
            <FormField
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <PasswordField
                id="password"
                name="password"
                label="Password"
                placeholder="Your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />

              <div className="flex justify-end">
                <span className="cursor-not-allowed text-xs font-medium text-mist-400/60">
                  Forgot password?
                </span>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400"
              >
                {successMessage}
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

                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="my-6">
            <AuthDivider />
          </div>

          <GoogleButton />

          <p className="mt-8 text-center text-sm text-mist-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-signal-400 hover:text-signal-500 focus:outline-none focus-visible:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
