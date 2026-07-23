import styles from "./Footer.module.css";

/**
 * Footer
 * Quiet by design — this is the end of the page, not another selling
 * moment. Brand mark, a couple of link groups, and a year. Nothing here
 * competes with the CTA section above it.
 */
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <span className={styles.brand}>Footprint</span>
          <p className={styles.tagline}>Evidence-driven contribution tracking.</p>
        </div>

        <div className={styles.linkGroups}>
          <div className={styles.group}>
            <span className={styles.groupTitle}>Product</span>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </div>
          <div className={styles.group}>
            <span className={styles.groupTitle}>Project</span>
            <a href="#">GitHub</a>
            <a href="#">Documentation</a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>&copy; {new Date().getFullYear()} Project Footprint.</span>
      </div>
    </footer>
  );
}

export default Footer;
