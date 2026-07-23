import styles from "./SectionHeading.module.css";

/**
 * SectionHeading
 * The "eyebrow label + heading + supporting text" pattern repeats across
 * Problem, Features, How It Works, and CTA sections. Centralizing it means
 * every section's heading rhythm (spacing, size, color) stays consistent
 * without copy-pasting the same three-tag markup five times.
 *
 * @param {string} eyebrow - small label above the heading (e.g. "The Problem")
 * @param {string} heading - the section's headline
 * @param {string} [subtext] - optional supporting sentence
 * @param {"left" | "center"} [align]
 */
function SectionHeading({ eyebrow, heading, subtext, align = "left" }) {
  return (
    <div className={`${styles.wrapper} ${styles[align]}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.heading}>{heading}</h2>
      {subtext && <p className={styles.subtext}>{subtext}</p>}
    </div>
  );
}

export default SectionHeading;
