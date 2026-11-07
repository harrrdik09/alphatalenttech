import { ArrowUpRight, Briefcase, Compass, FileText, MessagesSquare, MonitorSmartphone, Users } from 'lucide-react';
import { serviceIntro, services } from '../../data/services.js';
import Reveal from '../common/Reveal.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import styles from './RecruitmentServices.module.css';

const icons = {
  'it-staffing': MonitorSmartphone,
  'recruitment-services': Users,
  'job-placement': Briefcase,
  'career-guidance': Compass,
  'resume-support': FileText,
  'interview-preparation': MessagesSquare,
};

export default function RecruitmentServices({ onInquire }) {
  return (
    <section className={`section ${styles.services}`} id="services" aria-labelledby="services-heading">
      <div className={`wrap ${styles.layout}`}>
        <Reveal>
          <SectionHeading
            id="services-heading"
            eyebrow={serviceIntro.eyebrow}
            title={serviceIntro.title}
            lede={serviceIntro.lede}
          />
        </Reveal>
        <div className={styles.list}>
          {services.map((service) => {
            const Icon = icons[service.id];
            return (
              <article key={service.id} className={styles.row}>
                <div className={styles.indexWrap}>
                  <span className={styles.index}>{service.index}</span>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.audience}>{service.audience}</p>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <button type="button" className={styles.cta} onClick={() => onInquire(service.inquiry, service.title)}>
                  {service.cta}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
