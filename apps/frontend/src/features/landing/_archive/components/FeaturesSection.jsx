import SectionHeading from "../ui/SectionHeading";
import FeatureCard from "./FeatureCard";
import styles from "./FeaturesSection.module.css";

const features = [
  {
    tag: "CODE",
    tone: "code",
    title: "GitHub, fully wired in",
    description:
      "Commits, pull requests, and issues sync automatically via webhooks — no manual entry for code activity.",
  },
  {
    tag: "TASK",
    tone: "task",
    title: "Built-in task board",
    description:
      "Assign, move, and track work items alongside code activity, so planning and execution live in one place.",
  },
  {
    tag: "DOCS",
    tone: "docs",
    title: "Non-code work, counted",
    description:
      "Log research, documentation, and testing with evidence attached — work that never touches a repository still counts.",
  },
  {
    tag: "SCORE",
    tone: "review",
    title: "Explainable scoring",
    description:
      "Every contribution score traces back, in one click, to the exact events that produced it. No black-box numbers.",
  },
];

/**
 * FeaturesSection
 * A four-item responsive grid. Kept to four rather than a longer list —
 * this page's job is to establish identity and intent, not enumerate the
 * full feature set from the product blueprint.
 */
function FeaturesSection() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="What it does"
          heading="One system, every source of contribution."
          subtext="Code, tasks, and manual work — normalized into a single, comparable record."
        />
        <div className={styles.grid}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
