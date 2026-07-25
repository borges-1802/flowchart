import { Fragment } from 'react';
import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { DAYS, TIME_BLOCKS, getOptionAt } from '../../domain/scheduleGrid';
import { getColorByIndex } from '../../domain/subjectColor';
import { ScheduleCell } from './ScheduleCell';

interface ScheduleGridProps {
  theme: 'dark' | 'light';
  options: DisciplineOption[];
  placedIds: Set<string>;
  armedOption: DisciplineOption | null;
  colorAssignments: Record<string, number>;
}

const dayLabels: Record<(typeof DAYS)[number], string> = {
  SEG: 'SEG',
  TER: 'TER',
  QUA: 'QUA',
  QUI: 'QUI',
  SEX: 'SEX',
};

export function ScheduleGrid({ theme, options, placedIds, armedOption, colorAssignments }: ScheduleGridProps) {
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
              !occupant && armedOption ? armedOption.slots.some((slot) => slot.day === day && slot.time === time) : false;

            const armedColorIndex = armedOption ? colorAssignments[armedOption.subjectId] : undefined;
            const previewColor = armedOption
              ? armedColorIndex !== undefined
                ? isDark
                  ? getColorByIndex(armedColorIndex).previewDark
                  : getColorByIndex(armedColorIndex).previewLight
                : isDark
                  ? 'border-neutral-500 bg-neutral-500/10'
                  : 'border-neutral-400 bg-neutral-100'
              : null;

            return (
              <ScheduleCell
                key={`${day}-${time}`}
                theme={theme}
                occupant={occupant}
                colorIndex={occupant ? colorAssignments[occupant.subjectId] : undefined}
                isPreview={isPreview}
                previewColor={previewColor}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}