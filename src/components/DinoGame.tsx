"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// --- GAME CONSTANTS ---
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const GROUND_Y = 300;
const INITIAL_SPEED = 4;      // Reduced from 6
const MAX_SPEED = 12;         // Reduced from 15
const ACCELERATION = 0.0005;  // Reduced from 0.001

// --- ASSET PIXEL DATA ---
// Simple 1s and 0s to represent pixels. 1 = filled.
const DINO_RUN_1 = [
  "             1111111",
  "             1101111",
  "             1111111",
  "             111111 ",
  "             1111111",
  "             11     ",
  "             111111 ",
  "1          111111   ",
  "11         11111    ",
  "111       11111     ",
  "111111   11111      ",
  " 111111111111       ",
  "   111111111        ",
  "    1111111         ",
  "     1111           ",
  "      11            ",
  "      1 1           ",
  "      1 1           ",
  "      1  1          ",
  "     11             "
];

const DINO_RUN_2 = [
  "             1111111",
  "             1101111",
  "             1111111",
  "             111111 ",
  "             1111111",
  "             11     ",
  "             111111 ",
  "1          111111   ",
  "11         11111    ",
  "111       11111     ",
  "111111   11111      ",
  " 111111111111       ",
  "   111111111        ",
  "    1111111         ",
  "     1111           ",
  "      11            ",
  "      1 1           ",
  "        1           ",
  "        11          "
];

const DINO_DUCK_1 = [
  "                                  ",
  "                                  ",
  "                                  ",
  "                                  ",
  "                                  ",
  "                                  ",
  "                                  ",
  "                      1111111     ",
  "                      1101111     ",
  "1                     1111111     ",
  "11        1111111     111111      ",
  "11111111111111111111111111111     ",
  " 1111111111111111111111           ",
  "    1111111                       ",
  "     1111                         ",
  "      11                          ",
  "      1 1                         ",
  "      1  1                        ",
  "     11                           "
];

const CACTUS_SMALL = [
  "  11  ",
  "  11  ",
  "1 11 1",
  "111111",
  " 1111 ",
  "  11  ",
  "  11  ",
  "  11  "
];

const CACTUS_LARGE = [
  "   111   ",
  "   111   ",
  " 1 111 1 ",
  "11 111 11",
  "111111111",
  " 1111111 ",
  "   111   ",
  "   111   ",
  "   111   ",
  "   111   ",
  "   111   "
];

const PTERO_1 = [
  "        1       ",
  "       11       ",
  "      111       ",
  " 111111111111   ",
  "1111111101      ",
  "  1111111       ",
  "   111          ",
  "                "
];

const PTERO_2 = [
  "                ",
  "                ",
  "                ",
  " 111111111111   ",
  "1111111101      ",
  "  1111111       ",
  "   111          ",
  "   1            "
];

