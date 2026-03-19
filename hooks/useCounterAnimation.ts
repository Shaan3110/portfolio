'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';

interface UseCounterAnimationOptions {
  target: number;
  duration?: number;
}

export function useCounterAnimation({
  target,
  duration = 2000,
}: UseCounterAnimationOptions): { count: number; ref: React.RefObject<HTMLElement | null> } {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * target);

      setCount(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (isInView) {
      animate();
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isInView, animate]);

  return { count, ref };
}
