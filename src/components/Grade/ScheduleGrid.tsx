import { Fragment } from 'react';
import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { DAYS, TIME_BLOCKS, getOptionAt } from '../../domain/scheduleGrid';
import { getSubjectColor } from '../../domain/subjectColor';
import { ScheduleCell } from './ScheduleCell';

interface ScheduleGridProps {
  theme: 'dark' | 'light';
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

export function ScheduleGrid({ theme, options, placedIds, selectedOption, onCellClick }: ScheduleGridProps) {
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-[64px_repeat(5,1fr)] gap-2">
      <div />
      {DAYS.map((day) => (
        <p key={day} className={`text-center text-xs font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          {dayLabels[day]}
        </p>
      ))}

      {TIME_BLOCKS.map((time) => (
        <Fragment key={time}>
          <p className={`flex items-center text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{time}</p>
          {DAYS.map((day) => {
            const occupant = getOptionAt(day, time, placedIds, options);
            const isPreview =
              !occupant && selectedOption ? selectedOption.slots.some((slot) => slot.day === day && slot.time === time) : false;
            const previewColor = selectedOption
              ? isDark
                ? getSubjectColor(selectedOption.subjectId).previewDark
                : getSubjectColor(selectedOption.subjectId).previewLight
              : null;

            return (
              <ScheduleCell
                key={`${day}-${time}`}
                theme={theme}
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