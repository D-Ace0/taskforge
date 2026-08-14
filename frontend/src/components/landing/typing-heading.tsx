"use client";

import { useEffect, useState } from "react";

const phrases = [
  "Plan work.",
  "Track progress.",
  "Build together.",
];

export default function TypingHeading() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrase = phrases[phraseIndex];
  const visibleText = phrase.slice(0, characterCount);

  useEffect(() => {
    const isComplete = characterCount === phrase.length;
    const isEmpty = characterCount === 0;

    let delay = isDeleting ? 45 : 85;

    if (isComplete && !isDeleting) {
      delay = 1200;
    }

    const timeoutId = window.setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (isEmpty && isDeleting) {
        setIsDeleting(false);
        setPhraseIndex(
          (currentIndex) =>
            (currentIndex + 1) % phrases.length,
        );
        return;
      }

      setCharacterCount((currentCount) =>
        isDeleting
          ? currentCount - 1
          : currentCount + 1,
      );
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [
    characterCount,
    isDeleting,
    phrase,
  ]);

  return (
    <h1 className="mt-4 min-h-[7rem] text-4xl font-bold tracking-tight text-slate-900 sm:min-h-[4rem] sm:text-5xl">
      {visibleText}

      <span
        aria-hidden="true"
        className="ml-1 inline-block animate-pulse text-indigo-600"
      >
        |
      </span>

      <span className="sr-only">
        Plan work. Track progress. Build together.
      </span>
    </h1>
  );
}