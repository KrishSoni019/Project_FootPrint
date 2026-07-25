const LOG_LINES = [
  { hash: 'a3f9c21', msg: 'feat: contribution scoring engine' },
  { hash: '7d1e4b0', msg: 'fix: webhook signature verification' },
  { hash: 'c58e9aa', msg: 'chore: normalise commit timestamps to UTC' },
  { hash: '02b7f3d', msg: 'docs: update contribution index formula' },
];

/**
 * Purely decorative — echoes the terminal-log motif from the landing page.
 * Static content, no live data.
 */
export default function TerminalPreview() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="ml-2 font-mono text-[11px] text-zinc-500">footprint — log</span>
      </div>

      <div className="space-y-2 px-4 py-4 font-mono text-[12px] leading-relaxed">
        <p className="text-zinc-500">$ git log --author=&quot;you&quot; --oneline</p>
        {LOG_LINES.map((line) => (
          <p key={line.hash} className="truncate">
            <span className="text-emerald-400">{line.hash}</span>{' '}
            <span className="text-zinc-400">{line.msg}</span>
          </p>
        ))}
        <p className="flex items-center gap-1.5 pt-1 text-zinc-500">
          <span>&gt; tracking contribution</span>
          <span className="inline-block h-3.5 w-1.5 animate-pulse bg-emerald-400" />
        </p>
      </div>
    </div>
  );
}
