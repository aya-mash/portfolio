"use client";

import { SectionShell } from "./SectionShell";
import { SpotlightEffect } from "./SpotlightEffect";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Cpu,
  Zap,
  Shield,
  FileSpreadsheet,
  LayoutTemplate,
} from "lucide-react";

interface CaseStudy {
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  description: string;
  icon: React.ElementType;
  technologies: string[];
  architecture?: React.ReactNode;
}

// Reusing ArchComponents locally
function ArchNode({
  label,
  sub,
  active = false,
  last = false,
  color = "neon-blue",
}: {
  label: string;
  sub: string;
  active?: boolean;
  last?: boolean;
  color?: string;
}) {
  const colorClass =
    color === "neon-blue"
      ? "text-neon-blue border-neon-blue bg-neon-blue/10"
      : color === "neon-green"
      ? "text-neon-green border-neon-green bg-neon-green/10"
      : "text-slate-400 border-white/20 bg-black";

  const dotClass =
    color === "neon-blue"
      ? "bg-neon-blue"
      : color === "neon-green"
      ? "bg-neon-green"
      : "bg-slate-500";

  return (
    <div className="relative flex items-center gap-4 pl-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border ${
          active ? colorClass : "border-white/20 bg-black"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            active ? dotClass : "bg-slate-500"
          }`}
        />
      </div>
      <div className="flex-1 p-3 rounded border border-white/5 bg-white/5 hover:border-white/20 transition-colors">
        <div className="text-xs font-bold text-slate-200">{label}</div>
        <div className="text-[10px] font-mono text-slate-400">{sub}</div>
      </div>
    </div>
  );
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "UI Architecture & Standardization",
    category: "Core Systems Engineering",
    metric: "-30%",
    metricLabel: "Boilerplate Reduction",
    description:
      "Architected the enterprise UI ecosystem over 5 years. Delivered a localized Design System, reusable component library, and standardized validation patterns (Formik/Yup/MUI), slashing feature delivery time from 3+ weeks to 2 days.",
    icon: LayoutTemplate,
    technologies: ["React", "Formik + Yup", "Design System", "MUI / Excel"],
    architecture: (
      <div className="flex flex-col md:flex-row gap-8 items-center h-full">
        <div className="flex-1">
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            A centralized ecosystem reducing redundancy. Validations, components,
            and theming are standardized at the root.
          </p>
          <div className="flex gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-pink" />
              <span>Tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
              <span>Schema</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
              <span>a11y</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 to-neon-blue/5 rounded-lg -z-10" />
          <div className="p-4 border border-white/10 rounded-lg bg-black/50 space-y-3">
            {/* Layer 1 */}
            <div className="flex items-center gap-4">
              <div className="w-20 text-[10px] text-right font-mono text-neon-pink uppercase">
                System
              </div>
              <div className="flex-1 h-8 rounded bg-white/5 border border-white/10 flex items-center px-3 text-xs text-slate-300">
                MUI Theme <span className="text-slate-600 mx-2">|</span> Styled
              </div>
            </div>
            {/* Layer 2 */}
            <div className="flex items-center gap-4">
              <div className="w-20 text-[10px] text-right font-mono text-neon-blue uppercase">
                Logic
              </div>
              <div className="flex-1 h-8 rounded bg-white/5 border border-white/10 flex items-center px-3 text-xs text-slate-300">
                Formik Ctx <span className="text-slate-600 mx-2">→</span> Yup
              </div>
            </div>
            {/* Layer 3 */}
            <div className="flex items-center gap-4">
              <div className="w-20 text-[10px] text-right font-mono text-neon-green uppercase">
                Output
              </div>
              <div className="flex-1 h-8 rounded bg-white/5 border border-white/10 flex items-center px-3 text-xs text-slate-300">
                ARIA Fields
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "High-Scale Data Engine",
    category: "Performance Engineering",
    metric: "1M+",
    metricLabel: "Records Handled",
    description:
      "Optimized a mission-critical planning tool using React Virtualization and Web Workers to achieve sub-16ms latency for massive datasets.",
    icon: Cpu,
    technologies: [
      "React Virtualized",
      "Web Workers",
      "Redux Toolkit",
      "Reselect",
    ],
    architecture: (
      <div className="relative flex flex-col justify-center h-full">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-2 rounded border border-white/10 bg-white/5 text-center">
            <div className="text-[10px] font-mono text-neon-pink mb-1">
              FRONTEND
            </div>
            <div className="text-[10px] font-bold">Apollo Client</div>
          </div>
          <div className="p-2 rounded border border-white/10 bg-white/5 text-center">
            <div className="text-[10px] font-mono text-neon-blue mb-1">
              BACKEND
            </div>
            <div className="text-[10px] font-bold">HotChocolate</div>
          </div>
        </div>

        <div className="space-y-2 font-mono text-[10px] text-slate-400">
          <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
            <span>List</span>
            <span className="text-neon-green">Virtual</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
            <span>Fetch</span>
            <span className="text-neon-blue">Batched</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
            <span>Aggr.</span>
            <span className="text-neon-pink">Paged</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Platform Modernization",
    category: "Developer Experience",
    metric: "40%",
    metricLabel: "Faster Builds",
    description:
      "Migrated legacy Webpack architecture to a modular Vite ecosystem, establishing standardized micro-frontend configs and automated versioning.",
    icon: Zap,
    technologies: ["Vite", "Turborepo", "Custom Plugins", "GitHub Actions"],
    architecture: (
      <div className="space-y-3 relative flex-grow pt-2">
        <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-neon-blue/50 to-transparent dashed-line" />
        <ArchNode
          label="Platform Config"
          sub="Vite Plugins"
          active
        />
        <ArchNode
          label="DX Layer"
          sub="Tokens · i18n"
        />
        <ArchNode
          label="Security"
          sub="OIDC · JWT"
        />
      </div>
    ),
  },
  {
    title: "Security Operations (AppSec)",
    category: "Security & Compliance",
    metric: "ISO",
    metricLabel: "Compliance Ready",
    description:
      "Designed a Zero-Trust authentication architecture with client-side encryption and automated secret scanning pipelines to meet enterprise standards.",
    icon: Shield,
    technologies: ["OIDC/JWT", "Dependabot", "SonarQube", "Trivy"],
    architecture: (
      <div className="space-y-3 relative flex-grow pt-2">
        <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-neon-green/50 to-transparent dashed-line" />
        <ArchNode
          label="Guardrails"
          sub="Lint · Secrets"
          color="neon-green"
        />
        <ArchNode
          label="CI Matrix"
          sub="Sonar · BlackDuck"
          color="neon-green"
          active
        />
        <ArchNode
          label="Audit"
          sub="SBOM · Logs"
          color="neon-green"
          last
        />
      </div>
    ),
  },
  {
    title: "Hybrid Import Engine",
    category: "Product & UX Architecture",
    metric: "+25%",
    metricLabel: "Import Success Rate",
    description:
      "Designed a resilient hybrid import flow (client preview + server streaming). Utilizes Postgres COPY for bulk transfers and optimistic set-based upserts, eliminating browser freezes.",
    icon: FileSpreadsheet,
    technologies: ["React", ".NET", "Postgres COPY", "Resiliency Patt."],
    architecture: (
        <div className="relative flex-grow flex flex-col justify-center space-y-2">
            <div className="p-2 rounded border border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[9px] font-mono text-purple-400">CLIENT</span>
                <span className="text-[10px] font-bold text-slate-200">Preview</span>
            </div>
            <span className="text-[9px] text-slate-500">→</span>
            <div className="flex flex-col text-right">
                <span className="text-[9px] font-mono text-purple-400">API</span>
                <span className="text-[10px] font-bold text-slate-200">Async</span>
            </div>
            </div>

            <div className="flex-1 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent mx-auto" />

            <div className="p-2 rounded border border-white/10 bg-white/5 space-y-1">
            <div className="text-[9px] font-mono text-slate-400 text-center uppercase tracking-wider">Processing</div>
            <div className="flex gap-2">
                <span className="flex-1 py-1 text-center bg-purple-500/10 rounded text-[9px] font-mono text-purple-300 border border-purple-500/20">Hangfire</span>
                <span className="flex-1 py-1 text-center bg-purple-500/10 rounded text-[9px] font-mono text-purple-300 border border-purple-500/20">Npgsql</span>
            </div>
            </div>

            <div className="flex-1 w-0.5 bg-gradient-to-b from-transparent to-purple-500/50 mx-auto" />

            <div className="p-2 rounded border border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[9px] font-mono text-purple-400">DB</span>
                <span className="text-[10px] font-bold text-slate-200">Stage</span>
            </div>
            <span className="text-[9px] font-mono text-neon-green border border-neon-green/30 bg-neon-green/10 px-2 rounded">Upsert</span>
            </div>
        </div>
    )
  },
];

export function FeaturedCaseStudies() {
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => {
    setFlippedMap(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <SectionShell
      id="case-studies"
      title="Featured Case Studies & Architecture"
      eyebrow="SENIOR Platform WORK"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {CASE_STUDIES.map((study, i) => {
          const isFlipped = !!flippedMap[i];
          
          return (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`h-[340px] ${i === 0 ? "md:col-span-2" : ""}`}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="relative w-full h-full"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => toggle(i)}
              >
                {/* Front Face */}
                <div 
                  className="absolute inset-0 cursor-pointer"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <SpotlightEffect className="h-full p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-white/5 text-neon-blue border border-white/5">
                        <study.icon size={24} strokeWidth={1.5} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white tracking-tight">
                          {study.metric}
                        </div>
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
                        {study.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-slate-300 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SpotlightEffect>
                </div>

                {/* Back Face */}
                <div 
                  className="absolute inset-0 cursor-pointer"
                  style={{ 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)" 
                  }}
                >
                  <SpotlightEffect className="h-full p-6 flex flex-col bg-slate-950/80">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <div className="text-xs font-mono font-bold text-neon-blue uppercase tracking-wider">System Architecture</div>
                        <div className="text-[10px] text-slate-500">{study.category}</div>
                    </div>
                    <div className="flex-grow relative">
                         {study.architecture}
                    </div>
                  </SpotlightEffect>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
