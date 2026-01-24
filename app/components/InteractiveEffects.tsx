"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function InteractiveEffects() {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to avoid flash
  const [mounted, setMounted] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Cursor position with spring physics
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 100, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 100, damping: 20 });

  // Create animated gradient background using motion template
  const cursorGradient = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(59, 130, 246, 0.15), transparent 40%)`;

  // Detect mobile and set mounted
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      // Check for touch capability AND no fine pointer (mouse)
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasMouse = window.matchMedia("(pointer: fine)").matches;
      setIsMobile(hasTouch && !hasMouse);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop: Cursor glow
  useEffect(() => {
    if (isMobile || !mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mounted, cursorX, cursorY]);

  // Mobile: Touch ripple
  const handleTouch = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    const newRipple: Ripple = {
      id: Date.now(),
      x: touch.clientX,
      y: touch.clientY,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    window.addEventListener("touchstart", handleTouch);
    return () => window.removeEventListener("touchstart", handleTouch);
  }, [isMobile, handleTouch]);

  // Mobile: Device tilt parallax
  useEffect(() => {
    if (!isMobile) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = e.gamma ? Math.min(Math.max(e.gamma, -30), 30) / 30 : 0; // Left/right tilt
      const y = e.beta ? Math.min(Math.max(e.beta - 45, -30), 30) / 30 : 0; // Front/back tilt
      setTilt({ x, y });
    };

    // Request permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      // Permission needs to be requested on user interaction
      const requestPermission = async () => {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch (error) {
          console.log("DeviceOrientation permission denied");
        }
      };

      // Add one-time click listener to request permission
      const handleClick = () => {
        requestPermission();
        document.removeEventListener("click", handleClick);
      };
      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, [isMobile]);

  return (
    <>
      {/* Desktop: Cursor glow */}
      {mounted && !isMobile && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30"
          style={{
            background: cursorGradient,
          }}
        />
      )}

      {/* Mobile: Touch ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="pointer-events-none fixed z-50 rounded-full bg-accent/20"
            initial={{
              width: 0,
              height: 0,
              x: ripple.x,
              y: ripple.y,
              opacity: 0.5
            }}
            animate={{
              width: 150,
              height: 150,
              x: ripple.x - 75,
              y: ripple.y - 75,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Mobile: Tilt-based ambient gradient */}
      {mounted && isMobile && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 opacity-30"
          animate={{
            background: `radial-gradient(circle at ${50 + tilt.x * 30}% ${50 + tilt.y * 30}%, rgba(59, 130, 246, 0.2), transparent 50%)`,
          }}
          transition={{ type: "tween", duration: 0.1 }}
        />
      )}
    </>
  );
}
