import { principles } from '../../data/companyContent.js';
import SectionHeading from '../common/SectionHeading.jsx';
import styles from './WhyAlphaTalent.module.css';

export default function WhyAlphaTalent() {
  return (
    <section className={`section ${styles.why}`} id="why" aria-labelledby="why-heading">
      <div className={`wrap ${styles.layout}`}>
        <SectionHeading
          inverse
          id="why-heading"
          eyebrow="Why it matters"
          title="Why the right connection matters"
          lede="Recruitment is more useful when the hiring need and the person are both understood before an introduction is made."
        />
        <ol className={styles.list}>
          {principles.map((item, index) => (
            <li key={item.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
