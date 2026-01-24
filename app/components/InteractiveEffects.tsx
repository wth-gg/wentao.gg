"use client";

import { useEffect, useState, useRef } from "react";

export default function InteractiveEffects() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set mounted and detect mobile
  useEffect(() => {
    setMounted(true);
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    setIsMobile(hasTouch && !hasMouse);
  }, []);

  // WebGL Fluid Simulation
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    let fluidInstance: any = null;

    const initFluid = async () => {
      try {
        const WebGLFluid = (await import("webgl-fluid")).default;
        if (canvasRef.current) {
          fluidInstance = WebGLFluid(canvasRef.current, {
            IMMEDIATE: false,
            TRIGGER: "hover",
            SIM_RESOLUTION: 512,
            DYE_RESOLUTION: 2048,
            CAPTURE_RESOLUTION: 256,
            DENSITY_DISSIPATION: 2,
            VELOCITY_DISSIPATION: 2.5,
            PRESSURE: 0.4,
            PRESSURE_ITERATIONS: 45,
            CURL: 20,
            SPLAT_RADIUS: 0.075,
            SPLAT_FORCE: 6000,
            SHADING: true,
            COLORFUL: true,
            COLOR_UPDATE_SPEED: 25,
            PAUSED: false,
            BACK_COLOR: { r: 0, g: 0, b: 0 },
            TRANSPARENT: true,
            BLOOM: false,
          });
        }
      } catch (error) {
        console.error("Failed to initialize WebGL Fluid:", error);
      }
    };

    initFluid();

    return () => {
      fluidInstance = null;
    };
  }, [mounted]);

  // Forward touch events to canvas on mobile (allows scroll + fluid effect)
  useEffect(() => {
    if (!mounted || !isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;

    const forwardTouchEvent = (e: TouchEvent, type: string) => {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;

      const pointerEvent = new PointerEvent(type, {
        clientX: touch.clientX,
        clientY: touch.clientY,
        pointerId: touch.identifier,
        pointerType: "touch",
        isPrimary: true,
        bubbles: true,
      });
      canvas.dispatchEvent(pointerEvent);
    };

    const handleTouchStart = (e: TouchEvent) => forwardTouchEvent(e, "pointerdown");
    const handleTouchMove = (e: TouchEvent) => forwardTouchEvent(e, "pointermove");
    const handleTouchEnd = (e: TouchEvent) => forwardTouchEvent(e, "pointerup");

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mounted, isMobile]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-10 ${isMobile ? "pointer-events-none" : ""}`}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
