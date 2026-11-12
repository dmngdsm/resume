"use client";

import { useEffect, useRef } from "react";
import { paintCoverage, type PaintStamp } from "../../lib/paint-coverage";

export function CursorPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const enabled = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let previous: { x: number; y: number } | null = null;
    let lastMove = 0;
    let stamps: PaintStamp[] = [];
    const textTargets = Array.from(canvas.parentElement?.querySelectorAll<HTMLElement>("[data-paint-text], a") ?? []);
    const lifetime = 700;
    const brushCanvas = document.createElement("canvas");
    brushCanvas.width = brushCanvas.height = 128;
    const brushContext = brushCanvas.getContext("2d");
    if (!brushContext) return;
    const brush = brushContext.createRadialGradient(64, 64, 0, 64, 64, 64);
    brush.addColorStop(0, "rgba(43,71,242,0.95)");
    brush.addColorStop(0.55, "rgba(43,71,242,0.85)");
    brush.addColorStop(1, "rgba(43,71,242,0)");
    brushContext.fillStyle = brush;
    brushContext.fillRect(0, 0, 128, 128);
    // A reusable, stationary grain tile avoids flicker and per-frame pixel work.
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = grainCanvas.height = 256;
    const grainContext = grainCanvas.getContext("2d");
    let grain: CanvasPattern | null = null;
    if (grainContext) {
      const pixels = grainContext.createImageData(256, 256);
      for (let i = 0; i < pixels.data.length; i += 4) {
        // Keep the grain saturated so it adds texture without graying the blue.
        const highlight = Math.random() < 0.5;
        pixels.data[i] = highlight ? 78 : 22;
        pixels.data[i + 1] = highlight ? 105 : 40;
        pixels.data[i + 2] = highlight ? 255 : 200;
        pixels.data[i + 3] = Math.round(20 + Math.random() * 55);
      }
      grainContext.putImageData(pixels, 0, 0);
      grain = ctx.createPattern(grainCanvas, "repeat");
    }
    let width = 0;
    let height = 0;

    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = null;
      stamps = [];
      ctx.clearRect(0, 0, width, height);
      textTargets.forEach((target) => target.removeAttribute("data-painted"));
    };

    const resize = () => {
      clear();
      // One pixel per CSS pixel keeps the grain fine without a retina buffer.
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    };

    const fade = (now: number) => {
      // Redraw from age-based samples instead of repeatedly erasing an 8-bit
      // canvas: low-alpha pixels otherwise stop fading and leave a ghost edge.
      ctx.clearRect(0, 0, width, height);
      stamps = stamps.filter((stamp) => now - stamp.born < lifetime);
      for (const stamp of stamps) {
        const age = (now - stamp.born) / lifetime;
        ctx.globalAlpha = Math.pow(1 - age, 3);
        ctx.drawImage(brushCanvas, stamp.x - stamp.radius, stamp.y - stamp.radius, stamp.radius * 2, stamp.radius * 2);
      }
      ctx.globalAlpha = 1;
      for (const target of textTargets) {
        const smallText = !target.closest(".intro");
        const threshold = smallText
          ? (target.hasAttribute("data-painted") ? 0.88 : 0.94)
          : (target.hasAttribute("data-painted") ? 0.68 : 0.78);
        // Track each word independently; inline links may also wrap across lines.
        const covered = Array.from(target.getClientRects()).some((rect) =>
          paintCoverage(rect.left + rect.width / 2, rect.top + rect.height / 2, stamps, now, lifetime)
            >= threshold
        );
        target.toggleAttribute("data-painted", covered);
      }
      if (grain && stamps.length) {
        // Source-atop preserves the trail's alpha, including its soft edges.
        // Transparent areas remain transparent, and the grain fades with paint.
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = grain;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      }
      if (stamps.length) {
        frame = requestAnimationFrame(fade);
      } else {
        clear();
      }
    };

    const paint = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType !== "mouse" || document.hidden) return;
      const now = performance.now();
      const point = { x: event.clientX, y: event.clientY };
      const start = now - lastMove < 150 && previous ? previous : point;
      const distance = Math.hypot(point.x - start.x, point.y - start.y);
      const radius = (Math.min(150, Math.max(65, width * 0.08)) + Math.min(25, distance * 0.2)) * 0.8;
      const steps = Math.max(1, Math.min(80, Math.ceil(distance / 8)));
      ctx.globalCompositeOperation = "source-over";
      for (let i = 1; i <= steps; i++) {
        const x = start.x + (point.x - start.x) * i / steps;
        const y = start.y + (point.y - start.y) * i / steps;
        stamps.push({ x, y, radius, born: now });
      }
      // Bound drawing work during rapid input bursts.
      if (stamps.length > 900) stamps = stamps.slice(-900);
      previous = point;
      lastMove = now;
      if (!frame) {
        frame = requestAnimationFrame(fade);
      }
    };

    const leave = () => { previous = null; };
    resize();
    window.addEventListener("pointermove", paint, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", clear);
    window.addEventListener("scroll", clear, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", clear);
    enabled.addEventListener("change", clear);
    return () => {
      clear();
      window.removeEventListener("pointermove", paint);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", clear);
      window.removeEventListener("scroll", clear);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", clear);
      enabled.removeEventListener("change", clear);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-paint" aria-hidden="true" />;
}
