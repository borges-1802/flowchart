import type { Subject, SubjectStatus } from '../../types/subject.types';
import type { ElectiveSlot } from '../../types/electiveSlot.types';
import { SubjectBox } from '../SubjectBox/SubjectBox';
import { SlotBox } from '../Slotbox/Slotbox';

interface SelectedElective {
  id: string;
  name: string;
}

interface SemesterColumnProps {
  period: number;
  subjects: Subject[];
  slots: ElectiveSlot[];
  getStatus: (id: string, preRequisites: string[]) => SubjectStatus;
  selectedId: string | null;
  onBoxClick: (id: string) => void;
  selectedElectives: Record<string, SelectedElective>;
  onSlotClick: (slot: ElectiveSlot) => void;
  onSlotOpenPicker: (slotId: string) => void;
}

export function SemesterColumn({
  period,
  subjects,
  slots,
  getStatus,
  selectedId,
  onBoxClick,
  selectedElectives,
  onSlotClick,
  onSlotOpenPicker,
}: SemesterColumnProps) {
  return (
    <div className="flex min-w-[120px] flex-1 flex-col gap-2">
      <p className="mb-1 text-center text-[11px] text-neutral-500">Período {period}</p>
      {subjects.map((subject) => (
        <SubjectBox
          key={subject.id}
          subject={subject}
          status={getStatus(subject.id, subject.preRequisites)}
          isSelected={selectedId === subject.id}
          onClick={onBoxClick}
        />
      ))}
      {slots.map((slot) => {
        const selected = selectedElectives[slot.id] ?? null;
        return (
          <SlotBox
            key={slot.id}
            slot={slot}
            selected={selected}
            status={selected ? getStatus(selected.id, []) : 'locked'}
            isSelected={selected ? selectedId === selected.id : false}
            onClick={() => onSlotClick(slot)}
            onOpenPicker={() => onSlotOpenPicker(slot.id)}
          />
        );
      })}
    </div>
  );
}