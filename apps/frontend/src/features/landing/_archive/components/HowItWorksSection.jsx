import SectionHeading from "../ui/SectionHeading";
import StepItem from "./StepItem";
import styles from "./HowItWorksSection.module.css";

const steps = [
  {
    number: "01",
    title: "Connect your sources",
    description:
      "Link a GitHub repository and invite your team. Every commit, pull request, and task starts flowing in automatically.",
  },
  {
    number: "02",
    title: "Log what code can't see",
    description:
      "Research, documentation, and testing get recorded with a note or evidence link — work that would otherwise go uncounted.",
  },
  {
    number: "03",
    title: "Everything normalizes into one timeline",
    description:
      "Code, tasks, and manual entries merge into a single chronological record anyone on the team can audit.",
  },
  {
    number: "04",
    title: "See an explainable score, not a guess",
    description:
      "A weighted contribution score is computed per member — and every number links back to the evidence behind it.",
  },
];

/**
 * HowItWorksSection
 * A four-step pipeline. This IS a sequential process (each step depends on
 * data from the step before), so presenting it as an ordered list is
 * accurate, not just a stylistic device.
 */
function HowItWorksSection() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="How it works"
          heading="From scattered activity to one accountable record."
        />
        <div className={styles.steps}>
          {steps.map((step) => (
            <StepItem key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
