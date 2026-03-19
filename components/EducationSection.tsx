'use client';

import { motion } from 'framer-motion';
import { education } from '@/data/education';
import { useAnimationReady } from '@/hooks/useAnimationReady';
import { EducationEntry } from '@/data/types';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function GraduationCapIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary flex-shrink-0"
      aria-hidden="true"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
    </svg>
  );
}

function CourseName({ entry }: { entry: EducationEntry }) {
  if (entry.link) {
    return (
      <a
        href={entry.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-bold gradient-text hover:underline"
      >
        {entry.course}
      </a>
    );
  }
  return <h3 className="text-lg font-bold gradient-text">{entry.course}</h3>;
}

interface EducationTimelineNodeProps {
  entry: EducationEntry;
  index: number;
  animationReady: boolean;
}

function EducationTimelineNode({ entry, index, animationReady }: EducationTimelineNodeProps) {
  const isOdd = index % 2 !== 0;
  const xOffset = isOdd ? 40 : -40;

  return (
    <div
      className={`relative flex items-center gap-6 md:gap-10 ${
        isOdd ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10 w-4 h-4 rounded-full gradient-border flex-shrink-0"
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full bg-surface" />
      </div>
      <div className="w-10 flex-shrink-0 md:hidden" />
      <div className="hidden md:block md:w-1/2" />
      <motion.div
        className="bg-surface glass-card gradient-border rounded-xl p-5 flex-1 md:w-1/2"
        initial={
          animationReady
            ? { opacity: 0, x: xOffset, y: 10 }
            : { opacity: 1, x: 0, y: 0 }
        }
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-start gap-3">
          <GraduationCapIcon />
          <div>
            <CourseName entry={entry} />
            <p className="text-primary font-medium text-sm mt-1">{entry.platform}</p>
            <p className="text-text-secondary text-sm mt-1">{entry.period}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function EducationSection() {
  const animationReady = useAnimationReady();

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8" aria-label="Education">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial={animationReady ? 'hidden' : 'visible'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl font-bold gradient-text mb-12 text-center"
        >
          Courses & Certifications
        </motion.h2>

        {education.length > 0 && (
          <div className="relative">
            <div
              className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
              style={{
                background: 'linear-gradient(to bottom, var(--color-primary), var(--color-accent))',
              }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-10">
              {education.map((entry, index) => (
                <EducationTimelineNode
                  key={entry.course}
                  entry={entry}
                  index={index}
                  animationReady={animationReady}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
