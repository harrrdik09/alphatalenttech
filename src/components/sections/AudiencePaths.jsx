import { audiences, company } from '../../data/companyContent.js';
import Button from '../common/Button.jsx';
import styles from './AudiencePaths.module.css';

function Points({ items }) {
  return (
    <ul className={styles.points}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function AudiencePaths({ onEmployer, onCandidate }) {
  return (
    <section className={styles.paths} aria-label="Choose your path">
      <div className={styles.split}>
        <article className={styles.employer} id="employers">
          <p className={styles.eyebrow}>{audiences.employer.eyebrow}</p>
          <h2>{audiences.employer.title}</h2>
          <p className={styles.lede}>{audiences.employer.lede}</p>
          <Points items={audiences.employer.points} />
          <Button onClick={onEmployer}>{audiences.employer.cta}</Button>
        </article>

        <div className={styles.seal}>
          <img src={company.logo} alt="" width="120" height="120" />
        </div>

        <article className={styles.candidate} id="candidates">
          <p className={styles.eyebrowDark}>{audiences.candidate.eyebrow}</p>
          <h2>{audiences.candidate.title}</h2>
          <p className={styles.ledeDark}>{audiences.candidate.lede}</p>
          <Points items={audiences.candidate.points} />
          <Button variant="ink" onClick={onCandidate}>{audiences.candidate.cta}</Button>
        </article>
      </div>
    </section>
  );
}
