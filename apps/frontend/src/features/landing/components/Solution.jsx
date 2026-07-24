import { motion } from "framer-motion";
import { GitCommit, CheckSquare, PenLine } from "lucide-react";
import Section from "./shared/Section.jsx";
import TrailMarker from "./shared/TrailMarker.jsx";
import { fadeUp, viewportOnce } from "../lib/motion.js";

const SOURCES = [
  {
    Icon: GitCommit,
    tone: "text-trace-400",
    title: "Code activity",
    body: "Commits, pull requests, reviews, and issues — synced automatically from GitHub.",
  },
  {
    Icon: CheckSquare,
    tone: "text-signal-400",
    title: "Task activity",
    body: "Work items moving through To Do, In Progress, and Completed, timestamped as they happen.",
  },
  {
    Icon: PenLine,
    tone: "text-mist-400",
    title: "Logged work",
    body: "Research, testing, and documentation — recorded manually, with evidence attached.",
  },
];

const DIAGRAM_SOURCES = [
  { y: 56, label: "GitHub", hex: "#5FD6C4" },
  { y: 160, label: "Tasks", hex: "#E3A23B" },
  { y: 264, label: "Manual log", hex: "#8A93A6" },
];

function FlowDiagram() {
  return (
    <svg viewBox="0 0 480 320" className="h-auto w-full" aria-hidden="true">
      {DIAGRAM_SOURCES.map((s) => (
        <motion.path
          key={s.label}
          d={`M92 ${s.y} C 170 ${s.y}, 190 160, 250 160`}
          stroke={s.hex}
          strokeWidth="1.5"
          strokeOpacity="0.55"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      <motion.path
        d="M270 160 C 330 160, 350 160, 410 160"
        stroke="#EDEAE2"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
      />

      {DIAGRAM_SOURCES.map((s) => (
        <g key={`node-${s.label}`}>
          <circle cx="64" cy={s.y} r="26" fill="#12151C" stroke="#232733" strokeWidth="1.5" />
          <circle cx="64" cy={s.y} r="4" fill={s.hex} />
          <text
            x="64"
            y={s.y + 42}
            textAnchor="middle"
            className="font-mono"
            fontSize="10"
            fill="#8A93A6"
            letterSpacing="0.5"
          >
            {s.label.toUpperCase()}
          </text>
        </g>
      ))}

      <circle cx="260" cy="160" r="34" fill="#181C25" stroke="#E3A23B" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="260" cy="160" r="44" fill="none" stroke="#E3A23B" strokeOpacity="0.12" strokeWidth="10" />
      <text x="260" y="156" textAnchor="middle" className="font-display" fontSize="11" fill="#EDEAE2">
        Footprint
      </text>
      <text x="260" y="170" textAnchor="middle" className="font-mono" fontSize="8" fill="#8A93A6" letterSpacing="0.5">
        ENGINE
      </text>

      <circle cx="432" cy="160" r="26" fill="#12151C" stroke="#232733" strokeWidth="1.5" />
      <path
        d="M424 164l6 6 10-12"
        stroke="#5FD6C4"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="432" y="202" textAnchor="middle" className="font-mono" fontSize="10" fill="#8A93A6" letterSpacing="0.5">
        REPORT
      </text>
    </svg>
  );
}

export default function Solution() {
  return (
    <Section id="solution" className="py-24 md:py-32">
      <TrailMarker index="02" label="The solution" />

      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-normal leading-[1.15] text-paper-100">
            One trail, three sources.
          </h2>
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-mist-400">
          Code-only tracking overlooks non-technical contributions. Task-only tracking
          misses spontaneous effort. Self-reported logs provide context but can't stand
          on their own. When all three are combined and cross-verified, contributions
          become far more complete, trustworthy, and difficult to manipulate.
        </p>
                  <ul className="mt-8 space-y-5">
            {SOURCES.map(({ Icon, tone, title, body }) => (
              <li key={title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-ink-700 bg-ink-850">
                  <Icon className={`h-4 w-4 ${tone}`} />
                </span>
                <div>
                  <p className="text-[14.5px] font-medium text-paper-100">{title}</p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-mist-500">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6"
        >
          <FlowDiagram />
        </motion.div>
      </div>
    </Section>
  );
}
