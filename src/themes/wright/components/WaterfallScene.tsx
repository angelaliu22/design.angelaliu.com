"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Particle-based waterfall
function WaterParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, velocities, lifetimes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across a wide area at the top
      pos[i * 3] = (Math.random() - 0.5) * 8; // x: wide spread
      pos[i * 3 + 1] = Math.random() * 6 + 2; // y: start high
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2; // z: some depth

      vel[i * 3] = (Math.random() - 0.5) * 0.02; // slight x drift
      vel[i * 3 + 1] = -0.02 - Math.random() * 0.04; // fall speed
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      life[i] = Math.random(); // stagger start times
    }

    return [pos, vel, life];
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posArray = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Update positions
      posArray[i * 3] += velocities[i * 3] * delta * 60;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;

      // Accelerate downward (gravity)
      velocities[i * 3 + 1] -= 0.001 * delta * 60;

      // Reset when below water level
      if (posArray[i * 3 + 1] < -3) {
        posArray[i * 3] = (Math.random() - 0.5) * 8;
        posArray[i * 3 + 1] = Math.random() * 2 + 4;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 1] = -0.02 - Math.random() * 0.04;
      }
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
        color="#a8c4d4"
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Mist particles near the base of the waterfall
function MistParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 2 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle floating drift
      posArray[i * 3] += Math.sin(t + i * 0.1) * 0.003;
      posArray[i * 3 + 1] += Math.cos(t * 0.5 + i * 0.05) * 0.002;

      // Reset if drifted too far
      if (posArray[i * 3 + 1] > 0) {
        posArray[i * 3 + 1] = -3;
      }
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
        color="#d4e6ef"
        size={0.12}
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Concrete cantilever slabs (Fallingwater-style)
function ConcreteSlab({
  position,
  width,
  depth,
}: {
  position: [number, number, number];
  width: number;
  depth: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, 0.15, depth]} />
      <meshStandardMaterial color="#c4b9a8" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

// Stone wall / pillar
function StonePillar({
  position,
  height,
}: {
  position: [number, number, number];
  height: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.4, height, 0.6]} />
      <meshStandardMaterial color="#8a7d6b" roughness={1} metalness={0} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#e8dcc8" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={0.8}
        color="#fff5e0"
        castShadow
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.3}
        color="#a8c4d4"
      />

      {/* Fog for depth */}
      <fog attach="fog" args={["#2c3828", 8, 25]} />

      {/* Background - dark forest green */}
      <color attach="background" args={["#1a2418"]} />

      {/* Waterfall particles */}
      <WaterParticles />
      <MistParticles />

      {/* Cantilevered concrete slabs */}
      <ConcreteSlab position={[-2, 1.5, 0]} width={5} depth={3} />
      <ConcreteSlab position={[1.5, 0, -0.5]} width={4.5} depth={2.5} />
      <ConcreteSlab position={[-1, -1.5, 0.3]} width={6} depth={2.8} />

      {/* Stone pillars */}
      <StonePillar position={[-4, 0, 0.5]} height={4} />
      <StonePillar position={[3.5, -0.5, -0.3]} height={3} />

      {/* Water surface at bottom */}
      <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#2a4a3a"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Rocks */}
      {[
        [-3, -3, 1],
        [2, -3.2, 0.5],
        [-1, -3.1, 1.5],
        [4, -3, -0.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <dodecahedronGeometry args={[0.4 + Math.random() * 0.3, 0]} />
          <meshStandardMaterial color="#5a5045" roughness={1} />
        </mesh>
      ))}

      {/* Camera position */}
      <perspectiveCamera position={[0, 1, 8]} />
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
        camera={{ position: [0, 0.5, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
