interface ColorSet {
  base: string;
  text: string;
  ring: string;
  previewDark: string;
  previewLight: string;
}

const PALETTE: ColorSet[] = [
  {
    base: 'bg-red-700',
    text: 'text-white',
    ring: 'ring-red-700',
    previewDark: 'border-red-700 bg-red-700/10',
    previewLight: 'border-red-700 bg-red-200',
  },
  {
    base: 'bg-orange-500',
    text: 'text-black',
    ring: 'ring-orange-500',
    previewDark: 'border-orange-500 bg-orange-500/10',
    previewLight: 'border-orange-500 bg-orange-200',
  },
  {
    base: 'bg-amber-500',
    text: 'text-black',
    ring: 'ring-amber-500',
    previewDark: 'border-amber-500 bg-amber-500/10',
    previewLight: 'border-amber-500 bg-amber-200',
  },
  {
    base: 'bg-lime-500',
    text: 'text-black',
    ring: 'ring-lime-500',
    previewDark: 'border-lime-500 bg-lime-500/10',
    previewLight: 'border-lime-500 bg-lime-200',
  },
  {
    base: 'bg-emerald-500',
    text: 'text-black',
    ring: 'ring-emerald-500',
    previewDark: 'border-emerald-500 bg-emerald-500/10',
    previewLight: 'border-emerald-500 bg-emerald-200',
  },
  {
    base: 'bg-cyan-500',
    text: 'text-black',
    ring: 'ring-cyan-500',
    previewDark: 'border-cyan-500 bg-cyan-500/10',
    previewLight: 'border-cyan-500 bg-cyan-200',
  },
  {
    base: 'bg-sky-500',
    text: 'text-black',
    ring: 'ring-sky-500',
    previewDark: 'border-sky-500 bg-sky-500/10',
    previewLight: 'border-sky-500 bg-sky-200',
  },
  {
    base: 'bg-violet-500',
    text: 'text-white',
    ring: 'ring-violet-500',
    previewDark: 'border-violet-500 bg-violet-500/10',
    previewLight: 'border-violet-500 bg-violet-200',
  },
  {
    base: 'bg-fuchsia-500',
    text: 'text-white',
    ring: 'ring-fuchsia-500',
    previewDark: 'border-fuchsia-500 bg-fuchsia-500/10',
    previewLight: 'border-fuchsia-500 bg-fuchsia-200',
  },
  {
    base: 'bg-indigo-500',
    text: 'text-white',
    ring: 'ring-indigo-500',
    previewDark: 'border-indigo-500 bg-indigo-500/10',
    previewLight: 'border-indigo-500 bg-indigo-200',
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