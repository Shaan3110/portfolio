// Feature: ui-enhancements-v2, Property 4: Career timeline renders all experience entries with required data
// **Validates: Requirements 4.1, 4.2**

import React from 'react';
import { render, within, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ExperienceEntry } from '@/data/types';

// Mutable experience array that we swap per iteration
let mockExperience: ExperienceEntry[] = [];

jest.mock('@/data/experience', () => ({
  get experience() {
    return mockExperience;
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

// Mock useCounterAnimation to return a fixed count and a ref
jest.mock('@/hooks/useCounterAnimation', () => ({
  useCounterAnimation: ({ target }: { target: number }) => ({
    count: target,
    ref: { current: null },
  }),
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

const experienceCategoryArb = fc.record({
  title: fc.stringMatching(/^[A-Za-z][A-Za-z ]{1,15}$/),
  bullets: fc.array(fc.stringMatching(/^[A-Za-z][A-Za-z ]{1,20}$/), { minLength: 1, maxLength: 2 }),
});

const experienceEntryArb = fc.record({
  role: safeStringArb('Role'),
  company: safeStringArb('Co'),
  period: safeStringArb('Per'),
  categories: fc.array(experienceCategoryArb, { minLength: 1, maxLength: 2 }),
});

// Generate arrays of 1-4 entries with unique company, role, and period values
const experienceArrayArb = fc
  .array(experienceEntryArb, { minLength: 1, maxLength: 4 })
  .filter((entries) => {
    const companies = entries.map((e) => e.company);
    const roles = entries.map((e) => e.role);
    const periods = entries.map((e) => e.period);
    return (
      new Set(companies).size === companies.length &&
      new Set(roles).size === roles.length &&
      new Set(periods).size === periods.length
    );
  });

// Lazy-require AboutSection so it picks up the mocked experience module
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AboutSection = require('@/components/AboutSection').default;

describe('Property 4: Career timeline renders all experience entries with required data', () => {
  it('for any array of ExperienceEntry objects, nodes are rendered in order with company, role, and period', () => {
    fc.assert(
      fc.property(experienceArrayArb, (entries) => {
        // Set the mutable mock data for this iteration
        mockExperience = entries;

        const { container, unmount } = render(<AboutSection />);
        const section = within(container);

        // Each entry's company, role, and period should appear in the rendered output
        for (const entry of entries) {
          expect(section.getByText(entry.company)).toBeInTheDocument();
          expect(section.getByText(entry.role)).toBeInTheDocument();
          expect(section.getByText(entry.period)).toBeInTheDocument();
        }

        // Verify order: company names should appear in array order in the DOM
        const allText = container.textContent || '';
        let lastIndex = -1;
        for (const entry of entries) {
          const idx = allText.indexOf(entry.company, lastIndex + 1);
          expect(idx).toBeGreaterThan(lastIndex);
          lastIndex = idx;
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
