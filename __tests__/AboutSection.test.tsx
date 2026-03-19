import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutSection from '@/components/AboutSection';

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

describe('AboutSection', () => {
  /**
   * Validates: Requirements 4.3
   * THE About_Section SHALL display the following experience highlights:
   * Cross-platform Testing, Selenium Automation, Playwright Automation, Manual Testing
   */
  it('renders all 4 experience highlights', () => {
    render(<AboutSection />);
    const highlights = [
      'Cross-platform Testing',
      'Selenium Automation',
      'Playwright Automation',
      'Manual Testing',
    ];
    highlights.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  /**
   * Validates: Requirements 4.4
   * THE About_Section SHALL display a Counter_Animation for "Projects Across Countries" with target 2
   */
  it('renders "Projects Across Countries" label with counter value 2', () => {
    render(<AboutSection />);
    expect(screen.getByText('Projects Across Countries')).toBeInTheDocument();
    expect(screen.getByText('2+')).toBeInTheDocument();
  });

  /**
   * Validates: Requirements 4.5
   * THE About_Section SHALL display a Counter_Animation for "Projects Completed" with target 3
   */
  it('renders "Projects Completed" label with counter value 3', () => {
    render(<AboutSection />);
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    expect(screen.getByText('3+')).toBeInTheDocument();
  });

  /**
   * Validates: Requirements 4.1, 4.2
   * THE About_Section SHALL display years of experience as a decimal with one decimal place
   */
  it('displays years of experience as a number with one decimal place', () => {
    render(<AboutSection />);
    const section = screen.getByLabelText('About');
    // Find the experience value — it should be a decimal like "2.8"
    const experienceText = section.textContent || '';
    expect(experienceText).toMatch(/\d+\.\d/);
    expect(screen.getByText('Years of Experience')).toBeInTheDocument();
  });
});
