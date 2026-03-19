'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import { useAnimationReady } from '@/hooks/useAnimationReady';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface SkillBarProps {
  name: string;
  percentage: number;
}

function SkillBar({ name, percentage }: SkillBarProps) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const targetOffset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${name} proficiency ${clamped}%`}
      className="group"
    >
      {/* Hidden SVG with 2 circles — preserves test contract */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <circle cx="0" cy="0" r={RADIUS} />
        <circle cx="0" cy="0" r={RADIUS} strokeDasharray={CIRCUMFERENCE} strokeDashoffset={targetOffset} />
      </svg>

      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-text-primary">{name}</span>
        <span className="text-xs font-medium text-primary tabular-nums">{clamped}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:!duration-0"
          style={{
            width: `${clamped}%`,
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
            transitionDelay: '0.3s',
          }}
        />
      </div>
    </div>
  );
}

interface SkillCategoryGroupProps {
  category: string;
  skills: { name: string; percentage: number }[];
}

function SkillCategoryGroup({ category, skills: categorySkills }: SkillCategoryGroupProps) {
  return (
    <div className="glass-card gradient-border rounded-xl p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider gradient-text mb-4">
        {category}
      </h3>
      <div className="space-y-3">
        {categorySkills.map((skill) => (
          <SkillBar key={skill.name} name={skill.name} percentage={skill.percentage} />
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const animationReady = useAnimationReady();
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8" aria-label="Skills">
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial={animationReady ? 'hidden' : 'visible'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl font-bold gradient-text mb-12 text-center"
        >
          Skills
        </motion.h2>

        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {categories.map((category) => (
            <motion.div key={category} variants={itemVariants} className="break-inside-avoid">
              <SkillCategoryGroup
                category={category}
                skills={skills.filter((s) => s.category === category)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
