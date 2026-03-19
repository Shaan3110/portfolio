// Feature: ui-enhancements-v2, Property 7: Skills section groups skills by category
// **Validates: Requirements 7.1**

import React from 'react';
import { render, within, cleanup } from '@testing-library/react';
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

// Generator: unique skill names prefixed to avoid collisions with static text
const safeNameArb = (prefix: string) =>
  fc.stringMatching(/^[A-Za-z][A-Za-z0-9]{2,12}$/).map((s) => `${prefix}_${s}`);

// Generator: category strings prefixed to avoid collisions
const categoryArb = safeNameArb('Cat');

// Generator: a single Skill with a given category
const skillWithCategoryArb = (category: fc.Arbitrary<string>) =>
  fc.record({
    name: safeNameArb('Skill'),
    percentage: fc.integer({ min: 0, max: 100 }),
    category,
  });

// Generator: array of 1-8 skills with 1-4 unique categories, all skill names unique
const skillsArrayArb = fc
  .array(categoryArb, { minLength: 1, maxLength: 4 })
  .chain((cats) => {
    const uniqueCats = [...new Set(cats)];
    if (uniqueCats.length === 0) return fc.constant([] as Skill[]);
    const catArb = fc.constantFrom(...uniqueCats);
    return fc
      .array(skillWithCategoryArb(catArb), { minLength: 1, maxLength: 8 })
      .filter((skills) => {
        const names = skills.map((s) => s.name);
        return new Set(names).size === names.length;
      })
      // Ensure every category has at least one skill
      .filter((skills) => {
        const usedCats = new Set(skills.map((s) => s.category));
        return uniqueCats.every((c) => usedCats.has(c));
      });
  });

// Lazy-require SkillsSection so it picks up the mocked skills module
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SkillsSection = require('@/components/SkillsSection').default;

describe('Property 7: Skills section groups skills by category', () => {
  it('for any categorized skills array, renders one group per unique category with correct skills in each', () => {
    fc.assert(
      fc.property(skillsArrayArb, (skills) => {
        // Set the mutable mock data for this iteration
        mockSkills = skills;

        const { container, unmount } = render(<SkillsSection />);

        // Derive expected categories preserving first-appearance order
        const expectedCategories = Array.from(new Set(skills.map((s) => s.category)));

        // Find all h3 elements (category titles)
        const h3Elements = container.querySelectorAll('h3');
        expect(h3Elements).toHaveLength(expectedCategories.length);

        // Verify each category group has the correct title and skills
        h3Elements.forEach((h3, index) => {
          const categoryName = expectedCategories[index];
          expect(h3.textContent).toBe(categoryName);

          // The h3's parent container is the category group (glass-card)
          const groupContainer = h3.closest('.glass-card')!;
          expect(groupContainer).toBeTruthy();

          // Get the skills expected in this category
          const expectedSkills = skills.filter((s) => s.category === categoryName);

          // Find all progressbar elements within this group
          const group = within(groupContainer as HTMLElement);
          const progressBars = group.queryAllByRole('progressbar');
          expect(progressBars).toHaveLength(expectedSkills.length);

          // Verify each skill is present via aria-label
          for (const skill of expectedSkills) {
            const clamped = Math.max(0, Math.min(100, skill.percentage));
            const label = `${skill.name} proficiency ${clamped}%`;
            expect(group.getByLabelText(label)).toBeInTheDocument();
          }
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
