'use client';

import { useEffect, useState } from 'react';

/**
 * Observes all section elements matching the provided IDs and returns
 * the sectionId of the one currently most visible in the viewport.
 *
 * @param sectionIds - Array of section element IDs to observe
 * @param options - Optional IntersectionObserver options (threshold, rootMargin)
 * @returns The id string of the currently active section
 */
export function useActiveSection(
  sectionIds: string[],
  options?: { threshold?: number; rootMargin?: string }
): string {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        }

        let highestRatio = 0;
        let highestId = 'home';

        ratioMap.forEach((ratio, id) => {
          if (ratio > highestRatio) {
            highestRatio = ratio;
            highestId = id;
          }
        });

        setActiveSection(highestRatio > 0 ? highestId : 'home');
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: options?.rootMargin ?? '-20% 0px -20% 0px',
      }
    );

    const elements: Element[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [sectionIds, options?.rootMargin]);

  return activeSection;
}
