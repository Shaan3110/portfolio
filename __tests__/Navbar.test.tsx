import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { navigationLinks } from '@/data/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock framer-motion so AnimatePresence renders children and motion.div renders as a plain div
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <div ref={ref} {...Object.fromEntries(Object.entries(props).filter(([k]) => !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileInView', 'variants', 'viewport'].includes(k)))}>
        {children}
      </div>
    )),
  },
}));

function renderNavbar() {
  return render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}

describe('Navbar', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value;
    });
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a nav element with aria-label "Main navigation"', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderNavbar();
    navigationLinks.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });
  });

  it('renders the ThemeToggle button', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: /switch to .+ theme/i })).toBeInTheDocument();
  });

  it('has fixed positioning classes', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav.className).toContain('fixed');
    expect(nav.className).toContain('top-0');
    expect(nav.className).toContain('w-full');
    expect(nav.className).toContain('z-50');
  });

  it('smooth scrolls to section when a nav link is clicked', async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = jest.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = mockScrollIntoView;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    renderNavbar();
    const aboutLink = screen.getByText('About');
    await user.click(aboutLink);

    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('applies transparent background when not scrolled', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav.className).toContain('bg-transparent');
  });

  it('renders hamburger button with aria-label "Open menu"', () => {
    renderNavbar();
    const hamburger = screen.getByRole('button', { name: 'Open menu' });
    expect(hamburger).toBeInTheDocument();
  });

  it('hamburger button has aria-expanded attribute', () => {
    renderNavbar();
    const hamburger = screen.getByRole('button', { name: 'Open menu' });
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking hamburger opens the mobile menu overlay with links', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const hamburger = screen.getByRole('button', { name: 'Open menu' });

    await user.click(hamburger);

    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    // The mobile overlay duplicates the nav links, so each label appears at least twice
    navigationLinks.forEach((link) => {
      const matches = screen.getAllByText(link.label);
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('clicking a link in the mobile menu closes the overlay', async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = jest.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = mockScrollIntoView;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    renderNavbar();
    const hamburger = screen.getByRole('button', { name: 'Open menu' });

    // Open the menu
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    // Click a link in the overlay — grab the last occurrence (mobile overlay)
    const aboutLinks = screen.getAllByText('About');
    await user.click(aboutLinks[aboutLinks.length - 1]);

    // Menu should close
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Navbar accessibility', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value;
    });
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('closes mobile menu when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    const hamburger = screen.getByRole('button', { name: 'Open menu' });
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('hamburger button has aria-controls pointing to mobile menu', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    const hamburger = screen.getByRole('button', { name: 'Open menu' });
    expect(hamburger).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('hamburger label changes to "Close menu" when open', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    const hamburger = screen.getByRole('button', { name: 'Open menu' });
    await user.click(hamburger);

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });
});
