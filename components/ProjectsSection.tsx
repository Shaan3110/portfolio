'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { useAnimationReady } from '@/hooks/useAnimationReady';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Deterministic gradient based on title hash */
function getBannerGradient(title: string) {
  const gradients = [
    'from-indigo-600 via-purple-600 to-cyan-500',
    'from-emerald-600 via-teal-500 to-blue-500',
    'from-rose-600 via-pink-500 to-orange-400',
    'from-violet-600 via-fuchsia-500 to-pink-400',
    'from-sky-600 via-blue-500 to-indigo-500',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
}

function GeneratedBanner({ title }: { title: string }) {
  const gradient = getBannerGradient(title);
  return (
    <div className={`relative w-full h-56 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
      {/* Animated floating shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-6 w-16 h-16 border-2 border-white/40 rounded-lg animate-float" />
        <div className="absolute bottom-6 right-8 w-12 h-12 border-2 border-white/30 rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-8 h-8 border border-white/20 rounded animate-float" />
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 text-6xl font-mono select-none" aria-hidden="true">
        &lt;/&gt;
      </div>
      <span className="relative z-10 text-white font-bold text-lg sm:text-xl text-center px-6 drop-shadow-lg leading-snug">
        {title}
      </span>
    </div>
  );
}

function isValidImageUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

interface ProjectCardProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  githubUrl: string;
  index: number;
}

function ProjectCard({ title, description, thumbnailUrl, githubUrl, index }: ProjectCardProps) {
  const hasImage = isValidImageUrl(thumbnailUrl);
  const accentGradients = [
    'from-blue-500/10 to-cyan-500/10',
    'from-purple-500/10 to-pink-500/10',
    'from-green-500/10 to-emerald-500/10',
    'from-orange-500/10 to-red-500/10',
  ];
  const accent = accentGradients[index % accentGradients.length];

  return (
    <motion.div
      className="group glass-card rounded-2xl overflow-hidden h-full flex flex-col border border-white/5 hover:border-primary/20 transition-all duration-300 relative"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      {/* Thumbnail / Banner */}
      <div className="relative w-full h-56 overflow-hidden">
        {hasImage ? (
          <Image
            src={thumbnailUrl}
            alt={`${title} project thumbnail`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <GeneratedBanner title={title} />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative z-10">
        <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          {title}
        </h3>
        <p className="text-foreground/60 text-sm mb-5 flex-1 leading-relaxed">{description}</p>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            aria-label={`View ${title} on GitHub`}
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-foreground/60 text-sm font-medium hover:border-primary/30 hover:text-foreground transition-all"
            aria-label={`View ${title} live demo`}
          >
            <ExternalLinkIcon />
            Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const animationReady = useAnimationReady();

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative" aria-label="Projects">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial={animationReady ? 'hidden' : 'visible'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 text-center"
        >
          Projects
        </motion.h2>
        <motion.div variants={itemVariants}>
          <p className="text-foreground/50 text-center max-w-2xl mx-auto mb-12">
            Open-source automation frameworks and tools I&apos;ve built.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {projects.map((project, i) => (
            <motion.div key={project.title} variants={itemVariants}>
              <ProjectCard
                title={project.title}
                description={project.description}
                thumbnailUrl={project.thumbnailUrl}
                githubUrl={project.githubUrl}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
