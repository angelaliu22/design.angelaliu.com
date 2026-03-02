"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Deterministic seeded RNG
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Build a leaf's outline points (oval with a pointed tip)
function leafOutlinePoints(segments = 40): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    // Asymmetric oval: wider in middle, pointed top/bottom
    const r = 0.22 * Math.sin(t);
    const y = 0.48 * Math.cos(t) * (1 - 0.15 * Math.abs(Math.sin(t)));
    pts.push(new THREE.Vector3(r, y, 0));
  }
  return pts;
}

// Side vein: goes from midrib outward at an angle, slightly curved
function sideVeinPoints(side: 1 | -1, yStart: number, angle: number): THREE.Vector3[] {
  const len = 0.13 + Math.abs(yStart) * 0.1;
  return [
    new THREE.Vector3(0, yStart, 0),
    new THREE.Vector3(side * len * 0.5, yStart + angle * 0.04, 0),
    new THREE.Vector3(side * len, yStart + angle * 0.02, 0),
  ];
}

// A single pencil-sketch leaf: line loop outline + midrib + side veins
function SketchLeaf({
  position,
  rotZ,
  scale,
  phase,
  driftFreqX,
  driftFreqY,
  spinSpeed,
  opacity,
}: {
  position: [number, number, number];
  rotZ: number;
  scale: number;
  phase: number;
  driftFreqX: number;
  driftFreqY: number;
  spinSpeed: number;
  opacity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const color = new THREE.Color("#5a5a5a");
  const strokeOpacity = opacity;

  // Outline
  const outlineGeo = useMemo(() => {
    const pts = leafOutlinePoints(48);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  const outlineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: strokeOpacity }),
    [strokeOpacity] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Midrib (center vein)
  const midribGeo = useMemo(() => {
    const pts = [new THREE.Vector3(0, -0.44, 0), new THREE.Vector3(0, 0.44, 0)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  const midribMat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: strokeOpacity * 0.7 }),
    [strokeOpacity] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Side veins (4 pairs)
  const veinGeos = useMemo(() => {
    const veinYs = [-0.28, -0.1, 0.1, 0.28];
    return veinYs.flatMap((y) => [
      new THREE.BufferGeometry().setFromPoints(sideVeinPoints(1, y, 1)),
      new THREE.BufferGeometry().setFromPoints(sideVeinPoints(-1, y, 1)),
    ]);
  }, []);
  const veinMat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: strokeOpacity * 0.5 }),
    [strokeOpacity] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle billow: drift + slow tumble
    groupRef.current.position.x = position[0] + Math.sin(t * driftFreqX + phase) * 0.5;
    groupRef.current.position.y = position[1] + Math.sin(t * driftFreqY + phase * 0.8) * 0.35;
    groupRef.current.position.z = position[2];
    // Rotation: slow tumble + gentle flutter
    groupRef.current.rotation.z = rotZ + t * spinSpeed + Math.sin(t * 0.5 + phase) * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.3 + phase * 1.2) * 0.18;
    groupRef.current.rotation.y = Math.cos(t * 0.25 + phase) * 0.12;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={new THREE.Line(outlineGeo, outlineMat)} />
      <primitive object={new THREE.Line(midribGeo, midribMat)} />
      {veinGeos.map((geo, i) => (
        <primitive key={i} object={new THREE.Line(geo, veinMat)} />
      ))}
    </group>
  );
}

// Petal: more rounded, broader oval with a notch at top
function SketchPetal({
  position,
  rotZ,
  scale,
  phase,
  driftFreqX,
  driftFreqY,
  spinSpeed,
  opacity,
}: {
  position: [number, number, number];
  rotZ: number;
  scale: number;
  phase: number;
  driftFreqX: number;
  driftFreqY: number;
  spinSpeed: number;
  opacity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const color = new THREE.Color("#6a6a6a");

  const outlineGeo = useMemo(() => {
    // Rounded petal outline
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 44; i++) {
      const t = (i / 44) * Math.PI * 2;
      const r = 0.18 + 0.04 * Math.sin(t * 2);
      const x = r * Math.sin(t) * 1.1;
      const y = r * Math.cos(t) * 1.3 - 0.04 * Math.sin(t * 2);
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // A few curved lines inside petal for texture
  const innerGeos = useMemo(() => {
    return [-0.06, 0, 0.06].map((xOff) => {
      const pts = [
        new THREE.Vector3(xOff * 0.5, -0.2, 0),
        new THREE.Vector3(xOff, 0, 0),
        new THREE.Vector3(xOff * 0.7, 0.18, 0),
      ];
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, []);

  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    [opacity] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const innerMat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: opacity * 0.45 }),
    [opacity] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.x = position[0] + Math.sin(t * driftFreqX + phase) * 0.45;
    groupRef.current.position.y = position[1] + Math.sin(t * driftFreqY + phase * 0.9) * 0.3;
    groupRef.current.position.z = position[2];
    groupRef.current.rotation.z = rotZ + t * spinSpeed + Math.cos(t * 0.45 + phase) * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.35 + phase) * 0.2;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={new THREE.Line(outlineGeo, lineMat)} />
      {innerGeos.map((geo, i) => (
        <primitive key={i} object={new THREE.Line(geo, innerMat)} />
      ))}
    </group>
  );
}

function BotanicalField() {
  const items = useMemo(() => {
    const rng = mulberry32(17);
    return Array.from({ length: 32 }, (_, i) => {
      const isPetal = rng() < 0.35;
      return {
        id: i,
        isPetal,
        position: [
          (rng() - 0.5) * 18,
          (rng() - 0.5) * 10,
          (rng() - 0.5) * 3,
        ] as [number, number, number],
        rotZ: rng() * Math.PI * 2,
        scale: isPetal ? 0.55 + rng() * 0.7 : 0.6 + rng() * 1.1,
        phase: rng() * Math.PI * 2,
        driftFreqX: 0.18 + rng() * 0.32,
        driftFreqY: 0.14 + rng() * 0.28,
        spinSpeed: (rng() - 0.5) * 0.08,
        opacity: 0.35 + rng() * 0.4,
      };
    });
  }, []);

  return (
    <>
      {items.map((item) =>
        item.isPetal ? (
          <SketchPetal key={item.id} {...item} />
        ) : (
          <SketchLeaf key={item.id} {...item} />
        )
      )}
    </>
  );
}

export function BotanicalScene() {
  return (
    <div style={{ position: "absolute", inset: 0 }} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 52 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <BotanicalField />
      </Canvas>
    </div>
  );
}
