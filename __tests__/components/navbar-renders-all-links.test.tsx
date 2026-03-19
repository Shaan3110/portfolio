// Feature: ui-enhancements-v2, Property 1: Navbar renders all navigation links
// **Validates: Requirements 2.3**

import React from 'react';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { navigationLinks } from '@/data/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock framer-motion (same pattern as existing Navbar tests)
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
  },
}));

// Mock IntersectionObserver for useActiveSection hook
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

describe('Property 1: Navbar renders all navigation links', () => {
  it('for any navigation link, there exists exactly one button with matching text in the desktop menu', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationLinks),
        (link) => {
          const { unmount } = renderNavbar();

          // Get all buttons with the link's label text
          const buttons = screen.getAllByRole('menuitem', { name: link.label });

          // Desktop menu renders one button per link; mobile overlay may add another
          // when menu is closed (default state), only the desktop button should exist
          // Filter to desktop-only: the desktop menubar buttons
          const desktopButtons = buttons.filter((btn) => {
            // Walk up to find the menubar container (desktop links)
            let parent = btn.parentElement;
            while (parent) {
              if (parent.getAttribute('role') === 'menubar') return true;
              parent = parent.parentElement;
            }
            return false;
          });

          // Exactly one button in the desktop menubar for this link
          expect(desktopButtons).toHaveLength(1);
          expect(desktopButtons[0].textContent).toBe(link.label);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
