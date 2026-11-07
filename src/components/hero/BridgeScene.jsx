import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, useTexture } from '@react-three/drei';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import cardStyles from './StoryCards.module.css';

const POSES = [
  {
    cardEmployer: 1,
    cardCandidate: 0.42,
    employerPath: 0.72,
    candidatePath: 0.05,
    nodes: 0,
    traveler: 0,
    ring: 0,
    employerEnergy: 1,
    candidateEnergy: 0.38,
    hubEnergy: 0.5,
    camX: -0.9,
  },
  {
    cardEmployer: 1,
    cardCandidate: 0.5,
    employerPath: 1,
    candidatePath: 0.12,
    nodes: 1,
    traveler: 0,
    ring: 0,
    employerEnergy: 0.75,
    candidateEnergy: 0.46,
    hubEnergy: 1,
    camX: 0.05,
  },
  {
    cardEmployer: 0.84,
    cardCandidate: 1,
    employerPath: 1,
    candidatePath: 1,
    nodes: 0.82,
    traveler: 1,
    ring: 0.08,
    employerEnergy: 0.8,
    candidateEnergy: 1,
    hubEnergy: 0.92,
    camX: 0.9,
  },
  {
    cardEmployer: 0.92,
    cardCandidate: 1,
    employerPath: 1,
    candidatePath: 1,
    nodes: 0.22,
    traveler: 1,
    ring: 1,
    employerEnergy: 1,
    candidateEnergy: 1,
    hubEnergy: 1,
    camX: 0,
  },
];

const INTRO = {
  cardEmployer: 0.04,
  cardCandidate: 0.04,
  employerPath: 0,
  candidatePath: 0,
  nodes: 0,
  traveler: 0,
  ring: 0,
  employerEnergy: 0.4,
  candidateEnergy: 0.28,
  hubEnergy: 0.28,
  camX: -0.2,
};

const KEYS = Object.keys(POSES[0]);

const employerCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-1.45, 1.05, 0.45),
  new THREE.Vector3(-0.85, 1.42, 0.8),
  new THREE.Vector3(-0.12, 1.12, 0.28),
]);

const candidateCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.5, 1.08, 0.45),
  new THREE.Vector3(0.88, 1.46, 0.8),
  new THREE.Vector3(0.14, 1.12, 0.28),
]);

const NODE_DEFS = [
  { id: 'skills', label: 'Skills', hot: true },
  { id: 'experience', label: 'Experience', hot: true },
  { id: 'profile', label: 'Profile', hot: false },
  { id: 'interest', label: 'Interest', hot: false },
  { id: 'background', label: 'Background', hot: false },
];

function dampPose(current, target, delta) {
  for (const key of KEYS) {
    current[key] = THREE.MathUtils.damp(current[key], target[key], 2.5, delta);
  }
}

