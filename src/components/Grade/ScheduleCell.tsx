import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { getSubjectColor } from '../../domain/subjectColor';

interface ScheduleCellProps {
  theme: 'dark' | 'light';
  occupant: DisciplineOption | null;
  isPreview: boolean;
  previewColor: string | null;
  onClick: () => void;
}

export function ScheduleCell({ theme, occupant, isPreview, previewColor, onClick }: ScheduleCellProps) {
  const isDark = theme === 'dark';

  if (occupant) {
    const color = getSubjectColor(occupant.subjectId);
    const cellClass = isDark ? color.cellDark : color.cellLight;

    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex h-16 w-full flex-col items-center justify-center rounded-lg px-1 text-center ring-1 transition-opacity hover:opacity-80 ${cellClass}`}
      >
        <span className="truncate text-xs font-semibold">{occupant.shortName}</span>
        <span className="truncate text-[10px] opacity-80">{occupant.teacher}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-16 w-full rounded-lg border border-dashed transition-colors ${
        isPreview && previewColor
          ? previewColor
          : isDark
            ? 'border-neutral-800 hover:border-neutral-700'
            : 'border-neutral-300 hover:border-neutral-400'
      }`}
    />
  );
}