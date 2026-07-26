interface LegendProps {
  theme: 'dark' | 'light';
}

const items = [
  { color: 'bg-red-400', label: 'Ainda não feita' },
  { color: 'bg-green-500', label: 'Já feita' },
  { color: 'bg-neutral-500', label: 'Falta requisito' },
  { color: 'bg-blue-500', label: 'Pré-requisito' },
  { color: 'bg-purple-500', label: 'Tranca' }
];

export function Legend({ theme }: LegendProps) {
  const textClass = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        <p>Legenda:</p>
      {items.map((item) => (
        <span key={item.label} className={`flex items-center gap-1.5 ${textClass}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}