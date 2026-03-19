'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true after the component has mounted, confirming that
 * JavaScript and Framer Motion are available. Used to conditionally
 * apply animation initial states so content remains visible if
 * animations fail to load (Requirement 11.5).
 */
export function useAnimationReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
}
