import { useEffect, useState } from 'react';

import { usePersistedState } from '../hooks/usePersistedState';

import { Header } from '../components/Header';
import { SemesterColumn } from '../components/SemesterColumn';
import { SelectElectiveModal } from '../components/SelectElectiveModal';
import { SubjectDetailPanel } from '../components/SubjectDetailPanel';
import { Legend } from '../components/Legend';
import { CreditsCounter } from '../components/CreditsCounter';

import { getSubjectStatus } from '../domain/getSubjectStatus';
import { computeCreditsSummary } from '../domain/creditsSummary';
import { findSubjectLike } from '../domain/findSubjectLike';

import subjectsData from '../data/subjects.json';
import electiveSlotsData from '../data/electiveSlots.json';
import electivesData from '../data/electives.json';
import humanitiesData from '../data/humanities.json';

import type { Subject } from '../types/subject.types';
import type { ElectiveSlot } from '../types/electiveSlot.types';
import type { ElectiveOption } from '../types/electiveOption.types';

interface HumanitiesOption {
  id: string;
  name: string;
  shortName: string;
  credits: number;
}

const subjects = subjectsData as Subject[];
const electiveSlots = electiveSlotsData as ElectiveSlot[];
const electives = electivesData as ElectiveOption[];
const humanities = humanitiesData as HumanitiesOption[];
const nameById = new Map<string, string>([
  ...subjects.map((subject): [string, string] => [subject.id, subject.name]),
  ...electives.map((option): [string, string] => [option.id, option.name]),
  ...humanities.map((option): [string, string] => [option.id, option.name]),
]);
const periods = [
  ...new Set([...subjects.map((subject) => subject.period), ...electiveSlots.map((slot) => slot.period)]),
].sort((a, b) => a - b);

interface SelectedElective {
  id: string;
  name: string;
  shortName: string;
}

