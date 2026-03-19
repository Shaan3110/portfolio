import { renderHook, act } from '@testing-library/react';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';

// Mock framer-motion's useInView
let mockInView = false;
jest.mock('framer-motion', () => ({
  useInView: () => mockInView,
}));

describe('useCounterAnimation', () => {
  let rafCallbacks: Array<(time: number) => void>;
  let rafIdCounter: number;

  beforeEach(() => {
    mockInView = false;
    rafCallbacks = [];
    rafIdCounter = 0;

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      const id = ++rafIdCounter;
      rafCallbacks.push(cb);
      return id;
    });

    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    jest.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 0 as the initial count', () => {
    const { result } = renderHook(() =>
      useCounterAnimation({ target: 10, duration: 1000 })
    );
    expect(result.current.count).toBe(0);
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() =>
      useCounterAnimation({ target: 5 })
    );
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('does not animate when not in view', () => {
    mockInView = false;
    renderHook(() => useCounterAnimation({ target: 10, duration: 1000 }));
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('starts animation when element enters viewport', () => {
    mockInView = true;
    renderHook(() => useCounterAnimation({ target: 10, duration: 1000 }));
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('animates to the target value over the specified duration', () => {
    mockInView = true;
    const { result } = renderHook(() =>
      useCounterAnimation({ target: 100, duration: 1000 })
    );

    // Simulate animation at the end of duration
    act(() => {
      (performance.now as jest.Mock).mockReturnValue(1000);
      rafCallbacks.forEach((cb) => cb(1000));
    });

    expect(result.current.count).toBe(100);
  });

  it('returns intermediate values during animation', () => {
    mockInView = true;
    const { result } = renderHook(() =>
      useCounterAnimation({ target: 100, duration: 1000 })
    );

    // Simulate animation at halfway point
    act(() => {
      (performance.now as jest.Mock).mockReturnValue(500);
      rafCallbacks.forEach((cb) => cb(500));
    });

    // With ease-out cubic, halfway through time should be > 50% of target
    expect(result.current.count).toBeGreaterThan(50);
    expect(result.current.count).toBeLessThan(100);
  });

  it('cleans up animation frame on unmount', () => {
    mockInView = true;
    const { unmount } = renderHook(() =>
      useCounterAnimation({ target: 10, duration: 1000 })
    );

    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('defaults duration to 2000ms when not specified', () => {
    mockInView = true;
    const { result } = renderHook(() =>
      useCounterAnimation({ target: 50 })
    );

    // At 2000ms (default duration), should reach target
    act(() => {
      (performance.now as jest.Mock).mockReturnValue(2000);
      rafCallbacks.forEach((cb) => cb(2000));
    });

    expect(result.current.count).toBe(50);
  });
});
