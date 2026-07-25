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
      <div className={`relative flex h-16 w-full flex-col items-center justify-center rounded-lg px-1 text-center ${bgClass} ${textClass}`}>
        <span className="truncate text-xs font-semibold">{occupant.shortName}</span>
        <span className="truncate text-[10px] opacity-80">{occupant.teacher}</span>

        {conflictOption && (
          <span
            className={`absolute -right-1 -top-1 max-w-[85%] truncate rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-md ring-2 ${
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
      className={`h-16 w-full rounded-lg border border-dashed transition-colors ${
        isPreview && previewColor
          ? previewColor
          : isDark
            ? 'border-neutral-800'
            : 'border-neutral-300'
      }`}
    />
  );
}