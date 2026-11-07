import { company, footerBlurb, navigation } from '../../data/companyContent.js';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <a href="#home" className={styles.brand}>
            <img src={company.logo} alt={company.logoAlt} width="72" height="72" />
            <span>
              <strong>{company.name}</strong>
              <small>{company.slogan}</small>
            </span>
          </a>
          <p>{footerBlurb}</p>
        </div>
        <nav aria-label="Footer">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className={styles.reach}>
          <a href={`tel:${company.phoneTel}`}>{company.phoneDisplay}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <p>{company.location} <span>({company.locationNote})</span></p>
        </div>
      </div>
      <div className={`wrap ${styles.legal}`}>
        <p>© {year} Alpha Talent Technology. All rights reserved.</p>
      </div>
    </footer>
  );
}
