'use client';

import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { getResume } from '@/data';

/* ── WebGL Detection ──────────────────────────────────────────── */

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('webgl2'))
    );
  } catch {
    return false;
  }
}

/* ── Reduced motion detection ─────────────────────────────────── */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/* ── Mobile detection ─────────────────────────────────────────── */

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return mobile;
}

/* ── Error Boundary (catches runtime WebGL failures) ──────────── */

class WebGLErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

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

/* ── CSS Fallback (no WebGL) ───────────────────────────────────── */

function CSSFallback() {
  return (
    <div className="wallpaper-fallback" aria-hidden="true">
      <div className="wallpaper-fallback-grid">
        {skillEntries.map((entry, i) => (
          <span
            key={i}
            className="wallpaper-fallback-word"
            style={{
              fontSize: `${entry.fontSize * 0.45}rem`,
              color: entry.color,
              animationDelay: `${(i * 0.15) % 4}s`,
            }}
          >
            {entry.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Scene ─────────────────────────────────────────────────────── */

export default function WallpaperScene() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    setWebgl(isWebGLAvailable());
  }, []);

  // Still detecting
  if (webgl === null) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }} aria-hidden="true">
        <CanvasLoader />
      </div>
    );
  }

  // Mobile or no WebGL — use CSS fallback (saves bundle weight + battery)
  if (!webgl || isMobile) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }} aria-hidden="true">
        <CSSFallback />
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }} aria-hidden="true">
      <WebGLErrorBoundary fallback={<CSSFallback />}>
        <Suspense fallback={<CanvasLoader />}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 75 }}>
            <fog attach="fog" args={['#0f0a1e', 25, 70]} />
            <Cloud radius={20} />
            <OrbitControls
              enablePan={false}
              autoRotate={!prefersReducedMotion}
              autoRotateSpeed={1.0}
              minDistance={15}
              maxDistance={55}
            />
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>
    </div>
  );
}
