import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { FeaturedCaseStudies } from "@/components/FeaturedCaseStudies";
import { Achievements } from "@/components/Achievements";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { ProjectsGallery } from "@/components/ProjectsGallery";
import { EducationCerts } from "@/components/EducationCerts";
import { AdditionalInfo } from "@/components/AdditionalInfo";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <FeaturedCaseStudies />
      <ProjectsGallery />
      <SkillsMatrix />
      <ExperienceTimeline />
      <EducationCerts />
      <Achievements />
      <AdditionalInfo />
      <ContactSection />
      <footer className="py-16 text-center text-[11px] tracking-widest text-slate-500 font-mono">
        Aya Mash · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
