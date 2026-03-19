// Feature: ui-enhancements-v2, Property 11: All interactive elements are keyboard-accessible
// **Validates: Requirements 10.3**

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ThemeProvider } from '@/components/ThemeProvider';

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

// Mock next/image
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

// Lazy-require components so they pick up mocked modules
/* eslint-disable @typescript-eslint/no-var-requires */
const HeroSection = require('@/components/HeroSection').default;
const Navbar = require('@/components/Navbar').default;
const AboutSection = require('@/components/AboutSection').default;
const EducationSection = require('@/components/EducationSection').default;
const SkillsSection = require('@/components/SkillsSection').default;
/* eslint-enable @typescript-eslint/no-var-requires */

const COMPONENTS = [
  { name: 'HeroSection', Component: HeroSection },
  { name: 'Navbar', Component: Navbar },
  { name: 'AboutSection', Component: AboutSection },
  { name: 'EducationSection', Component: EducationSection },
  { name: 'SkillsSection', Component: SkillsSection },
] as const;

describe('Property 11: All interactive elements are keyboard-accessible', () => {
  it('for any new/redesigned component, all buttons and links are focusable', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...COMPONENTS),
        ({ name, Component }) => {
          const element =
            name === 'Navbar' ? (
              <ThemeProvider>
                <Component />
              </ThemeProvider>
            ) : (
              <Component />
            );
          const { container, unmount } = render(element);

          // Find all button and anchor elements
          const interactiveElements = container.querySelectorAll('button, a');

          interactiveElements.forEach((el) => {
            const tag = el.tagName.toLowerCase();

            // Native <button> and <a> elements are focusable by default
            // unless they have a negative tabIndex
            const tabIndex = el.getAttribute('tabindex');
            const hasNegativeTabIndex = tabIndex !== null && parseInt(tabIndex, 10) < 0;

            expect(hasNegativeTabIndex).toBe(false);

            // Buttons should not be disabled (disabled buttons are not keyboard-accessible)
            if (tag === 'button') {
              // Disabled is acceptable for some UI states, but in default render
              // all buttons should be enabled
              expect((el as HTMLButtonElement).disabled).toBe(false);
            }

            // Links should have an href or be a button-like element with tabIndex >= 0
            if (tag === 'a') {
              const href = el.getAttribute('href');
              const ti = el.getAttribute('tabindex');
              const isFocusable =
                href !== null || (ti !== null && parseInt(ti, 10) >= 0);
              expect(isFocusable).toBe(true);
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
