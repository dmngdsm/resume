const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_";

export function scrambleText(from: string, to: string, progress: number) {
  if (progress >= 1) return to;
  const length = Math.round(from.length + (to.length - from.length) * progress);
  const settled = Math.floor(to.length * progress);
  return Array.from({ length }, (_, index) => {
    if (index < settled) return to[index];
    if (to[index] === " ") return " ";
    return glyphs[Math.floor(Math.random() * glyphs.length)];
  }).join("");
}