function GlowPath({ curve, color, weightKey, weights }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 56, 0.014, 6, false), [curve]);
  const material = useRef();

  useFrame(() => {
    if (!material.current) return;
    material.current.opacity = 0.08 + weights.current[weightKey] * 0.9;
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        ref={material}
        color={color}
        transparent
        opacity={0.2}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function PacketStream({ curve, count, color, weightKey, weights, timeRef }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let index = 0; index < count; index += 1) {
      dummy.position.set(0, -4, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const span = weights.current[weightKey];
    for (let index = 0; index < count; index += 1) {
      const local = (timeRef.current * 0.2 + index / count) % 1;
      curve.getPoint(THREE.MathUtils.clamp(local * Math.max(span, 0), 0, 1), scratch);
      dummy.position.copy(scratch);
      dummy.scale.setScalar(span > 0.04 ? 1 : 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.042, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
}

export default function BridgeScene({ stage, playing, reduced, quality }) {
  const logo = useTexture('/logo.jpg');
  const compact = quality === 'low';
  const parallax = !compact && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const weights = useRef(null);
  if (!weights.current) weights.current = { ...(reduced ? POSES[0] : INTRO) };

  const stageRef = useRef(stage);
  const playingRef = useRef(playing);
  stageRef.current = stage;
  playingRef.current = playing;

  const timeRef = useRef(0);
  const root = useRef();
  const travelerRef = useRef();
  const linkRef = useRef();
  const nodeGroup = useRef();
  const nodeRefs = useRef([]);
  const ringA = useRef();
  const ringB = useRef();
  const beacon = useRef();
  const lookAt = useRef(new THREE.Vector3(0, 1.08, 0));
  const scratch = useMemo(() => new THREE.Vector3(), []);

  const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e7f0ff',
    emissive: '#7eb6ff',
    emissiveIntensity: 0.45,
    roughness: 0.22,
    metalness: 0.04,
  }), []);

  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#2a2162',
    metalness: 0.46,
    roughness: 0.34,
    clearcoat: compact ? 0 : 0.35,
    emissive: '#248bff',
    emissiveIntensity: 0.08,
  }), [compact]);

  const hubMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d5ccff',
    emissive: '#633bff',
    emissiveIntensity: 0.45,
    metalness: 0.72,
    roughness: 0.22,
  }), []);

  useLayoutEffect(() => {
    logo.colorSpace = THREE.SRGBColorSpace;
    logo.anisotropy = 8;
    logo.needsUpdate = true;
  }, [logo]);

  const { camera, pointer } = useThree();
  const camY = compact ? 1.72 : 1.48;
  const camZ = compact ? 12.6 : 10.35;
  const sceneScale = compact ? 0.82 : 0.96;
  const nodes = compact ? NODE_DEFS.slice(0, 3) : NODE_DEFS;
  const packetCount = compact ? 4 : 7;
  const windowGrid = compact
    ? { cols: 3, rows: 3 }
    : { cols: 4, rows: 5 };

  const windows = [];
  for (let row = 0; row < windowGrid.rows; row += 1) {
    for (let col = 0; col < windowGrid.cols; col += 1) {
      const x = windowGrid.cols === 1 ? 0 : -0.4 + (col / (windowGrid.cols - 1)) * 0.8;
      const y = 0.55 + (row / Math.max(windowGrid.rows - 1, 1)) * 1.28;
      windows.push([x, y, 0.43]);
    }
  }

  useFrame((_, delta) => {
    if (playingRef.current && !reduced) timeRef.current += delta;
    const pose = POSES[stageRef.current];
    if (reduced) {
      Object.assign(weights.current, pose);
      camera.position.set(pose.camX, camY, camZ);
      camera.lookAt(0, 1.08, 0);
    } else {
      dampPose(weights.current, pose, delta);
      const current = weights.current;
      const px = parallax ? pointer.x * 0.22 : 0;
      const py = parallax ? pointer.y * 0.08 : 0;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, current.camX + px, 2.4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camY + py, 2.4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 2.4, delta);
      lookAt.current.set(current.camX * 0.25, 1.08, 0);
      camera.lookAt(lookAt.current);
    }

    if (root.current && parallax && !reduced) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x * 0.055, 2.4, delta);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, pointer.y * -0.028, 2.4, delta);
    }

    const current = weights.current;
    windowMaterial.emissiveIntensity = 0.18 + current.employerEnergy * 0.9;
    bodyMaterial.emissiveIntensity = 0.03 + current.candidateEnergy * 0.24;
    hubMaterial.emissiveIntensity = 0.2 + current.hubEnergy * 0.95;

    if (beacon.current) {
      const pulse = playingRef.current && !reduced ? 1 + Math.sin(timeRef.current * 2.1) * 0.1 : 1;
      beacon.current.scale.setScalar(pulse);
    }
    if (ringA.current) {
      ringA.current.rotation.x = Math.PI / 2.2;
      ringA.current.rotation.z = timeRef.current * 0.22;
    }
    if (ringB.current) {
      ringB.current.rotation.x = 1.05;
      ringB.current.rotation.y = timeRef.current * 0.16;
    }

    const travel = THREE.MathUtils.clamp(current.traveler, 0, 1);
    candidateCurve.getPoint(travel, scratch);
    if (travelerRef.current) {
      travelerRef.current.position.copy(scratch);
      travelerRef.current.scale.setScalar(Math.max(travel * (1 - current.ring), 0));
    }
    if (linkRef.current) {
      linkRef.current.scale.setScalar(Math.max(current.ring, 0.001));
      linkRef.current.visible = current.ring > 0.04;
    }

    const spin = reduced || !playingRef.current ? 0.6 : timeRef.current * 0.16;
    nodeRefs.current.forEach((node, index) => {
      if (!node) return;
      const angle = spin + (index / Math.max(nodes.length, 1)) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 1.55, Math.sin(angle) * 0.08, Math.sin(angle) * 0.28);
    });
    if (nodeGroup.current) {
      nodeGroup.current.scale.setScalar(Math.max(current.nodes, 0.001));
      nodeGroup.current.visible = current.nodes > 0.04;
    }
  });

  const showNodeLabels = stage === 1;

  return (
    <>
      <color attach="background" args={['#080B1A']} />
      <hemisphereLight args={['#d5def8', '#140f2e', 0.72]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 6]} intensity={2.4} color="#f7f8ff" />
      <directionalLight position={[-6, 3, -3]} intensity={0.7} color="#633bff" />
      <pointLight position={[0, 2.2, 2.4]} intensity={18} distance={12} decay={2} color="#f3f0ff" />
      <pointLight position={[-3.2, 1.8, 1.6]} intensity={14} distance={8} decay={2} color="#633bff" />
      <pointLight position={[3.2, 1.8, 1.6]} intensity={12} distance={8} decay={2} color="#248bff" />

      <group ref={root} scale={sceneScale}>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[5.5, 0.08, 1.05]} />
          <meshStandardMaterial color="#14182e" metalness={0.62} roughness={0.32} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
          <circleGeometry args={[5.2, 48]} />
          <meshStandardMaterial color="#0b1022" metalness={0.4} roughness={0.6} />
        </mesh>

        <group position={[-2.15, 0, 0]}>
          <RoundedBox args={[1.7, 0.22, 1.12]} radius={0.04} position={[0, 0.12, 0]}>
            <meshStandardMaterial color="#21154f" metalness={0.48} roughness={0.38} />
          </RoundedBox>
          <RoundedBox args={[1.2, 1.9, 0.8]} radius={0.07} smoothness={3} position={[0, 1.18, 0]}>
            <meshStandardMaterial color="#232846" metalness={0.58} roughness={0.28} />
          </RoundedBox>
          {windows.map(([x, y, z]) => (
            <mesh key={`${x}-${y}`} position={[x, y, z]} material={windowMaterial}>
              <boxGeometry args={[0.12, 0.14, 0.03]} />
            </mesh>
          ))}
          <mesh position={[0, 0.46, 0.42]}>
            <planeGeometry args={[0.26, 0.34]} />
            <meshStandardMaterial color="#0c1020" />
          </mesh>
          <mesh position={[0, 2.18, 0]}>
            <boxGeometry args={[0.62, 0.08, 0.42]} />
            <meshStandardMaterial color="#633bff" emissive="#633bff" emissiveIntensity={0.35} />
          </mesh>
          <mesh ref={beacon} position={[0, 2.38, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#b5a5ff" toneMapped={false} />
          </mesh>
          <Html position={[0, 2.32, 0]} center zIndexRange={[16, 0]} pointerEvents="none">
            <span className={cardStyles.sideLabel}>Employer</span>
          </Html>
        </group>

        <group position={[2.15, 0, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.58, 0.68, 0.12, 28]} />
            <meshStandardMaterial color="#17182e" metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.95, 0]} material={bodyMaterial}>
            <capsuleGeometry args={[0.27, 0.56, 6, 16]} />
          </mesh>
          <mesh position={[-0.36, 0.98, 0]} rotation={[0, 0, 0.4]} material={bodyMaterial}>
            <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
          </mesh>
          <mesh position={[0.36, 0.98, 0]} rotation={[0, 0, -0.4]} material={bodyMaterial}>
            <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
          </mesh>
          <mesh position={[0, 1.62, 0]}>
            <sphereGeometry args={[0.22, 28, 28]} />
            <meshStandardMaterial color="#f4f5ff" roughness={0.22} metalness={0.08} />
          </mesh>
          <mesh position={[0, 1.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.02, 10, 28]} />
            <meshStandardMaterial color="#248bff" emissive="#248bff" emissiveIntensity={0.4} />
          </mesh>
          <Html position={[0, 2.15, 0]} center zIndexRange={[16, 0]} pointerEvents="none">
            <span className={cardStyles.sideLabel}>Candidate</span>
          </Html>
        </group>

        <group position={[0, 1.2, 0]}>
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[1.16, 1.16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.02, 1.02]} />
            <meshBasicMaterial map={logo} toneMapped={false} />
          </mesh>
          <mesh ref={ringA} material={hubMaterial}>
            <torusGeometry args={[0.92, 0.016, 12, 64]} />
          </mesh>
          <mesh ref={ringB}>
            <torusGeometry args={[1.12, 0.01, 10, 64]} />
            <meshStandardMaterial color="#9ec9ff" emissive="#248bff" emissiveIntensity={0.55} metalness={0.7} roughness={0.25} />
          </mesh>
        </group>

        <GlowPath curve={employerCurve} color="#b5a5ff" weightKey="employerPath" weights={weights} />
        <GlowPath curve={candidateCurve} color="#7eb6ff" weightKey="candidatePath" weights={weights} />
        <PacketStream
          curve={employerCurve}
          count={packetCount}
          color="#d7ccff"
          weightKey="employerPath"
          weights={weights}
          timeRef={timeRef}
        />
        <PacketStream
          curve={candidateCurve}
          count={packetCount}
          color="#9fd0ff"
          weightKey="candidatePath"
          weights={weights}
          timeRef={timeRef}
        />

        <group ref={nodeGroup} position={[0, 1.18, 0]}>
          {nodes.map((node, index) => (
            <group key={node.id} ref={(element) => { nodeRefs.current[index] = element; }}>
              <mesh>
                <sphereGeometry args={[node.hot ? 0.09 : 0.062, 18, 18]} />
                <meshStandardMaterial
                  color={node.hot ? '#efeaff' : '#9aa3c4'}
                  emissive={node.hot ? '#633bff' : '#248bff'}
                  emissiveIntensity={node.hot ? 0.75 : 0.18}
                  metalness={0.35}
                  roughness={0.3}
                />
              </mesh>
              {showNodeLabels && node.hot ? (
                <Html position={[0, 0.22, 0]} center zIndexRange={[18, 0]} pointerEvents="none">
                  <span className={cardStyles.nodeTag}>{node.label}</span>
                </Html>
              ) : null}
            </group>
          ))}
        </group>

        <group ref={travelerRef}>
          <mesh>
            <sphereGeometry args={[0.09, 18, 18]} />
            <meshBasicMaterial color="#f5f6ff" toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.012, 10, 28]} />
            <meshBasicMaterial color="#248bff" toneMapped={false} />
          </mesh>
        </group>

        <group ref={linkRef} position={[0, 1.18, 0.55]}>
          <mesh rotation={[Math.PI / 2.35, 0, 0]}>
            <torusGeometry args={[0.58, 0.016, 12, 48]} />
            <meshBasicMaterial color="#e4dcff" toneMapped={false} />
          </mesh>
          <mesh position={[-0.58, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#633bff" toneMapped={false} />
          </mesh>
          <mesh position={[0.58, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#248bff" toneMapped={false} />
          </mesh>
        </group>

        {!compact ? (
          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={0.4}
            scale={14}
            blur={2.4}
            far={4.5}
            resolution={512}
            frames={28}
            color="#000000"
          />
        ) : null}
      </group>
    </>
  );
}
