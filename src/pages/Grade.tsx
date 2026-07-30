import { useEffect, useMemo, useState } from 'react';

import { Header } from '../components/Header';
import { DisciplineList } from '../components/Grade/DisciplineList';
import { ScheduleGrid } from '../components/Grade/ScheduleGrid';
import { GradeSummary } from '../components/Grade/GradeSummary';
import { GradeTabs } from '../components/Grade/GradeTabs';

import { usePersistedState } from '../hooks/usePersistedState';

import { buildDisciplineOptions, type DisciplineOption } from '../domain/buildDisciplineOptions';
import { buildPpgiOptions, type PpgiSubject, type PpgiSchedule } from '../domain/buildPpgiOptions';
import { buildCustomOptions, getNextTimeBlock, type CustomElective } from '../domain/customElectives';
import { hasConflict, isSameSubjectAlreadyPlaced, getOptionAt } from '../domain/scheduleGrid';
import { pickRandomColorIndex } from '../domain/subjectColor';
import { getMigratedTabsState, type TabId, type TabData, type TabsState } from '../domain/gradeTabs';

import subjectsData from '../data/subjects.json';
import electivesData from '../data/electives.json';
import turmasData from '../data/turmas.json';
import ppgiSubjectsData from '../data/ppgiSubjects.json';
import ppgiTurmasData from '../data/ppgiTurmas.json';

import type { PeriodFilter } from '../components/Grade/DisciplineList';
import type { Subject } from '../types/subject.types';
import type { SubjectSchedule } from '../types/turma.types';
import type { ElectiveOption } from '../types/electiveOption.types';

const subjects = subjectsData as Subject[];
const electives = electivesData as ElectiveOption[];
const schedules = turmasData as SubjectSchedule[];
const bccOptions = buildDisciplineOptions(subjects, electives, schedules);

const ppgiSubjects = ppgiSubjectsData as PpgiSubject[];
const ppgiSchedules = ppgiTurmasData as PpgiSchedule[];
const ppgiOptions = buildPpgiOptions(ppgiSubjects, ppgiSchedules);

const catalogOptions = [...bccOptions, ...ppgiOptions];
const periods = [...new Set(catalogOptions.map((option) => option.period).filter((period) => period > 0))].sort(
  (a, b) => a - b,
);
const hasElectives = catalogOptions.some((option) => option.period === 0);
const hasPpgiMestrado = catalogOptions.some((option) => option.period === -1 && option.program === 'mestrado');
const hasPpgiDoutorado = catalogOptions.some((option) => option.period === -1 && option.program === 'doutorado');

