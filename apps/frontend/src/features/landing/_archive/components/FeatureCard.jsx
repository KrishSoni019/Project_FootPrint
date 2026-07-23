import Badge from "../ui/Badge";
import styles from "./FeatureCard.module.css";

/**
 * FeatureCard
 * One capability, one card. FeaturesSection maps an array of data into this
 * component — adding a sixth feature later means adding one object to that
 * array, not writing new markup.
 */
function FeatureCard({ tag, tone, title, description }) {
  return (
    <div className={styles.card}>
      <Badge tone={tone}>{tag}</Badge>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

export default FeatureCard;
