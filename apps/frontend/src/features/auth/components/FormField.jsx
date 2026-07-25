import { forwardRef } from 'react';

/**
 * Generic labeled input field.
 * Static/UI-only for now — no validation, no error states wired up yet.
 * `rightSlot` lets PasswordField drop a toggle button inside the input.
 */
const FormField = forwardRef(function FormField(
  { id, label, type = 'text', placeholder, autoComplete, rightSlot, ...rest },
  ref
) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-mono text-xs uppercase tracking-wider text-zinc-400"
      >
        {label}
      </label>

      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors duration-150 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
          {...rest}
        />

        {rightSlot ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default FormField;
