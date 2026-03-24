'use client';

import { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { getResume } from '@/data';

/* ── Data ─────────────────────────────────────────────────────── */

const resume = getResume();
const categories = Object.entries(resume.core_technical_skills ?? {});

/** Pair each skill with a font size based on its category's weight */
const skillEntries: { text: string; fontSize: number; color: string }[] = [];

const CATEGORY_COLORS: Record<string, string> = {
  'Frontend Platform': '#c084fc',
  'Developer Experience & Infra': '#60a5fa',
  'Security & Quality': '#34d399',
  'Data & Performance': '#fbbf24',
};

const CATEGORY_FONT_SIZES: Record<number, number> = {
  7: 3.2, // large categories
  6: 2.6, // medium
  5: 2.0, // smaller
};

for (const [category, skills] of categories) {
  const count = (skills as string[]).length;
  const fontSize = CATEGORY_FONT_SIZES[count] ?? 2.2;
  const color = CATEGORY_COLORS[category] ?? '#c084fc';
  for (const skill of skills as string[]) {
    skillEntries.push({ text: skill, fontSize, color });
  }
}

/* ── Fibonacci Sphere ─────────────────────────────────────────── */

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < n; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
    points.push(
      new THREE.Vector3().setFromSpherical(
        new THREE.Spherical(radius, phi, theta),
      ),
    );
  }
  return points;
}

/* ── Word Component ───────────────────────────────────────────── */

interface WordProps {
  position: THREE.Vector3;
  children: string;
  fontSize: number;
  baseColor: string;
}

function Word({ position, children, fontSize, baseColor }: WordProps) {
  const color = useMemo(() => new THREE.Color(), []);
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const fontProps = useMemo(
    () => ({
      fontSize,
      letterSpacing: -0.05,
      lineHeight: 1,
      'material-toneMapped': false,
    }),
    [fontSize],
  );

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current.quaternion.copy(camera.quaternion);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(color.set(hovered ? '#ffffff' : baseColor), 0.1);
  });

  return (
    <Text
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        (e as unknown as { stopPropagation: () => void }).stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      {...fontProps}
    >
      {children}
    </Text>
  );
}

/* ── Cloud Component ──────────────────────────────────────────── */

function Cloud({ radius = 20 }) {
  const words = useMemo(() => {
    const positions = fibonacciSphere(skillEntries.length, radius);
    return skillEntries.map((entry, i) => ({
      position: positions[i],
      ...entry,
    }));
  }, [radius]);

  return (
    <>
      {words.map((w, i) => (
        <Word
          key={i}
          position={w.position}
          fontSize={w.fontSize}
          baseColor={w.color}
        >
          {w.text}
        </Word>
      ))}
    </>
  );
}

/* ── Loading Fallback ─────────────────────────────────────────── */

function CanvasLoader() {
  return (
    <div className="wallpaper-loader">
      <div className="wallpaper-loader-spinner" />
    </div>
  );
}

/* ── Scene ─────────────────────────────────────────────────────── */

export default function WallpaperScene() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Suspense fallback={<CanvasLoader />}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 75 }}>
          <fog attach="fog" args={['#0f0a1e', 25, 70]} />
          <Cloud radius={20} />
          <OrbitControls
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.0}
            minDistance={15}
            maxDistance={55}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
