const GoogleIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.99-4.32 2.99-7.31Z"
    />
    <path
      fill="#34A853"
      d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.23-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.06v2.59A10 10 0 0 0 10 20Z"
    />
    <path fill="#FBBC05" d="M4.41 11.91a6 6 0 0 1 0-3.82V5.5H1.06a10 10 0 0 0 0 9l3.35-2.59Z" />
    <path
      fill="#EA4335"
      d="M10 3.96c1.47 0 2.79.51 3.83 1.5l2.87-2.87C14.95.99 12.7 0 10 0 6.09 0 2.71 2.24 1.06 5.5l3.35 2.6C5.2 5.72 7.4 3.96 10 3.96Z"
    />
  </svg>
);

/**
 * UI only — no OAuth wiring yet.
 */
export default function GoogleButton({ children = 'Continue with Google', ...rest }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors duration-150 hover:bg-zinc-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
      {...rest}
    >
      <GoogleIcon />
      {children}
    </button>
  );
}
