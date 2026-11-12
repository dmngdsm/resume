"use client";

import { useEffect, useRef, useState } from "react";
import { scrambleText } from "../../lib/scramble-text";

const name = "Ivan Manchev";
const interests = "Web3, AI, Creative direction";
const scrambleDuration = 650;
const revealInterval = 7_000;
const holdDuration = 1_500;

export function ScrambleHeading() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [display, setDisplay] = useState(name);
  const current = useRef(name);
  const nextRevealAt = useRef<number | null>(null);
  const active = hovered || focused || rotated;

  useEffect(() => {
    if (hovered || focused) {
      nextRevealAt.current = null;
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      if (document.hidden) {
        nextRevealAt.current = null;
        return;
      }
      const now = performance.now();
      nextRevealAt.current ??= now + revealInterval;
      const animationTime = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : scrambleDuration;
      const delay = rotated ? animationTime + holdDuration : Math.max(0, nextRevealAt.current - now);
      timer = setTimeout(() => {
        if (!rotated) nextRevealAt.current = performance.now() + revealInterval;
        setRotated(!rotated);
      }, delay);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [hovered, focused, rotated]);

  useEffect(() => {
    const target = active ? interests : name;
    const from = current.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = (value: string) => {
      current.current = value;
      setDisplay(value);
    };
    const settle = () => {
      cancelAnimationFrame(frame);
      update(target);
    };
    if (reduced.matches || from === target) {
      settle();
    } else {
      const start = performance.now();
      let lastTick = -1;
      const animate = (now: number) => {
        const elapsed = now - start;
        const tick = Math.floor(elapsed / 36);
        if (tick !== lastTick) {
          lastTick = tick;
          update(scrambleText(from, target, Math.min(1, elapsed / scrambleDuration)));
        }
        if (elapsed < scrambleDuration) frame = requestAnimationFrame(animate);
        else update(target);
      };
      frame = requestAnimationFrame(animate);
    }
    reduced.addEventListener("change", settle);
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", settle);
    };
  }, [active]);

  return (
    <h1>
      <button
        type="button"
        className="scramble-heading"
        aria-label="Ivan Manchev — Web3, AI, Creative direction"
        aria-pressed={active}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setFocused(true); }}
        onBlur={() => setFocused(false)}
        onClick={() => {
          if (window.matchMedia("(hover: none)").matches) {
            nextRevealAt.current = performance.now() + revealInterval;
            setRotated((value) => !value);
          }
        }}
      >
        <span className="scramble-size" aria-hidden="true">{interests}</span>
        <span className="scramble-label" data-paint-text="" aria-hidden="true">{display}</span>
      </button>
    </h1>
  );
}
