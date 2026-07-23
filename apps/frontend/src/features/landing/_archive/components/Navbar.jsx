import Button from "../ui/Button";
import styles from "./Navbar.module.css";

/**
 * Navbar
 * Sticky top navigation. Deliberately minimal — brand mark, three anchor
 * links to on-page sections, and one CTA. No mega-menus: this is a landing
 * page, not the authenticated app, so navigation should ask nothing of the
 * visitor's attention beyond "here's what this is, here's how to start."
 */
function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          Footprint
        </a>

        <nav className={styles.links} aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#problem">Why it exists</a>
        </nav>

        <div className={styles.actions}>
          <Button as="a" href="#" variant="ghost">
            GitHub
          </Button>
          <Button as="a" href="#get-started" variant="primary">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
