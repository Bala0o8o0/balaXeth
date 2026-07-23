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

    // --- Event Listeners ---
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
    window.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("mouseover", handleMouseOver);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(console.error);
      }
    };
  }, []);

  return null;
}
