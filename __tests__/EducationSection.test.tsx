import React from 'react';
import { render, screen } from '@testing-library/react';
import EducationSection from '@/components/EducationSection';

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

describe('EducationSection', () => {
  it('renders Playwright Automation with JavaScript with correct details', () => {
    render(<EducationSection />);
    expect(screen.getByText('Playwright Automation with JavaScript')).toBeInTheDocument();
    expect(screen.getByText('YouTube SDET-QA')).toBeInTheDocument();
    expect(screen.getByText('2024-Current')).toBeInTheDocument();
  });

  it('renders RestAssured Automation with Cucumber with correct details', () => {
    render(<EducationSection />);
    const courseHeading = screen.getByText('RestAssured Automation with Cucumber');
    expect(courseHeading).toBeInTheDocument();
  });

  it('renders B Tech CSE with correct details', () => {
    render(<EducationSection />);
    expect(screen.getByText('B Tech CSE')).toBeInTheDocument();
    expect(screen.getByText('Bennett University')).toBeInTheDocument();
    expect(screen.getByText('2019-2023')).toBeInTheDocument();
  });
});
