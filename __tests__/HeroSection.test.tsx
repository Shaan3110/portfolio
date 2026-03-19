import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/HeroSection';

// Mock framer-motion so motion.div renders as a plain div
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
    p: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <p
        ref={ref}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([k]) =>
              !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileInView', 'variants', 'viewport'].includes(k)
          )
        )}
      >
        {children}
      </p>
    )),
    h1: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <h1
        ref={ref}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([k]) =>
              !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileInView', 'variants', 'viewport'].includes(k)
          )
        )}
      >
        {children}
      </h1>
    )),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('HeroSection', () => {
  /**
   * Validates: Requirements 3.1
   * THE Hero_Section SHALL display the name "Suchintan" as a prominent heading
   */
  it('renders "Suchintan" as an h1 heading', () => {
    render(<HeroSection />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Suchintan' });
    expect(heading).toBeInTheDocument();
  });

  /**
   * Validates: Requirements 3.3
   * THE Hero_Section SHALL display a CTA button linking to LinkedIn
   */
  it('renders LinkedIn link with correct href', () => {
    render(<HeroSection />);
    const linkedInLink = screen.getByRole('link', { name: /connect on linkedin/i });
    expect(linkedInLink).toHaveAttribute(
      'href',
      'https://in.linkedin.com/in/suchintan-das-b698bb1b8'
    );
  });

  /**
   * Validates: Requirements 3.4
   * THE Hero_Section SHALL display a secondary link to the GitHub profile
   */
  it('renders GitHub link with correct href', () => {
    render(<HeroSection />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Shaan3110');
  });
});
