"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 1500 }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const light = useRef<THREE.PointLight>(null);

    // Generate deterministic pseudo-random values to prevent hydration errors and keep render pure
    const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed + 1) * 10000;
        return x - Math.floor(x);
    };

    // Generate positions, velocities and colors for our particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = pseudoRandom(i * 6) * 100;
            const factor = 20 + pseudoRandom(i * 6 + 1) * 100;
            const speed = 0.01 + pseudoRandom(i * 6 + 2) / 200;
            const x = pseudoRandom(i * 6 + 3) * 100 - 50;
            const y = pseudoRandom(i * 6 + 4) * 100 - 50;
            const z = pseudoRandom(i * 6 + 5) * 100 - 50;

            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const scrollVelocity = useRef(0);
    const lastScrollY = useRef(0);
    const scrollYRef = useRef(0);

    // Track scroll velocity for hyperspace effect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;
            // Map scroll speed to particle speed multiplier
            scrollVelocity.current = delta * 0.05;
            lastScrollY.current = currentScrollY;
            scrollYRef.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame((state) => {
        // Interactivity: Make particles react to the mouse cursor
        const mouseX = state.pointer.x * 20;
        const mouseY = state.pointer.y * 20;

        // Optional subtle camera movement or light follow based on mouse
        if (light.current) {
            light.current.position.set(mouseX, mouseY, 10);
        }

        // Camera scroll dive effect!
        const targetZ = 30 - (scrollYRef.current * 0.015);
        const targetY = -(scrollYRef.current * 0.01);
        const targetRotX = (scrollYRef.current * 0.0005);

        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, Math.max(5, targetZ), 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
        state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotX, 0.05);

        particles.forEach((particle, i) => {
            const { factor, speed, x, y } = particle;
            let { z } = particle;

            // Decay scroll velocity smoothly
            scrollVelocity.current *= 0.95;

            // Update time + apply scroll blast hyperspace effect!
            particle.time += (speed / 2) + Math.abs(scrollVelocity.current * 0.05);
            const time = particle.time;

            // Push particles towards camera (Z axis) on scroll
            particle.z += scrollVelocity.current * factor * 0.02;

            // Wrap particles around if they fly past camera or too far back
            if (particle.z > 50) particle.z = -50;
            if (particle.z < -50) particle.z = 50;

            z = particle.z;

            // Calculate dynamic positions swirling around based on noise (sine/cosine waves)
            const dynamicX = x + Math.cos(time) * factor;
            const dynamicY = y + Math.sin(time) * factor;
            const dynamicZ = z + Math.sin(time) * factor;

            // Make some particles react specifically to the mouse distance
            const distance = Math.sqrt(Math.pow(dynamicX - mouseX, 2) + Math.pow(dynamicY - mouseY, 2));
            const forceDropoff = Math.max(0, 15 - distance);

            // Push particles away from mouse
            const pushX = distance > 0 ? ((dynamicX - mouseX) / distance) * forceDropoff * 0.5 : 0;
            const pushY = distance > 0 ? ((dynamicY - mouseY) / distance) * forceDropoff * 0.5 : 0;

            dummy.position.set(
                dynamicX + pushX,
                dynamicY + pushY,
                dynamicZ
            );

            const scale = distance > 0 ? Math.max(0.1, 1 - distance / 20) : 1;
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });

        mesh.current!.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight ref={light} distance={40} intensity={8} color="#CC0000" />
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshPhysicalMaterial color="#CC0000" roughness={0.1} metalness={0.8} />
            </instancedMesh>
        </>
    );
}

export default function ParticleBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
                <color attach="background" args={["#000000"]} />
                <ambientLight intensity={0.2} />
                <Particles count={800} />
            </Canvas>
        </div>
    );
}
