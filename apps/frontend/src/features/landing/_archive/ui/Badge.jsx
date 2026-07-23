import styles from "./Badge.module.css";

/**
 * Badge
 * A small monospace tag pill. Used by EvidenceTrail to label an entry's
 * source (CODE / TASK / DOCS) and by FeatureCard for category labels.
 * Rendered in the mono font deliberately — it reads as "data," not decoration.
 *
 * @param {"code" | "task" | "docs" | "review" | "neutral"} tone
 */
function Badge({ tone = "neutral", children }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

export default Badge;
