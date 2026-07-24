interface GradeSummaryProps {
  credits: number;
  hoursPerWeek: number;
  placedCount: number;
}

export function GradeSummary({ credits, hoursPerWeek, placedCount }: GradeSummaryProps) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-neutral-900 p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-500">Créditos na grade</p>
        <p className="text-xl font-bold">{credits}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-500">Horas/semana</p>
        <p className="text-xl font-bold">{hoursPerWeek}h</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-500">Disciplinas encaixadas</p>
        <p className="text-xl font-bold">{placedCount}</p>
      </div>
    </div>
  );
}