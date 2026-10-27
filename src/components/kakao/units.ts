/** Converts a spec length (pt/dp) to CSS relative to the phone screen width (--u). */
export function u(n: number): string {
  return `calc(var(--u) * ${Math.round(n * 1000) / 1000})`;
}

function superellipsePath(n: number, steps = 96): string {
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
    const y = Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
    pts.push(`${(0.5 + x * 0.5).toFixed(4)},${(0.5 + y * 0.5).toFixed(4)}`);
  }
  return `M${pts.join("L")}Z`;
}

// Kakao profile images are squircles rather than circles.
export const SQUIRCLE_PATH = superellipsePath(3.3);
