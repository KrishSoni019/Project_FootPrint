export default function AuthDivider({ text = 'or continue with' }) {
  return (
    <div className="flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-zinc-800" />
      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
        {text}
      </span>
      <span className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}
