import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { DisciplineListItem } from './DisciplineListItem';

interface DisciplineListProps {
  theme: 'dark' | 'light';
  options: DisciplineOption[];
  periods: number[];
  selectedPeriod: number | 'all';
  onPeriodChange: (period: number | 'all') => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DisciplineList({
  theme,
  options,
  periods,
  selectedPeriod,
  onPeriodChange,
  selectedId,
  onSelect,
}: DisciplineListProps) {
  const isDark = theme === 'dark';
  const filteredOptions =
    selectedPeriod === 'all' ? options : options.filter((option) => option.period === selectedPeriod);

  return (
    <div className="flex h-full flex-col">
      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
        Disciplinas
      </p>

      <select
        value={selectedPeriod}
        onChange={(event) =>
          onPeriodChange(event.target.value === 'all' ? 'all' : Number(event.target.value))
        }
        className={`mb-3 rounded-lg border px-3 py-2 text-sm ${
          isDark ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-neutral-900'
        }`}
      >
        <option value="all">Todos os períodos</option>
        {periods.map((period) => (
          <option key={period} value={period}>
            {period}º período
          </option>
        ))}
      </select>

      <div className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto">
        {filteredOptions.map((option) => (
          <DisciplineListItem
            key={option.id}
            theme={theme}
            option={option}
            isSelected={selectedId === option.id}
            onClick={() => onSelect(option.id)}
          />
        ))}
        {filteredOptions.length === 0 && (
          <p className={`px-3 py-4 text-center text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Nenhuma disciplina nesse período.
          </p>
        )}
      </div>
    </div>
  );
}