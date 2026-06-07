"use client";

import { useEffect, useRef } from "react";

interface RadarBlip {
  angle: number;
  distance: number;
  intensity: number;
  x: number;
  y: number;
}

interface HexLine {
  address: string;
  bytes: string[];
  status: string;
  color: string;
}

export default function CyberTelemetry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const resizeCanvas = () => {
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    // ── Radar Variables ──
    let radarAngle = 0;
    const radarBlips: RadarBlip[] = [
      { angle: 0.5, distance: 0.4, intensity: 0, x: 0, y: 0 },
      { angle: 2.1, distance: 0.7, intensity: 0, x: 0, y: 0 },
      { angle: 4.3, distance: 0.5, intensity: 0, x: 0, y: 0 }
    ];

    // ── Hex Decrypter Variables ──
    const addresses = ["0x4E8A", "0x5A1F", "0x63B2", "0x7F0E", "0x8D29", "0x91CA"];
    const hexLines: HexLine[] = [
      { address: "0x4E8A", bytes: ["A1", "3F", "99", "C2"], status: "DEC", color: "rgba(255, 0, 0, 0.4)" },
      { address: "0x5A1F", bytes: ["02", "FF", "D2", "4B"], status: "OK ", color: "rgba(255, 255, 255, 0.7)" },
      { address: "0x63B2", bytes: ["FE", "1A", "88", "C0"], status: "SYS", color: "rgba(255, 0, 0, 0.4)" },
      { address: "0x7F0E", bytes: ["90", "C1", "E4", "F8"], status: "ERR", color: "#FF0000" }
    ];

    // ── Graph Variables ──
    const graphPoints: number[] = Array(35).fill(0).map(() => 15 + Math.random() * 20);

    let frame = 0;

    // ── Main Draw Loop ──
    const tick = () => {
      frame++;

      // Clear
      ctx.fillStyle = "rgba(5, 5, 5, 1)";
      ctx.fillRect(0, 0, width, height);

      // Grid Pattern Background
      ctx.strokeStyle = "rgba(255, 0, 0, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 10;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Responsive spacing definitions
      const showRadar = width > 240;
      const showGraph = width > 360;

      // ── SECTION 1: RADAR SCANNER (LEFT) ──
      if (showRadar) {
        const radarX = 35;
        const radarY = height / 2;
        const radarRadius = 22;

        // Draw radar bounds
        ctx.strokeStyle = "rgba(255, 0, 0, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radarX, radarY, radarRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
        ctx.beginPath();
        ctx.moveTo(radarX - radarRadius - 3, radarY);
        ctx.lineTo(radarX + radarRadius + 3, radarY);
        ctx.moveTo(radarX, radarY - radarRadius - 3);
        ctx.lineTo(radarX, radarY + radarRadius + 3);
        ctx.stroke();

        // Rotate sweep
        radarAngle = (radarAngle + 0.03) % (Math.PI * 2);

        // Draw sweep wedge
        const gradient = ctx.createRadialGradient(
          radarX, radarY, 0,
          radarX, radarY, radarRadius
        );
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.15)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 0.0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(radarX, radarY);
        ctx.arc(
          radarX,
          radarY,
          radarRadius,
          radarAngle - 0.5,
          radarAngle,
          false
        );
        ctx.closePath();
        ctx.fill();

        // Sweep leading line
        ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(radarX, radarY);
        ctx.lineTo(
          radarX + Math.cos(radarAngle) * radarRadius,
          radarY + Math.sin(radarAngle) * radarRadius
        );
        ctx.stroke();

        // Draw & Update Blips
        radarBlips.forEach((blip) => {
          const blipX = radarX + Math.cos(blip.angle) * (radarRadius * blip.distance);
          const blipY = radarY + Math.sin(blip.angle) * (radarRadius * blip.distance);

          // Calculate angle diff between sweep and blip
          let angleDiff = radarAngle - blip.angle;
          if (angleDiff < 0) angleDiff += Math.PI * 2;

          // If sweep passes over blip, light it up
          if (angleDiff < 0.1) {
            blip.intensity = 1.0;
          } else {
            blip.intensity = Math.max(0, blip.intensity - 0.015);
          }

          if (blip.intensity > 0) {
            ctx.shadowColor = "#FF0000";
            ctx.shadowBlur = 6 * blip.intensity;

            // Blip center
            ctx.fillStyle = `rgba(255, 0, 0, ${blip.intensity})`;
            ctx.beginPath();
            ctx.arc(blipX, blipY, 2, 0, Math.PI * 2);
            ctx.fill();

            // Blip ring
            ctx.strokeStyle = `rgba(255, 0, 0, ${blip.intensity * 0.3})`;
            ctx.beginPath();
            ctx.arc(blipX, blipY, 5 * (1 - blip.intensity + 0.2), 0, Math.PI * 2);
            ctx.stroke();

            ctx.shadowBlur = 0; // Reset
          }
        });
      }

      // ── SECTION 2: HEX DECRYPTER TERMINAL (CENTER) ──
      const hexX = showRadar ? 78 : 12;
      const hexYStart = 16;
      ctx.textAlign = "left";

      // Mutate hex bytes randomly for hacking feel
      if (frame % 8 === 0) {
        const lineIdx = Math.floor(Math.random() * hexLines.length);
        const byteIdx = Math.floor(Math.random() * 4);
        const chars = "0123456789ABCDEF";
        hexLines[lineIdx].bytes[byteIdx] =
          chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)];

        // Randomly flicker state
        if (Math.random() < 0.2) {
          hexLines[lineIdx].status = Math.random() > 0.5 ? "DEC" : "SYS";
          hexLines[lineIdx].color = Math.random() > 0.5 ? "rgba(255, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.5)";
        }
      }

      // Render Hex lines
      hexLines.forEach((line, index) => {
        const y = hexYStart + index * 11;
        ctx.font = "8px Courier New, monospace";

        // Address
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillText(line.address, hexX, y);

        // Bytes
        ctx.fillStyle = line.color;
        const bytesStr = line.bytes.join(" ");
        ctx.fillText(bytesStr, hexX + 38, y);

        // Status Label (e.g. OK, DEC)
        if (line.status === "ERR") {
          ctx.fillStyle = "#FF0000";
        } else if (line.status === "OK ") {
          ctx.fillStyle = "#FF4444";
        } else {
          ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        }
        ctx.fillText(`[${line.status}]`, hexX + 90, y);
      });

      // ── SECTION 3: TELEMETRY SIGNAL WAVE (RIGHT) ──
      if (showGraph) {
        const graphWidth = 90;
        const graphHeight = 30;
        const graphX = width - graphWidth - 12;
        const graphY = (height - graphHeight) / 2;

        // Draw graph background border
        ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
        ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

        // Title
        ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        ctx.font = "7px Courier New, monospace";
        ctx.fillText("SIGNAL_FREQ", graphX, graphY - 3);

        // Status
        const netLoad = 65 + Math.sin(frame * 0.03) * 15 + Math.random() * 2;
        ctx.fillStyle = "#FF0000";
        ctx.textAlign = "right";
        ctx.fillText(`${Math.round(netLoad)}%`, graphX + graphWidth, graphY - 3);
        ctx.textAlign = "left"; // reset

        // Shift points and add new value
        if (frame % 3 === 0) {
          graphPoints.shift();
          const nextVal =
            graphY +
            graphHeight / 2 +
            Math.sin(frame * 0.08) * (graphHeight * 0.35) +
            (Math.random() - 0.5) * 5;
          // Constrain
          const clampedVal = Math.max(graphY + 2, Math.min(graphY + graphHeight - 2, nextVal));
          graphPoints.push(clampedVal);
        }

        // Draw wave path
        ctx.beginPath();
        const step = graphWidth / (graphPoints.length - 1);
        graphPoints.forEach((val, idx) => {
          const x = graphX + idx * step;
          if (idx === 0) {
            ctx.moveTo(x, val);
          } else {
            ctx.lineTo(x, val);
          }
        });

        // Stroke
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(255, 0, 0, 0.5)";
        ctx.shadowBlur = 3;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Gradient fill below wave
        const fillGrad = ctx.createLinearGradient(graphX, graphY, graphX, graphY + graphHeight);
        fillGrad.addColorStop(0, "rgba(255, 0, 0, 0.15)");
        fillGrad.addColorStop(1, "rgba(255, 0, 0, 0.0)");

        ctx.lineTo(graphX + graphWidth, graphY + graphHeight);
        ctx.lineTo(graphX, graphY + graphHeight);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();
      }

      // ── CRT CRT scanlines overlay ──
      ctx.fillStyle = "rgba(255, 0, 0, 0.04)";
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />
    </div>
  );
}
