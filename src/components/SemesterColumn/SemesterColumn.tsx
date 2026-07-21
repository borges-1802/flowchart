import type { Subject, SubjectStatus } from '../../types/subject.types';
import type { ElectiveSlot } from '../../types/electiveSlot.types';
import { SubjectBox } from '../SubjectBox/SubjectBox';
import { SlotBox } from '../Slotbox/Slotbox';

interface SemesterColumnProps {
  period: number;
  subjects: Subject[];
  slots: ElectiveSlot[];
  getStatus: (subject: Subject) => SubjectStatus;
  selectedId: string | null;
  onBoxClick: (id: string) => void;
  selectedElectives: Record<string, string>;
  onSlotClick: (slotId: string) => void;
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
}: SemesterColumnProps) {
  return (
    <div className="flex min-w-[120px] flex-1 flex-col gap-2">
      <p className="mb-1 text-center text-[11px] text-neutral-500">Período {period}</p>
      {subjects.map((subject) => (
        <SubjectBox
          key={subject.id}
          subject={subject}
          status={getStatus(subject)}
          isSelected={selectedId === subject.id}
          onClick={onBoxClick}
        />
      ))}
      {slots.map((slot) => (
        <SlotBox
          key={slot.id}
          slot={slot}
          selectedName={selectedElectives[slot.id] ?? null}
          onClick={() => onSlotClick(slot.id)}
        />
      ))}
    </div>
  );
}