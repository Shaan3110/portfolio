import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
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

  it('renders a button with dynamic aria-label', () => {
    renderWithProvider();
    const button = screen.getByRole('button', { name: 'Switch to light theme' });
    expect(button).toBeTruthy();
  });

  it('renders sun icon when theme is dark (default)', () => {
    renderWithProvider();
    const button = screen.getByRole('button', { name: 'Switch to light theme' });
    const svg = button.querySelector('svg');
    expect(svg).toBeTruthy();
    // Sun icon has a circle element
    expect(svg!.querySelector('circle')).toBeTruthy();
  });

  it('renders moon icon after toggling to light theme', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const button = screen.getByRole('button', { name: 'Switch to light theme' });

    await user.click(button);

    // After toggling to light, label should now say "Switch to dark theme"
    const updatedButton = screen.getByRole('button', { name: 'Switch to dark theme' });
    const svg = updatedButton.querySelector('svg');
    expect(svg).toBeTruthy();
    // Moon icon uses a path element, no circle
    expect(svg!.querySelector('path')).toBeTruthy();
    expect(svg!.querySelector('circle')).toBeNull();
  });

  it('calls toggleTheme on click (theme changes)', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const button = screen.getByRole('button', { name: 'Switch to light theme' });

    // Default is dark, clicking should store 'light'
    await user.click(button);
    expect(store['theme']).toBe('light');

    // Click again to go back to dark
    const updatedButton = screen.getByRole('button', { name: 'Switch to dark theme' });
    await user.click(updatedButton);
    expect(store['theme']).toBe('dark');
  });
});
