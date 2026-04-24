"use client";

import { useEffect, useRef, useState } from "react";
import { Application } from "@splinetool/runtime";

type Props = {
  onEnter: () => void;
};

const localScene = "/assets/spline/scene.splinecode";
const remoteScene = "https://prod.spline.design/zyrqM7maVfJjfUWE/scene.splinecode";

export function SplineEntrance({ onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    let cancelled = false;

    if (!canvas) return;

    const app = new Application(canvas);
    appRef.current = app;

    app
      .load(localScene)
      .catch(() => app.load(remoteScene))
      .then(() => {
        if (cancelled) app.dispose?.();
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      appRef.current?.dispose?.();
      appRef.current = null;
    };
  }, []);

  return (
    <div className={`spline-entrance ${failed ? "failed" : ""}`}>
      <canvas ref={canvasRef} id="canvas3d" aria-hidden="true" />
      <button className="spline-touch-layer" type="button" onClick={onEnter} aria-label="포트폴리오 진입" />
      <button className="spline-enter-zone magnetic" type="button" onClick={onEnter} aria-label="포트폴리오 진입">
        <span>KWON YONGHYUN</span>
        <strong>Touch to enter</strong>
      </button>
    </div>
  );
}
