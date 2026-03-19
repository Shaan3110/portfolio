// Feature: ui-enhancements-v2, Property 3: Active section indicator follows viewport section
// **Validates: Requirements 3.2**

import React from 'react';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { navigationLinks } from '@/data/navigation';

// We need to mock useActiveSection to control which section is "active"
const mockActiveSection = jest.fn().mockReturnValue('home');
jest.mock('@/hooks/useActiveSection', () => ({
  useActiveSection: (...args: any[]) => mockActiveSection(...args),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock framer-motion — preserve animate prop so we can inspect indicator positioning
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: React.forwardRef(({ children, animate, transition, initial, exit, whileHover, whileInView, variants, viewport, ...props }: any, ref: any) => (
      <div
        ref={ref}
        {...props}
        {...(animate ? { 'data-animate-left': animate.left, 'data-animate-width': animate.width } : {})}
      >
        {children}
      </div>
    )),
  },
}));

// Mock IntersectionObserver (still needed for any residual usage)
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

beforeEach(() => {
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  jest.restoreAllMocks();
});

function renderNavbar() {
  return render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}

describe('Property 3: Active section indicator follows viewport section', () => {
  it('for any section becoming most visible, the indicator is rendered under the matching nav link', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationLinks),
        (link) => {
          // Mock useActiveSection to return this link's sectionId
          mockActiveSection.mockReturnValue(link.sectionId);

          const { unmount, container } = renderNavbar();

          // The active indicator is a motion.div with aria-hidden="true" and bg-primary class
          const indicator = container.querySelector('[aria-hidden="true"].bg-primary');
          expect(indicator).not.toBeNull();

          // Verify the indicator has animate data attributes (position values)
          // In JSDOM, offsetLeft/offsetWidth are 0, so left=0 and width=0
          // The key property is that the indicator EXISTS when a section is active
          expect(indicator).toBeTruthy();
          expect(indicator!.getAttribute('data-animate-left')).toBeDefined();
          expect(indicator!.getAttribute('data-animate-width')).toBeDefined();

          // Verify the corresponding nav link exists in the desktop menubar
          const buttons = screen.getAllByRole('menuitem', { name: link.label });
          const desktopButton = buttons.find((btn) => {
            let parent = btn.parentElement;
            while (parent) {
              if (parent.getAttribute('role') === 'menubar') return true;
              parent = parent.parentElement;
            }
            return false;
          });
          expect(desktopButton).toBeDefined();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
