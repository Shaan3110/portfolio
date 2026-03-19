import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import ProjectsSection from '@/components/ProjectsSection';
import BlogsSection from '@/components/BlogsSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`section-divider ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1200 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,24 C200,48 400,0 600,24 C800,48 1000,0 1200,24 L1200,48 L0,48 Z"
          className="fill-background"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider flip />
        <div className="relative overflow-hidden">
          <div className="absolute top-20 -left-32 w-64 h-64 orb bg-[var(--orb-primary)] animate-float" aria-hidden="true" />
          <div className="absolute bottom-10 -right-24 w-48 h-48 orb bg-[var(--orb-accent)] animate-float-delayed" aria-hidden="true" />
          <SkillsSection />
        </div>
        <SectionDivider />
        <ExperienceSection />
        <SectionDivider flip />
        <EducationSection />
        <SectionDivider />
        <div className="relative overflow-hidden">
          <div className="absolute top-16 -right-28 w-56 h-56 orb bg-[var(--orb-accent)] animate-float" aria-hidden="true" />
          <div className="absolute bottom-20 -left-20 w-52 h-52 orb bg-[var(--orb-pink)] animate-float-delayed" aria-hidden="true" />
          <ProjectsSection />
        </div>
        <SectionDivider flip />
        <BlogsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
