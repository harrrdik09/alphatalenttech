import { company } from '../../data/companyContent.js';
import styles from './SceneFallback.module.css';

export default function SceneFallback({ stage }) {
  const employer = stage === 0 || stage === 3 ? 1 : 0.45;
  const hub = stage >= 1 ? 1 : 0.55;
  const candidate = stage >= 2 ? 1 : 0.4;
  const link = stage === 3 ? 1 : stage === 2 ? 0.55 : 0.2;

  return (
    <div className={styles.fallback} aria-hidden="true">
      <svg className={styles.art} viewBox="0 0 760 420">
        <rect x="70" y="250" width="620" height="10" rx="5" fill="#21154F" />
        <g opacity={employer}>
          <rect x="92" y="150" width="92" height="130" rx="8" fill="#171A30" />
          <rect x="108" y="168" width="14" height="16" fill="#7EB6FF" />
          <rect x="130" y="168" width="14" height="16" fill="#7EB6FF" />
          <rect x="152" y="168" width="14" height="16" fill="#7EB6FF" />
          <rect x="108" y="196" width="14" height="16" fill="#B5A5FF" />
          <rect x="130" y="196" width="14" height="16" fill="#7EB6FF" />
          <rect x="152" y="196" width="14" height="16" fill="#7EB6FF" />
          <rect x="124" y="236" width="22" height="44" fill="#0C1020" />
        </g>
        <g opacity={hub}>
          <circle cx="380" cy="176" r="78" fill="none" stroke="#B5A5FF" strokeWidth="3" />
          <circle cx="380" cy="176" r="104" fill="none" stroke="#248BFF" strokeWidth="2" opacity="0.8" />
        </g>
        <path d="M180 210 C 250 120, 300 130, 360 176" fill="none" stroke="#B5A5FF" strokeWidth="3" opacity={stage === 0 ? 0.7 : 1} />
        <path d="M580 210 C 510 120, 460 130, 400 176" fill="none" stroke="#7EB6FF" strokeWidth="3" opacity={link} />
        <g opacity={candidate}>
          <circle cx="610" cy="150" r="28" fill="#F5F6FF" />
          <rect x="582" y="184" width="56" height="78" rx="28" fill="#2A2162" />
        </g>
        {stage >= 1 ? (
          <g>
            <circle cx="330" cy="110" r="8" fill={stage === 1 ? '#B5A5FF' : '#6d678c'} />
            <circle cx="430" cy="108" r="8" fill={stage === 1 ? '#B5A5FF' : '#6d678c'} />
            <circle cx="392" cy="78" r="6" fill="#248BFF" />
          </g>
        ) : null}
        {stage === 3 ? <circle cx="380" cy="176" r="46" fill="none" stroke="#F5F6FF" strokeWidth="2" /> : null}
      </svg>
      <img className={styles.logo} src={company.logo} alt="" />
      <p className={styles.note}>Illustration of the same recruitment story.</p>
    </div>
  );
}
