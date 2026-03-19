'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { navigationLinks } from '@/data/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useActiveSection } from '@/hooks/useActiveSection';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const desktopLinksRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const sectionIds = useMemo(
    () => navigationLinks.map((l) => l.sectionId),
    []
  );
  const activeSection = useActiveSection(sectionIds);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);

  // Recalculate indicator position when activeSection changes
  useEffect(() => {
    const container = desktopLinksRef.current;
    const activeLink = linkRefs.current.get(activeSection);
    if (!container || !activeLink) {
      setIndicatorStyle(null);
      return;
    }
    const left = activeLink.offsetLeft - container.offsetLeft;
    const width = activeLink.offsetWidth;
    setIndicatorStyle({ left, width });
  }, [activeSection]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  const pathname = usePathname();
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || '';
  const isHome = pathname === '/' || pathname === basePath || pathname === `${basePath}/`;

  const handleNavClick = (sectionId: string) => {
    closeMenu();
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `${basePath}/#${sectionId}`;
    }
  };

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Focus first menu link when menu opens
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector('button');
      firstLink?.focus();
    }
  }, [menuOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 w-full z-50 bg-transparent"
    >
      {/* Floating glassmorphic capsule */}
      <div className="mx-auto mt-4 w-auto max-w-fit glass-card rounded-2xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Desktop nav links — hidden below 768px */}
          <div
            ref={desktopLinksRef}
            className="hidden md:flex items-center space-x-6 relative"
            role="menubar"
          >
            {navigationLinks.map((link) => (
              <button
                key={link.sectionId}
                ref={(el) => {
                  linkRefs.current.set(link.sectionId, el);
                }}
                onClick={() => handleNavClick(link.sectionId)}
                role="menuitem"
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 rounded-md px-2 py-1"
              >
                {link.label}
              </button>
            ))}

            {/* Active section indicator */}
            {indicatorStyle && (
              <motion.div
                aria-hidden="true"
                className="absolute bottom-0 h-0.5 bg-primary rounded-full"
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                style={{ position: 'absolute' }}
              />
            )}
          </div>

          {/* Hamburger button — visible below 768px */}
          <button
            ref={hamburgerRef}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-card shadow-lg mx-4 mt-2 rounded-2xl"
          >
            <div className="flex flex-col px-4 py-4 space-y-2">
              {navigationLinks.map((link) => (
                <button
                  key={link.sectionId}
                  onClick={() => handleNavClick(link.sectionId)}
                  role="menuitem"
                  className="text-left text-sm font-medium text-text-secondary hover:text-primary transition-colors py-2 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 rounded-md px-2"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}