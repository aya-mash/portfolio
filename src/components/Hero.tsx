"use client";
import { loadResume } from '@/lib/resume';
import { motion } from 'framer-motion';
import { AnimatedGridBackground } from './AnimatedGridBackground';
import { ProfileImage } from './ProfileImage';
import { RoleShowcase } from './RoleShowcase';

export function Hero() {
  const resume = loadResume();
  const { personal_info, executive_summary, totalYearsExperience } = resume;
  return (
    <div className="relative min-h-[70vh] flex items-center">
      <AnimatedGridBackground className="opacity-40" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-10 md:gap-8">
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                <span className="block font-mono text-[13px] md:text-sm text-neon-blue/80 tracking-wider">
                  &lt;h1 role="heading" data-level="1"&gt;
                </span>
                <span className="neon-text block bg-clip-text mt-1">
                  {personal_info.preferred_name}
                </span>
                <span className="mt-3 block text-slate-300 text-xl md:text-2xl font-light">
                  Senior Frontend Platform Engineer · {totalYearsExperience != null ? Math.round(totalYearsExperience) : 0}+ yrs
                </span>
                <span className="block font-mono text-[13px] md:text-sm text-neon-blue/60 tracking-wider mt-4">
                  &lt;/h1&gt;
                </span>
              </h1>
              <RoleShowcase />
            </motion.div>
          </div>
          <ProfileImage size={220} />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="mt-10 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed"
        >
          Architecting high-performance React systems and standardizing enterprise engineering patterns.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-10 flex flex-wrap gap-4 text-sm"
        >
          <a href="#case-studies" aria-label="Jump to case studies section" className="px-5 py-2 rounded-full bg-gradient-to-r from-neon-pink/30 to-neon-blue/30 hover:from-neon-pink/50 hover:to-neon-blue/50 backdrop-blur-md border border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            Case Studies
          </a>
          <a href="#experience" aria-label="Jump to experience section" className="px-5 py-2 rounded-full glass hover:bg-surface-hover border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            Experience
          </a>
          <a href="#projects" aria-label="Jump to projects section" className="px-5 py-2 rounded-full glass hover:bg-surface-hover border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            Projects
          </a>
          <a href={`mailto:${personal_info.email}`} aria-label="Compose email to Aya" className="px-5 py-2 rounded-full glass hover:bg-surface-hover border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            Contact
          </a>
          <a href={personal_info.github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile" className="px-5 py-2 rounded-full glass hover:bg-surface-hover border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            GitHub
          </a>
        </motion.div>
      </div>
    </div>
  );
}
