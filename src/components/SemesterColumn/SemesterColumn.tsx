import type { Subject, SubjectStatus } from '../../types/subject.types';
import type { ElectiveSlot } from '../../types/electiveSlot.types';
import { SubjectBox } from '../SubjectBox/SubjectBox';
import { SlotBox } from '../Slotbox/Slotbox';

interface SelectedElective {
  id: string;
  name: string;
  shortName: string;
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
    <div className="w-full sm:w-[148px] sm:shrink-0">
      <p className="mb-1.5 text-center text-[11px] text-neutral-500">Período {period}</p>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-col">
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
    </div>
  );
}