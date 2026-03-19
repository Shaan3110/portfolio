import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  /**
   * Validates: Requirements 12.2
   * THE footer SHALL include icon links to LinkedIn
   */
  it('renders LinkedIn link with correct href', () => {
    render(<Footer />);
    const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedInLink).toHaveAttribute(
      'href',
      'https://in.linkedin.com/in/suchintan-das-b698bb1b8'
    );
  });

  /**
   * Validates: Requirements 12.2
   * THE footer SHALL include icon links to GitHub
   */
  it('renders GitHub link with correct href', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Shaan3110');
  });

  /**
   * Validates: Requirements 12.3
   * THE footer SHALL display a copyright notice with the current year
   */
  it('displays copyright notice with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`©\\s*${currentYear}`))).toBeInTheDocument();
  });

  it('renders a semantic footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('social links open in a new tab', () => {
    render(<Footer />);
    const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(linkedInLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });
});
