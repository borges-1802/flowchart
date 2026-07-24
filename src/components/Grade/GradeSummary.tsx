interface GradeSummaryProps {
  theme: 'dark' | 'light';
  credits: number;
  hoursPerWeek: number;
  placedCount: number;
}

export function GradeSummary({ theme, credits, hoursPerWeek, placedCount }: GradeSummaryProps) {
  const isDark = theme === 'dark';
  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';

  return (
    <div className={`mt-4 grid grid-cols-3 gap-4 rounded-xl p-4 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
      <div>
        <p className={`text-xs uppercase tracking-wide ${labelClass}`}>Créditos na grade</p>
        <p className="text-xl font-bold">{credits}</p>
      </div>
      <div>
        <p className={`text-xs uppercase tracking-wide ${labelClass}`}>Horas/semana</p>
        <p className="text-xl font-bold">{hoursPerWeek}h</p>
      </div>
      <div>
        <p className={`text-xs uppercase tracking-wide ${labelClass}`}>Disciplinas encaixadas</p>
        <p className="text-xl font-bold">{placedCount}</p>
      </div>
    </div>
  );
}