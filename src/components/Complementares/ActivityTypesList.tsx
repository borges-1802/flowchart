import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ComplementaryActivity } from '../../domain/complementaryHours';
import { singularUnit } from '../../domain/complementaryHours';

interface ActivityTypesListProps {
  theme: 'dark' | 'light';
  activities: ComplementaryActivity[];
}

const COMPACT_UNIT: Record<string, string> = {
  meses: 'mês',
  eventos: 'evento',
  apresentações: 'apres.',
  etapas: 'etapa',
  premiações: 'premiação',
  dias: 'dia',
  semestres: 'sem.',
};

function compactRateLabel(activity: ComplementaryActivity): string {
  if (activity.id === 'curso_aperf') return `${activity.rate * 100}%/curso`;
  return `${activity.rate}h/${COMPACT_UNIT[activity.unit] ?? activity.unit}`;
}

export function ActivityTypesList({ theme, activities }: ActivityTypesListProps) {
  const isDark = theme === 'dark';
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const dividerClass = isDark ? 'divide-neutral-800' : 'divide-neutral-200';
  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const hoverClass = isDark ? 'hover:bg-white/5' : 'hover:bg-black/5';

  function toggle(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={`divide-y ${dividerClass}`}>
      {activities.map((activity) => {
        const isExpanded = expandedIds.has(activity.id);

        return (
          <div key={activity.id}>
            <button
              type="button"
              onClick={() => toggle(activity.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-3 text-left transition-colors ${hoverClass}`}
            >
              <span className="text-sm font-semibold">{activity.label}</span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className={`text-xs ${labelClass}`}>
                  {compactRateLabel(activity)} · máx {activity.max}h
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${labelClass} ${isExpanded ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {isExpanded && (
              <div className="px-2 pb-3">
                <p className={`text-xs ${labelClass}`}>
                  Duração mín. {activity.min} {activity.min === 1 ? singularUnit(activity.unit) : activity.unit}
                </p>
                <p className={`mt-0.5 text-xs italic ${labelClass}`}>Comprovante: {activity.doc}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}