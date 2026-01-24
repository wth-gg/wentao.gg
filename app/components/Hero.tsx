"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";

interface TextSection {
  text: string;
  className: string;
}

// Playful greetings for each time period
const greetingsByPeriod: Record<string, string[]> = {
  early_morning: [
    "Rise and shine ☀️",
    "Early bird gets the worm 🐦",
    "Up with the sun 🌅",
    "Morning hustle activated 💪",
  ],
  morning: [
    "Good morning ☕",
    "Hope your coffee is strong ☕",
    "Ready to conquer the day? 🚀",
    "Morning vibes ✨",
  ],
  midday: [
    "Hope you're having a great day 🌤️",
    "Lunch break browsing? 🍕",
    "Halfway through the day 💫",
    "Midday momentum 🎯",
  ],
  afternoon: [
    "Happy afternoon 🌞",
    "Afternoon productivity mode 💻",
    "Making the most of the day ⚡",
    "Cruising through the afternoon 🛹",
  ],
  evening: [
    "Good evening ✨",
    "Winding down? 🌆",
    "Evening explorations 🔍",
    "Golden hour greetings 🌅",
  ],
  night: [
    "Burning the midnight oil 🦉",
    "Night owl mode activated 🌙",
    "Late night coding? 💻",
    "Stars are out ⭐",
  ],
  late_night: [
    "Up late, huh? 🌙",
    "Can't sleep? Same 😅",
    "The internet never sleeps 🌐",
    "Late night adventures 🚀",
  ],
};

const defaultGreetings = ["Hey there 👋", "Welcome 👋", "Hello 👋"];

type TypingPhase = "typing" | "waiting" | "deleting";

function RotatingGreeting({
  greetings,
  location,
  typingSpeed = 40,
  deleteSpeed = 20,
  displayDuration = 3500,
}: {
  greetings: string[];
  location: string;
  typingSpeed?: number;
  deleteSpeed?: number;
  displayDuration?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<TypingPhase>("typing");
  const [showCursor, setShowCursor] = useState(true);

  const currentGreeting = greetings[currentIndex];
  const fullText = location
    ? `${currentGreeting}, visitor from ${location}! I'm`
    : `${currentGreeting}! I'm`;

  // Main animation loop
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, wait before deleting
        timeout = setTimeout(() => {
          setPhase("deleting");
        }, displayDuration);
      }
    } else if (phase === "deleting") {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Finished deleting, move to next greeting
        setCurrentIndex((prev) => (prev + 1) % greetings.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, phase, fullText, typingSpeed, deleteSpeed, displayDuration, greetings.length]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-accent text-sm font-medium tracking-wide">
      {displayedText}
      <span
        className={`inline-block bg-accent align-baseline transition-opacity ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: "0.5em",
          height: "1em",
          marginLeft: "1px",
          verticalAlign: "text-bottom",
        }}
      />
    </span>
  );
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

interface GreetingData {
  timePeriod: string;
  location: string;
}

function getGreetingData(): GreetingData {
  if (typeof document === "undefined") {
    return { timePeriod: "morning", location: "" };
  }

  const match = document.cookie.match(/visitor-greeting-data=([^;]+)/);
  if (match) {
    try {
      let data = decodeURIComponent(match[1]);
      // Handle double-encoding
      if (data.includes("%")) {
        data = decodeURIComponent(data);
      }
      return JSON.parse(data);
    } catch {
      return { timePeriod: "morning", location: "" };
    }
  }
  return { timePeriod: "morning", location: "" };
}

export default function Hero() {
  const [typingComplete, setTypingComplete] = useState(false);
  const [greetingData, setGreetingData] = useState<GreetingData>({ timePeriod: "morning", location: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setGreetingData(getGreetingData());
  }, []);

  const greetings = greetingsByPeriod[greetingData.timePeriod] || defaultGreetings;

  const textSections: TextSection[] = [
    {
      text: "Wentao",
      className: "block text-5xl md:text-7xl font-bold tracking-[-0.04em] text-foreground mb-4 text-shimmer",
    },
    {
      text: "⚙️ Engineer + 💻 Developer",
      className: "block text-xl md:text-3xl font-medium tracking-[-0.01em] text-muted mb-4",
    },
    {
      text: "Building infrastructure to scale, shaping data to drive product decisions.",
      className: "block text-base md:text-lg text-muted/80 max-w-2xl leading-[1.7]",
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
          className="space-y-6 relative z-20 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-6"
          >
            {mounted && (
              <RotatingGreeting
                greetings={greetings}
                location={greetingData.location}
                typingSpeed={30}
                deleteSpeed={15}
                displayDuration={2000}
              />
            )}
          </motion.div>

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
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors pointer-events-auto"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
        >
          <motion.a
            href="#projects"
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
