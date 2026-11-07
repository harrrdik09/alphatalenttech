import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BridgeScene from './BridgeScene.jsx';

function Invalidator({ stage, playing, active }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [stage, playing, active, invalidate]);
  return null;
}

export default function TalentConnectionScene({
  stage,
  playing,
  reduced,
  quality,
  active,
  onFail,
}) {
  const [live, setLive] = useState(!reduced);

  useEffect(() => {
    if (reduced) {
      setLive(false);
      return undefined;
    }
    setLive(true);
    if (!playing) {
      const id = window.setTimeout(() => setLive(false), 1900);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [stage, playing, reduced]);

  const compact = quality === 'low';
  const frameloop = active && !reduced && live ? 'always' : 'demand';

  return (
    <Canvas
      dpr={compact ? [1, 1.2] : [1, 1.6]}
      frameloop={frameloop}
      camera={{ position: [0, compact ? 1.72 : 1.48, compact ? 12.6 : 10.35], fov: compact ? 40 : 36, near: 0.1, far: 40 }}
      gl={{ antialias: !compact, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.setClearColor('#080B1A');
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onFail?.();
        });
      }}
    >
      <Invalidator stage={stage} playing={playing} active={active} />
      <Suspense fallback={null}>
        <BridgeScene stage={stage} playing={playing} reduced={reduced} quality={quality} />
      </Suspense>
    </Canvas>
  );
}
