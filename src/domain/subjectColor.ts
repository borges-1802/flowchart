interface ColorSet {
  base: string;
  text: string;
  previewDark: string;
  previewLight: string;
}

const PALETTE: ColorSet[] = [
  {
    base: 'bg-red-500',
    text: 'text-white',
    previewDark: 'border-red-500 bg-red-500/10',
    previewLight: 'border-red-500 bg-red-100',
  },
  {
    base: 'bg-orange-500',
    text: 'text-black',
    previewDark: 'border-orange-500 bg-orange-500/10',
    previewLight: 'border-orange-500 bg-orange-100',
  },
  {
    base: 'bg-amber-500',
    text: 'text-black',
    previewDark: 'border-amber-500 bg-amber-500/10',
    previewLight: 'border-amber-500 bg-amber-100',
  },
  {
    base: 'bg-lime-500',
    text: 'text-black',
    previewDark: 'border-lime-500 bg-lime-500/10',
    previewLight: 'border-lime-500 bg-lime-100',
  },
  {
    base: 'bg-emerald-500',
    text: 'text-white',
    previewDark: 'border-emerald-500 bg-emerald-500/10',
    previewLight: 'border-emerald-500 bg-emerald-100',
  },
  {
    base: 'bg-cyan-500',
    text: 'text-black',
    previewDark: 'border-cyan-500 bg-cyan-500/10',
    previewLight: 'border-cyan-500 bg-cyan-100',
  },
  {
    base: 'bg-sky-500',
    text: 'text-white',
    previewDark: 'border-sky-500 bg-sky-500/10',
    previewLight: 'border-sky-500 bg-sky-100',
  },
  {
    base: 'bg-violet-500',
    text: 'text-white',
    previewDark: 'border-violet-500 bg-violet-500/10',
    previewLight: 'border-violet-500 bg-violet-100',
  },
  {
    base: 'bg-fuchsia-500',
    text: 'text-white',
    previewDark: 'border-fuchsia-500 bg-fuchsia-500/10',
    previewLight: 'border-fuchsia-500 bg-fuchsia-100',
  },
  {
    base: 'bg-rose-500',
    text: 'text-white',
    previewDark: 'border-rose-500 bg-rose-500/10',
    previewLight: 'border-rose-500 bg-rose-100',
  },
];

export function pickRandomColorIndex(usedIndices: number[]): number {
  const available = PALETTE.map((_, index) => index).filter((index) => !usedIndices.includes(index));
  const pool = available.length > 0 ? available : PALETTE.map((_, index) => index);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getColorByIndex(index: number): ColorSet {
  return PALETTE[index];
}

export const NEUTRAL_DOT = 'bg-neutral-500';