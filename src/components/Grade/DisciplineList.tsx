import { useState } from 'react';
import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { DisciplineListItem } from './DisciplineListItem';

export type PeriodFilter = number | 'all' | 'eletiva' | 'ppgi-mestrado' | 'ppgi-doutorado';

interface DisciplineListProps {
  theme: 'dark' | 'light';
  options: DisciplineOption[];
  periods: number[];
  hasElectives: boolean;
  hasPpgiMestrado: boolean;
  hasPpgiDoutorado: boolean;
  selectedPeriod: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
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
  hasPpgiMestrado,
  hasPpgiDoutorado,
  selectedPeriod,
  onPeriodChange,
  armedId,
  placedIds,
  colorAssignments,
  onItemClick,
  onRemove,
}: DisciplineListProps) {
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');

  const periodFiltered =
    selectedPeriod === 'all'
      ? options
      : selectedPeriod === 'eletiva'
        ? options.filter((option) => option.period === 0)
        : selectedPeriod === 'ppgi-mestrado'
          ? options.filter((option) => option.period === -1 && option.program === 'mestrado')
          : selectedPeriod === 'ppgi-doutorado'
            ? options.filter((option) => option.period === -1 && option.program === 'doutorado')
            : options.filter((option) => option.period === selectedPeriod);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredOptions =
    trimmedQuery.length > 0
      ? periodFiltered.filter(
          (option) =>
            option.name.toLowerCase().includes(trimmedQuery) ||
            option.shortName.toLowerCase().includes(trimmedQuery) ||
            option.subjectId.toLowerCase().includes(trimmedQuery),
        )
      : periodFiltered;

  return (
    <div className="flex h-full flex-col">
      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
        Disciplinas
      </p>

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nome ou código..."
        className={`mb-2 rounded-lg border px-3 py-2 text-sm ${
          isDark
            ? 'border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500'
            : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400'
        }`}
      />

      <select
        value={selectedPeriod}
        onChange={(event) => {
          const value = event.target.value;
          onPeriodChange(
            value === 'all' || value === 'eletiva' || value === 'ppgi-mestrado' || value === 'ppgi-doutorado'
              ? value
              : Number(value),
          );
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
        {hasPpgiMestrado && <option value="ppgi-mestrado">PPGI - Mestrado</option>}
        {hasPpgiDoutorado && <option value="ppgi-doutorado">PPGI - Doutorado</option>}
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
            Nenhuma disciplina encontrada.
          </p>
        )}
      </div>
    </div>
  );
}