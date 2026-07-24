"use client";

import { useRef, useCallback, useEffect } from "react";

export function useWatchCrownSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const playTick = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 18);
      }
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      const bpf = ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.value = 3800;
      bpf.Q.value = 0.6;
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      src.buffer = buf;
      src.connect(bpf);
      bpf.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (e) {}
  }, [getCtx]);

  return { playTick };
}

export function useScrollWatchCrown(stepPx = 40) {
  const { playTick } = useWatchCrownSound();
  const lastScrollPos = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentPos = window.scrollY;
      if (Math.abs(currentPos - lastScrollPos.current) >= stepPx) {
        playTick();
        lastScrollPos.current = currentPos;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [playTick, stepPx]);
}
