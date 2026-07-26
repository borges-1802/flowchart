import type { CreditsSummary, CategorySummary } from '../domain/creditsSummary';

interface CreditsCounterProps {
  theme: 'dark' | 'light';
  summary: CreditsSummary;
}

function percentageOf(data: CategorySummary): number {
  if (data.total <= 0) return 0;
  return Math.min((data.completed / data.total) * 100, 100);
}

function ProgressRing({ percentage, size = 48 }: { percentage: number; size?: number }) {
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
      <circle cx={center} cy={center} r={radius} fill="none" strokeWidth="5" className="stroke-neutral-700/60" />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="stroke-green-500 transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
}

function ProgressBar({ data }: { data: CategorySummary }) {
  const pct = percentageOf(data);
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-700/40 md:w-20">
      <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function CreditsCounter({ theme, summary }: CreditsCounterProps) {
  const isDark = theme === 'dark';
  const cardClass = isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-100';
  const categoryLabelClass = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const dividerClass = isDark ? 'border-neutral-800' : 'border-neutral-300';

  const rows = [
    { label: 'Obrigatórias', data: summary.obrigatorias },
    { label: 'Eletivas', data: summary.condicionada },
    { label: 'Humanidades', data: summary.humanidades },
    { label: 'Livres', data: summary.livres },
  ];

  return (
    <div className={`w-full rounded-2xl border p-4 md:w-auto md:max-w-none md:rounded-none md:border-0 md:bg-transparent md:p-0 ${cardClass}`}>
      <div className="md:hidden" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-wide`}>
              Créditos totais
            </p>
            <p className="text-2xl font-bold">
              {summary.total.completed}
              <span className="text-base font-normal text-neutral-500">/{summary.total.total}</span>
            </p>
          </div>
          <ProgressRing percentage={percentageOf(summary.total)} />
        </div>

        <div className={`border-t pt-3 ${dividerClass}`}>
          {rows.map((row) => (
            <div key={row.label} className="mb-2.5 last:mb-0">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={categoryLabelClass}>{row.label}</span>
                <span className="font-medium">
                  {row.data.completed}/{row.data.total}
                </span>
              </div>
              <ProgressBar data={row.data} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden items-center gap-6 md:flex" onClick={(event) => event.stopPropagation()}>
        <p className="text-xs">Créditos:</p>

        {rows.map((row, index) => (
          <div key={row.label} className={index > 0 ? `border-l pl-6 ${dividerClass}` : ''}>
            <div className="mb-1.5 flex items-baseline gap-2 text-xs">
              <span className={categoryLabelClass}>{row.label}</span>
              <span className="font-medium">
                {row.data.completed}/{row.data.total}
              </span>
            </div>
            <ProgressBar data={row.data} />
          </div>
        ))}

        <div className={`flex items-center gap-3 border-l pl-6 ${dividerClass}`}>
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-wide ${categoryLabelClass}`}>Total</p>
            <p className="text-xl font-bold">
              {summary.total.completed}
              <span className="text-sm font-normal text-neutral-500">/{summary.total.total}</span>
            </p>
          </div>
          <ProgressRing percentage={percentageOf(summary.total)} />
        </div>
      </div>
    </div>
  );
}