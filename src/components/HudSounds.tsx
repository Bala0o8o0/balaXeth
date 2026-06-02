"use client";

import { useEffect, useRef } from "react";

export default function HudSounds() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Initialize AudioContext on first user interaction to comply with browser autoplay policies
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      if (!clickAudioRef.current) {
        clickAudioRef.current = new Audio("/assets/sci-fi-click-900.wav");
        clickAudioRef.current.volume = 0.8;
      }
    };

    // --- Sound Synthesis Functions ---
    // Hi-tech subtle hover blip
    const playHoverSound = () => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Quick pitch sweep up for a futuristic feel
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.01); // Kept volume very low (0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    };

    // Custom Audio File Click
    const playClickSound = () => {
      if (clickAudioRef.current) {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current
          .play()
          .catch((e) => console.log("Audio play blocked", e));
      }
    };

    // Subtle data-scroll tick
    const playScrollSound = () => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      // Slight randomization of pitch for each scroll tick, higher base pitch for sci-fi feel
      osc.frequency.setValueAtTime(300 + Math.random() * 100, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      // Significantly increased gain so the scroll tick is clearly audible
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    };

    // --- Event Listeners ---
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastScrollTime = 0;

    const handleScroll = () => {
      initAudio();

      const now = Date.now();
      // Throttle scroll sounds to avoid overwhelming audio
      if (now - lastScrollTime > 50) {
        playScrollSound();
        lastScrollTime = now;
      }
    };

    const handleClick = (e: MouseEvent) => {
      initAudio();
      playClickSound();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-target")
      ) {
        initAudio();
        playHoverSound();
      }
    };

    // Attach listeners
    // We attach to document for scroll if body is not scrollable, or window
    // Added wheel and touchmove to capture scroll intent even if window scroll isn't firing
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    window.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      window.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("mouseover", handleMouseOver);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(console.error);
      }
    };
  }, []);

  return null;
}
