import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { DisciplineListItem } from './DisciplineListItem';

interface DisciplineListProps {
  theme: 'dark' | 'light';
  options: DisciplineOption[];
  periods: number[];
  hasElectives: boolean;
  hasPpgi: boolean;
  selectedPeriod: number | 'all' | 'eletiva' | 'ppgi';
  onPeriodChange: (period: number | 'all' | 'eletiva' | 'ppgi') => void;
  armedId: string | null;
  placedIds: Set<string>;
  colorAssignments: Record<string, number>;
  onItemClick: (option: DisciplineOption) => void;
  onRemove: (optionId: string) => void;
}

export function DisciplineList({
  theme,
  options,
  periods,
  hasElectives,
  hasPpgi,
  selectedPeriod,
  onPeriodChange,
  armedId,
  placedIds,
  colorAssignments,
  onItemClick,
  onRemove,
}: DisciplineListProps) {
  const isDark = theme === 'dark';
  const filteredOptions =
    selectedPeriod === 'all'
      ? options
      : selectedPeriod === 'eletiva'
        ? options.filter((option) => option.period === 0)
        : selectedPeriod === 'ppgi'
          ? options.filter((option) => option.period === -1)
          : options.filter((option) => option.period === selectedPeriod);

  return (
    <div className="flex h-full flex-col">
      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
        Disciplinas
      </p>

      <select
        value={selectedPeriod}
        onChange={(event) => {
          const value = event.target.value;
          onPeriodChange(value === 'all' || value === 'eletiva' || value === 'ppgi' ? value : Number(value));
        }}
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
        {hasElectives && <option value="eletiva">Eletivas</option>}
        {hasPpgi && <option value="ppgi">PPGI</option>}
      </select>

      <div className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto">
        {filteredOptions.map((option) => (
          <DisciplineListItem
            key={option.id}
            theme={theme}
            option={option}
            isArmed={armedId === option.id}
            isPlaced={placedIds.has(option.id)}
            colorIndex={colorAssignments[option.subjectId]}
            onClick={() => onItemClick(option)}
            onRemove={() => onRemove(option.id)}
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