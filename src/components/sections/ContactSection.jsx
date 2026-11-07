import { company, contactCopy } from '../../data/companyContent.js';
import ContactForm from '../common/ContactForm.jsx';
import styles from './ContactSection.module.css';

export default function ContactSection({ inquiryType, topic, onTypeChange }) {
  return (
    <section className={`section ${styles.contact}`} id="contact" aria-labelledby="contact-heading">
      <div className={`wrap ${styles.layout}`}>
        <div>
          <p className={styles.eyebrow}>{contactCopy.eyebrow}</p>
          <h2 id="contact-heading" tabIndex={-1}>{contactCopy.title}</h2>
          <p className={styles.lede}>{contactCopy.lede}</p>
          <dl className={styles.details}>
            <div>
              <dt>Call our team</dt>
              <dd><a href={`tel:${company.phoneTel}`}>{company.phoneDisplay}</a></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${company.email}`}>{company.email}</a></dd>
            </div>
            <div>
              <dt>Office location</dt>
              <dd>
                {company.location}
                <span>{company.locationNote}</span>
              </dd>
            </div>
          </dl>
        </div>
        <div className={styles.card}>
          <ContactForm inquiryType={inquiryType} topic={topic} onTypeChange={onTypeChange} />
        </div>
      </div>
    </section>
  );
}
