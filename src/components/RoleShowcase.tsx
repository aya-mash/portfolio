"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Rotating capability keywords sourced directly from resume core skills & achievements
// Keep each under ~18 chars to avoid layout shift; adjust width below if adding longer terms.
const WORDS = [
  "React",
  "TypeScript",
  "Design Systems",
  "Micro Frontends",
  "Performance",
  "GraphQL",
  "Apollo Client",
  "React Query",
  "Vite",
  "Accessibility",
  "Next.js",
  "TailwindCSS",
];

export function RoleShowcase() {
  const [index, setIndex] = useState(0);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [widthCh, setWidthCh] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    // Measure current word width and set container width in ch (approximate using character count fallback)
    const word = WORDS[index];
    if (measureRef.current) {
      measureRef.current.textContent = word;
      const rect = measureRef.current.getBoundingClientRect();
      // Convert px width to ch equivalent using average character width of the element's font
      const fontSize = parseFloat(getComputedStyle(measureRef.current).fontSize || '13');
      // Rough monospace approximation: ch ~ fontSize * 0.62 (for JetBrains Mono it can be near 0.6). We prefer measuring '0' width.
  measureRef.current.textContent = '0';
      const zeroRect = measureRef.current.getBoundingClientRect();
      const perCh = zeroRect.width || (fontSize * 0.62);
      measureRef.current.textContent = word;
      const ch = rect.width / perCh;
      setWidthCh(Math.ceil(ch + 0.5));
    } else {
      setWidthCh(word.length + 1);
    }
  }, [index]);
  return (
    <div className="mt-6 font-mono text-[13px] md:text-sm tracking-wide text-soft/90">
      <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 border border-white/10 text-neon-pink/80">
          &lt;FrontendEngineer /&gt;
        </span>
        <span className="text-muted">specialising in</span>
        <span
          className="relative inline-block h-[1.4em]"
          style={{ width: widthCh ? `${widthCh}ch` : undefined }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={WORDS[index]}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 flex items-center text-neon-blue/90 dark:text-neon-blue"
            >
              {WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </span>
        {/* Hidden measuring span */}
        <span ref={measureRef} className="absolute -z-10 opacity-0 pointer-events-none font-mono text-[13px] md:text-sm tracking-wide whitespace-pre" aria-hidden />
        <span className="hidden sm:inline text-muted">
          crafting resilient UI pipelines
        </span>
      </div>
    </div>
  );
}
