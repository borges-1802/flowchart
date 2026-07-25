import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { getColorByIndex, NEUTRAL_DOT } from '../../domain/subjectColor';

interface ScheduleCellProps {
  theme: 'dark' | 'light';
  occupant: DisciplineOption | null;
  colorIndex: number | undefined;
  isPreview: boolean;
  previewColor: string | null;
}

export function ScheduleCell({ theme, occupant, colorIndex, isPreview, previewColor }: ScheduleCellProps) {
  const isDark = theme === 'dark';

  if (occupant) {
    const color = colorIndex !== undefined ? getColorByIndex(colorIndex) : null;
    const bgClass = color ? color.base : NEUTRAL_DOT;
    const textClass = color ? color.text : isDark ? 'text-white' : 'text-black';

    return (
      <div className={`flex h-16 w-full flex-col items-center justify-center rounded-lg px-1 text-center ${bgClass} ${textClass}`}>
        <span className="truncate text-xs font-semibold">{occupant.shortName}</span>
        <span className="truncate text-[10px] opacity-80">{occupant.teacher}</span>
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