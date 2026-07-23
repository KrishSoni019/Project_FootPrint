import Button from "../ui/Button";
import EvidenceTrail from "./EvidenceTrail";
import styles from "./HeroSection.module.css";

/**
 * HeroSection
 * An asymmetric split rather than a centered headline-over-screenshot
 * template: copy + CTAs on the left, the live EvidenceTrail on the right.
 * This lets the signature element carry visual weight without competing
 * with the headline for the same center of attention.
 */
function HeroSection() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Evidence-driven contribution tracking</span>
          <h1 className={styles.headline}>
            Every contribution
            <br />
            leaves a footprint.
          </h1>
          <p className={styles.subhead}>
            Project Footprint turns scattered commits, tasks, and logged work
            into one evidence-backed record of who did what — so contribution
            never has to be a guess again.
          </p>
          <div className={styles.ctaRow}>
            <Button as="a" href="#get-started" variant="primary">
              Get Started
            </Button>
            <Button as="a" href="#" variant="ghost">
              View on GitHub
            </Button>
          </div>
        </div>

        <div className={styles.visual}>
          <EvidenceTrail />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
