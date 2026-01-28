"use client";

import React, { useEffect, useRef } from "react";

type HeartbeatPulseBackgroundProps = {
    className?: string;
    /** distance between dot centers in pixels */
    gap?: number;
    /** base radius of each dot in CSS px */
    radius?: number;
    /** base dot color */
    color?: string;
    /** glow color when pulsed */
    glowColor?: string;
    /** global opacity for the whole layer */
    opacity?: number;
    /** center X position (0-1, relative to container width) */
    centerX?: number;
    /** center Y position (0-1, relative to container height) */
    centerY?: number;
    /** duration for pulse to travel from center to edge (ms) */
    pulseDuration?: number;
    /** gap between pulses (ms) */
    pulseGap?: number;
};

/**
 * Canvas-based dotted background with Circular pulse animation.
 * Dots pulse outward from center in regular circular rings.
 */
export const HeartbeatPulseBackground = ({
    className,
    gap = 20,
    radius = 2,
    color = "rgba(255,255,255,0.15)",
    glowColor = "rgba(59, 130, 246, 0.7)",
    opacity = 0.8,
    centerX = 0.5,
    centerY = 0.4,
    pulseDuration = 2000,
    pulseGap = 2000,
}: HeartbeatPulseBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = canvasRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        const ctx = el.getContext("2d");
        if (!ctx) return;

        let raf = 0;
        let stopped = false;

        const dpr = Math.max(1, window.devicePixelRatio || 1);

        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            el.width = Math.max(1, Math.floor(width * dpr));
            el.height = Math.max(1, Math.floor(height * dpr));
            el.style.width = `${Math.floor(width)}px`;
            el.style.height = `${Math.floor(height)}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        // Standard Euclidean Distance (Circular)
        const getDistance = (x: number, y: number, cx: number, cy: number): number => {
            const dx = x - cx;
            const dy = y - cy;
            return Math.sqrt(dx * dx + dy * dy);
        };

        // Precompute dot positions in hexagonal grid (dots themselves stay in hex grid for density)
        let dots: { x: number; y: number; dist: number }[] = [];
        let maxDist = 0;

        const regenDots = () => {
            dots = [];
            maxDist = 0;
            const { width, height } = container.getBoundingClientRect();
            const cx = width * centerX;
            const cy = height * centerY;

            // Hexagonal grid spacing for dots (keeps the nice lattice look)
            const hGap = gap;
            const vGap = gap * Math.sqrt(3) / 2;

            const cols = Math.ceil(width / hGap) + 4;
            const rows = Math.ceil(height / vGap) + 4;

            for (let row = -5; row < rows + 5; row++) {
                for (let col = -5; col < cols + 5; col++) {
                    const xOffset = (Math.abs(row) % 2) * (hGap / 2);
                    const x = col * hGap + xOffset;
                    const y = row * vGap;

                    const dist = getDistance(x, y, cx, cy);
                    maxDist = Math.max(maxDist, dist);

                    dots.push({ x, y, dist });
                }
            }
        };

        regenDots();

        // Total cycle time
        const cycleTime = pulseDuration + pulseGap;
        let cycleStart = performance.now();

        const draw = (now: number) => {
            if (stopped) return;

            ctx.clearRect(0, 0, el.width, el.height);

            // Calculate current cycle time
            const elapsed = now - cycleStart;
            if (elapsed > cycleTime) {
                cycleStart = now - (elapsed % cycleTime);
            }
            const timeInCycle = (now - cycleStart) % cycleTime;

            // Current pulse ring
            const pulseProgress = timeInCycle < pulseDuration
                ? timeInCycle / pulseDuration
                : -1;

            const currentPulseRing = pulseProgress >= 0 ? pulseProgress * maxDist : -1;

            // Draw each dot
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];

                let pulseIntensity = 0;

                if (currentPulseRing >= 0) {
                    const distFromPulse = Math.abs(d.dist - currentPulseRing);
                    const pulseWidth = 100; // Wide smooth ripple

                    if (distFromPulse < pulseWidth) {
                        pulseIntensity = 1 - (distFromPulse / pulseWidth);
                        pulseIntensity = pulseIntensity * pulseIntensity; // Quadratic ease out
                    }
                }

                const baseAlpha = 0.15;
                const pulseAlpha = baseAlpha + pulseIntensity * 0.4;
                const pulseScale = 1 + pulseIntensity * 0.6;
                const dotRadius = radius * pulseScale;

                if (pulseIntensity > 0.1) {
                    ctx.shadowColor = glowColor;
                    ctx.shadowBlur = 6 * pulseIntensity;
                } else {
                    ctx.shadowColor = "transparent";
                    ctx.shadowBlur = 0;
                }

                ctx.globalAlpha = pulseAlpha * opacity;
                ctx.fillStyle = pulseIntensity > 0.1 ? glowColor : color;

                ctx.beginPath();
                ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            resize();
            regenDots();
        };

        window.addEventListener("resize", handleResize);
        raf = requestAnimationFrame(draw);

        return () => {
            stopped = true;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", handleResize);
            ro.disconnect();
        };
    }, [gap, radius, color, glowColor, opacity, centerX, centerY, pulseDuration, pulseGap]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ position: "absolute", inset: 0 }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: "block", width: "100%", height: "100%" }}
            />
        </div>
    );
};
