"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function PolygonBackdrop({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const points: Point[] = [];
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points.length = 0;

      const count = coarsePointer ? 22 : 38;
      for (let index = 0; index < count; index += 1) {
        points.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.28
        });
      }
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = "rgba(5, 7, 13, 0.5)";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);

      points.forEach((point) => {
        if (!reducedMotion) {
          point.x += point.vx;
          point.y += point.vy;
        }

        if (point.x < -40 || point.x > window.innerWidth + 40) point.vx *= -1;
        if (point.y < -40 || point.y > window.innerHeight + 40) point.vy *= -1;
      });

      for (let index = 0; index < points.length; index += 1) {
        const origin = points[index];
        for (let next = index + 1; next < points.length; next += 1) {
          const target = points[next];
          const dx = origin.x - target.x;
          const dy = origin.y - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 190) {
            const alpha = (1 - distance / 190) * 0.22;
            context.strokeStyle = `rgba(114, 244, 255, ${alpha})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(origin.x, origin.y);
            context.lineTo(target.x, target.y);
            context.stroke();
          }
        }
      }

      points.forEach((point, index) => {
        const pulse = reducedMotion ? 1 : 1 + Math.sin(frame * 0.015 + index) * 0.28;
        const gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, 32 * pulse);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.28)");
        gradient.addColorStop(0.42, "rgba(255, 108, 207, 0.12)");
        gradient.addColorStop(1, "rgba(114, 244, 255, 0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(point.x, point.y, 32 * pulse, 0, Math.PI * 2);
        context.fill();
      });

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas ref={canvasRef} className={`polygon-backdrop ${active ? "active" : ""}`} aria-hidden="true" />;
}