function drawPixelArt(ctx: CanvasRenderingContext2D, art: string[], x: number, y: number, scale: number) {
  for (let row = 0; row < art.length; row++) {
    for (let col = 0; col < art[row].length; col++) {
      if (art[row][col] === '1') {
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      } else if (art[row][col] === '0') {
        // Transparent / Background color eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
        ctx.fillStyle = '#FF0000';
      }
    }
  }
}

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  
  // Audio Context reference
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Core game state mutables (refs for animation loop)
  const state = useRef({
    frames: 0,
    speed: INITIAL_SPEED,
    score: 0,
    highScore: 0,
    dino: {
      x: 50,
      y: GROUND_Y,
      vy: 0,
      width: 40,
      height: 40, // Base height, changes on duck
      isJumping: false,
      isDucking: false,
    },
    obstacles: [] as { x: number, y: number, width: number, height: number, type: string, art: string[][] }[],
    clouds: [] as { x: number, y: number }[],
    groundParticles: [] as { x: number, y: number, size: number }[],
    keys: { ArrowUp: false, ArrowDown: false, " ": false }
  });

  // Sound effects using Web Audio API
  const playSound = (type: 'jump' | 'score' | 'hit') => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'score') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  };

  const initGame = () => {
    state.current = {
      ...state.current,
      frames: 0,
      speed: INITIAL_SPEED,
      score: 0,
      dino: {
        x: 50,
        y: GROUND_Y,
        vy: 0,
        width: 40,
        height: 40,
        isJumping: false,
        isDucking: false,
      },
      obstacles: [],
      clouds: [],
      groundParticles: []
    };
    
    // Initial ground
    for (let i = 0; i < 100; i++) {
      state.current.groundParticles.push({
        x: Math.random() * 2000,
        y: GROUND_Y + Math.random() * 15 + 2,
        size: Math.random() * 2 + 1
      });
    }

    setGameState('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key === ' ' ? ' ' : e.key;
      if (['ArrowUp', 'ArrowDown', ' '].includes(k)) {
        e.preventDefault();
        state.current.keys[k as keyof typeof state.current.keys] = true;
      }
      if (k === ' ' || k === 'ArrowUp') {
        if (gameState !== 'PLAYING') initGame();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key === ' ' ? ' ' : e.key;
      if (['ArrowUp', 'ArrowDown', ' '].includes(k)) {
        state.current.keys[k as keyof typeof state.current.keys] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const loop = () => {
      // Handle Resize full-screen
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      update();
      draw(ctx, canvas);
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  const update = () => {
    if (gameState !== 'PLAYING') return;

    const s = state.current;
    s.frames++;
    s.score += 0.1;
    
    if (s.speed < MAX_SPEED) {
      s.speed += ACCELERATION;
    }

    if (Math.floor(s.score) > 0 && Math.floor(s.score) % 100 === 0 && Math.floor(s.score - 0.1) % 100 !== 0) {
      playSound('score');
    }

    // Controls
    const { dino, keys } = s;
    if ((keys.ArrowUp || keys[" "]) && !dino.isJumping) {
      dino.vy = JUMP_FORCE;
      dino.isJumping = true;
      playSound('jump');
    }

    dino.isDucking = keys.ArrowDown && !dino.isJumping;
    dino.width = dino.isDucking ? 55 : 40;
    dino.height = dino.isDucking ? 25 : 40;

    // Physics
    dino.y += dino.vy;
    if (dino.y < GROUND_Y) {
      dino.vy += GRAVITY;
      if (keys.ArrowDown) dino.vy += GRAVITY; // Fast drop
    } else {
      dino.y = GROUND_Y;
      dino.vy = 0;
      dino.isJumping = false;
    }

    // Spawn Obstacles
    // Increased the gap between obstacles to give player time to react
    if (s.frames % Math.floor(Math.random() * 100 + 100) === 0) {
      const type = Math.random() > 0.7 && s.score > 300 ? 'ptero' : 'cactus';
      if (type === 'cactus') {
        const isLarge = Math.random() > 0.5;
        s.obstacles.push({
          x: window.innerWidth,
          y: isLarge ? GROUND_Y - 20 : GROUND_Y - 10,
          width: isLarge ? 25 : 15,
          height: isLarge ? 40 : 30,
          type: 'cactus',
          art: [isLarge ? CACTUS_LARGE : CACTUS_SMALL]
        });
      } else {
        const heights = [GROUND_Y - 15, GROUND_Y - 45, GROUND_Y - 75];
        s.obstacles.push({
          x: window.innerWidth,
          y: heights[Math.floor(Math.random() * heights.length)],
          width: 40,
          height: 30,
          type: 'ptero',
          art: [PTERO_1, PTERO_2]
        });
      }
    }

    // Move Obstacles
    s.obstacles.forEach(obs => {
      obs.x -= s.speed;
      
      // Hitbox logic (smaller than visual bounds for fairness)
      const hitBoxScale = 0.7;
      const dinoHitX = dino.x + (dino.width * (1 - hitBoxScale)) / 2;
      const dinoHitY = dino.y - dino.height + (dino.height * (1 - hitBoxScale)) / 2;
      const dinoHitW = dino.width * hitBoxScale;
      const dinoHitH = dino.height * hitBoxScale;

      const obsHitX = obs.x + (obs.width * (1 - hitBoxScale)) / 2;
      const obsHitY = obs.y - obs.height + (obs.height * (1 - hitBoxScale)) / 2;
      const obsHitW = obs.width * hitBoxScale;
      const obsHitH = obs.height * hitBoxScale;

      if (
        dinoHitX < obsHitX + obsHitW &&
        dinoHitX + dinoHitW > obsHitX &&
        dinoHitY < obsHitY + obsHitH &&
        dinoHitY + dinoHitH > obsHitY
      ) {
        playSound('hit');
        if (s.score > s.highScore) s.highScore = Math.floor(s.score);
        setGameState('GAMEOVER');
      }
    });

    // Remove off-screen obstacles
    s.obstacles = s.obstacles.filter(obs => obs.x > -100);

    // Environment
    s.groundParticles.forEach(p => {
      p.x -= s.speed;
      if (p.x < 0) p.x = window.innerWidth;
    });

    if (Math.random() < 0.01) {
      s.clouds.push({ x: window.innerWidth, y: Math.random() * 150 + 50 });
    }
    s.clouds.forEach(c => c.x -= s.speed * 0.2);
    s.clouds = s.clouds.filter(c => c.x > -100);
  };

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const s = state.current;
    
    // Full screen background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Center the game vertically
    const yOffset = (canvas.height / 2) - GROUND_Y;
    ctx.translate(0, yOffset);

    // Set drawing color to brand red
    ctx.fillStyle = '#FF0000';
    ctx.strokeStyle = '#FF0000';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Ground line
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    // Ground details
    s.groundParticles.forEach(p => {
      ctx.fillRect(p.x, p.y, p.size, 1);
    });

    // Clouds
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    s.clouds.forEach(c => {
      ctx.fillRect(c.x, c.y, 40, 10);
      ctx.fillRect(c.x + 10, c.y - 5, 20, 5);
      ctx.fillRect(c.x + 5, c.y + 10, 30, 5);
    });

    ctx.fillStyle = '#FF0000';

    // Obstacles
    s.obstacles.forEach(obs => {
      const artToDraw = obs.type === 'ptero' ? obs.art[Math.floor(s.frames / 15) % 2] : obs.art[0];
      const scale = 2; // Pixel scaling
      drawPixelArt(ctx, artToDraw, obs.x, obs.y - artToDraw.length * scale, scale);
    });

    // Dino
    let dinoArt = DINO_RUN_1;
    if (gameState === 'GAMEOVER') {
      dinoArt = DINO_RUN_1; // Can define a dead sprite, using run1 for now
    } else if (s.dino.isJumping) {
      dinoArt = DINO_RUN_1;
    } else if (s.dino.isDucking) {
      dinoArt = Math.floor(s.frames / 5) % 2 === 0 ? DINO_DUCK_1 : DINO_DUCK_1; // Need duck 2, using duck 1
    } else {
      dinoArt = Math.floor(s.frames / 5) % 2 === 0 ? DINO_RUN_1 : DINO_RUN_2;
    }
    
    const dinoScale = 2;
    drawPixelArt(ctx, dinoArt, s.dino.x, s.dino.y - dinoArt.length * dinoScale, dinoScale);

    ctx.restore();

    // UI Overlay
    ctx.font = '20px var(--font-orbitron), monospace';
    ctx.fillStyle = '#FF0000';
    ctx.textAlign = 'right';
    const scoreStr = Math.floor(s.score).toString().padStart(5, '0');
    const hiStr = s.highScore > 0 ? `HI ${s.highScore.toString().padStart(5, '0')} ` : '';
    ctx.fillText(`${hiStr}${scoreStr}`, canvas.width - 20, 20);

    if (gameState === 'START') {
      ctx.textAlign = 'center';
      ctx.font = '30px var(--font-orbitron), monospace';
      ctx.fillText('PRESS SPACE TO START', canvas.width / 2, canvas.height / 2);
    } else if (gameState === 'GAMEOVER') {
      ctx.textAlign = 'center';
      ctx.font = '40px var(--font-orbitron), monospace';
      ctx.fillText('G A M E  O V E R', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '20px var(--font-orbitron), monospace';
      ctx.fillText('PRESS SPACE TO RESTART', canvas.width / 2, canvas.height / 2 + 30);
    }

    // Go Back text
    ctx.textAlign = 'left';
    ctx.font = '16px var(--font-orbitron), monospace';
    ctx.fillText('< RETURN TO BASE', 20, 20);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#000000] overflow-hidden">
      <Link href="/">
        <div className="absolute top-4 left-4 w-48 h-12 z-50 cursor-pointer" />
      </Link>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-none"
      />
    </div>
  );
}
