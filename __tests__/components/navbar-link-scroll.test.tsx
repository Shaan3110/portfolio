// Feature: ui-enhancements-v2, Property 2: Navigation link click triggers scroll to corresponding section
// **Validates: Requirements 2.6**

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('Property 2: Navigation link click triggers scroll to corresponding section', () => {
  it('for any navigation link, clicking calls scrollIntoView on the matching section element', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationLinks),
        (link) => {
          // Create a mock section element with a scrollIntoView spy
          const scrollIntoViewSpy = jest.fn();
          const mockElement = document.createElement('div');
          mockElement.id = link.sectionId;
          mockElement.scrollIntoView = scrollIntoViewSpy;

          // Mock document.getElementById to return our mock element for the target sectionId
          const originalGetElementById = document.getElementById.bind(document);
          jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
            if (id === link.sectionId) return mockElement;
            return originalGetElementById(id);
          });

          const { unmount } = renderNavbar();

          // Find the desktop menubar button for this link
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
          fireEvent.click(desktopButton!);

          // Verify scrollIntoView was called with smooth behavior
          expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });

          unmount();
          jest.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });
});
