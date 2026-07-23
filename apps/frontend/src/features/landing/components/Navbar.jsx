import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#solution" },
  { label: "How scoring works", href: "#scoring" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="#232733" strokeWidth="1.5" />
      <path
        d="M9 19c0-3 1.6-4.6 1.6-7.4S9.4 7 9.4 7"
        stroke="#5FD6C4"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18.6 21c0-3-1.6-4.8-1.6-7.8s1.6-4.8 1.6-4.8"
        stroke="#E3A23B"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="9.4" cy="7" r="1.6" fill="#5FD6C4" />
      <circle cx="18.6" cy="8.4" r="1.6" fill="#E3A23B" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          scrolled
            ? "border-b border-ink-700 bg-ink-950/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
          <a href="#top" className="flex items-center gap-2.5">
            <Mark />
            <span className="font-display text-[17px] font-medium tracking-tight text-paper-100">
              Footprint
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[13px] uppercase tracking-wide text-mist-400 transition-colors hover:text-paper-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#signin"
              className="font-mono text-[13px] uppercase tracking-wide text-mist-400 transition-colors hover:text-paper-100"
            >
              Sign in
            </a>
            <a
              href="#cta"
              className="group inline-flex items-center gap-1.5 rounded-full bg-signal-500 px-4 py-2 text-[13px] font-semibold text-ink-950 transition-all hover:bg-signal-400 hover:shadow-glow-amber"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-700 text-paper-100 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-ink-700 bg-ink-950/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2.5 font-mono text-sm uppercase tracking-wide text-mist-400 hover:bg-ink-800 hover:text-paper-100"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-3 px-2 pt-2">
                <a href="#signin" className="font-mono text-sm text-mist-400">
                  Sign in
                </a>
                <a
                  href="#cta"
                  className="inline-flex items-center gap-1.5 rounded-full bg-signal-500 px-4 py-2 text-sm font-semibold text-ink-950"
                >
                  Get started
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