export function Grade() {
  const [theme, setTheme] = usePersistedState<'dark' | 'light'>('flowchart:theme', 'dark');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('all');
  const [armedId, setArmedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = usePersistedState<TabId>('grade:activeTab', 'A');
  const [tabsState, setTabsState] = usePersistedState<TabsState>('grade:tabs', getMigratedTabsState());
  const [tabNames, setTabNames] = usePersistedState<Record<TabId, string>>('grade:tabNames', {
    A: 'Grade A',
    B: 'Grade B',
    C: 'Grade C',
  });
  const [customElectives, setCustomElectives] = usePersistedState<CustomElective[]>('grade:customElectives', []);
  const isDark = theme === 'dark';
  const [feedback, setFeedback] = useState<string | null>(null);

  const options = useMemo(() => {
    return [...catalogOptions, ...buildCustomOptions(customElectives)];
  }, [customElectives]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function updateActiveTab(updater: (tab: TabData) => TabData) {
    setTabsState((current) => ({ ...current, [activeTab]: updater(current[activeTab]) }));
  }

  const currentTab = tabsState[activeTab] ?? { placedIds: [], colorAssignments: {} };
  const placedIds = useMemo(() => new Set(currentTab.placedIds), [currentTab.placedIds]);
  const colorAssignments = currentTab.colorAssignments;

  const armedOption = options.find((option) => option.id === armedId) ?? null;

  function placeOption(option: DisciplineOption) {
    if (isSameSubjectAlreadyPlaced(option, placedIds, options)) {
      setFeedback(`Você já tem uma turma de ${option.subjectId} na grade.`);
      return;
    } else if (hasConflict(option, placedIds, options)) {
      setFeedback(`${option.shortName} conflita com outra disciplina já encaixada.`);
      return;
    } else {
      updateActiveTab((tab) => {
        const nextColorAssignments = { ...tab.colorAssignments };

        if (!(option.subjectId in nextColorAssignments)) {
          const placedSubjectIds = new Set(
            options.filter((item) => tab.placedIds.includes(item.id)).map((item) => item.subjectId),
          );
          const usedIndices = [...placedSubjectIds]
            .map((subjectId) => nextColorAssignments[subjectId])
            .filter((index) => index !== undefined);
          nextColorAssignments[option.subjectId] = pickRandomColorIndex(usedIndices);
        }

        return {
          placedIds: [...tab.placedIds, option.id],
          colorAssignments: nextColorAssignments,
        };
      });
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
    updateActiveTab((tab) => ({
      ...tab,
      placedIds: tab.placedIds.filter((id) => id !== optionId),
    }));
  }

  function handleTabChange(tabId: TabId) {
    setActiveTab(tabId);
    setArmedId(null);
  }

  function handleRenameTab(tabId: TabId, name: string) {
    setTabNames((current) => ({ ...current, [tabId]: name }));
  }

  function handleClearTab() {
    setTabsState((current) => ({ ...current, [activeTab]: { placedIds: [], colorAssignments: {} } }));
  }

  function handleCreateCustom(elective: CustomElective) {
    setCustomElectives((current) => [...current, elective]);
  }

  function handleCreateAndPlaceCustom(name: string, credits: number, day: string, time: string, duration: 2 | 4) {
    if (duration === 4) {
      const nextBlock = getNextTimeBlock(time);
      if (nextBlock && getOptionAt(day, nextBlock, placedIds, options) !== null) {
        setFeedback(`${nextBlock} em ${day} já está ocupado — não dá pra encaixar 4h aqui.`);
        return;
      }
    }

    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const elective: CustomElective = { id, name, credits, day, time, duration };

    setCustomElectives((current) => [...current, elective]);

    updateActiveTab((tab) => {
      const nextColorAssignments = { ...tab.colorAssignments };
      if (!(id in nextColorAssignments)) {
        const placedSubjectIds = new Set(
          options.filter((item) => tab.placedIds.includes(item.id)).map((item) => item.subjectId),
        );
        const usedIndices = [...placedSubjectIds]
          .map((subjectId) => nextColorAssignments[subjectId])
          .filter((index) => index !== undefined);
        nextColorAssignments[id] = pickRandomColorIndex(usedIndices);
      }
      return { placedIds: [...tab.placedIds, id], colorAssignments: nextColorAssignments };
    });
  }

  function handleDeleteCustom(optionId: string) {
    setCustomElectives((current) => current.filter((elective) => elective.id !== optionId));

    setTabsState((current) => {
      const next = { ...current } as TabsState;
      (Object.keys(next) as TabId[]).forEach((tabId) => {
        const tab = next[tabId];
        if (!tab.placedIds.includes(optionId)) return;
        const nextColorAssignments = { ...tab.colorAssignments };
        delete nextColorAssignments[optionId];
        next[tabId] = {
          placedIds: tab.placedIds.filter((id) => id !== optionId),
          colorAssignments: nextColorAssignments,
        };
      });
      return next;
    });

    if (armedId === optionId) setArmedId(null);
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
          <div className={`order-3 max-h-140 overflow-hidden rounded-xl p-4 lg:order-1 lg:max-h-155 ${cardClass}`}>
            <DisciplineList
              theme={theme}
              options={options}
              periods={periods}
              hasElectives={hasElectives}
              hasPpgiMestrado={hasPpgiMestrado}
              hasPpgiDoutorado={hasPpgiDoutorado}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              armedId={armedId}
              placedIds={placedIds}
              colorAssignments={colorAssignments}
              onItemClick={handleItemClick}
              onRemove={handleRemove}
              onCreateCustom={handleCreateCustom}
              onDeleteCustom={handleDeleteCustom}
            />
          </div>

          <div className="order-1 lg:order-2">
            <GradeTabs
              theme={theme}
              activeTab={activeTab}
              tabNames={tabNames}
              onChange={handleTabChange}
              onRename={handleRenameTab}
              onClearTab={handleClearTab}
            />

            <div className={`custom-scrollbar overflow-x-auto rounded-xl p-4 ${cardClass}`}>
              <ScheduleGrid
                theme={theme}
                options={options}
                placedIds={placedIds}
                armedOption={armedOption}
                colorAssignments={colorAssignments}
                onRemove={handleRemove}
                onCreateAndPlaceCustom={handleCreateAndPlaceCustom}
              />
            </div>

            <GradeSummary theme={theme} credits={credits} hoursPerWeek={hoursPerWeek} placedCount={placedOptions.length} />
          </div>
        </div>

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