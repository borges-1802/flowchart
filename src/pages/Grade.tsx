import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { DisciplineList } from '../components/Grade/DisciplineList';
import { ScheduleGrid } from '../components/Grade/ScheduleGrid';
import { GradeSummary } from '../components/Grade/GradeSummary';
import { usePersistedState } from '../hooks/usePersistedState';
import { buildDisciplineOptions, type DisciplineOption } from '../domain/buildDisciplineOptions';
import { hasConflict, isSameSubjectAlreadyPlaced } from '../domain/scheduleGrid';
import { pickRandomColorIndex } from '../domain/subjectColor';
import subjectsData from '../data/subjects.json';
import electivesData from '../data/electives.json';
import turmasData from '../data/turmas.json';
import type { Subject } from '../types/subject.types';
import type { SubjectSchedule } from '../types/turma.types';
import type { ElectiveOption } from '../types/electiveOption.types';

const subjects = subjectsData as Subject[];
const electives = electivesData as ElectiveOption[];
const schedules = turmasData as SubjectSchedule[];
const options = buildDisciplineOptions(subjects, electives, schedules);
const periods = [...new Set(options.map((option) => option.period).filter((period) => period > 0))].sort(
  (a, b) => a - b,
);
const hasElectives = options.some((option) => option.period === 0);

export function Grade() {
  const [theme, setTheme] = usePersistedState<'dark' | 'light'>('flowchart:theme', 'dark');
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'all' | 'eletiva'>('all');
  const [armedId, setArmedId] = useState<string | null>(null);
  const [placedIdsArray, setPlacedIdsArray] = usePersistedState<string[]>('grade:placedIds', []);
  const [colorAssignments, setColorAssignments] = usePersistedState<Record<string, number>>(
    'grade:colorAssignments',
    {},
  );
  const placedIds = useMemo(() => new Set(placedIdsArray), [placedIdsArray]);
  const isDark = theme === 'dark';
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  const armedOption = options.find((option) => option.id === armedId) ?? null;

  function placeOption(option: DisciplineOption) {
    if (isSameSubjectAlreadyPlaced(option, placedIds, options)) {
      setFeedback(`Você já tem uma turma de ${option.subjectId} na grade.`);
      return;
    } else if (hasConflict(option, placedIds, options)) {
      setFeedback(`${option.shortName} conflita com outra disciplina já encaixada.`);
      return;
    } else {
      if (!(option.subjectId in colorAssignments)) {
        const placedSubjectIds = new Set(
          options.filter((item) => placedIds.has(item.id)).map((item) => item.subjectId),
        );
        const usedIndices = [...placedSubjectIds]
          .map((subjectId) => colorAssignments[subjectId])
          .filter((index) => index !== undefined);
        const newIndex = pickRandomColorIndex(usedIndices);
        setColorAssignments((current) => ({ ...current, [option.subjectId]: newIndex }));
      }

      setPlacedIdsArray((current) => [...current, option.id]);
      setArmedId(null);
    }
  }

  function handleItemClick(option: DisciplineOption) {
    if (armedId === option.id) {
      placeOption(option);
      return;
    }
    setArmedId(option.id);
  }

  function handleRemove(optionId: string) {
    setPlacedIdsArray((current) => current.filter((id) => id !== optionId));
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
        <p className="mb-4 text-sm text-neutral-500">
          Monte sua grade horária selecionando as disciplinas que deseja cursar.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          <div className={`order-2 max-h-105 overflow-hidden rounded-xl p-4 lg:order-1 lg:max-h-110 ${cardClass}`}>
            <DisciplineList
              theme={theme}
              options={options}
              periods={periods}
              hasElectives={hasElectives}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              armedId={armedId}
              placedIds={placedIds}
              colorAssignments={colorAssignments}
              onItemClick={handleItemClick}
              onRemove={handleRemove}
            />
          </div>

          <div className={`order-1 overflow-x-auto rounded-xl p-4 lg:order-2 ${cardClass}`}>
            <ScheduleGrid
              theme={theme}
              options={options}
              placedIds={placedIds}
              armedOption={armedOption}
              colorAssignments={colorAssignments}
            />
          </div>
        </div>

        <GradeSummary theme={theme} credits={credits} hoursPerWeek={hoursPerWeek} placedCount={placedOptions.length} />

        {feedback && (
          <div
            className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${
              isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-900 text-white'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>
    </>
  );
}