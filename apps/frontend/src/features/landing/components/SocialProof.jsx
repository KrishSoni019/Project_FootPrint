import { Github, GraduationCap, Timer, GitFork, Users, Building2 } from "lucide-react";

const CONTEXTS = [
  { label: "University capstones", Icon: GraduationCap },
  { label: "Hackathon teams", Icon: Timer },
  { label: "Open-source maintainers", Icon: GitFork },
  { label: "Distributed dev teams", Icon: Users },
  { label: "Bootcamp cohorts", Icon: GraduationCap },
  { label: "Agency pods", Icon: Building2 },
];

const LOOP = [...CONTEXTS, ...CONTEXTS];

export default function SocialProof() {
  return (
    <section className="border-y border-ink-700 bg-ink-900/60 py-10">
      <div className="mx-auto mb-6 flex w-full max-w-[1200px] items-center gap-3 px-6 md:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist-500">
          Built for teams like
        </span>
        <span className="h-px flex-1 bg-ink-700" />
        <span className="hidden items-center gap-1.5 font-mono text-[11px] text-mist-500 md:flex">
          <Github className="h-3.5 w-3.5" />
          Syncs directly with GitHub
        </span>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-900 to-transparent" />

        <div className="flex w-max animate-marquee gap-3 px-3 motion-reduce:animate-none">
          {LOOP.map(({ label, Icon }, i) => (
            <div
              key={`${label}-${i}`}
              className="flex flex-shrink-0 items-center gap-2 rounded-full border border-ink-700 bg-ink-850/70 px-4 py-2"
            >
              <Icon className="h-3.5 w-3.5 text-trace-400" />
              <span className="whitespace-nowrap font-mono text-[12px] text-paper-300">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
