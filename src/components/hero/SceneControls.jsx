import { useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import { storyStages } from '../../data/recruitmentStages.js';
import styles from './SceneControls.module.css';

export default function SceneControls({ stage, playing, onSelect, onToggle }) {
  const buttons = useRef([]);

  const select = (index) => {
    const next = (index + storyStages.length) % storyStages.length;
    onSelect(next);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      select(stage + 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(stage - 1);
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.stages} role="radiogroup" aria-label="Recruitment story stages" onKeyDown={onKeyDown}>
        {storyStages.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => { buttons.current[index] = element; }}
            type="button"
            role="radio"
            aria-checked={stage === index}
            tabIndex={stage === index ? 0 : -1}
            className={stage === index ? `${styles.stage} ${styles.on}` : styles.stage}
            onClick={() => onSelect(index)}
          >
            <span>{index + 1}</span>
            {item.control}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.play}
        aria-pressed={playing}
        aria-label={playing ? 'Pause recruitment story' : 'Play recruitment story'}
        onClick={onToggle}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
}
