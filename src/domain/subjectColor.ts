interface ColorSet {
  dot: string;
  cellDark: string;
  cellLight: string;
  previewDark: string;
  previewLight: string;
}

const PALETTE: ColorSet[] = [
  {
    dot: 'bg-red-500',
    cellDark: 'bg-red-500/20 ring-red-500 text-red-300',
    cellLight: 'bg-red-100 ring-red-400 text-red-800',
    previewDark: 'border-red-500 bg-red-500/10',
    previewLight: 'border-red-500 bg-red-100',
  },
  {
    dot: 'bg-orange-500',
    cellDark: 'bg-orange-500/20 ring-orange-500 text-orange-300',
    cellLight: 'bg-orange-100 ring-orange-400 text-orange-800',
    previewDark: 'border-orange-500 bg-orange-500/10',
    previewLight: 'border-orange-500 bg-orange-100',
  },
  {
    dot: 'bg-amber-500',
    cellDark: 'bg-amber-500/20 ring-amber-500 text-amber-300',
    cellLight: 'bg-amber-100 ring-amber-400 text-amber-800',
    previewDark: 'border-amber-500 bg-amber-500/10',
    previewLight: 'border-amber-500 bg-amber-100',
  },
  {
    dot: 'bg-lime-500',
    cellDark: 'bg-lime-500/20 ring-lime-500 text-lime-300',
    cellLight: 'bg-lime-100 ring-lime-400 text-lime-800',
    previewDark: 'border-lime-500 bg-lime-500/10',
    previewLight: 'border-lime-500 bg-lime-100',
  },
  {
    dot: 'bg-emerald-500',
    cellDark: 'bg-emerald-500/20 ring-emerald-500 text-emerald-300',
    cellLight: 'bg-emerald-100 ring-emerald-400 text-emerald-800',
    previewDark: 'border-emerald-500 bg-emerald-500/10',
    previewLight: 'border-emerald-500 bg-emerald-100',
  },
  {
    dot: 'bg-cyan-500',
    cellDark: 'bg-cyan-500/20 ring-cyan-500 text-cyan-300',
    cellLight: 'bg-cyan-100 ring-cyan-400 text-cyan-800',
    previewDark: 'border-cyan-500 bg-cyan-500/10',
    previewLight: 'border-cyan-500 bg-cyan-100',
  },
  {
    dot: 'bg-sky-500',
    cellDark: 'bg-sky-500/20 ring-sky-500 text-sky-300',
    cellLight: 'bg-sky-100 ring-sky-400 text-sky-800',
    previewDark: 'border-sky-500 bg-sky-500/10',
    previewLight: 'border-sky-500 bg-sky-100',
  },
  {
    dot: 'bg-violet-500',
    cellDark: 'bg-violet-500/20 ring-violet-500 text-violet-300',
    cellLight: 'bg-violet-100 ring-violet-400 text-violet-800',
    previewDark: 'border-violet-500 bg-violet-500/10',
    previewLight: 'border-violet-500 bg-violet-100',
  },
  {
    dot: 'bg-fuchsia-500',
    cellDark: 'bg-fuchsia-500/20 ring-fuchsia-500 text-fuchsia-300',
    cellLight: 'bg-fuchsia-100 ring-fuchsia-400 text-fuchsia-800',
    previewDark: 'border-fuchsia-500 bg-fuchsia-500/10',
    previewLight: 'border-fuchsia-500 bg-fuchsia-100',
  },
  {
    dot: 'bg-rose-500',
    cellDark: 'bg-rose-500/20 ring-rose-500 text-rose-300',
    cellLight: 'bg-rose-100 ring-rose-400 text-rose-800',
    previewDark: 'border-rose-500 bg-rose-500/10',
    previewLight: 'border-rose-500 bg-rose-100',
  },
];

export function getSubjectColor(subjectId: string): ColorSet {
  let hash = 0;
  for (let i = 0; i < subjectId.length; i++) {
    hash = (hash * 31 + subjectId.charCodeAt(i)) % PALETTE.length;
  }
  return PALETTE[hash];
}