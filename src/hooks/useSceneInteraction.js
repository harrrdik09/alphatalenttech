import { useCallback, useEffect, useRef, useState } from 'react';

const STAGE_COUNT = 4;
const INTERVAL_MS = 6800;

export default function useSceneInteraction({ reducedMotion, enabled }) {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(!reducedMotion);
  const timer = useRef(null);

  const clear = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };

  const start = useCallback(() => {
    clear();
    timer.current = window.setInterval(() => {
      setStage((current) => (current + 1) % STAGE_COUNT);
    }, INTERVAL_MS);
  }, []);

  useEffect(() => {
    if (reducedMotion) setPlaying(false);
  }, [reducedMotion]);

  useEffect(() => {
    if (playing && enabled && !reducedMotion) start();
    else clear();
    return clear;
  }, [playing, enabled, reducedMotion, start]);

  const selectStage = useCallback((index) => {
    setStage(index);
    if (playing && enabled && !reducedMotion) start();
  }, [enabled, playing, reducedMotion, start]);

  const togglePlay = useCallback(() => {
    setPlaying((value) => !value);
  }, []);

  return { stage, playing, selectStage, togglePlay };
}
