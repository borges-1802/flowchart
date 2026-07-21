import { useState } from 'react';
import { Header } from '../components/Header/Header';
import { SemesterColumn } from '../components/SemesterColumn/SemesterColumn';
import { SelectElectiveModal } from '../components/SelectElectiveModal/SelectElectiveModal';
import { getSubjectStatus } from '../domain/getSubjectStatus';
import subjectsData from '../data/subjects.json';
import electiveSlotsData from '../data/electiveSlots.json';
import type { Subject } from '../types/subject.types';
import type { ElectiveSlot } from '../types/electiveSlot.types';

const subjects = subjectsData as Subject[];
const electiveSlots = electiveSlotsData as ElectiveSlot[];
const periods = [
  ...new Set([...subjects.map((subject) => subject.period), ...electiveSlots.map((slot) => slot.period)]),
].sort((a, b) => a - b);

export function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedElectives, setSelectedElectives] = useState<Record<string, string>>({});
  const [openSlotId, setOpenSlotId] = useState<string | null>(null);

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function handleBoxClick(id: string) {
    if (selectedId === id) {
      const subject = subjects.find((item) => item.id === id);
      if (!subject) return;

      const status = getSubjectStatus({ subject, completedIds, selectedSubject: null });
      if (status !== 'locked') {
        setCompletedIds((current) =>
          current.includes(id) ? current.filter((completedId) => completedId !== id) : [...current, id],
        );
      }
      setSelectedId(null);
      return;
    }

    setSelectedId(id);
  }

  function handleSelectElective(name: string) {
    if (!openSlotId) return;
    setSelectedElectives((current) => ({ ...current, [openSlotId]: name }));
    setOpenSlotId(null);
  }

  const isDark = theme === 'dark';
  const selectedSubject = subjects.find((subject) => subject.id === selectedId) ?? null;
  const openSlot = electiveSlots.find((slot) => slot.id === openSlotId) ?? null;

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}
      onClick={() => setSelectedId(null)}
    >
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <div className="flex gap-2 overflow-x-auto p-4">
        {periods.map((period) => (
          <SemesterColumn
            key={period}
            period={period}
            subjects={subjects.filter((subject) => subject.period === period)}
            slots={electiveSlots.filter((slot) => slot.period === period)}
            getStatus={(subject) => getSubjectStatus({ subject, completedIds, selectedSubject })}
            selectedId={selectedId}
            onBoxClick={handleBoxClick}
            selectedElectives={selectedElectives}
            onSlotClick={setOpenSlotId}
          />
        ))}
      </div>

      {openSlot && (
        <SelectElectiveModal slot={openSlot} onSelect={handleSelectElective} onClose={() => setOpenSlotId(null)} />
      )}
    </div>
  );
}