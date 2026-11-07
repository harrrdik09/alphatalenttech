import { useEffect, useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { company, navigation } from '../../data/companyContent.js';
import Button from '../common/Button.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const panelId = useId();

  useEffect(() => {
    const elements = navigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0.15, 0.4] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const main = document.getElementById('main');
    const footer = document.querySelector('footer');
    if (open) {
      main?.setAttribute('inert', '');
      footer?.setAttribute('inert', '');
      document.body.style.overflow = 'hidden';
    } else {
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
      document.body.style.overflow = '';
    }
    return () => {
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#home" onClick={close}>
          <span className={styles.mark}>
            <img src={company.logo} alt="" width="96" height="96" />
          </span>
          <span className={styles.word}>
            <strong>Alpha Talent</strong>
            <small>Technology</small>
          </span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          {navigation.map((item) => (
            <a
              key={item.href}
              className={styles.link}
              href={item.href}
              aria-current={active === item.href ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button className={styles.desktopCta} href="#contact">
          Let&apos;s Connect
        </Button>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {open ? (
        <div id={panelId} className={`${styles.panel} ${styles.panelOpen}`}>
          <nav aria-label="Mobile">
            {navigation.map((item) => (
              <a key={item.href} className={styles.link} href={item.href} onClick={close}>
                {item.label}
              </a>
            ))}
            <Button href="#contact" onClick={close}>Let&apos;s Connect</Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
