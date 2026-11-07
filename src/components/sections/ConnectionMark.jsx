import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';

function Mark({ reduced }) {
  const ring = useRef();
  useFrame((_, delta) => {
    if (reduced || !ring.current) return;
    ring.current.rotation.z += delta * 0.35;
  });

  return (
    <>
      <color attach="background" args={['#080B1A']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 3]} intensity={2.2} />
      <mesh position={[-1.15, 0, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#633bff" emissive="#633bff" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[1.15, 0, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#248bff" emissive="#248bff" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 1.7, 8]} />
        <meshBasicMaterial color="#b5a5ff" />
      </mesh>
      <mesh ref={ring} rotation={[0.7, 0.2, 0]}>
        <torusGeometry args={[0.42, 0.028, 16, 48]} />
        <meshStandardMaterial color="#efeaff" metalness={0.72} roughness={0.22} />
      </mesh>
    </>
  );
}

export default function ConnectionMark({ reduced = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0.35, 4.2], fov: 35 }}
      dpr={[1, 1.5]}
      frameloop={reduced ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%' }}
    >
      <Mark reduced={reduced} />
    </Canvas>
  );
}
