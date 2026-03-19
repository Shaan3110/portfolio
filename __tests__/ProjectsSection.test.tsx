import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectsSection from '@/components/ProjectsSection';

// Mock framer-motion so motion elements render as plain HTML
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, style, ...props }: any, ref: any) => (
      <div
        ref={ref}
        style={style}
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
}));

// Mock next/image to render as a plain img tag
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ProjectsSection', () => {
  /**
   * Validates: Requirements 8.1
   * THE Projects_Section SHALL display "Amazon Automation with Selenium"
   */
  it('renders "Amazon Automation with Selenium" title', () => {
    render(<ProjectsSection />);
    const matches = screen.getAllByText('Amazon Automation with Selenium');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Validates: Requirements 8.1
   * THE Projects_Section SHALL display "Page Object Model with Playwright"
   */
  it('renders "Page Object Model with Playwright" title', () => {
    render(<ProjectsSection />);
    const matches = screen.getAllByText('Page Object Model with Playwright');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Validates: Requirements 8.2
   * GitHub link for Selenium project has correct href
   */
  it('has correct GitHub link for Selenium project', () => {
    render(<ProjectsSection />);
    const links = screen.getAllByRole('link', { name: /Selenium.*GitHub|View Amazon Automation with Selenium on GitHub/i });
    const match = links.find(
      (link) => link.getAttribute('href') === 'https://github.com/Shaan3110/Selenium_amazon'
    );
    expect(match).toBeDefined();
  });

  /**
   * Validates: Requirements 8.2
   * GitHub link for Playwright project has correct href
   */
  it('has correct GitHub link for Playwright project', () => {
    render(<ProjectsSection />);
    const links = screen.getAllByRole('link', { name: /Playwright.*GitHub|View Page Object Model with Playwright on GitHub/i });
    const match = links.find(
      (link) => link.getAttribute('href') === 'https://github.com/Shaan3110/PlayWright_automation_amazon'
    );
    expect(match).toBeDefined();
  });
});
