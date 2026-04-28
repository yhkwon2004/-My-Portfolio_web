"use client";

import { useEffect, useRef, useState } from "react";

type Spark = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  age: number;
};

export function CursorFollower() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(finePointer && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const canvas = canvasRef.current;
    const core = coreRef.current;
    const halo = haloRef.current;
    const aura = auraRef.current;
    if (!canvas || !core || !halo || !aura) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let raf = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let haloX = mouseX;
    let haloY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;
    let isMagnetic = false;
    const sparks: Spark[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      const target = event.target as HTMLElement | null;
      isMagnetic = Boolean(target?.closest("button, a, .magnetic, [data-cursor='magnetic']"));
    };

    const onPointerDown = () => {
      window.requestAnimationFrame(() => {
        for (let i = 0; i < 10; i += 1) {
          const angle = (Math.PI * 2 * i) / 10;
          sparks.push({
            x: mouseX,
            y: mouseY,
            dx: Math.cos(angle) * (1.2 + (i % 3) * 0.35),
            dy: Math.sin(angle) * (1.2 + (i % 3) * 0.35),
            age: 0
          });
        }
        halo.classList.add("cursor-pulse");
        window.setTimeout(() => halo.classList.remove("cursor-pulse"), 320);
      });
    };

    const drawSparks = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i];
        spark.age += 1;
        spark.x += spark.dx;
        spark.y += spark.dy;
        const alpha = Math.max(0, 0.72 - spark.age * 0.04);
        const radius = Math.max(0, 2.4 - spark.age * 0.08);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.shadowBlur = 16;
        ctx.shadowColor = "rgba(114,244,255,0.72)";
        ctx.arc(spark.x, spark.y, radius, 0, Math.PI * 2);
        ctx.fill();
        if (spark.age > 20) {
          sparks.splice(i, 1);
        }
      }
    };

    const frame = () => {
      haloX += (mouseX - haloX) * 0.14;
      haloY += (mouseY - haloY) * 0.14;
      auraX += (mouseX - auraX) * 0.055;
      auraY += (mouseY - auraY) * 0.055;

      core.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%) scale(${isMagnetic ? 1.38 : 1})`;
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%) scale(${isMagnetic ? 1.18 : 1})`;
      halo.dataset.magnetic = String(isMagnetic);
      aura.dataset.magnetic = String(isMagnetic);

      drawSparks();
      raf = window.requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [enabled]);

  if (!enabled) {
    return <div className="static-glow" aria-hidden="true" />;
  }

  return (
    <>
      <canvas ref={canvasRef} className="cursor-sparks" aria-hidden="true" />
      <div ref={auraRef} className="cursor-aura" aria-hidden="true" />
      <div ref={haloRef} className="cursor-halo" aria-hidden="true" />
      <div ref={coreRef} className="cursor-core" aria-hidden="true" />
    </>
  );
}
