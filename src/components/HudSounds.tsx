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
    // Deep Thocky Mechanical Keyboard Switch Click (60% Volume)
    const playThockyKeyboardSound = () => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Master Gain set to 60% volume
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.6, now);
      masterGain.connect(ctx.destination);

      // Layer 1: Mechanical Switch Bottom-Out Thud (Triangle Pitch Drop)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      const bodyFilter = ctx.createBiquadFilter();

      bodyOsc.type = "triangle";
      bodyOsc.frequency.setValueAtTime(180, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.05);

      bodyFilter.type = "lowpass";
      bodyFilter.frequency.setValueAtTime(550, now);

      bodyGain.gain.setValueAtTime(0.85, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(masterGain);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.05);

      // Layer 2: Mechanical Switch Tactile Contact Noise
      const bufferSize = Math.floor(ctx.sampleRate * 0.02);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
      }

      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.Q.setValueAtTime(1.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noiseSrc.start(now);
    };

    // --- Event Listeners ---
    const handleClick = (e: MouseEvent) => {
      initAudio();
      playThockyKeyboardSound();
    };

    // Attach listeners
    window.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(console.error);
      }
    };
  }, []);

  return null;
}
