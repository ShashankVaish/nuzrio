export function waveformBars(seed: string, count = 40): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bars.push(0.25 + (h % 100) / 100 * 0.75);
  }
  return bars;
}

export function formatDuration(sec: number): string {
  const m = Math.floor(Math.abs(sec) / 60);
  const s = Math.floor(Math.abs(sec) % 60);
  const sign = sec < 0 ? "-" : "";
  return `${sign}${m}:${s.toString().padStart(2, "0")}`;
}
