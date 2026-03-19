'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { calculateExperience } from '@/utils/calculateExperience';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { useAnimationReady } from '@/hooks/useAnimationReady';
import { experience } from '@/data/experience';
import { ExperienceEntry } from '@/data/types';

const EXPERIENCE_HIGHLIGHTS = [
  { text: 'Cross-platform Testing', icon: '🖥️' },
  { text: 'Selenium Automation', icon: '⚙️' },
  { text: 'Playwright Automation', icon: '🎭' },
  { text: 'Manual Testing', icon: '🧪' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

interface CounterCardProps {
  label: string;
  target: number;
  icon: string;
  gradient: string;
}

function CounterCard({ label, target, icon, gradient }: CounterCardProps) {
  const { count, ref } = useCounterAnimation({ target });

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 text-center relative overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300"
      whileHover={{ scale: 1.03, y: -4 }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <span className="text-2xl mb-3 block" aria-hidden="true">{icon}</span>
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className="block text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2"
      >
        {count}+
      </span>
      <span className="text-foreground/60 text-sm">{label}</span>
    </motion.div>
  );
}

/** Derive skill chips from category titles for hover display */
function getSkillChips(entry: ExperienceEntry): string[] {
  return entry.categories.map((c) => c.title);
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  );
}

interface TimelineNodeProps {
  entry: ExperienceEntry;
  index: number;
  isLast: boolean;
  animationReady: boolean;
}

function TimelineNode({ entry, index, isLast, animationReady }: TimelineNodeProps) {
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;
  const chips = getSkillChips(entry);

  return (
    <div className={`relative flex items-start gap-6 md:gap-10 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10 flex-shrink-0" aria-hidden="true">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 border-2 border-background" />
      </div>

      {/* Mobile spacer */}
      <div className="w-10 flex-shrink-0 md:hidden" />
      {/* Desktop half-width spacer */}
      <div className="hidden md:block md:w-1/2" />

      {/* Card */}
      <motion.div
        className="glass-card rounded-2xl p-6 flex-1 md:w-1/2 border border-white/5 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden"
        initial={animationReady ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              {entry.link ? (
                <a href={entry.link} target="_blank" rel="noopener noreferrer" className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:underline">
                  {entry.company}
                </a>
              ) : (
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {entry.company}
                </h3>
              )}
              <p className="text-foreground/60 text-sm mt-0.5">{entry.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                {entry.period}
              </span>
              {/* Arrow to navigate to experience section */}
              <a
                href="#experience"
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/20 hover:scale-110"
                aria-label={`View ${entry.company} experience details`}
              >
                <ArrowIcon />
              </a>
            </div>
          </div>

          {/* Skill chips — visible on hover */}
          {hovered && (
            <div className="flex flex-wrap gap-2 mt-3 animate-fade-in" aria-hidden="true">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary/80 border border-primary/10"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface CareerTimelineProps {
  entries: ExperienceEntry[];
  animationReady: boolean;
}

function CareerTimeline({ entries, animationReady }: CareerTimelineProps) {
  if (entries.length === 0) return null;

  return (
    <div className="relative mt-16">
      <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-10 text-center">
        Career Timeline
      </h3>

      <div className="relative">
        {/* Vertical connecting line */}
        <div
          className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 opacity-30"
          style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-accent), transparent)' }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-12">
          {entries.map((entry, index) => (
            <TimelineNode
              key={`${entry.company}-${entry.period}`}
              entry={entry}
              index={index}
              isLast={index === entries.length - 1}
              animationReady={animationReady}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const yearsOfExperience = calculateExperience(new Date(2022, 7));
  const animationReady = useAnimationReady();

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative" aria-label="About">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-16 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial={animationReady ? 'hidden' : 'visible'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4"
          >
            About Me
          </motion.h2>
          <p className="text-foreground/50 max-w-2xl mx-auto">
            Passionate QA engineer dedicated to building robust automation frameworks
            and ensuring software quality through innovative testing strategies.
          </p>
        </motion.div>

        {/* Experience hero + highlights */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 sm:p-10 mb-10 border border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Big experience number */}
            <div className="text-center md:text-left flex-shrink-0">
              <div className="relative inline-block">
                <span className="text-7xl sm:text-8xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent leading-none">
                  {yearsOfExperience}
                </span>
                <span className="absolute -top-2 -right-6 text-2xl text-primary/60">+</span>
              </div>
              <p className="text-foreground/50 text-sm mt-2 font-medium tracking-wide uppercase">
                Years of Experience
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

            {/* Highlights grid */}
            <div className="flex-1 w-full">
              <ul className="grid grid-cols-2 gap-3" aria-label="Experience highlights">
                {EXPERIENCE_HIGHLIGHTS.map((highlight) => (
                  <li
                    key={highlight.text}
                    className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 text-foreground/70 hover:text-foreground hover:border-primary/20 border border-transparent transition-all duration-200"
                  >
                    <span className="text-lg flex-shrink-0" aria-hidden="true">{highlight.icon}</span>
                    {highlight.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Counter cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <CounterCard label="Projects Across Countries" target={2} icon="🌍" gradient="from-blue-400 to-cyan-500" />
          <CounterCard label="Projects Completed" target={3} icon="🚀" gradient="from-purple-400 to-pink-500" />
          <CounterCard label="Test Cases Automated" target={500} icon="🤖" gradient="from-green-400 to-emerald-500" />
          <CounterCard label="APIs Validated" target={250} icon="🔗" gradient="from-orange-400 to-red-500" />
        </motion.div>

        {/* Career Timeline */}
        <CareerTimeline entries={experience} animationReady={animationReady} />
      </motion.div>
    </section>
  );
}
