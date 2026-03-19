import { renderHook, act } from '@testing-library/react';
import { useScrollPosition } from '@/hooks/useScrollPosition';

describe('useScrollPosition', () => {
  let scrollListeners: Array<() => void>;

  beforeEach(() => {
    scrollListeners = [];
    jest.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'scroll') {
        scrollListeners.push(handler as () => void);
      }
    });
    jest.spyOn(window, 'removeEventListener').mockImplementation((event, handler) => {
      if (event === 'scroll') {
        scrollListeners = scrollListeners.filter((h) => h !== handler);
      }
    });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 0 as the initial scroll position', () => {
    const { result } = renderHook(() => useScrollPosition());
    expect(result.current).toBe(0);
  });

  it('updates when a scroll event fires', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true });
      scrollListeners.forEach((fn) => fn());
    });

    expect(result.current).toBe(500);
  });

  it('adds a scroll event listener on mount', () => {
    renderHook(() => useScrollPosition());
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('removes the scroll event listener on unmount', () => {
    const { unmount } = renderHook(() => useScrollPosition());
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
