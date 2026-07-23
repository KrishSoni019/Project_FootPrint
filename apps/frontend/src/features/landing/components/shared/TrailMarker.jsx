import { motion } from "framer-motion";

// The recurring "node in the trail" mark. Every major section opens with
// one of these — a literal nod to the product's own idea that a project's
// story is a trail of small, traceable events, not one big claim.
export default function TrailMarker({ index, label, connect = true }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center">
        <span className="absolute h-8 w-8 rounded-full border border-ink-600" />
        <motion.span
          className="h-2 w-2 rounded-full bg-signal-500"
          initial={{ scale: 0.4, opacity: 0.4 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {connect && (
          <motion.span
            className="absolute left-1/2 top-full w-px -translate-x-1/2 bg-gradient-to-b from-trace-500/60 to-transparent"
            initial={{ height: 0 }}
            whileInView={{ height: 96 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        )}
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-mist-400">
        Evidence <span className="text-signal-400">— {index}</span> · {label}
      </span>
    </div>
  );
}
