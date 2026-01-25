"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ============================================================================
// Constants
// ============================================================================

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

interface Persona {
  position: string;
  description: string;
}

const personas: Persona[] = [
  {
    position: "⚙️ Engineer + 💻 Developer",
    description: "Building infrastructure to scale, shaping data to drive product decisions.",
  },
  {
    position: "🏋️ Powerlifter",
    description: "Compiling strength toward a 900KG total. Currently debugging my squat form.",
  },
];

// ============================================================================
// ScrambleText Component
// ============================================================================

function ScrambleText({
  text,
  className,
  scrambleSpeed = 30,
  revealSpeed = 50,
  onComplete,
}: {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);
  const prevTextRef = useRef(text);
  const frameRef = useRef<number>(0);
  const revealedRef = useRef(0);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (text !== prevTextRef.current || displayText === "") {
      prevTextRef.current = text;
      revealedRef.current = 0;
      hasCalledComplete.current = false;
      setIsScrambling(true);
    }
  }, [text, displayText]);

  useEffect(() => {
    if (!isScrambling || !text) return;

    const scrambleInterval = setInterval(() => {
      frameRef.current++;

      if (frameRef.current % Math.ceil(revealSpeed / scrambleSpeed) === 0) {
        revealedRef.current++;
      }

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealedRef.current) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else if (/[\u{1F300}-\u{1F9FF}]/u.test(text[i])) {
          result += text[i];
        } else {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      setDisplayText(result);

      if (revealedRef.current >= text.length) {
        setIsScrambling(false);
        setDisplayText(text);
        frameRef.current = 0;
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true;
          onComplete?.();
        }
      }
    }, scrambleSpeed);

    return () => clearInterval(scrambleInterval);
  }, [isScrambling, text, scrambleSpeed, revealSpeed, onComplete]);

  return <span className={className}>{displayText}</span>;
}

// ============================================================================
// useRotatingContent Hook
// ============================================================================

type RotationPhase =
  | "initial_greeting"   // Wait for greeting scramble to complete
  | "typing_persona"     // Type position + description together
  | "displaying"         // Pause before deleting
  | "deleting"           // Delete position + description (and greeting if changing)
  | "typing_rotation";   // Type new persona (and greeting if it changed)

function useRotatingContent({
  greetings,
  personas,
  location,
  personaTypingSpeed = 6,
  personaDeleteSpeed = 3,
  displayDuration = 4000,
}: {
  greetings: string[];
  personas: Persona[];
  location: string;
  personaTypingSpeed?: number;
  personaDeleteSpeed?: number;
  displayDuration?: number;
}) {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [personaIndex, setPersonaIndex] = useState(0);
  const rotationCountRef = useRef(0);
  const [positionText, setPositionText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [phase, setPhase] = useState<RotationPhase>("initial_greeting");
  const [showCursor, setShowCursor] = useState(true);

  const currentGreeting = greetings[greetingIndex];
  const greetingTarget = location
    ? `${currentGreeting}, visitor from ${location}!`
    : `${currentGreeting}!`;
  const currentPersona = personas[personaIndex];
  const positionTarget = currentPersona.position;
  const descriptionTarget = currentPersona.description;

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Main animation state machine
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "initial_greeting") {
      // Wait for greeting and name to complete before typing persona
      // This phase is controlled externally via greetingComplete prop
      return;
    }

    if (phase === "typing_persona" || phase === "typing_rotation") {
      const personaDone = positionText.length >= positionTarget.length &&
                          descriptionText.length >= descriptionTarget.length;

      if (!personaDone) {
        timeout = setTimeout(() => {
          if (positionText.length < positionTarget.length) {
            setPositionText(positionTarget.slice(0, positionText.length + 1));
          }
          if (descriptionText.length < descriptionTarget.length) {
            setDescriptionText(descriptionTarget.slice(0, descriptionText.length + 1));
          }
        }, personaTypingSpeed);
      } else {
        timeout = setTimeout(() => {
          setPhase("displaying");
        }, displayDuration);
      }
    } else if (phase === "displaying") {
      timeout = setTimeout(() => {
        setPhase("deleting");
      }, 0);
    } else if (phase === "deleting") {
      const personaDone = positionText.length === 0 && descriptionText.length === 0;

      if (!personaDone) {
        timeout = setTimeout(() => {
          if (positionText.length > 0) {
            setPositionText(positionText.slice(0, -1));
          }
          if (descriptionText.length > 0) {
            setDescriptionText(descriptionText.slice(0, -1));
          }
        }, personaDeleteSpeed);
      } else {
        // Rotate to next persona; greeting rotates every 2nd time
        setPersonaIndex((prev) => (prev + 1) % personas.length);
        rotationCountRef.current += 1;
        if (rotationCountRef.current % 2 === 0) {
          setGreetingIndex((prev) => (prev + 1) % greetings.length);
        }
        setPhase("typing_rotation");
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, positionText, descriptionText, positionTarget, descriptionTarget,
      personaTypingSpeed, personaDeleteSpeed, displayDuration,
      greetings.length, personas.length]);

  // Description is complete when fully typed and in display/delete phase
  const isDescriptionComplete = (phase === "displaying" || phase === "deleting") ||
    (descriptionText.length >= descriptionTarget.length && descriptionText.length > 0);

  return {
    greetingTarget,
    positionText,
    descriptionText,
    showCursor,
    isDescriptionComplete,
    startPersonaTyping: () => setPhase("typing_persona"),
  };
}

