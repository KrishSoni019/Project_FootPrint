import { forwardRef, useState } from 'react';
import FormField from './FormField';

const EyeIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" {...props}>
    <path
      d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="10"
      cy="10"
      r="2.25"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" {...props}>
    <path
      d="M2.5 2.5l15 15M8.35 8.4a2.25 2.25 0 0 0 3.2 3.2M5.6 5.7C3.2 7.1 1.5 10 1.5 10s3 6 8.5 6c1.5 0 2.8-.35 3.9-1.05M13.9 6.2C15.7 7.1 17 8.7 18.5 10c0 0-.6 1.1-1.7 2.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Password field with a visibility toggle.
 *
 * Forwards form props such as name, value and onChange
 * to the underlying FormField.
 */
const PasswordField = forwardRef(function PasswordField(
  {
    id,
    label,
    placeholder,
    autoComplete,
    ...rest
  },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      ref={ref}
      id={id}
      label={label}
      type={visible ? 'text' : 'password'}
      placeholder={placeholder}
      autoComplete={autoComplete}
      {...rest}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="rounded text-zinc-500 transition-colors hover:text-zinc-300 focus:outline-none focus-visible:text-emerald-400"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
});

export default PasswordField;