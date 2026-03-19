// Feature: ui-enhancements-v2, Property 10: Section ids and aria-labels are preserved
// **Validates: Requirements 9.2, 9.3**

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';

// Mock framer-motion so motion elements render as plain HTML
jest.mock('framer-motion', () => {
  const filterMotionProps = (props: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(props).filter(
        ([k]) =>
          ![
            'initial',
            'animate',
            'exit',
            'transition',
            'whileHover',
            'whileInView',
            'whileTap',
            'variants',
            'viewport',
            'layout',
            'layoutId',
          ].includes(k)
      )
    );

  const motion = new Proxy(
    {},
    {
      get: (_target, prop: string) =>
        React.forwardRef(({ children, ...props }: any, ref: any) =>
          React.createElement(prop, { ...filterMotionProps(props), ref }, children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useInView: () => true,
  };
});

// Mock useAnimationReady to return false (skip animations in tests)
jest.mock('@/hooks/useAnimationReady', () => ({
  useAnimationReady: () => false,
}));

// Mock useCounterAnimation (used by AboutSection)
jest.mock('@/hooks/useCounterAnimation', () => ({
  useCounterAnimation: ({ target }: { target: number }) => ({
    count: target,
    ref: { current: null },
  }),
}));

// Mock useTypedText (used by HeroSection)
jest.mock('@/hooks/useTypedText', () => ({
  useTypedText: () => 'Automation Tester',
}));

// Mock next/image (used by ProjectsSection)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    return <img {...rest} />;
  },
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

// Expected section id → aria-label mapping
const EXPECTED_SECTIONS = [
  { id: 'home', ariaLabel: 'Hero' },
  { id: 'about', ariaLabel: 'About' },
  { id: 'skills', ariaLabel: 'Skills' },
  { id: 'experience', ariaLabel: 'Experience' },
  { id: 'education', ariaLabel: 'Education' },
  { id: 'projects', ariaLabel: 'Projects' },
] as const;

// Lazy-require components so they pick up mocked modules
/* eslint-disable @typescript-eslint/no-var-requires */
const HeroSection = require('@/components/HeroSection').default;
const AboutSection = require('@/components/AboutSection').default;
const SkillsSection = require('@/components/SkillsSection').default;
const ExperienceSection = require('@/components/ExperienceSection').default;
const EducationSection = require('@/components/EducationSection').default;
const ProjectsSection = require('@/components/ProjectsSection').default;
/* eslint-enable @typescript-eslint/no-var-requires */

// Map section id to its component
const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  home: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
};

describe('Property 10: Section ids and aria-labels are preserved', () => {
  it('for any expected section, its id and aria-label are present and correct', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...EXPECTED_SECTIONS),
        (section) => {
          const Component = SECTION_COMPONENTS[section.id];
          const { container, unmount } = render(<Component />);

          // Find the section element by id
          const sectionEl = container.querySelector(`#${section.id}`);
          expect(sectionEl).toBeInTheDocument();

          // Verify the aria-label matches the expected value
          expect(sectionEl).toHaveAttribute('aria-label', section.ariaLabel);

          // Verify the element is a <section> tag
          expect(sectionEl!.tagName.toLowerCase()).toBe('section');

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
