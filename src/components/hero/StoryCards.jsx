import styles from './StoryCards.module.css';

export function EmployerCard({ dimmed = false }) {
  return (
    <article className={dimmed ? `${styles.panel} ${styles.dimmed}` : styles.panel}>
      <p className={styles.kicker}>Illustrative example</p>
      <strong>Software Developer</strong>
      <dl>
        <div>
          <dt>Required skills</dt>
          <dd>Application development</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>Professional experience</dd>
        </div>
        <div>
          <dt>Hiring requirement</dt>
          <dd>A role for the team</dd>
        </div>
      </dl>
      <p className={styles.note}>Not a live job opening.</p>
    </article>
  );
}

export function CandidateCard({ dimmed = false }) {
  return (
    <article className={dimmed ? `${styles.panel} ${styles.candidate} ${styles.dimmed}` : `${styles.panel} ${styles.candidate}`}>
      <p className={styles.kicker}>Illustrative profile</p>
      <strong>Candidate profile</strong>
      <dl>
        <div>
          <dt>Skills</dt>
          <dd>Example technical skills</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>Example background</dd>
        </div>
        <div>
          <dt>Career interest</dt>
          <dd>Example career direction</dd>
        </div>
      </dl>
      <p className={styles.note}>Not a registered candidate.</p>
    </article>
  );
}
