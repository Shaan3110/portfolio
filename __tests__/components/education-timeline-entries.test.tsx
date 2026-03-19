// Feature: ui-enhancements-v2, Property 6: Education timeline renders all entries with required content
// **Validates: Requirements 6.1, 6.3, 6.4**

import React from 'react';
import { render, within, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { EducationEntry } from '@/data/types';

// Mutable education array that we swap per iteration
let mockEducation: EducationEntry[] = [];

jest.mock('@/data/education', () => ({
  get education() {
    return mockEducation;
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

// Generator: prefixed alphanumeric strings to avoid collisions with static page text
const safeStringArb = (prefix: string) =>
  fc.stringMatching(/^[A-Za-z][A-Za-z0-9]{2,15}$/).map((s) => `${prefix}_${s}`);

const educationEntryArb = fc.record({
  course: safeStringArb('Crs'),
  platform: safeStringArb('Plat'),
  period: safeStringArb('Per'),
});

// Generate arrays of 1-4 entries with unique course, platform, and period values
const educationArrayArb = fc
  .array(educationEntryArb, { minLength: 1, maxLength: 4 })
  .filter((entries) => {
    const courses = entries.map((e) => e.course);
    const platforms = entries.map((e) => e.platform);
    const periods = entries.map((e) => e.period);
    return (
      new Set(courses).size === courses.length &&
      new Set(platforms).size === platforms.length &&
      new Set(periods).size === periods.length
    );
  });

// Lazy-require EducationSection so it picks up the mocked education module
// eslint-disable-next-line @typescript-eslint/no-var-requires
const EducationSection = require('@/components/EducationSection').default;

describe('Property 6: Education timeline renders all entries with required content', () => {
  it('for any array of EducationEntry objects, one node per entry with course name, platform, period, and icon SVG', () => {
    fc.assert(
      fc.property(educationArrayArb, (entries) => {
        // Set the mutable mock data for this iteration
        mockEducation = entries;

        const { container, unmount } = render(<EducationSection />);
        const section = within(container);

        // Each entry's course, platform, and period should appear in the rendered output
        for (const entry of entries) {
          expect(section.getByText(entry.course)).toBeInTheDocument();
          expect(section.getByText(entry.platform)).toBeInTheDocument();
          expect(section.getByText(entry.period)).toBeInTheDocument();
        }

        // Verify SVG icons: at least one SVG per entry
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThanOrEqual(entries.length);

        // Verify order: course names should appear in array order in the DOM
        const allText = container.textContent || '';
        let lastIndex = -1;
        for (const entry of entries) {
          const idx = allText.indexOf(entry.course, lastIndex + 1);
          expect(idx).toBeGreaterThan(lastIndex);
          lastIndex = idx;
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
