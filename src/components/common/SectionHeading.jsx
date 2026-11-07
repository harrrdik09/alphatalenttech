import styles from './SectionHeading.module.css';

export default function SectionHeading({ eyebrow, title, lede, id, inverse = false }) {
  return (
    <header className={inverse ? `${styles.heading} ${styles.inverse}` : styles.heading}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 id={id}>{title}</h2>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}
