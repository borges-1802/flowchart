import { Fragment } from 'react';
import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { DAYS, TIME_BLOCKS, getOptionAt } from '../../domain/scheduleGrid';
import { getSubjectColor } from '../../domain/subjectColor';
import { ScheduleCell } from './ScheduleCell';

interface ScheduleGridProps {
  options: DisciplineOption[];
  placedIds: Set<string>;
  selectedOption: DisciplineOption | null;
  onCellClick: (day: string, time: string) => void;
}

const dayLabels: Record<(typeof DAYS)[number], string> = {
  SEG: 'SEG',
  TER: 'TER',
  QUA: 'QUA',
  QUI: 'QUI',
  SEX: 'SEX',
};

export function ScheduleGrid({ options, placedIds, selectedOption, onCellClick }: ScheduleGridProps) {
  return (
    <div className="grid grid-cols-[64px_repeat(5,1fr)] gap-2">
      <div />
      {DAYS.map((day) => (
        <p key={day} className="text-center text-xs font-semibold text-neutral-400">
          {dayLabels[day]}
        </p>
      ))}

      {TIME_BLOCKS.map((time) => (
        <Fragment key={time}>
          <p className="flex items-center text-xs text-neutral-500">{time}</p>
          {DAYS.map((day) => {
            const occupant = getOptionAt(day, time, placedIds, options);
            const isPreview =
              !occupant && selectedOption ? selectedOption.slots.some((slot) => slot.day === day && slot.time === time) : false;
            const previewColor = selectedOption ? getSubjectColor(selectedOption.subjectId).preview : null;

            return (
              <ScheduleCell
                key={`${day}-${time}`}
                occupant={occupant}
                isPreview={isPreview}
                previewColor={previewColor}
                onClick={() => onCellClick(day, time)}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}