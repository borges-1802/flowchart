import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { getColorByIndex, NEUTRAL_DOT } from '../../domain/subjectColor';

interface ScheduleCellProps {
  theme: 'dark' | 'light';
  occupant: DisciplineOption | null;
  colorIndex: number | undefined;
  isPreview: boolean;
  previewColor: string | null;
  conflictOption: DisciplineOption | null;
  conflictColorIndex: number | undefined;
}

export function ScheduleCell({
  theme,
  occupant,
  colorIndex,
  isPreview,
  previewColor,
  conflictOption,
  conflictColorIndex,
}: ScheduleCellProps) {
  const isDark = theme === 'dark';

  if (occupant) {
    const color = colorIndex !== undefined ? getColorByIndex(colorIndex) : null;
    const bgClass = color ? color.base : NEUTRAL_DOT;
    const textClass = color ? color.text : isDark ? 'text-white' : 'text-black';

    const conflictColor = conflictColorIndex !== undefined ? getColorByIndex(conflictColorIndex) : null;

    return (
      <div
        className={`relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded px-0.5 text-center sm:aspect-auto sm:h-16 sm:rounded-lg sm:px-1 ${bgClass} ${textClass}`}
      >
        <span className="line-clamp-2 w-full wrap-break-word text-[8px] font-semibold leading-[1.1] sm:line-clamp-1 sm:truncate sm:text-xs sm:leading-tight">
          {occupant.shortName}
        </span>
        <span className="hidden w-full truncate text-[10px] opacity-80 sm:block">{occupant.teacher}</span>

        {conflictOption && (
          <span
            className={`absolute -right-1 -top-1 max-w-[85%] truncate rounded-full px-1 py-0.5 text-[7px] font-bold shadow-md ring-1 sm:px-1.5 sm:text-[9px] sm:ring-2 ${
              isDark ? 'ring-neutral-900' : 'ring-white'
            } ${conflictColor ? `${conflictColor.base} ${conflictColor.text}` : 'bg-neutral-500 text-white'}`}
          >
            {conflictOption.shortName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`aspect-square w-full rounded border border-dashed transition-colors sm:aspect-auto sm:h-16 sm:rounded-lg ${
        isPreview && previewColor
          ? previewColor
          : isDark
            ? 'border-neutral-800'
            : 'border-neutral-300'
      }`}
    />
  );
}