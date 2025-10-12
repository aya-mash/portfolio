"use client";
import { memo, useEffect, useRef } from 'react';

// Lightweight procedural animated grid (canvas)
interface AnimatedGridBackgroundProps {
  className?: string;
  lineColor?: string;
  glowColor?: string;
}

export const AnimatedGridBackground = memo(function AnimatedGridBackground({ className, lineColor = 'rgba(255,255,255,0.08)', glowColor = 'rgba(125,91,255,0.25)' }: AnimatedGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const DPR = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas || !ctx) return;
      canvas.width = canvas.clientWidth * DPR;
      canvas.height = canvas.clientHeight * DPR;
      ctx.scale(DPR, DPR);
    }
    resize();
    window.addEventListener('resize', resize);

    const spacing = 48;
    const speed = 12; // px per second vertical drift
    let offset = 0;
    function draw(t: number) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = t / 1000;
      offset = (time * speed) % spacing;

      ctx.lineWidth = 1;
      ctx.strokeStyle = lineColor;

  const cols = Math.ceil(canvas.width / DPR / spacing) + 1;
  const rows = Math.ceil(canvas.height / DPR / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        const x = i * spacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.height / DPR);
        ctx.stroke();
      }
      for (let j = 0; j < rows; j++) {
        const y = (j * spacing + offset);
        ctx.beginPath();
        ctx.moveTo(0, y);
  ctx.lineTo(canvas.width / DPR, y);
        ctx.stroke();
      }

      // Subtle glow overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / (2 * DPR),
        canvas.height / (2 * DPR),
        0,
        canvas.width / (2 * DPR),
        canvas.height / (2 * DPR),
        Math.max(canvas.width, canvas.height) / DPR
      );
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      animationFrame = requestAnimationFrame(draw);
    }

    animationFrame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [lineColor, glowColor]);

  return <canvas ref={canvasRef} className={"absolute inset-0 w-full h-full " + (className ?? '')} />;
});
