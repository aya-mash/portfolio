"use client";

import { SectionShell } from './SectionShell';
import { NeonCard } from './NeonCard';
import { motion } from 'framer-motion';
import { Cpu, Zap, Shield, ArrowUpRight } from 'lucide-react';

interface CaseStudy {
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  description: string;
  icon: React.ElementType;
  technologies: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "High-Scale Data Engine",
    category: "Performance Engineering",
    metric: "1M+",
    metricLabel: "Records Handled",
    description: "Optimized a mission-critical planning tool using React Virtualization and Web Workers to achieve sub-16ms latency for massive datasets.",
    icon: Cpu,
    technologies: ["React Virtualized", "Web Workers", "Redux Toolkit", "Reselect"]
  },
  {
    title: "Platform Modernization",
    category: "Developer Experience",
    metric: "40%",
    metricLabel: "Faster Builds",
    description: "Migrated legacy Webpack architecture to a modular Vite ecosystem, establishing standardized micro-frontend configs and automated versioning.",
    icon: Zap,
    technologies: ["Vite", "Turborepo", "Custom Plugins", "GitHub Actions"]
  },
  {
    title: "Security Operations (AppSec)",
    category: "Security & Compliance",
    metric: "ISO",
    metricLabel: "Compliance Ready",
    description: "Designed a Zero-Trust authentication architecture with client-side encryption and automated secret scanning pipelines to meet enterprise standards.",
    icon: Shield,
    technologies: ["OIDC/JWT", "Dependabot", "SonarQube", "Trivy"]
  }
];

export function FeaturedCaseStudies() {
  return (
    <SectionShell id="case-studies" title="Featured Case Studies" eyebrow="SENIOR Platform WORK">
      <div className="grid md:grid-cols-3 gap-6">
        {CASE_STUDIES.map((study, i) => (
          <motion.div
            key={study.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <NeonCard className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-white/5 text-neon-blue border border-white/5">
                  <study.icon size={24} strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white tracking-tight">{study.metric}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neon-green/80">
                    {study.metricLabel}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-pink transition-colors">
                  {study.title}
                </h3>
                <span className="text-xs font-mono text-neon-blue/80 tracking-wide uppercase">
                  {study.category}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                {study.description}
              </p>

              <div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map(tech => (
                    <span 
                      key={tech} 
                      className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-slate-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
