import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import GoogleButton from '../components/GoogleButton';
import AuthDivider from '../components/AuthDivider';
import TerminalPreview from '../components/TerminalPreview';

/**
 * RegisterPage — UI only.
 *
 * No form state library, no validation, no API calls, no context/hooks.
 * `isLoading` is local, demo-only state that fakes the button's loading
 * style on submit — swap the setTimeout for the real
 * POST /api/auth/signup call once the auth backend exists.
 */
export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1600); // demo only
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
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-500/10 font-mono text-sm font-semibold text-signal-400 ring-1 ring-signal-500/30">
            fp
          </span>
          <span className="font-display text-lg font-medium text-paper-100">FootPrint</span>
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
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-500/10 font-mono text-sm font-semibold text-signal-400 ring-1 ring-signal-500/30">
              fp
            </span>
            <span className="font-display text-lg font-medium text-paper-100">FootPrint</span>
          </Link>

          <h1 className="font-display text-3xl font-medium text-paper-100">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            Start tracking real contribution, not just commit count.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <FormField
              id="fullName"
              label="Full Name"
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <PasswordField
              id="password"
              label="Password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />

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
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="my-6">
            <AuthDivider />
          </div>

          <GoogleButton />

          <p className="mt-8 text-center text-sm text-mist-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-signal-400 hover:text-signal-500 focus:outline-none focus-visible:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}