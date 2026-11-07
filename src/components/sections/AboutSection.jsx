import { about, company } from '../../data/companyContent.js';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={`section ${styles.about}`} id="about" aria-labelledby="about-heading">
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.plate}>
          <img src={company.logo} alt={company.logoAlt} width="640" height="640" />
          <p>{company.slogan}</p>
        </div>
        <div>
          <p className={styles.eyebrow}>{about.eyebrow}</p>
          <h2 id="about-heading">{about.title}</h2>
          {about.paragraphs.map((paragraph) => <p key={paragraph} className={styles.copy}>{paragraph}</p>)}
          <ul>
            {about.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
