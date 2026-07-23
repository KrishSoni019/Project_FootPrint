import Button from "../ui/Button";
import styles from "./CTASection.module.css";

/**
 * CTASection
 * The last conversion moment before the footer. Deliberately short — one
 * line, one action. By this point the visitor has seen the problem, the
 * feature set, and the pipeline; this section doesn't re-sell, it just
 * gives the door.
 */
function CTASection() {
  return (
    <section id="get-started" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Stop guessing who did the work.</h2>
        <p className={styles.subtext}>
          Set up your first workspace in minutes — no credit card, no setup fee.
        </p>
        <Button as="a" href="#" variant="primary">
          Get Started for Free
        </Button>
      </div>
    </section>
  );
}

export default CTASection;
