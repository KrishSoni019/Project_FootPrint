import styles from "./StepItem.module.css";

/**
 * StepItem
 * One numbered step in the How It Works pipeline. Numbering is used here
 * deliberately, unlike a generic "01/02/03" decoration — this genuinely is
 * an ordered sequence (each step depends on the one before it), so the
 * number encodes real information about order.
 */
function StepItem({ number, title, description }) {
  return (
    <div className={styles.step}>
      <span className={styles.number}>{number}</span>
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export default StepItem;
