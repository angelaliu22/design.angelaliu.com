"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Very subtle ambient floating particles — like dust in light
function AmbientParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.15;
    const posArray = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3] += Math.sin(t + i * 0.3) * 0.001;
      posArray[i * 3 + 1] += Math.cos(t * 0.7 + i * 0.2) * 0.0008;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c45a3c"
        size={0.015}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Slow-rotating horizontal lines — like prairie horizon
function HorizonLines() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
  });

  const lines = useMemo(() => {
    const result: { y: number; width: number; opacity: number }[] = [];
    for (let i = 0; i < 6; i++) {
      result.push({
        y: -2 + i * 0.8,
        width: 6 + Math.random() * 8,
        opacity: 0.04 + Math.random() * 0.06,
      });
    }
    return result;
  }, []);

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <mesh key={i} position={[0, line.y, -4]}>
          <planeGeometry args={[line.width, 0.01]} />
          <meshBasicMaterial
            color="#d4a853"
            transparent
            opacity={line.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#0c0c0c"]} />
      <AmbientParticles />
      <HorizonLines />
    </>
  );
}

export function WaterfallScene() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
