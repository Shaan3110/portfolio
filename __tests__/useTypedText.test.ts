import { renderHook, act } from '@testing-library/react';
import { useTypedText } from '@/hooks/useTypedText';

describe('useTypedText', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns an empty string initially', () => {
    const { result } = renderHook(() =>
      useTypedText(['Hello', 'World'])
    );
    expect(result.current).toBe('');
  });

  it('types characters one by one at the configured speed', () => {
    const { result } = renderHook(() =>
      useTypedText(['Hi'], { typingSpeed: 50 })
    );

    act(() => { jest.advanceTimersByTime(50); });
    expect(result.current).toBe('H');

    act(() => { jest.advanceTimersByTime(50); });
    expect(result.current).toBe('Hi');
  });

  it('pauses after finishing a phrase then starts deleting', () => {
    const { result } = renderHook(() =>
      useTypedText(['AB'], {
        typingSpeed: 50,
        pauseDuration: 200,
        deletingSpeed: 30,
      })
    );

    // Type "AB"
    act(() => { jest.advanceTimersByTime(50); }); // A
    act(() => { jest.advanceTimersByTime(50); }); // AB

    expect(result.current).toBe('AB');

    // During pause, text should remain
    act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toBe('AB');

    // After pause completes, deleting begins
    act(() => { jest.advanceTimersByTime(100); }); // pause done, isDeleting = true
    act(() => { jest.advanceTimersByTime(30); });  // delete one char
    expect(result.current).toBe('A');

    act(() => { jest.advanceTimersByTime(30); });  // delete another
    expect(result.current).toBe('');
  });

  it('cycles to the next phrase after deleting', () => {
    const { result } = renderHook(() =>
      useTypedText(['A', 'B'], {
        typingSpeed: 50,
        pauseDuration: 100,
        deletingSpeed: 30,
      })
    );

    // Type "A"
    act(() => { jest.advanceTimersByTime(50); });
    expect(result.current).toBe('A');

    // Pause then delete
    act(() => { jest.advanceTimersByTime(100); }); // pause done
    act(() => { jest.advanceTimersByTime(30); });  // delete "A"
    expect(result.current).toBe('');

    // Now typing second phrase "B"
    act(() => { jest.advanceTimersByTime(50); });
    expect(result.current).toBe('B');
  });

  it('wraps back to the first phrase after the last one', () => {
    const { result } = renderHook(() =>
      useTypedText(['X', 'Y'], {
        typingSpeed: 50,
        pauseDuration: 100,
        deletingSpeed: 30,
      })
    );

    // Type "X", pause, delete
    act(() => { jest.advanceTimersByTime(50); });  // X
    act(() => { jest.advanceTimersByTime(100); }); // pause
    act(() => { jest.advanceTimersByTime(30); });  // delete

    // Type "Y", pause, delete
    act(() => { jest.advanceTimersByTime(50); });  // Y
    expect(result.current).toBe('Y');
    act(() => { jest.advanceTimersByTime(100); }); // pause
    act(() => { jest.advanceTimersByTime(30); });  // delete

    // Should wrap back to first phrase "X"
    act(() => { jest.advanceTimersByTime(50); });
    expect(result.current).toBe('X');
  });

  it('returns empty string for an empty phrases array', () => {
    const { result } = renderHook(() => useTypedText([]));
    act(() => { jest.advanceTimersByTime(500); });
    expect(result.current).toBe('');
  });

  it('cleans up timers on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() =>
      useTypedText(['Hello'], { typingSpeed: 50 })
    );

    // Advance so a timer is scheduled
    act(() => { jest.advanceTimersByTime(50); });

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
