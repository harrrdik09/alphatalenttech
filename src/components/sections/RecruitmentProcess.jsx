import { useState } from 'react';
import { processIntro, processSteps } from '../../data/recruitmentStages.js';
import SectionHeading from '../common/SectionHeading.jsx';
import styles from './RecruitmentProcess.module.css';

export default function RecruitmentProcess() {
  const [active, setActive] = useState(0);
  const current = processSteps[active];

  return (
    <section className={`section ${styles.process}`} id="process" aria-labelledby="process-heading">
      <div className="wrap">
        <SectionHeading
          inverse
          id="process-heading"
          eyebrow={processIntro.eyebrow}
          title={processIntro.title}
          lede={processIntro.lede}
        />
        <div className={styles.timeline}>
          {processSteps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={index === active ? `${styles.step} ${styles.on}` : styles.step}
              style={{ order: index * 2 }}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <span>{step.num}</span>
              {step.title}
            </button>
          ))}
          <div
            className={styles.panel}
            style={{ '--panel-order': active * 2 + 1 }}
            aria-live="polite"
          >
            <p className={styles.kicker}>{current.num} / {current.title}</p>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
