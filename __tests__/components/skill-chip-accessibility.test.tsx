// Feature: ui-enhancements-v2, Property 8: Skill chip displays name and accessible radial progress
// **Validates: Requirements 7.2, 7.3, 7.5**

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { Skill } from '@/data/types';

// Mutable skills array that we swap per iteration
let mockSkills: Skill[] = [];

jest.mock('@/data/skills', () => ({
  get skills() {
    return mockSkills;
  },
}));

// Mock useAnimationReady to return false (skip animations in tests)
jest.mock('@/hooks/useAnimationReady', () => ({
  useAnimationReady: () => false,
}));

// Mock framer-motion so motion elements render as plain HTML
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <div
        ref={ref}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([k]) =>
              !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileInView', 'variants', 'viewport'].includes(k)
          )
        )}
      >
        {children}
      </div>
    )),
    h2: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <h2
        ref={ref}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([k]) =>
              !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileInView', 'variants', 'viewport'].includes(k)
          )
        )}
      >
        {children}
      </h2>
    )),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
}));

// Mock IntersectionObserver
beforeAll(() => {
  const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: mockIntersectionObserver,
  });
});

afterEach(() => {
  cleanup();
});

// Generator: unique skill name that won't collide with static text
const safeNameArb = fc.stringMatching(/^[A-Za-z][A-Za-z0-9]{2,12}$/).map((s) => `Skill_${s}`);

// Generator: a single Skill with arbitrary name and percentage
const skillArb: fc.Arbitrary<Skill> = fc.record({
  name: safeNameArb,
  percentage: fc.integer({ min: -10, max: 150 }), // test clamping beyond [0,100]
  category: fc.constant('TestCategory'),
});

// Lazy-require SkillsSection so it picks up the mocked skills module
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SkillsSection = require('@/components/SkillsSection').default;

describe('Property 8: Skill chip displays name and accessible radial progress', () => {
  it('for any skill with name and percentage, chip contains name text and aria-valuenow matching clamped percentage', () => {
    fc.assert(
      fc.property(skillArb, (skill) => {
        // Set mock data to a single-skill array
        mockSkills = [skill];

        const { container, unmount } = render(<SkillsSection />);

        const clamped = Math.max(0, Math.min(100, skill.percentage));

        // Find the progressbar element
        const progressbar = container.querySelector('[role="progressbar"]');
        expect(progressbar).toBeTruthy();

        // Verify aria-valuenow matches the clamped percentage
        expect(progressbar!.getAttribute('aria-valuenow')).toBe(String(clamped));

        // Verify aria-valuemin and aria-valuemax
        expect(progressbar!.getAttribute('aria-valuemin')).toBe('0');
        expect(progressbar!.getAttribute('aria-valuemax')).toBe('100');

        // Verify aria-label contains name and clamped percentage
        expect(progressbar!.getAttribute('aria-label')).toBe(
          `${skill.name} proficiency ${clamped}%`
        );

        // Verify the skill name appears as text inside the chip
        expect(progressbar!.textContent).toContain(skill.name);

        // Verify the radial progress SVG is present with two circle elements
        const svg = progressbar!.querySelector('svg');
        expect(svg).toBeTruthy();
        const circles = svg!.querySelectorAll('circle');
        expect(circles.length).toBe(2);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
