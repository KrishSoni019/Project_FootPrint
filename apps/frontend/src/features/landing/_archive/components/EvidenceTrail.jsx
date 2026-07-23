import Badge from "../ui/Badge";
import styles from "./EvidenceTrail.module.css";

/**
 * EvidenceTrail
 * The page's signature element. Rather than illustrate the product with a
 * generic dashboard screenshot or a big stat, this renders a small, living
 * feed of contribution "evidence" — the exact concept the product is built
 * on. Each row fades in with a staggered delay (set via inline CSS custom
 * property) so the whole trail feels like it's being written in real time,
 * without a single line of animation JavaScript.
 *
 * The data below is illustrative sample content for the hero only — it is
 * NOT wired to any backend or real project.
 */
const trailEntries = [
  { tone: "code", label: "CODE", author: "priya", detail: "merged auth-refresh-flow", time: "2m ago" },
  { tone: "task", label: "TASK", author: "arjun", detail: "completed db-schema-review", time: "14m ago" },
  { tone: "docs", label: "DOCS", author: "meera", detail: "logged API design notes", time: "38m ago" },
  { tone: "review", label: "REVIEW", author: "priya", detail: "reviewed PR #142", time: "1h ago" },
  { tone: "code", label: "CODE", author: "dev", detail: "pushed 3 commits to scoring-engine", time: "2h ago" },
];

function EvidenceTrail() {
  return (
    <div className={styles.panel} role="img" aria-label="Sample live activity feed showing recent contribution evidence">
      <div className={styles.panelHeader}>
        <span className={styles.dot} aria-hidden="true" />
        Live evidence trail
      </div>

      <ul className={styles.list}>
        {trailEntries.map((entry, index) => (
          <li
            key={entry.detail}
            className={styles.row}
            style={{ "--delay": `${index * 140}ms` }}
          >
            <Badge tone={entry.tone}>{entry.label}</Badge>
            <span className={styles.detail}>
              <strong>{entry.author}</strong> {entry.detail}
            </span>
            <span className={styles.time}>{entry.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EvidenceTrail;
