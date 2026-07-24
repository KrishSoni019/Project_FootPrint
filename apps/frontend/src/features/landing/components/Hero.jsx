import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Github,
  GitCommit,
  GitPullRequest,
  CheckSquare,
  PenLine,
} from "lucide-react";
import { fadeUp, viewportOnce } from "../lib/motion.js";

const LOG_LINES = [
  {
    tag: "commit",
    tone: "trace",
    detail: "a3f9c2 · +142 −18 · auth/session.ts",
    Icon: GitCommit,
  },
  {
    tag: "task",
    tone: "signal",
    detail: 'done · "Set up CI pipeline"',
    Icon: CheckSquare,
  },
  {
    tag: "log",
    tone: "mist",
    detail: "+docs · research notes attached",
    Icon: PenLine,
  },
  {
    tag: "review",
    tone: "trace",
    detail: "merged · PR #48 reviewed by Priya",
    Icon: GitPullRequest,
  },
];

const TONE_CLASS = {
  trace: "text-trace-400",
  signal: "text-signal-400",
  mist: "text-mist-400",
};

function EvidenceConsole() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.32, delayChildren: 0.4 },
    },
  };

  const line = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[32px] bg-trace-500/10 blur-3xl" />

      <div className="rounded-2xl border border-ink-700 bg-ink-850/90 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-ink-700 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-flag-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-trace-500/70" />
          <span className="ml-2 font-mono text-[11px] tracking-wide text-mist-500">
            footprint · live-trail.log
          </span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="space-y-2.5 px-5 py-5"
        >
          {LOG_LINES.map(({ tag, tone, detail, Icon }) => (
            <motion.div
              key={tag}
              variants={line}
              className="flex items-center gap-2.5 font-mono text-[12.5px]"
            >
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${TONE_CLASS[tone]}`} />
              <span className={`w-14 flex-shrink-0 uppercase ${TONE_CLASS[tone]}`}>
                {tag}
              </span>
              <span className="truncate text-paper-300">{detail}</span>
            </motion.div>
          ))}

          <motion.div
            variants={line}
            className="flex items-center gap-2 pt-1 font-mono text-[11px] text-mist-500"
          >
            <span>consolidating into one record</span>
            <span className="inline-flex gap-0.5">
              <span className="h-1 w-1 animate-blink rounded-full bg-mist-500" />
              <span className="h-1 w-1 animate-blink rounded-full bg-mist-500 [animation-delay:0.2s]" />
              <span className="h-1 w-1 animate-blink rounded-full bg-mist-500 [animation-delay:0.4s]" />
            </span>
          </motion.div>

          <motion.div
            variants={line}
            className="mt-3 rounded-xl border border-ink-600 bg-ink-800/80 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-500/15 font-mono text-[12px] font-semibold text-signal-400">
                  PR
                </span>
                <div>
                  <p className="text-[13px] font-medium text-paper-100">Priya R.</p>
                  <p className="font-mono text-[11px] text-mist-500">
                    4 sources · verified
                  </p>
                </div>
              </div>
              <span className="font-mono text-lg font-semibold text-paper-100">
                87
              </span>
            </div>

            <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-ink-700">
              <motion.span
                className="h-full bg-trace-500"
                initial={{ width: 0 }}
                whileInView={{ width: "38%" }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
              />
              <motion.span
                className="h-full bg-signal-500"
                initial={{ width: 0 }}
                whileInView={{ width: "24%" }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: 1.75, ease: "easeOut" }}
              />
              <motion.span
                className="h-full bg-paper-300/70"
                initial={{ width: 0 }}
                whileInView={{ width: "12%" }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: 1.9, ease: "easeOut" }}
              />
            </div>
            <p className="mt-2 font-mono text-[10.5px] uppercase tracking-wide text-mist-500">
              Code · Collaboration · Non-code · click through to every event
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-40 md:pb-32 md:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 15% 20%, rgba(95,214,196,0.10), transparent), radial-gradient(50% 40% at 85% 0%, rgba(227,162,59,0.10), transparent)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1200px] gap-16 px-6 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-850/60 px-3 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-400">
              Project Footprint
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={0.08}
            initial="hidden"
            animate="show"
            className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-normal leading-[1.05] tracking-tight text-paper-100"
          >
            Turning invisible effort
            <br />
            into{" "}
            <span className="relative inline-block">
              visible evidence
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="10"
                viewBox="0 0 220 10"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M2 7C40 2 100 2 218 6"
                  stroke="#E3A23B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
                />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-mist-400"
          >
            Footprint turns your team&rsquo;s commits, tasks, and logged work
            into one contribution record..auditable, explainable, and
            traceable back to the activity behind it. No more guessing who
            did what.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.24}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-full bg-signal-500 px-6 py-3.5 text-[14px] font-semibold text-ink-950 transition-all hover:bg-signal-400 hover:shadow-glow-amber"
            >
              Start tracking your team
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#scoring"
              className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-6 py-3.5 text-[14px] font-medium text-paper-100 transition-colors hover:border-trace-500/60 hover:text-trace-300"
            >
              See how scoring works
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={0.32}
            initial="hidden"
            animate="show"
            className="mt-8 flex items-center gap-2 font-mono text-[12px] text-mist-500"
          >
            <Github className="h-3.5 w-3.5" />
            <span>Connects to GitHub in under 2 minutes · no credit card</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <EvidenceConsole />
        </motion.div>
      </div>
    </section>
  );
}
