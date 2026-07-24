import { useState } from "react";

/**
 * FAQSection
 *
 * Drop into features/landing/components/FAQSection.jsx and render it
 * from LandingPage.jsx, e.g.:
 *
 *   import FAQSection from "./components/FAQSection";
 *   ...
 *   <FAQSection />
 *
 * Design notes:
 * - Reuses the hero's terminal-log motif (">" prompt, monospace, blinking
 *   cursor) instead of introducing a new visual device.
 * - No numbered "01/02" eyebrow here — these questions aren't a sequence,
 *   unlike the Evidence section, so a fake order isn't implied.
 * - Colors are named as CSS custom properties at the top so they're easy
 *   to reconcile with your actual Tailwind config / design tokens.
 */

const FAQ_ITEMS = [
  {
    q: "Does a Footprint score replace my professor's judgment?",
    a: "No. Footprint gives your professor evidence to review it doesn't make the decision. Every score is backed by commits, tasks, pull requests, and activity logs so the final evaluation stays in human hands.",
  },
  {
    q: "Do my teammates have to agree before I connect our GitHub repo?",
    a: "The repo owner authorizes the connection, and every member still needs their GitHub username mapped to their workspace account before their activity is attributed to them. Nothing is scored under someone's name without that mapping step. The repository owner connects the project, but each teammate still has to link their GitHub account. Until that's done, their work won't be attributed to them.",
  },
  {
    q: "We use squash merges. Will that affect contribution tracking?",
    a: "Squash-merges and rebases can rewrite commit history, so Footprint cross-checks contribution at the pull-request level rather than trusting raw commit authorship alone. A squashed PR still credits everyone who committed to it.",
  },
  {
    q: "Will 10 tiny commits outscore 1 hard commit?",
    a: "Not usually. Footprint also looks at pull requests, so contributions aren't based only on commit history. Even after a squash merge, work can still be linked to the right contributor.",
  },
  {
    q: "Can scoring be adjusted for different kinds of projects?",
    a: "Yes. Each project can use different weights for Code, Tasks, Collaboration, Consistency, and Non-Code work. That lets a semester project and a weekend hackathon be evaluated differently.",
  },
  {
    q: "Does research, testing, or documentation count if it never touches GitHub?",
    a: "Yes. Work like documentation, research, testing, or planning can be logged manually with supporting evidence, so valuable contributions outside GitHub aren't ignored.",
  },
  {
    q: "Is our GitHub token stored in plain text?",
    a: "No. Integration tokens are encrypted, and the recommended setup is to connect through a GitHub App instead of using a broad personal access token.",
  },
  {
    q: "Can everyone see each other's scores?",
    a: "That's up to the project owner. Teams can choose how much score information is visible, and every score is shown with the evidence behind it instead of as a standalone number.",
  },
  {
    q: "What happens if GitHub's rate limit gets hit?",
    a: "Most updates arrive through GitHub webhooks, so hitting the rate limit during normal use is unlikely. If a large repository needs to be synced, Footprint processes it in the background instead of slowing down the app.",
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 200ms ease",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <path
        d="M4 6.5L9 11.5L14 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
    id="faq"
      style={{
        background: "var(--fp-bg, #0a0b0d)",
        color: "var(--fp-text, #e7e7e5)",
        padding: "96px 24px",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Eyebrow — terminal-log motif reused from the hero, no numbering */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--fp-mono, 'JetBrains Mono', ui-monospace, monospace)",
            fontSize: 12,
            letterSpacing: "0.12em",
            color: "var(--fp-amber, #f0a83c)",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--fp-amber, #f0a83c)",
              display: "inline-block",
            }}
          />
          FAQ&nbsp;·&nbsp;QUESTIONS TEAMS ACTUALLY ASK
        </div>

        <h2
          style={{
            fontFamily: "var(--fp-serif, 'Fraunces', Georgia, serif)",
            fontSize: "clamp(32px, 4.2vw, 48px)",
            lineHeight: 1.15,
            fontWeight: 500,
            margin: "0 0 16px",
            maxWidth: 640,
          }}
        >
          Before you connect a repo,{" "}
          <span style={{ color: "var(--fp-teal, #2dd4bf)" }}>read the fine print.</span>
        </h2>

        <p
          style={{
            color: "var(--fp-muted, #9a9a95)",
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 0 48px",
          }}
        >
          The honest answers to the questions that come up right before a team
          says yes — or right after something looks off.
        </p>

        {/* Terminal-style accordion */}
        <div
          style={{
            border: "1px solid var(--fp-border, #23262c)",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--fp-panel, #0f1114)",
          }}
        >
          {/* fake terminal titlebar, echoing the hero window */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid var(--fp-border, #23262c)",
              fontFamily: "var(--fp-mono, 'JetBrains Mono', ui-monospace, monospace)",
              fontSize: 12,
              color: "var(--fp-muted, #7d7d78)",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e5534b" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e8ab34" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2dd4bf" }} />
            <span style={{ marginLeft: 8 }}>footprint · faq.log</span>
          </div>

          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.q}
                style={{
                  borderBottom:
                    i < FAQ_ITEMS.length - 1 ? "1px solid var(--fp-border, #23262c)" : "none",
                }}
              >
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "18px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          "var(--fp-mono, 'JetBrains Mono', ui-monospace, monospace)",
                        color: "var(--fp-teal, #2dd4bf)",
                        flexShrink: 0,
                      }}
                    >
                      &gt;
                    </span>
                    {item.q}
                  </span>
                  <span style={{ color: "var(--fp-muted, #7d7d78)" }}>
                    <ChevronIcon open={open} />
                  </span>
                </button>

                {open && (
                  <div
                    style={{
                      padding: "0 20px 20px 52px",
                      fontSize: 14.5,
                      lineHeight: 1.65,
                      color: "var(--fp-muted, #b3b3ae)",
                      fontFamily: "var(--fp-body, inherit)",
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}