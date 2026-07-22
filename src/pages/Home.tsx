import { useEffect, useState } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { Header } from '../components/Header/Header';
import { SemesterColumn } from '../components/SemesterColumn/SemesterColumn';
import { SelectElectiveModal } from '../components/SelectElectiveModal/SelectElectiveModal';
import { SubjectDetailPanel } from '../components/SubjectDetailPanel/SubjectDetailPanel';
import { getSubjectStatus } from '../domain/getSubjectStatus';
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

  function handleSlotClick(slot: ElectiveSlot) {
    const selected = selectedElectives[slot.id];
    if (!selected) return;

    const preRequisites =
      slot.kind === 'condicionada'
        ? (electives.find((option) => option.id === selected.id)?.preRequisites ?? [])
        : [];

    handleEntityClick(selected.id, preRequisites);
  }

  function handleSelectElective(option: { id: string; name: string; shortName: string }) {
    if (!openSlotId) return;
    setSelectedElectives((current) => ({ ...current, [openSlotId]: option }));
    setOpenSlotId(null);
  }

  const isDark = theme === 'dark';
  const selectedSubject = subjects.find((subject) => subject.id === selectedId) ?? null;
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
          />
        ))}
      </div>

      {selectedSubject && <SubjectDetailPanel subject={selectedSubject} nameById={nameById} />}

      {openSlot && (
        <SelectElectiveModal
          slot={openSlot}
          theme={theme}
          onSelect={handleSelectElective}
          onClose={() => setOpenSlotId(null)}
        />
      )}
    </div>
  );
}