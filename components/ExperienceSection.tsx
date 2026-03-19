'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience } from '@/data/experience';
import { useAnimationReady } from '@/hooks/useAnimationReady';
import { ExperienceEntry } from '@/data/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const CATEGORY_ICONS: Record<string, string> = {
  'Manual Testing': '🧪',
  'Automation with Playwright': '🎭',
  'API Testing': '🔗',
  'Test Case Management': '📋',
  'Security Testing': '🔒',
};

function CompanyName({ entry }: { entry: ExperienceEntry }) {
  if (entry.link) {
    return (
      <a
        href={entry.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-medium hover:underline"
      >
        {entry.company}
      </a>
    );
  }
  return <span className="text-primary font-medium">{entry.company}</span>;
}

interface CategoryCardProps {
  title: string;
  bullets: string[];
  index: number;
}

function CategoryCard({ title, bullets, index }: CategoryCardProps) {
  const icon = CATEGORY_ICONS[title] || '📌';
  const gradients = [
    'from-blue-500/10 to-cyan-500/10',
    'from-purple-500/10 to-pink-500/10',
    'from-green-500/10 to-emerald-500/10',
    'from-orange-500/10 to-red-500/10',
    'from-indigo-500/10 to-violet-500/10',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Subtle gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl" aria-hidden="true">{icon}</span>
          <h4 className="text-base font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {title}
          </h4>
        </div>
        <ul className="space-y-2.5" aria-label={`${title} achievements`}>
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2.5 text-foreground/60 text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-accent mt-2 flex-shrink-0" aria-hidden="true" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(experience.length - 1);
  const animationReady = useAnimationReady();
  const entry = experience[activeIndex];

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 relative" aria-label="Experience">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-16 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
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
          Experience
        </motion.h2>
        <motion.div variants={itemVariants}>
          <p className="text-foreground/50 text-center max-w-2xl mx-auto mb-12">
            Detailed breakdown of my professional journey and the skills I&apos;ve honed at each role.
          </p>
        </motion.div>

        {/* Company tabs */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
          {experience.map((exp, index) => (
            <button
              key={exp.company}
              onClick={() => setActiveIndex(index)}
              className={`relative px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                activeIndex === index
                  ? 'text-white shadow-lg shadow-primary/20'
                  : 'glass-card text-foreground/60 hover:text-foreground hover:scale-105 border border-white/5 hover:border-primary/20'
              }`}
            >
              {activeIndex === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
              )}
              <span className="relative z-10">
                {exp.company}
                <span className="block text-xs opacity-75 mt-0.5">{exp.period}</span>
              </span>
            </button>
          ))}
        </motion.div>

        {/* Active entry content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={entry.company}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            {/* Role header card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 border border-white/5 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{entry.role}</h3>
              <p className="mb-1"><CompanyName entry={entry} /></p>
              <span className="text-xs font-medium text-primary/80 bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                {entry.period}
              </span>
            </div>

            {/* Category cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {entry.categories.map((category, i) => (
                <CategoryCard key={category.title} title={category.title} bullets={category.bullets} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
