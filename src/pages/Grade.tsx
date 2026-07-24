import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { DisciplineList } from '../components/Grade/DisciplineList';
import { ScheduleGrid } from '../components/Grade/ScheduleGrid';
import { GradeSummary } from '../components/Grade/GradeSummary';
import { usePersistedState } from '../hooks/usePersistedState';
import { buildDisciplineOptions } from '../domain/buildDisciplineOptions';
import { hasConflict, getOptionAt } from '../domain/scheduleGrid';
import subjectsData from '../data/subjects.json';
import turmasData from '../data/turmas.json';
import type { Subject } from '../types/subject.types';
import type { SubjectSchedule } from '../types/turma.types';

const subjects = subjectsData as Subject[];
const schedules = turmasData as SubjectSchedule[];
const options = buildDisciplineOptions(subjects, schedules);
const periods = [...new Set(options.map((option) => option.period))].sort((a, b) => a - b);

export function Grade() {
  const [theme, setTheme] = usePersistedState<'dark' | 'light'>('flowchart:theme', 'dark');
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placedIdsArray, setPlacedIdsArray] = usePersistedState<string[]>('grade:placedIds', []);
  const placedIds = useMemo(() => new Set(placedIdsArray), [placedIdsArray]);
  const isDark = theme === 'dark';

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  const selectedOption = options.find((option) => option.id === selectedId) ?? null;

  function handleCellClick(day: string, time: string) {
    const occupant = getOptionAt(day, time, placedIds, options);

    if (occupant) {
      setPlacedIdsArray((current) => current.filter((id) => id !== occupant.id));
      return;
    }

    if (!selectedOption) return;
    if (!selectedOption.slots.some((slot) => slot.day === day && slot.time === time)) return;
    if (hasConflict(selectedOption, placedIds, options)) return;

    setPlacedIdsArray((current) => [...current, selectedOption.id]);
    setSelectedId(null);
  }

  const placedOptions = options.filter((option) => placedIds.has(option.id));
  const credits = placedOptions.reduce((sum, option) => sum + option.credits, 0);
  const hoursPerWeek = placedOptions.reduce((sum, option) => sum + option.hours, 0);

  const cardClass = isDark ? 'bg-neutral-900' : 'bg-neutral-100';

  return (
    <>
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      <div className={`min-h-screen p-4 ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <h2 className="mb-1 text-xl font-bold">Montar Grade Horária</h2>
        <p className={`mb-4 text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          Clique numa disciplina e depois numa célula vazia da grade pra encaixar. Clique num bloco já encaixado pra
          remover.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          <div className={`order-2 max-h-[420px] overflow-hidden rounded-xl p-4 lg:order-1 lg:max-h-[440px] ${cardClass}`}>
            <DisciplineList
              theme={theme}
              options={options}
              periods={periods}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
            />
          </div>

          <div className={`order-1 overflow-x-auto rounded-xl p-4 lg:order-2 ${cardClass}`}>
            <ScheduleGrid
              theme={theme}
              options={options}
              placedIds={placedIds}
              selectedOption={selectedOption}
              onCellClick={handleCellClick}
            />
          </div>
        </div>

        <GradeSummary theme={theme} credits={credits} hoursPerWeek={hoursPerWeek} placedCount={placedOptions.length} />
      </div>
    </>
  );
}