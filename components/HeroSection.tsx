'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTypedText } from '@/hooks/useTypedText';
import { useAnimationReady } from '@/hooks/useAnimationReady';
import { useState, useEffect } from 'react';

const PHRASES = ['Automation Tester', 'Api Automation', 'Web and Mobile Automation'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/** Maps each phrase to a themed icon set */
const ROLE_VISUALS: Record<string, { icon: string; label: string; color: string }[]> = {
  'Automation Tester': [
    { icon: '⚙️', label: 'Selenium', color: 'from-green-400 to-emerald-600' },
    { icon: '🎭', label: 'Playwright', color: 'from-purple-400 to-violet-600' },
    { icon: '🧪', label: 'TestNG', color: 'from-orange-400 to-red-500' },
    { icon: '🔄', label: 'CI/CD', color: 'from-blue-400 to-cyan-500' },
  ],
  'Api Automation': [
    { icon: '🔗', label: 'REST APIs', color: 'from-cyan-400 to-blue-600' },
    { icon: '📡', label: 'RestAssured', color: 'from-indigo-400 to-purple-600' },
    { icon: '🥒', label: 'Cucumber', color: 'from-green-400 to-lime-500' },
    { icon: '📊', label: 'Validation', color: 'from-pink-400 to-rose-600' },
  ],
  'Web and Mobile Automation': [
    { icon: '🌐', label: 'Web Testing', color: 'from-blue-400 to-indigo-600' },
    { icon: '📱', label: 'Appium', color: 'from-violet-400 to-purple-600' },
    { icon: '🖥️', label: 'Cross-Browser', color: 'from-teal-400 to-cyan-600' },
    { icon: '🔍', label: 'BurpSuite', color: 'from-red-400 to-orange-500' },
  ],
};

function RoleVisual({ currentPhrase }: { currentPhrase: string }) {
  const [activeRole, setActiveRole] = useState(PHRASES[0]);

  useEffect(() => {
    // Match the current typed text to the closest phrase
    const match = PHRASES.find((p) => currentPhrase.startsWith(p.slice(0, 3)));
    if (match) setActiveRole(match);
  }, [currentPhrase]);

  const items = ROLE_VISUALS[activeRole] || ROLE_VISUALS[PHRASES[0]];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central glowing orb */}
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse-glow" />
      <div className="absolute w-48 h-48 rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
      <div className="absolute w-64 h-64 rounded-full border border-accent/5 animate-[spin_30s_linear_infinite_reverse]" />

      {/* Orbiting role chips */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="relative w-72 h-72"
        >
          {items.map((item, i) => {
            const angle = (i * 360) / items.length - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 110;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: 'backOut' }}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
              >
                <div className={`glass-card rounded-xl px-3 py-2 flex items-center gap-2 bg-gradient-to-r ${item.color} bg-opacity-10 border border-white/10 shadow-lg`}>
                  <span className="text-lg" aria-hidden="true">{item.icon}</span>
                  <span className="text-xs font-medium text-white whitespace-nowrap">{item.label}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary/60 text-center px-4">
              {activeRole}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ScrollArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function HeroSection() {
  const typedText = useTypedText(PHRASES);
  const ready = useAnimationReady();

  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 orb bg-[var(--orb-primary)] animate-float" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 orb bg-[var(--orb-accent)] animate-float-delayed" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb bg-[var(--orb-pink)] opacity-20" aria-hidden="true" />

      <motion.div
        variants={containerVariants}
        initial={ready ? 'hidden' : undefined}
        animate={ready ? 'visible' : undefined}
        className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Left column — text */}
        <div className="text-center lg:text-left space-y-6">
          <motion.div variants={itemVariants}>
            <p className="text-primary font-medium tracking-wider uppercase text-sm mb-2">
              Hello, I&apos;m
            </p>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            >
              Suchintan
            </motion.h1>
          </motion.div>

          <motion.div variants={itemVariants} className="h-8">
            <span className="text-xl md:text-2xl text-foreground/70 font-light">
              {typedText}
              <span className="animate-pulse text-primary">|</span>
            </span>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-foreground/60 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Passionate about building robust test automation frameworks and ensuring software quality
            through innovative testing strategies.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center lg:justify-start">
            <a
              href="https://in.linkedin.com/in/suchintan-das-b698bb1b8"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <LinkedInIcon />
              Connect on LinkedIn
            </a>
            <a
              href="https://github.com/Shaan3110"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card px-6 py-3 rounded-full hover:bg-white/5 text-foreground/70 hover:text-foreground font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <GitHubIcon />
              GitHub
            </a>
          </motion.div>
        </div>

        {/* Right column — dynamic role visual */}
        <motion.div variants={itemVariants} className="hidden lg:flex justify-center items-center">
          <div className="w-80 h-80">
            <RoleVisual currentPhrase={typedText} />
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground/30 animate-bounce"
      >
        <ScrollArrow />
      </motion.div>
    </section>
  );
}