export function Home() {
  const [theme, setTheme] = usePersistedState<'dark' | 'light'>('flowchart:theme', 'dark');
  const [completedIds, setCompletedIds] = usePersistedState<string[]>('flowchart:completedIds', []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedElectives, setSelectedElectives] = usePersistedState<Record<string, SelectedElective>>(
    'flowchart:selectedElectives',
    {},
  );
  const [openSlotId, setOpenSlotId] = useState<string | null>(null);

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function handleEntityClick(id: string, preRequisites: string[]) {
    if (selectedId === id) {
      const isAvailable = preRequisites.every((reqId) => completedIds.includes(reqId));
      if (completedIds.includes(id) || isAvailable) {
        setCompletedIds((current) =>
          current.includes(id) ? current.filter((completedId) => completedId !== id) : [...current, id],
        );
      }
      setSelectedId(null);
      return;
    }

    setSelectedId(id);
  }

  function handleBoxClick(id: string) {
    const subject = subjects.find((item) => item.id === id);
    if (!subject) return;
    handleEntityClick(id, subject.preRequisites);
  }

  function getElectivePreRequisites(slot: ElectiveSlot, electiveId: string): string[] {
    return slot.kind === 'condicionada' ? (electives.find((option) => option.id === electiveId)?.preRequisites ?? []) : [];
  }

  function handleSlotClick(slot: ElectiveSlot) {
    const selected = selectedElectives[slot.id];
    if (!selected) return;

    const preRequisites = getElectivePreRequisites(slot, selected.id);

    handleEntityClick(selected.id, preRequisites);
  }

  function handleSelectElective(option: { id: string; name: string; shortName: string }) {
    if (!openSlotId) return;
    setSelectedElectives((current) => ({ ...current, [openSlotId]: option }));
    setOpenSlotId(null);
  }

  function handleCompleteColumn(period: number) {
    const isUnlocked = (preRequisites: string[]) => preRequisites.every((id) => completedIds.includes(id));

    const subjectIds = subjects
      .filter((subject) => subject.period === period && isUnlocked(subject.preRequisites))
      .map((subject) => subject.id);

    const slotIds = electiveSlots
      .filter((slot) => slot.period === period)
      .map((slot) => {
        const selected = selectedElectives[slot.id];
        if (!selected) return null;

        const preRequisites =
          slot.kind === 'condicionada'
            ? (electives.find((option) => option.id === selected.id)?.preRequisites ?? [])
            : [];

        return isUnlocked(preRequisites) ? selected.id : null;
      })
      .filter((id): id is string => Boolean(id));

    const idsToComplete = [...subjectIds, ...slotIds];

    setCompletedIds((current) => [...new Set([...current, ...idsToComplete])]);
  }

  function getPeriodIds(period: number): string[] {
    const subjectIds = subjects.filter((subject) => subject.period === period).map((subject) => subject.id);
    const slotIds = electiveSlots
      .filter((slot) => slot.period === period)
      .map((slot) => selectedElectives[slot.id]?.id)
      .filter((id): id is string => Boolean(id));
    return [...subjectIds, ...slotIds];
  }

  function isPeriodComplete(period: number): boolean {
    const ids = getPeriodIds(period);
    return ids.length > 0 && ids.every((id) => completedIds.includes(id));
  }

  function handleUncompleteColumn(period: number) {
    const idsToRemove = new Set(getPeriodIds(period));
    setCompletedIds((current) => current.filter((id) => !idsToRemove.has(id)));
  }

  const isDark = theme === 'dark';
  const selectedSubject = selectedId ? findSubjectLike(selectedId, subjects, electives, humanities) : null;

  const selectedStatus = selectedSubject
    ? getSubjectStatus({
        id: selectedSubject.id,
        preRequisites: selectedSubject.preRequisites,
        completedIds,
        selectedSubject,
      })
    : null;

  const isSelectedElective = selectedSubject ? !subjects.some((subject) => subject.id === selectedSubject.id) : false;
  const showOverrideForId = selectedSubject && isSelectedElective && selectedStatus === 'locked' ? selectedSubject.id : null;

  function handleForceComplete(id: string) {
    setCompletedIds((current) => (current.includes(id) ? current : [...current, id]));
  }
  const openSlot = electiveSlots.find((slot) => slot.id === openSlotId) ?? null;

  useEffect(() => {
    document.body.style.overflow = openSlot ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openSlot]);

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#0a0a0a' : '#fafafa';
  }, [isDark]);

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}
      onClick={() => setSelectedId(null)}
    >
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <div className="flex flex-col gap-5 p-4 sm:flex-row sm:justify-center sm:gap-2 sm:overflow-x-auto">
        {periods.map((period) => (
          <SemesterColumn
            key={period}
            period={period}
            subjects={subjects.filter((subject) => subject.period === period)}
            slots={electiveSlots.filter((slot) => slot.period === period)}
            getStatus={(id, preRequisites) =>
              getSubjectStatus({ id, preRequisites, completedIds, selectedSubject })
            }
            selectedId={selectedId}
            onBoxClick={handleBoxClick}
            selectedElectives={selectedElectives}
            onSlotClick={handleSlotClick}
            onSlotOpenPicker={setOpenSlotId}
            onCompleteAll={() => handleCompleteColumn(period)}
            isComplete={isPeriodComplete(period)}
            onUncompleteAll={() => handleUncompleteColumn(period)}
            theme={theme}
            showOverrideForId={showOverrideForId}
            onConfirmOverride={() => selectedSubject && handleForceComplete(selectedSubject.id)}
            onDismissOverride={() => setSelectedId(null)}
            getElectivePreRequisites={getElectivePreRequisites}
          />
        ))}
      </div>

      <div className="flex justify-center px-4 pb-6 pt-1">
        <div className="flex flex-col items-center gap-4">
          <CreditsCounter
            theme={theme}
            summary={computeCreditsSummary(subjects, electives, humanities, electiveSlots, completedIds, selectedElectives)}
          />
          <Legend theme={theme} />
        </div>
      </div>

      {selectedSubject && <SubjectDetailPanel theme={theme} subject={selectedSubject} nameById={nameById} />}

      {openSlot && (
        <SelectElectiveModal
          slot={openSlot}
          theme={theme}
          onSelect={handleSelectElective}
          onClose={() => setOpenSlotId(null)}
          usedIds={
            new Set(
              Object.entries(selectedElectives)
                .filter(([slotId]) => slotId !== openSlot.id)
                .map(([, selected]) => selected.id),
            )
          }
        />
      )}
    </div>
  );
}