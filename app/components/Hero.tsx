"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface TextSection {
  text: string;
  className: string;
}

function TypeWriter({
  sections,
  speed = 60,
  initialDelay = 600,
  onComplete,
}: {
  sections: TextSection[];
  speed?: number;
  initialDelay?: number;
  onComplete?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Flatten all sections into a single character array with styling info
  const allChars = useMemo(() => {
    const chars: { char: string; sectionIndex: number; isNewSection: boolean }[] = [];
    sections.forEach((section, sectionIndex) => {
      section.text.split("").forEach((char, charIndex) => {
        chars.push({
          char,
          sectionIndex,
          isNewSection: charIndex === 0 && sectionIndex > 0,
        });
      });
    });
    return chars;
  }, [sections]);

  const totalLength = allChars.length;

  // Start typing after initial delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true);
    }, initialDelay);
    return () => clearTimeout(timeout);
  }, [initialDelay]);

  // Typing effect
  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < totalLength) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, isTyping, totalLength, speed, onComplete]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Get current section for cursor sizing
  const currentSectionIndex = currentIndex < totalLength
    ? allChars[currentIndex]?.sectionIndex ?? sections.length - 1
    : sections.length - 1;

  // Build rendered sections
  const isComplete = currentIndex >= totalLength;
  const lastSectionIndex = sections.length - 1;

  const renderedSections = sections.map((section, sectionIndex) => {
    // Calculate how many characters of this section to show
    let charsBeforeThisSection = 0;
    for (let i = 0; i < sectionIndex; i++) {
      charsBeforeThisSection += sections[i].text.length;
    }

    const charsToShowInThisSection = Math.max(
      0,
      Math.min(section.text.length, currentIndex - charsBeforeThisSection)
    );

    const displayedText = section.text.slice(0, charsToShowInThisSection);
    const isCurrentSection = currentSectionIndex === sectionIndex;
    const showCursorHere = isCurrentSection && currentIndex < totalLength;
    const showEndCursor = isComplete && sectionIndex === lastSectionIndex;

    if (charsToShowInThisSection === 0 && !showCursorHere) {
      return null;
    }

    return (
      <span key={sectionIndex} className={section.className}>
        {displayedText}
        {(showCursorHere || showEndCursor) && (
          <span
            className={`inline-block bg-accent align-baseline ${
              showCursor ? "opacity-100" : "opacity-0"
            }`}
            style={{
              width: "0.6em",
              height: "1.1em",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
            }}
          />
        )}
      </span>
    );
  });

  return (
    <div className="space-y-4">
      {renderedSections}
    </div>
  );
}

export default function Hero() {
  const [typingComplete, setTypingComplete] = useState(false);

  const textSections: TextSection[] = [
    {
      text: "Wentao",
      className: "block text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4",
    },
    {
      text: "⚙️ Engineer + 💻 Developer",
      className: "block text-2xl md:text-4xl font-semibold text-muted mb-4",
    },
    {
      text: "Building infrastructure to scale, shaping data to drive product decisions.",
      className: "block text-lg text-muted max-w-2xl leading-relaxed",
    },
  ];

  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center px-6 pt-20"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-accent font-mono text-sm tracking-wider"
          >
            Hello, I&apos;m
          </motion.p>

          <TypeWriter
            sections={textSections}
            speed={5}
            initialDelay={10}
            onComplete={() => setTypingComplete(true)}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex gap-4 pt-4"
          >
            <a
              href="#connect"
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#education"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted hover:text-foreground transition-colors"
          >
            <ArrowDown size={24} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
