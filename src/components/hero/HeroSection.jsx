import { useRef, useState } from 'react';
import { company, hero } from '../../data/companyContent.js';
import { storyStages } from '../../data/recruitmentStages.js';
import useInView from '../../hooks/useInView.js';
import useMediaQuery from '../../hooks/useMediaQuery.js';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useSceneInteraction from '../../hooks/useSceneInteraction.js';
import Button from '../common/Button.jsx';
import SceneBoundary from './SceneBoundary.jsx';
import SceneControls from './SceneControls.jsx';
import SceneFallback from './SceneFallback.jsx';
import { CandidateCard, EmployerCard } from './StoryCards.jsx';
import styles from './HeroSection.module.css';
import { lazy, Suspense, useMemo } from 'react';

const TalentConnectionScene = lazy(() => import('./TalentConnectionScene.jsx'));

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function HeroSection() {
  const frameRef = useRef(null);
  const reduced = useReducedMotion();
  const phone = useMediaQuery('(max-width: 760px)');
  const inView = useInView(frameRef, { threshold: 0.12, initial: true });
  const { stage, playing, selectStage, togglePlay } = useSceneInteraction({
    reducedMotion: reduced,
    enabled: inView,
  });
  const [failed, setFailed] = useState(false);
  const webgl = useMemo(() => canUseWebGL(), []);
  const story = storyStages[stage];
  const showScene = webgl && !failed;

  return (
    <section className={styles.hero} id="home">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1>
            {hero.titleLead}
            <br />
            {hero.titleTail}
          </h1>
          <p className={styles.intro}>{hero.intro}</p>
          <div className={styles.actions}>
            <Button href="#employers">{hero.employerCta}</Button>
            <Button href="#candidates" variant="secondary">{hero.candidateCta}</Button>
          </div>
          <p className={styles.call}>
            <a href={`tel:${company.phoneTel}`}>Call {company.phoneDisplay}</a>
          </p>
        </div>

        <div className={styles.frame} ref={frameRef}>
          <div className={styles.viewport}>
            {showScene ? (
              <SceneBoundary fallback={<SceneFallback stage={stage} />}>
                <Suspense fallback={<div className={styles.loading} role="status">Preparing the recruitment scene</div>}>
                  <TalentConnectionScene
                    stage={stage}
                    playing={playing}
                    reduced={reduced}
                    quality={phone ? 'low' : 'high'}
                    active={inView}
                    onFail={() => setFailed(true)}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              <SceneFallback stage={stage} />
            )}
          </div>
          <div className={styles.exampleCards}>
            <EmployerCard dimmed={stage === 2} />
            <CandidateCard dimmed={stage === 0} />
          </div>
          <div className={styles.caption} aria-live="polite">
            <p className={styles.label}>{story.label}</p>
            <p>{story.text}</p>
          </div>
          <SceneControls
            stage={stage}
            playing={playing}
            onSelect={selectStage}
            onToggle={togglePlay}
          />
          <p className={styles.disclaimer}>
            Illustrative story only. The role and profile are examples, not a live opening or a registered candidate.
            {!showScene ? ' 3D graphics are unavailable, so the story is shown as an illustration.' : ''}
          </p>
        </div>
      </div>
    </section>
  );
}
