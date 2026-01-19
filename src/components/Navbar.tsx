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
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Scroll visibility
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

    // Active Link Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px", // Trigger when element is near center/top
        threshold: 0.1,
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // Offset for navbar
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none"
        >
          <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-1 p-1 shadow-2xl shadow-neon-blue/10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`px-4 py-2 text-xs font-mono font-medium rounded-full transition-all duration-300 ${
                  activeId === item.id
                    ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            ))}

            <div className="w-px h-4 bg-white/10 mx-1" />

            <a
              href="mailto:ayabulelamahlathini@gmail.com"
              className="px-4 py-2 text-xs font-mono font-medium rounded-full bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-colors"
            >
              HIRE_ME
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