// ============================================================================
// Greeting Data Helper
// ============================================================================

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

// ============================================================================
// Hero Component
// ============================================================================

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [greetingData, setGreetingData] = useState<GreetingData>({ timePeriod: "morning", location: "" });
  const [nameComplete, setNameComplete] = useState(false);
  const [nameText, setNameText] = useState("");

  useEffect(() => {
    setMounted(true);
    setGreetingData(getGreetingData());
  }, []);

  const greetings = greetingsByPeriod[greetingData.timePeriod] || defaultGreetings;

  const {
    greetingTarget,
    positionText,
    descriptionText,
    showCursor,
    isDescriptionComplete,
    startPersonaTyping,
  } = useRotatingContent({
    greetings,
    personas,
    location: greetingData.location,
    personaTypingSpeed: 3,
    personaDeleteSpeed: 2,
    displayDuration: 2500,
  });

  // Type "I'm Wentao" immediately when mounted (parallel with greeting)
  useEffect(() => {
    if (!mounted || nameComplete) return;

    const target = "I'm Wentao";
    if (nameText.length < target.length) {
      const timeout = setTimeout(() => {
        setNameText(target.slice(0, nameText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setNameComplete(true);
      startPersonaTyping();
    }
  }, [mounted, nameText, nameComplete, startPersonaTyping]);

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
          {/* Greeting line */}
          {mounted && (
            <div className="h-6">
              <ScrambleText
                text={greetingTarget}
                className="text-accent text-sm font-medium tracking-wide"
                scrambleSpeed={25}
                revealSpeed={40}
              />
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div className="min-h-[3.5rem] md:min-h-[5rem]">
              <span className="text-5xl md:text-7xl font-bold tracking-[-0.04em] text-foreground text-shimmer">
                {nameText}
              </span>
            </div>

            {/* Position */}
            <div className="min-h-[2rem] md:min-h-[2.5rem]">
              <span className="block text-xl md:text-3xl font-medium tracking-[-0.01em] text-muted">
                {positionText}
              </span>
            </div>

            {/* Description with cursor */}
            <div className="min-h-[1.75rem] md:min-h-[2rem]">
              <span className="text-base md:text-lg text-muted/80 leading-[1.7]" style={{ display: "inline" }}>
                {descriptionText}
                <span
                  className={`bg-accent ${isDescriptionComplete && showCursor ? "opacity-100" : "opacity-0"}`}
                  style={{
                    display: "inline-block",
                    width: "0.6em",
                    height: "1.1em",
                    marginLeft: "3px",
                    verticalAlign: "text-bottom",
                  }}
                />
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: nameComplete ? 1 : 0, y: nameComplete ? 0 : 20 }}
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

        {/* Scroll indicator */}
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
