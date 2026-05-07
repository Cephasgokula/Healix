"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypeWriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
  cursorClassName?: string;
}

export function TypeWriter({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  className,
  cursorClassName,
}: TypeWriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;

    const currentWord = words[currentWordIndex];

    if (!isDeleting && currentText === currentWord) {
      // Word complete, wait then start deleting
      timeout = setTimeout(() => setIsDeleting(true), delayBetweenWords);
    } else if (isDeleting && currentText === "") {
      // Word fully deleted, move to next word and stop deleting
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      // Normal typing or deleting
      timeout = setTimeout(
        () => {
          if (!isDeleting) {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          } else {
            setCurrentText(currentText.slice(0, -1));
          }
        },
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className="inline-flex items-center">
      <span className={cn("inline-block relative", className)}>
        {currentText}
        {/* Invisible shadow text to maintain width and prevent jumping */}
        <span className="invisible h-0 block pointer-events-none" aria-hidden="true">
          {words.reduce((a, b) => (a.length > b.length ? a : b))}
        </span>
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className={cn("ml-1 inline-block w-[3px] h-[1.1em] bg-primary", cursorClassName)}
      />
    </span>
  );
}
