import SectionHeading from "../ui/SectionHeading";
import styles from "./ProblemSection.module.css";

const problems = [
  {
    title: "No supporting evidence",
    detail:
      "Team members can claim significant work was done, but there's rarely a central system that backs the claim with verifiable records.",
  },
  {
    title: "Commits aren't the whole story",
    detail:
      "A member responsible for research, testing, or coordination may commit rarely while contributing heavily.",
  },
  {
    title: "Non-code work is invisible",
    detail:
      "Documentation, requirement analysis, and manual testing leave no trace in a repository at all.",
  },
  {
    title: "Effort is judged only at the end",
    detail:
      "Without a running timeline, uneven workload is usually discovered at final submission — too late to correct.",
  },
];

/**
 * ProblemSection
 * States the gap the product closes, in the audience's own language —
 * academic teams and hackathon builders who've felt this problem directly.
 * A simple two-column grid; no illustration needed, the copy carries it.
 */
function ProblemSection() {
  return (
    <section id="problem" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="The problem"
          heading="Contribution disputes come from a missing system, not missing effort."
          subtext="Group work fails to get evaluated fairly for the same handful of reasons, every time."
        />

        <div className={styles.grid}>
          {problems.map((problem) => (
            <div className={styles.item} key={problem.title}>
              <h3 className={styles.itemTitle}>{problem.title}</h3>
              <p className={styles.itemDetail}>{problem.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
