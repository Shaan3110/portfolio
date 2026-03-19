'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TypedTextConfig {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const defaults: Required<TypedTextConfig> = {
  typingSpeed: 100,
  deletingSpeed: 50,
  pauseDuration: 1500,
};

export function useTypedText(
  phrases: string[],
  config?: TypedTextConfig
): string {
  const { typingSpeed, deletingSpeed, pauseDuration } = {
    ...defaults,
    ...config,
  };

  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      if (displayText.length < currentPhrase.length) {
        timerRef.current = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing — pause then start deleting
        timerRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting backward
      if (displayText.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Finished deleting — move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return clearTimer;
  }, [
    displayText,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    clearTimer,
  ]);

  return displayText;
}
