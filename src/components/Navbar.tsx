"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "case-studies", label: "Case Studies" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            next[entry.target.id] = entry.isIntersecting;
          });
          return next;
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0,
      }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const activeId = NAV_ITEMS.find((item) => visibleSections[item.id])?.id || "";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <AnimatePresence>
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 md:bottom-auto md:top-0 left-0 right-0 z-50 flex justify-center md:pt-4 pointer-events-none"
        >
          {/* Container */}
          <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center p-1.5 shadow-2xl shadow-neon-blue/10 max-w-[95vw] mx-2">
            
            {/* Scrollable Area */}
            <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar px-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`flex-shrink-0 whitespace-nowrap px-3 py-2 text-[11px] md:text-xs font-mono font-medium rounded-full transition-all duration-300 ${
                    activeId === item.id
                      ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Separator & CTA (Fixed, preserves layout) */}
            <div className="hidden md:flex items-center border-l border-white/10 pl-1 ml-1 flex-shrink-0">
              <a
                href="mailto:ayabulelamahlathini@gmail.com"
                className="whitespace-nowrap px-3 md:px-4 py-2 text-[10px] md:text-xs font-mono font-bold rounded-full bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-colors"
              >
                HIRE ME
              </a>
            </div>
          </div>
        </motion.nav>
      </AnimatePresence>
    </>
  );
}
