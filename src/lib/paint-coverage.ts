export type PaintStamp = { x: number; y: number; radius: number; born: number; soft?: boolean; opacity?: number };

// Match the brush gradient and source-over blending without reading canvas
// pixels back from the GPU on every animation frame.
export function paintCoverage(x: number, y: number, stamps: PaintStamp[], now: number, lifetime: number) {
  let transparent = 1;
  for (const stamp of stamps) {
    const age = (now - stamp.born) / lifetime;
    if (age < 0 || age >= 1) continue;
    const distance = Math.hypot(x - stamp.x, y - stamp.y) / stamp.radius;
    if (distance >= 1) continue;
    const brushAlpha = stamp.soft
      ? (distance <= 0.4 ? 0.75 - (distance / 0.4) * 0.45 : 0.3 * (1 - distance) / 0.6)
      : (distance <= 0.55 ? 0.95 - (distance / 0.55) * 0.1 : 0.85 * (1 - distance) / 0.45);
    transparent *= 1 - brushAlpha * (stamp.opacity ?? 1) * Math.pow(1 - age, 3);
  }
  return 1 - transparent;
}
