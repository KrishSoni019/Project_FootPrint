import { motion } from "framer-motion";
import Section from "./shared/Section.jsx";
import TrailMarker from "./shared/TrailMarker.jsx";
import { fadeUp, viewportOnce } from "../lib/motion.js";

const ENTRIES = [
  {
    claim: '"She said she did a lot of the work."',
    reality:
      "Contribution claims rarely have anything behind them .. no record, no way to check.",
    rotate: "-rotate-1",
  },
  {
    claim: '"Just check the commit graph."',
    reality:
      "Research, testing, and planning never touch a repository, so real work stays invisible.",
    rotate: "rotate-1",
  },
  {
    claim: '"He committed 40 times!"',
    reality:
      "Ten small edits can outweigh one hard problem solved .. frequency isn't difficulty.",
    rotate: "rotate-1",
  },
  {
    claim: '"We\'ll sort it out at the end."',
    reality:
      "By submission day, an uneven workload is a surprise nobody has time left to fix.",
    rotate: "-rotate-1",
  },
];

export default function Problem() {
  return (
    <Section id="problem" className="py-24 md:py-32">
      <TrailMarker index="01" label="The problem" />

      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <h2 className="font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-normal leading-[1.15] text-paper-100">
            Group work still runs on{" "}
            <span className="text-mist-600 line-through decoration-flag-500/70">
              trust
            </span>{" "}
            memory - not evidence.
          </h2>
         <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-mist-400">
          Every project has visible outcomes, but the work behind them is often
          invisible. Planning, research, debugging, reviews, and collaboration fade
          into the background, leaving contributions to be judged by a few commits or
          the loudest voice in the room.
        </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.claim}
              variants={fadeUp}
              custom={i * 0.08}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className={`rounded-2xl border border-ink-700 bg-ink-850/60 p-5 ${entry.rotate} transition-transform hover:rotate-0`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-flag-400">
                Assumed
              </span>
              <p className="mt-2 text-[14px] italic text-mist-500 line-through decoration-ink-600">
                {entry.claim}
              </p>
              <span className="mt-4 block font-mono text-[10px] uppercase tracking-[0.2em] text-trace-400">
                Actually
              </span>
              <p className="mt-2 text-[14.5px] leading-relaxed text-paper-100">
                {entry.reality}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
