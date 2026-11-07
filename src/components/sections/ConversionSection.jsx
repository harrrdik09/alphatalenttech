import { lazy, Suspense, useRef } from 'react';
import useInView from '../../hooks/useInView.js';
import useMediaQuery from '../../hooks/useMediaQuery.js';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import Button from '../common/Button.jsx';
import styles from './ConversionSection.module.css';

const ConnectionMark = lazy(() => import('./ConnectionMark.jsx'));

function ConnectionSketch() {
  return (
    <svg className={styles.sketch} viewBox="0 0 280 180" aria-hidden="true">
      <line x1="48" y1="90" x2="232" y2="90" stroke="#B5A5FF" strokeWidth="2" />
      <circle cx="48" cy="90" r="16" fill="#633BFF" />
      <circle cx="232" cy="90" r="16" fill="#248BFF" />
      <circle cx="140" cy="90" r="28" fill="none" stroke="#F5F6FF" strokeWidth="2" />
    </svg>
  );
}

export default function ConversionSection({ onEmployer, onCandidate }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3, initial: false });
  const reduced = useReducedMotion();
  const compact = useMediaQuery('(max-width: 800px)');
  const showCanvas = inView && !reduced && !compact;

  return (
    <section className={styles.band} aria-labelledby="conversion-heading">
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.mark} ref={ref}>
          {showCanvas ? (
            <Suspense fallback={<ConnectionSketch />}>
              <ConnectionMark />
            </Suspense>
          ) : (
            <ConnectionSketch />
          )}
        </div>
        <div>
          <p className={styles.eyebrow}>Start a conversation</p>
          <h2 id="conversion-heading">Your Next Great Connection Starts Here.</h2>
          <p className={styles.lede}>
            Tell us whether you are hiring or looking for a next step. The inquiry form opens with the fields that match your path.
          </p>
          <div className={styles.actions}>
            <Button onClick={onEmployer}>I&apos;m Hiring</Button>
            <Button variant="secondary" onClick={onCandidate}>I&apos;m Looking for Opportunities</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
