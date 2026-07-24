const PALETTE = [
  { dot: 'bg-red-500', cell: 'bg-red-500/20 ring-red-500 text-red-300', preview: 'border-red-500 bg-red-500/10' },
  {
    dot: 'bg-orange-500',
    cell: 'bg-orange-500/20 ring-orange-500 text-orange-300',
    preview: 'border-orange-500 bg-orange-500/10',
  },
  {
    dot: 'bg-amber-500',
    cell: 'bg-amber-500/20 ring-amber-500 text-amber-300',
    preview: 'border-amber-500 bg-amber-500/10',
  },
  {
    dot: 'bg-lime-500',
    cell: 'bg-lime-500/20 ring-lime-500 text-lime-300',
    preview: 'border-lime-500 bg-lime-500/10',
  },
  {
    dot: 'bg-emerald-500',
    cell: 'bg-emerald-500/20 ring-emerald-500 text-emerald-300',
    preview: 'border-emerald-500 bg-emerald-500/10',
  },
  {
    dot: 'bg-cyan-500',
    cell: 'bg-cyan-500/20 ring-cyan-500 text-cyan-300',
    preview: 'border-cyan-500 bg-cyan-500/10',
  },
  {
    dot: 'bg-sky-500',
    cell: 'bg-sky-500/20 ring-sky-500 text-sky-300',
    preview: 'border-sky-500 bg-sky-500/10',
  },
  {
    dot: 'bg-violet-500',
    cell: 'bg-violet-500/20 ring-violet-500 text-violet-300',
    preview: 'border-violet-500 bg-violet-500/10',
  },
  {
    dot: 'bg-fuchsia-500',
    cell: 'bg-fuchsia-500/20 ring-fuchsia-500 text-fuchsia-300',
    preview: 'border-fuchsia-500 bg-fuchsia-500/10',
  },
  {
    dot: 'bg-rose-500',
    cell: 'bg-rose-500/20 ring-rose-500 text-rose-300',
    preview: 'border-rose-500 bg-rose-500/10',
  },
];

export function getSubjectColor(subjectId: string) {
  let hash = 0;
  for (let i = 0; i < subjectId.length; i++) {
    hash = (hash * 31 + subjectId.charCodeAt(i)) % PALETTE.length;
  }
  return PALETTE[hash];
}