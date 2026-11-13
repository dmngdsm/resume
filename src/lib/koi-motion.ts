import type { PaintStamp } from "./paint-coverage";

function position(time: number, phase: number, width: number, height: number, size: number) {
  const margin = Math.min(width * 0.2, 130 * size);
  const nx = 0.5 + 0.32 * Math.sin(time * 0.14 + phase) + 0.08 * Math.sin(time * 0.27 + phase * 1.3);
  const ny = 0.5 + 0.3 * Math.sin(time * 0.19 + phase + 1.1) + 0.07 * Math.cos(time * 0.11 + phase);
  return {
    x: margin + nx * (width - margin * 2),
    y: margin + ny * Math.max(1, height - margin * 2),
  };
}

// Fuller bodies and a short, diffuse tail fan suggest fish without outlining
// fins. Overlapping translucent washes keep the silhouettes indistinct.
export function koiPaintStamps(now: number, elapsed: number, width: number, height: number): PaintStamp[] {
  const stamps: PaintStamp[] = [];
  const time = elapsed / 1000;
  const size = Math.min(1.25, Math.max(0.58, Math.min(width, height) / 720));
  for (let fish = 0; fish < 2; fish++) {
    const phase = fish * Math.PI;
    const head = position(time, phase, width, height, size);
    const next = position(time + 0.08, phase, width, height, size);
    const angle = Math.atan2(next.y - head.y, next.x - head.x);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const wave = (u: number) => Math.sin(time * 2.6 - u * 6.5 + phase) * 19 * size * u * u;
    const add = (x: number, y: number, radius: number, opacity: number) => {
      stamps.push({
        x: head.x + x * cos - y * sin,
        y: head.y + x * sin + y * cos,
        radius,
        born: now,
        soft: true,
        opacity,
      });
    };
    const length = 145 * size;
    for (let i = 0; i <= 32; i++) {
      const u = i / 32;
      const radius = (14 + 31 * Math.exp(-Math.pow((u - 0.28) / 0.42, 2))) * size;
      add(-length * u, wave(u), radius, 0.3 * (1 - u * 0.35));
    }
    // A compact, broad wash at the rear avoids a long filament-like tail.
    // The two lobes merge softly into the body rather than forming crisp fins.
    for (const side of [-1, 1]) {
      for (let i = 0; i <= 12; i++) {
        const u = i / 12;
        const along = 0.72 + u * 0.35;
        const spread = (18 + 3 * Math.sin(time * 2.6 + phase)) * size;
        add(-length * along, wave(along) + side * spread * u,
          (11 + 9 * Math.sin(Math.PI * u)) * size, 0.16 * (1 - u * 0.3));
      }
    }
  }
  return stamps;
}
