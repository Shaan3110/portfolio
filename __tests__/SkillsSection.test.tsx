import React from 'react';
import { render, screen } from '@testing-library/react';
import SkillsSection from '@/components/SkillsSection';
import { skills } from '@/data/skills';

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

describe('SkillsSection', () => {
  it('renders all skill names from data', () => {
    render(<SkillsSection />);
    skills.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('renders progress bars with correct aria-valuenow for each skill', () => {
    render(<SkillsSection />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(skills.length);

    skills.forEach(({ name, percentage }) => {
      const clamped = Math.max(0, Math.min(100, percentage));
      const bar = screen.getByLabelText(`${name} proficiency ${clamped}%`);
      expect(bar).toHaveAttribute('aria-valuenow', String(clamped));
    });
  });
});
