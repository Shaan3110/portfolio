import React from 'react';
import { render, screen } from '@testing-library/react';
import ExperienceSection from '@/components/ExperienceSection';

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

describe('ExperienceSection', () => {
  /**
   * Validates: Requirements 6.1
   * THE Experience_Section SHALL display the role "Software Test Engineer (Manual + Automation)"
   */
  it('renders the role title', () => {
    render(<ExperienceSection />);
    expect(
      screen.getByText('Software Development Engineer in Test (SDET)')
    ).toBeInTheDocument();
  });

  /**
   * Validates: Requirements 6.1
   * THE Experience_Section SHALL display the company "Salescode.ai"
   */
  it('renders the company name', () => {
    render(<ExperienceSection />);
    expect(screen.getByText('Salescode.ai')).toBeInTheDocument();
  });

  /**
   * Validates: Requirements 6.1, 5.4
   * THE Salescode.ai Experience_Entry period SHALL be "2022 - 2024"
   */
  it('renders the employment period', () => {
    render(<ExperienceSection />);
    expect(screen.getByText('2022 - 2024')).toBeInTheDocument();
  });

  /**
   * Validates: Requirements 6.2
   * THE Experience_Section SHALL organize work details into the following categories:
   * Manual Testing, Automation with Playwright, API Testing, Test Case Management, Security Testing
   */
  it('renders all five category titles', () => {
    render(<ExperienceSection />);
    const expectedCategories = [
      'Manual Testing',
      'Automation with Playwright',
      'API Testing',
      'Test Case Management',
      'Security Testing',
    ];
    expectedCategories.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
